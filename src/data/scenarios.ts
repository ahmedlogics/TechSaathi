import type { LocalText } from "@/types/learning";

/* ---------- Send Money (fictional practice data) ---------- */
export const WALLET_BALANCE = 25000;
export const TARGET_AMOUNT = 1000;
export const paymentContacts = [
  { id: "ahmed", name: "Ahmed Ali", phone: "0300 1234567" },
  { id: "bilal", name: "Bilal Khan", phone: "0311 7654321" },
];
export const TARGET_RECIPIENT = "ahmed";
export const digitsOnly = (s: string) => s.replace(/\D/g, "");
export const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

/* ---------- Book a Ride (fictional Karachi practice locations) ---------- */
export const rideLocations: { id: string; label: LocalText; pos: number }[] = [
  { id: "home", label: { en: "Home — Gulshan-e-Iqbal", ur: "گھر — گلشنِ اقبال" }, pos: 0 },
  { id: "hospital", label: { en: "City Hospital — Saddar", ur: "سٹی ہسپتال — صدر" }, pos: 3 },
  { id: "market", label: { en: "Market — Tariq Road", ur: "بازار — طارق روڈ" }, pos: 1 },
  { id: "mosque", label: { en: "Masjid — Clifton", ur: "مسجد — کلفٹن" }, pos: 4 },
];
export const rideTypes = [
  { id: "car", label: { en: "Car", ur: "گاڑی" }, base: 300, perKm: 110 },
  { id: "rickshaw", label: { en: "Rickshaw", ur: "رکشہ" }, base: 180, perKm: 70 },
];
export function practiceFare(pickup: string, dest: string, type: string) {
  const a = rideLocations.find((l) => l.id === pickup)?.pos ?? 0;
  const b = rideLocations.find((l) => l.id === dest)?.pos ?? 0;
  const r = rideTypes.find((t) => t.id === type) ?? rideTypes[0];
  return r.base + Math.max(1, Math.abs(a - b)) * 2 * r.perKm;
}
export const rideDriver = { name: "Imran Saeed", bookedPlate: "KHI-4821", arrivedPlate: "KHI-4281" };

/* ---------- Video call ---------- */
export const callContacts = [
  { id: "sara", name: "Sara (Daughter)", initials: "S" },
  { id: "usman", name: "Usman (Son)", initials: "U" },
  { id: "nasreen", name: "Nasreen (Sister)", initials: "N" },
];

