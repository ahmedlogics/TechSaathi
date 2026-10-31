import { createFileRoute } from "@tanstack/react-router";
import { Compass, Hand, Lightbulb, RotateCcw, ShieldCheck } from "lucide-react";
import { PageContainer } from "@/components/layout/AppHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — How to use TechSaathi" },
      { name: "description", content: "Simple instructions for using the TechSaathi practice phone." },
      { property: "og:title", content: "Help — How to use TechSaathi" },
      { property: "og:description", content: "Simple instructions for using the TechSaathi practice phone." },
    ],
  }),
  component: HelpPage,
});

const items = [
  { icon: Compass, en: ["Guide Me", "The helper tells you each step and highlights the button to tap."], ur: ["میری رہنمائی کریں", "مددگار ہر قدم بتاتا ہے اور دبانے والا بٹن نمایاں کرتا ہے۔"] },
  { icon: Hand, en: ["Let Me Try", "You try on your own. Tap Need Help any time for a hint."], ur: ["مجھے خود کرنے دیں", "آپ خود کوشش کرتے ہیں۔ کسی بھی وقت \"مدد چاہیے؟\" دبائیں۔"] },
  { icon: Lightbulb, en: ["Mistakes are fine", "If you tap the wrong thing, we explain what happened and how to fix it."], ur: ["غلطی ٹھیک ہے", "غلط بٹن دبانے پر ہم بتاتے ہیں کیا ہوا اور کیسے درست کریں۔"] },
  { icon: RotateCcw, en: ["Back and Start again", "Use the arrow at the top of the phone to go back, or Start again to begin fresh."], ur: ["واپس اور دوبارہ", "فون کے اوپر تیر سے واپس جائیں، یا شروع سے کریں۔"] },
  { icon: ShieldCheck, en: ["Nothing is real", "No real money, rides, calls or identity checks. Never enter your real PIN or CNIC here."], ur: ["کچھ بھی اصل نہیں", "کوئی اصل رقم، سواری، کال یا شناخت نہیں۔ یہاں اپنا اصل پن یا شناختی کارڈ کبھی نہ لکھیں۔"] },
];

function HelpPage() {
  const { t, lang } = useLanguage();
  return (
    <PageContainer>
      <h1 className="text-[2rem] font-extrabold">{t("navHelp")}</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map(({ icon: Icon, ...txt }) => {
          const [title, body] = lang === "ur" ? txt.ur : txt.en;
          return (
            <li key={txt.en[0]} className="card-surface flex gap-4 p-5">
              <Icon className="h-9 w-9 shrink-0 text-primary" />
              <div><h2 className="text-xl font-bold">{title}</h2><p className="text-lg">{body}</p></div>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
