import { useState } from "react";
import { ArrowUpRight, History, Wallet, Landmark, Smartphone, UserRound, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import { TARGET_AMOUNT, TARGET_RECIPIENT, WALLET_BALANCE, digitsOnly, formatRs, paymentContacts } from "@/data/scenarios";
import { cn } from "@/lib/utils";

const tile = "flex w-full items-center gap-3 rounded-xl border-2 border-border bg-card p-4 text-start text-lg font-semibold text-heading hover:border-primary";

export function PaymentSimulator() {
  const { engine, isTarget } = useLesson();
  const { tr, lang } = useLanguage();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const recipient = paymentContacts.find((c) => digitsOnly(c.phone) === digitsOnly(phone));
  const ur = lang === "ur";

  const continueRecipient = () => {
    if (!digitsOnly(phone)) return engine.mistake({ en: "The number box is empty. Type a mobile number or tap a practice contact.", ur: "نمبر کا خانہ خالی ہے۔ نمبر لکھیں یا کانٹیکٹ دبائیں۔" });
    if (!recipient) return engine.mistake({ en: "This number is not in the practice contacts. Check each digit, or tap a name from the list.", ur: "یہ نمبر مشق کانٹیکٹس میں نہیں ہے۔ ہر ہندسہ چیک کریں یا فہرست سے نام دبائیں۔" });
    engine.act("recipient-continue");
  };
  const continueAmount = () => {
    const n = Number(amount);
    if (!amount || !Number.isFinite(n) || n <= 0) return engine.mistake({ en: "Please type an amount using numbers only, for example 1000.", ur: "براہ کرم صرف نمبروں میں رقم لکھیں، مثلاً 1000۔" });
    if (n > WALLET_BALANCE) return engine.mistake({ en: `That is more than your practice balance of ${formatRs(WALLET_BALANCE)}.`, ur: `یہ آپ کے مشق بیلنس ${formatRs(WALLET_BALANCE)} سے زیادہ ہے۔` });
    if (n !== TARGET_AMOUNT) return engine.mistake({ en: `You typed ${formatRs(n)}. Your task is to send ${formatRs(TARGET_AMOUNT)}. Change the amount.`, ur: `آپ نے ${formatRs(n)} لکھا۔ آپ کا کام ${formatRs(TARGET_AMOUNT)} بھیجنا ہے۔ رقم درست کریں۔` });
    engine.act("amount-continue");
  };
  const confirm = () => {
    if (recipient?.id !== TARGET_RECIPIENT)
      return engine.mistake({
        en: `Stop! This transfer is to ${recipient?.name ?? "someone else"}, but your task is to send money to Ahmed Ali. Tap Edit to change the recipient.`,
        ur: `رکیں! یہ رقم ${recipient?.name ?? "کسی اور"} کو جا رہی ہے، لیکن آپ کو احمد علی کو بھیجنی ہے۔ وصول کنندہ بدلنے کے لیے "ترمیم" دبائیں۔`,
      });
    engine.act("confirm");
  };

  const screen = engine.step.screen;

  return (
    <PhoneFrame appName="Practice Wallet">
      {screen === "home" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="flex items-center gap-2 text-sm font-semibold"><Wallet className="h-4 w-4" /> {ur ? "مشق بیلنس" : "Practice balance"}</p>
            <p className="mt-1 text-3xl font-bold">{formatRs(WALLET_BALANCE)}</p>
            <p className="text-xs">{ur ? "فرضی رقم — اصل نہیں" : "Pretend money — not real"}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SimButton action="send-money" className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-4 text-lg font-bold text-heading">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-primary-strong"><ArrowUpRight className="h-7 w-7" /></span>
              {ur ? "رقم بھیجیں" : "Send Money"}
            </SimButton>
            <SimButton
              action="history"
              onPress={() => { setShowHistory((v) => !v); engine.act("history"); }}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-4 text-lg font-bold text-heading"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky text-heading"><History className="h-7 w-7" /></span>
              {ur ? "ہسٹری" : "History"}
            </SimButton>
          </div>
          {showHistory && (
            <div className="rounded-xl border border-border bg-card p-4 text-base">
              <p className="font-bold text-heading">{ur ? "مشق ہسٹری" : "Practice history"}</p>
              <p className="text-muted-foreground">{ur ? "ابھی کوئی ٹرانزیکشن نہیں۔" : "No practice transactions yet."}</p>
            </div>
          )}
        </div>
      )}

      {screen === "type" && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{ur ? "کہاں بھیجنا ہے؟" : "Where are you sending?"}</h3>
          <SimButton action="wallet-to-wallet" className={tile}><Smartphone className="h-7 w-7 text-primary" /> {ur ? "والیٹ سے والیٹ" : "Wallet to Wallet"}</SimButton>
          <SimButton action="bank" className={tile}><Landmark className="h-7 w-7 text-primary" /> {ur ? "بینک ٹرانسفر" : "Bank Transfer"}</SimButton>
        </div>
      )}

      {screen === "recipient" && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-lg font-bold text-heading">{ur ? "موبائل نمبر" : "Mobile number"}</span>
            <input
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX XXXXXXX"
              className={cn("mt-1 h-14 w-full rounded-xl border-2 border-input bg-card px-4 text-xl tracking-wider text-heading", isTarget("recipient-continue") && !recipient && "sim-target")}
            />
          </label>
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-muted-foreground">{ur ? "مشق کانٹیکٹس" : "Practice contacts"}</p>
            <div className="space-y-2">
              {paymentContacts.map((c) => (
                <button key={c.id} type="button" onClick={() => setPhone(c.phone)} className={cn(tile, "p-3", recipient?.id === c.id && "border-primary bg-mint")}>
                  <UserRound className="h-6 w-6 text-primary" />
                  <span className="flex-1"><span className="block">{c.name}</span><span className="block text-base font-normal text-muted-foreground" dir="ltr">{c.phone}</span></span>
                </button>
              ))}
            </div>
          </div>
          <SimButton action="recipient-continue" onPress={continueRecipient} className="btn btn-primary w-full">{ur ? "آگے بڑھیں" : "Continue"}</SimButton>
        </div>
      )}

      {screen === "amount" && (
        <div className="space-y-4">
          <p className="text-base">{ur ? "بھیج رہے ہیں:" : "Sending to:"} <strong className="text-heading">{recipient?.name}</strong></p>
          <label className="block">
            <span className="text-lg font-bold text-heading">{ur ? "رقم (روپے)" : "Amount (Rs.)"}</span>
            <input
              inputMode="numeric"
              dir="ltr"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="0"
              className={cn("mt-1 h-16 w-full rounded-xl border-2 border-input bg-card px-4 text-3xl font-bold text-heading", isTarget("amount-continue") && Number(amount) !== TARGET_AMOUNT && "sim-target")}
            />
          </label>
          <p className="text-sm text-muted-foreground">{ur ? "مشق بیلنس:" : "Practice balance:"} {formatRs(WALLET_BALANCE)}</p>
          <SimButton action="amount-continue" onPress={continueAmount} className="btn btn-primary w-full">{ur ? "آگے بڑھیں" : "Continue"}</SimButton>
        </div>
      )}

      {screen === "review" && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{ur ? "تفصیل چیک کریں" : "Review transfer"}</h3>
          <dl className="divide-y divide-border rounded-xl border-2 border-border bg-card text-lg">
            {[
              [ur ? "وصول کنندہ" : "Recipient", recipient?.name],
              [ur ? "نمبر" : "Number", recipient?.phone],
              [ur ? "رقم" : "Amount", formatRs(Number(amount))],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 p-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold text-heading" dir="ltr">{v}</dd></div>
            ))}
          </dl>
          <p className="rounded-lg bg-warning-soft p-2 text-center text-sm font-bold text-warning">{ur ? "فرضی ٹرانزیکشن — اصل نہیں" : "Fictional transaction — not real"}</p>
          <SimButton action="confirm" onPress={confirm} className="btn btn-primary w-full">{ur ? "مشق ٹرانسفر کی تصدیق" : "Confirm Practice Transfer"}</SimButton>
          <SimButton action="edit" highlightFor="__never" onPress={() => engine.goTo("recipient")} className="btn btn-outline w-full">{ur ? "ترمیم / واپس" : "Edit / Back"}</SimButton>
        </div>
      )}

      {screen === "receipt" && (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="rounded-lg border-2 border-dashed border-warning bg-warning-soft p-3 text-base font-extrabold text-warning">
            PRACTICE COMPLETED — NO REAL MONEY SENT
          </p>
          <dl className="rounded-xl border border-border bg-card p-4 text-start text-base">
            <div className="flex justify-between"><dt>{ur ? "رقم" : "Amount"}</dt><dd className="font-bold">{formatRs(Number(amount))}</dd></div>
            <div className="flex justify-between"><dt>{ur ? "وصول کنندہ" : "To"}</dt><dd className="font-bold">{recipient?.name}</dd></div>
            <div className="flex justify-between"><dt>{ur ? "حوالہ" : "Reference"}</dt><dd className="font-mono font-bold">PRACTICE-NOT-REAL</dd></div>
          </dl>
          <p className="text-sm text-muted-foreground">{tr({ en: "This is not a payment receipt and cannot be used as proof of payment.", ur: "یہ ادائیگی کی رسید نہیں اور ثبوت کے طور پر استعمال نہیں ہو سکتی۔" })}</p>
          <CompletionActions />
        </div>
      )}
    </PhoneFrame>
  );
}