/* ---------- PakID orientation: practice decisions ---------- */
export interface PakIdQuestion {
  icon: "shield" | "heart" | "users" | "camera" | "fingerprint" | "building";
  question: LocalText;
  options: { id: string; label: LocalText; feedback?: LocalText }[];
}
export const pakIdQuestions: Record<string, PakIdQuestion> = {
  official: {
    icon: "shield",
    question: { en: "Where should you get the PakID app?", ur: "پاک آئی ڈی ایپ کہاں سے لینی چاہیے؟" },
    options: [
      { id: "official-store", label: { en: "From the official app store, published by NADRA", ur: "آفیشل ایپ اسٹور سے، جو نادرا نے شائع کی ہو" } },
      {
        id: "whatsapp-link",
        label: { en: "From a link sent by an unknown number on WhatsApp", ur: "واٹس ایپ پر نامعلوم نمبر کے بھیجے گئے لنک سے" },
        feedback: { en: "Unknown links can be scams. Only install from the official app store or NADRA's website.", ur: "نامعلوم لنک دھوکا ہو سکتے ہیں۔ صرف آفیشل ایپ اسٹور یا نادرا ویب سائٹ سے انسٹال کریں۔" },
      },
    ],
  },
  purpose: {
    icon: "heart",
    question: { en: "What is proof of life for?", ur: "زندگی کا ثبوت کس لیے ہے؟" },
    options: [
      { id: "pension", label: { en: "To confirm a pensioner is alive so the pension can continue", ur: "یہ تصدیق کہ پنشنر زندہ ہے تاکہ پنشن جاری رہے" } },
      {
        id: "loan",
        label: { en: "To apply for a bank loan", ur: "بینک قرض کے لیے درخواست" },
        feedback: { en: "Not quite. Proof of life is about confirming a pensioner is alive, not loans.", ur: "درست نہیں۔ یہ پنشنر کے زندہ ہونے کی تصدیق کے لیے ہے، قرض کے لیے نہیں۔" },
      },
    ],
  },
  who: {
    icon: "users",
    question: { en: "Can a family member help with the application?", ur: "کیا گھر کا فرد درخواست میں مدد کر سکتا ہے؟" },
    options: [
      { id: "official-rules", label: { en: "Possibly — but only as the official rules allow", ur: "شاید — لیکن صرف سرکاری قواعد کے مطابق" } },
      {
        id: "anyone",
        label: { en: "Yes, anyone can verify for anyone", ur: "ہاں، کوئی بھی کسی کی بھی تصدیق کر سکتا ہے" },
        feedback: { en: "No. Who may apply is decided by official verification rules. Always check NADRA's guidance.", ur: "نہیں۔ کون درخواست دے سکتا ہے یہ سرکاری قواعد طے کرتے ہیں۔ نادرا کی ہدایات دیکھیں۔" },
      },
    ],
  },
  camera: {
    icon: "camera",
    question: { en: "Which is better for a face photo step?", ur: "چہرے کی تصویر کے لیے کون سا بہتر ہے؟" },
    options: [
      { id: "good-light", label: { en: "Good light, face in the middle, phone held still", ur: "اچھی روشنی، چہرہ درمیان میں، فون ساکن" } },
      {
        id: "dark-room",
        label: { en: "Dark room, wearing sunglasses", ur: "اندھیرا کمرہ، دھوپ کی عینک پہن کر" },
        feedback: { en: "Dark rooms and glasses make your face hard to see. Use good light and remove glasses.", ur: "اندھیرے اور عینک سے چہرہ صاف نظر نہیں آتا۔ اچھی روشنی رکھیں اور عینک اتاریں۔" },
      },
    ],
  },
  fingerprint: {
    icon: "fingerprint",
    question: { en: "If a fingerprint step is shown, what helps most?", ur: "اگر انگلیوں کے نشان کا مرحلہ ہو تو کیا مدد کرتا ہے؟" },
    options: [
      { id: "clean-still", label: { en: "Clean, dry fingers held steady as instructed", ur: "صاف، خشک انگلیاں ہدایت کے مطابق ساکن" } },
      {
        id: "rush",
        label: { en: "Moving fingers quickly to finish fast", ur: "جلدی ختم کرنے کے لیے انگلیاں تیزی سے ہلانا" },
        feedback: { en: "Moving quickly can cause the capture to fail. Hold steady and follow on-screen instructions.", ur: "تیزی سے ہلانے پر عمل ناکام ہو سکتا ہے۔ ساکن رکھیں اور ہدایات پر عمل کریں۔" },
      },
    ],
  },
  nadra: {
    icon: "building",
    question: { en: "Who completes the actual verification?", ur: "اصل تصدیق کون مکمل کرتا ہے؟" },
    options: [
      { id: "nadra", label: { en: "Only NADRA, through official channels", ur: "صرف نادرا، سرکاری ذرائع سے" } },
      {
        id: "techsaathi",
        label: { en: "This TechSaathi practice app", ur: "یہ ٹیک ساتھی مشق ایپ" },
        feedback: { en: "TechSaathi only teaches. It cannot verify anyone. Only NADRA can.", ur: "ٹیک ساتھی صرف سکھاتا ہے۔ یہ کسی کی تصدیق نہیں کر سکتا۔ صرف نادرا کر سکتا ہے۔" },
      },
    ],
  },
};
