import { useState } from "react";
import { Car, MapPin, Navigation, Search, CheckCircle2, UserRound, ShieldAlert, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { formatRs, practiceFare, rideDriver, rideLocations, rideTypes } from "@/data/scenarios";
import { cn } from "@/lib/utils";

function RouteMap({ pickup, dest }: { pickup?: string | undefined; dest?: string | undefined }) {
  return (
    <div className="relative h-40 overflow-hidden rounded-2xl border border-border bg-sky" aria-hidden>
      <svg viewBox="0 0 300 160" className="h-full w-full">
        <path d="M0 40 H300 M0 110 H300 M70 0 V160 M200 0 V160" stroke="var(--color-card)" strokeWidth="10" />
        {pickup && dest && <path d="M50 125 C 120 125, 150 40, 250 35" stroke="var(--color-primary)" strokeWidth="5" fill="none" strokeDasharray="10 6" />}
        {pickup && <circle cx="50" cy="125" r="10" fill="var(--color-primary)" />}
        {dest && <circle cx="250" cy="35" r="10" fill="var(--color-destructive)" />}
      </svg>
      <span className="absolute bottom-1 end-2 text-xs font-semibold text-muted-foreground">Practice map</span>
    </div>
  );
}

export function RideSimulator() {
  const { engine } = useLesson();
  const { tr, lang } = useLanguage();
  const ur = lang === "ur";
  const [pickup, setPickup] = useState<string>();
  const [dest, setDest] = useState<string>();
  const [rideType, setRideType] = useState<string>();
  const screen = engine.step.screen;
  const label = (id?: string) => tr(rideLocations.find((l) => l.id === id)?.label);
  const fare = pickup && dest && rideType ? practiceFare(pickup, dest, rideType) : 0;
  const option = (selected: boolean) =>
    cn("flex w-full items-center gap-3 rounded-xl border-2 bg-card p-3 text-start text-lg font-semibold text-heading", selected ? "border-primary bg-mint" : "border-border hover:border-primary");

  const LocationList = ({ value, onPick, disabled }: { value?: string | undefined; onPick: (id: string) => void; disabled?: string | undefined }) => (
    <div className="space-y-2" role="radiogroup">
      {rideLocations.map((l) => (
        <button key={l.id} type="button" role="radio" aria-checked={value === l.id} onClick={() => onPick(l.id)} className={option(value === l.id)}>
          <MapPin className="h-6 w-6 text-primary" />
          <span className="flex-1">{tr(l.label)}{disabled === l.id && <span className="block text-sm font-normal text-muted-foreground">{ur ? "سوار ہونے کی جگہ" : "Your pickup"}</span>}</span>
          {value === l.id && <Check className="h-6 w-6 text-primary" />}
        </button>
      ))}
    </div>
  );

  return (
    <PhoneFrame appName="Practice Ride">
      {screen === "home" && (
        <div className="space-y-4">
          <RouteMap />
          <SimButton action="where-to" className="flex w-full items-center gap-3 rounded-xl border-2 border-border bg-card p-4 text-start text-xl font-bold text-heading shadow">
            <Search className="h-6 w-6 text-primary" /> {ur ? "آپ کہاں جا رہے ہیں؟" : "Where are you going?"}
          </SimButton>
          <p className="text-center text-sm text-muted-foreground">{ur ? "کوئی اصل مقام استعمال نہیں ہوتا" : "No live location is used"}</p>
        </div>
      )}

      {screen === "pickup" && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold"><Navigation className="h-5 w-5 text-primary" /> {ur ? "سوار ہونے کی جگہ" : "Pickup"}</h3>
          <LocationList value={pickup} onPick={(id) => { setPickup(id); if (dest === id) setDest(undefined); }} />
          <SimButton
            action="pickup-continue"
            onPress={() => (pickup ? engine.act("pickup-continue") : engine.mistake({ en: "Please choose a pickup place first.", ur: "پہلے سوار ہونے کی جگہ منتخب کریں۔" }))}
            className="btn btn-primary w-full"
          >{ur ? "آگے بڑھیں" : "Continue"}</SimButton>
        </div>
      )}

      {screen === "destination" && (
        <div className="space-y-4">
          <RouteMap pickup={pickup} dest={dest} />
          <h3 className="text-xl font-bold">{ur ? "منزل" : "Destination"}</h3>
          <LocationList
            value={dest}
            disabled={pickup}
            onPick={(id) =>
              id === pickup
                ? engine.mistake({ en: "That is your pickup place. Your destination must be somewhere different.", ur: "یہ آپ کی سوار ہونے کی جگہ ہے۔ منزل کوئی اور جگہ ہونی چاہیے۔" })
                : setDest(id)
            }
          />
          <SimButton
            action="dest-continue"
            onPress={() => (dest ? engine.act("dest-continue") : engine.mistake({ en: "Please choose a destination first.", ur: "پہلے منزل منتخب کریں۔" }))}
            className="btn btn-primary w-full"
          >{ur ? "آگے بڑھیں" : "Continue"}</SimButton>
        </div>
      )}

      {screen === "ride" && (
        <div className="space-y-4">
          <RouteMap pickup={pickup} dest={dest} />
          <div className="space-y-2" role="radiogroup">
            {rideTypes.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={rideType === r.id} onClick={() => setRideType(r.id)} className={option(rideType === r.id)}>
                <Car className="h-7 w-7 text-primary" />
                <span className="flex-1">{tr(r.label)}<span className="block text-sm font-normal text-muted-foreground">{ur ? "مشق کرایہ" : "Practice Fare"}</span></span>
                <span className="font-bold" dir="ltr">{formatRs(practiceFare(pickup!, dest!, r.id))}</span>
                {rideType === r.id && <Check className="h-6 w-6 text-primary" />}
              </button>
            ))}
          </div>
          <SimButton
            action="ride-continue"
            onPress={() => (rideType ? engine.act("ride-continue") : engine.mistake({ en: "Please tap Car or Rickshaw first.", ur: "پہلے گاڑی یا رکشہ دبائیں۔" }))}
            className="btn btn-primary w-full"
          >{ur ? "آگے بڑھیں" : "Continue"}</SimButton>
        </div>
      )}

      {screen === "review" && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{ur ? "بکنگ کا جائزہ" : "Review booking"}</h3>
          <dl className="divide-y divide-border rounded-xl border-2 border-border bg-card text-base">
            {[
              [ur ? "سوار ہونا" : "Pickup", label(pickup)],
              [ur ? "منزل" : "Destination", label(dest)],
              [ur ? "سواری" : "Ride", tr(rideTypes.find((r) => r.id === rideType)?.label)],
              [ur ? "اندازاً مشق کرایہ" : "Est. practice fare", formatRs(fare)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 p-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-end font-bold text-heading">{v}</dd></div>
            ))}
          </dl>
          <SimButton action="confirm-booking" className="btn btn-primary w-full">{ur ? "مشق بکنگ کی تصدیق" : "Confirm Practice Booking"}</SimButton>
        </div>
      )}

      {screen === "assigned" && (
        <div className="space-y-4">
          <p className="rounded-lg bg-success-soft p-2 text-center font-bold text-success">{ur ? "مشق ڈرائیور مل گیا — 3 منٹ میں" : "Practice driver found — arriving in 3 min"}</p>
          <div className="rounded-xl border-2 border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint"><UserRound className="h-8 w-8 text-primary-strong" /></span>
              <div><p className="text-xl font-bold text-heading">{rideDriver.name}</p><p className="text-sm text-muted-foreground">{ur ? "فرضی ڈرائیور" : "Fictional driver"} · {tr(rideTypes.find((r) => r.id === rideType)?.label)}</p></div>
            </div>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">{ur ? "نمبر پلیٹ" : "Number plate"}</p>
            <p className="inline-block rounded-md border-4 border-heading bg-card px-4 py-1 font-mono text-3xl font-black tracking-widest text-heading" dir="ltr">{rideDriver.bookedPlate}</p>
          </div>
          <SimButton action="see-vehicle" className="btn btn-primary w-full">{ur ? "گاڑی پہنچ گئی" : "Vehicle has arrived"}</SimButton>
        </div>
      )}

      {screen === "verify" && (
        <div className="space-y-4">
          <div className="flex flex-col items-center rounded-xl border-2 border-border bg-sky p-5">
            <Car className="h-24 w-24 text-heading" />
            <p className="rounded-md border-4 border-heading bg-card px-4 py-1 font-mono text-3xl font-black tracking-widest text-heading" dir="ltr">{rideDriver.arrivedPlate}</p>
            <p className="mt-2 text-sm text-muted-foreground">{ur ? "آنے والی گاڑی" : "Arriving vehicle"}</p>
          </div>
          <p className="text-lg font-semibold text-heading">{ur ? "کیا یہ نمبر پلیٹ آپ کی بکنگ والی سے ملتی ہے؟" : "Does this vehicle number plate match the number shown in your booking?"}</p>
          <p className="text-sm text-muted-foreground">{ur ? "بکنگ:" : "Your booking:"} <span className="font-mono font-bold" dir="ltr">{rideDriver.bookedPlate}</span></p>
          <SimButton action="plate-match" highlightFor="__never" className="btn btn-outline w-full">{ur ? "ہاں، ملتی ہے" : "Yes, it matches"}</SimButton>
          <SimButton action="plate-different" className="btn btn-outline w-full">{ur ? "نہیں، مختلف ہے" : "No, it is different"}</SimButton>
        </div>
      )}

      {screen === "done" && (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="flex items-start gap-2 rounded-xl bg-warning-soft p-3 text-start text-base text-heading">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-warning" />
            {ur ? "درست! پلیٹ مختلف تھی، اس لیے گاڑی میں نہ بیٹھیں۔ ایپ میں ڈرائیور کو چیک کریں یا سواری منسوخ کریں۔" : "Correct! The plate was different, so do not get in. Check the driver in the app or cancel the ride."}
          </p>
          <p className="text-lg font-semibold text-heading">{ur ? "زبردست! آپ نے سواری بک کرنے اور ڈرائیور کی تفصیل چیک کرنے کی مشق کی۔" : "Great! You practised booking a ride and checking your driver's details."}</p>
          <CompletionActions />
        </div>
      )}
    </PhoneFrame>
  );
}
