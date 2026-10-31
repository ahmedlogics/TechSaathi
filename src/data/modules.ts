import type { LearningModule, LessonStep, ModuleId } from "@/types/learning";
import { pakIdQuestions } from "./scenarios";

const sendMoney: LearningModule = {
  id: "send-money",
  title: { en: "Send Money", ur: "رقم بھیجیں" },
  description: { en: "Learn how to send money safely using a mobile wallet.", ur: "موبائل والیٹ سے محفوظ طریقے سے رقم بھیجنا سیکھیں۔" },
  cardAction: { en: "Start Learning", ur: "سیکھنا شروع کریں" },
  introTitle: { en: "Learn to Send Money", ur: "رقم بھیجنا سیکھیں" },
  intro: {
    en: "You will practise sending money in a safe mobile wallet. No real money will be transferred.",
    ur: "آپ ایک محفوظ موبائل والیٹ میں رقم بھیجنے کی مشق کریں گے۔ کوئی اصل رقم منتقل نہیں ہوگی۔",
  },
  learnPoints: [
    { en: "Find the Send Money option in a wallet app", ur: "والیٹ ایپ میں رقم بھیجنے کا آپشن تلاش کرنا" },
    { en: "Enter the right mobile number and amount", ur: "درست موبائل نمبر اور رقم درج کرنا" },
    { en: "Check the name before you confirm", ur: "تصدیق سے پہلے نام چیک کرنا" },
  ],
  objective: { en: "Send Rs. 1,000 to Ahmed Ali.", ur: "احمد علی کو 1,000 روپے بھیجیں۔" },
  safetyNote: { en: "No real money will be sent.", ur: "کوئی اصل رقم نہیں بھیجی جائے گی۔" },
  steps: [
    {
      id: "home",
      screen: "home",
      expected: "send-money",
      title: { en: "Tap Send Money", ur: "\"رقم بھیجیں\" دبائیں" },
      body: { en: "This is your practice wallet. To send money, start with the Send Money button.", ur: "یہ آپ کا مشق والیٹ ہے۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" کا بٹن دبائیں۔" },
      hint: { en: "Look for the large button with an arrow, near the top of the phone screen.", ur: "فون اسکرین کے اوپر تیر والا بڑا بٹن دیکھیں۔" },
      wrong: {
        history: { en: "That opens your past transactions. To send money, tap Send Money instead.", ur: "اس سے پرانی ٹرانزیکشنز کھلتی ہیں۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" دبائیں۔" },
      },
    },
    {
      id: "type",
      screen: "type",
      expected: "wallet-to-wallet",
      title: { en: "Choose Wallet to Wallet", ur: "\"والیٹ سے والیٹ\" منتخب کریں" },
      body: { en: "Ahmed has a mobile wallet, so choose Wallet to Wallet.", ur: "احمد کا موبائل والیٹ ہے، اس لیے \"والیٹ سے والیٹ\" منتخب کریں۔" },
      hint: { en: "It is the first option in the list.", ur: "یہ فہرست میں پہلا آپشن ہے۔" },
      wrong: {
        bank: { en: "Bank Transfer sends money to a bank account. Ahmed uses a mobile wallet — choose Wallet to Wallet.", ur: "بینک ٹرانسفر بینک اکاؤنٹ میں جاتا ہے۔ احمد موبائل والیٹ استعمال کرتے ہیں — \"والیٹ سے والیٹ\" منتخب کریں۔" },
      },
    },
    {
      id: "recipient",
      screen: "recipient",
      expected: "recipient-continue",
      title: { en: "Enter Ahmed's mobile number", ur: "احمد کا موبائل نمبر درج کریں" },
      body: { en: "Type the number, or tap a name in Practice Contacts to fill it in. Then tap Continue.", ur: "نمبر لکھیں، یا مشق کانٹیکٹس میں نام دبائیں۔ پھر \"آگے بڑھیں\" دبائیں۔" },
      tip: { en: "Always double-check the number. Money sent to a wrong number is hard to get back.", ur: "نمبر ہمیشہ دوبارہ چیک کریں۔ غلط نمبر پر بھیجی گئی رقم واپس لینا مشکل ہوتا ہے۔" },
      hint: { en: "Ahmed Ali's number is 0300 1234567.", ur: "احمد علی کا نمبر 0300 1234567 ہے۔" },
    },
    {
      id: "amount",
      screen: "amount",
      expected: "amount-continue",
      title: { en: "Enter the amount: 1,000", ur: "رقم درج کریں: 1,000" },
      body: { en: "Type how much to send. Your task is Rs. 1,000.", ur: "کتنی رقم بھیجنی ہے لکھیں۔ آپ کا کام 1,000 روپے ہے۔" },
      hint: { en: "Type 1000 using the number keys, then tap Continue.", ur: "نمبر سے 1000 لکھیں، پھر \"آگے بڑھیں\" دبائیں۔" },
    },
    {
      id: "review",
      screen: "review",
      expected: "confirm",
      title: { en: "Check the details, then confirm", ur: "تفصیل چیک کریں، پھر تصدیق کریں" },
      body: { en: "Read the name, number and amount carefully. If anything is wrong, tap Edit.", ur: "نام، نمبر اور رقم غور سے پڑھیں۔ اگر کچھ غلط ہو تو \"ترمیم\" دبائیں۔" },
      tip: { en: "This review screen is your last chance to catch a mistake.", ur: "یہ جائزہ اسکرین غلطی پکڑنے کا آخری موقع ہے۔" },
      hint: { en: "If it says Ahmed Ali and Rs. 1,000, tap Confirm Practice Transfer.", ur: "اگر احمد علی اور 1,000 روپے لکھا ہو تو \"تصدیق کریں\" دبائیں۔" },
    },
    {
      id: "receipt",
      screen: "receipt",
      expected: null,
      title: { en: "You sent the practice money!", ur: "آپ نے مشق کی رقم بھیج دی!" },
      body: { en: "This receipt shows what a confirmation looks like. Remember: no real money was sent.", ur: "یہ رسید دکھاتی ہے کہ تصدیق کیسی ہوتی ہے۔ یاد رکھیں: کوئی اصل رقم نہیں بھیجی گئی۔" },
      hint: { en: "", ur: "" },
    },
  ],
};

const bookRide: LearningModule = {
  id: "book-ride",
  title: { en: "Book a Ride", ur: "سواری بک کریں" },
  description: { en: "Practise booking a ride, checking fares and verifying your driver.", ur: "سواری بک کرنے، کرایہ دیکھنے اور ڈرائیور کی تصدیق کی مشق کریں۔" },
  cardAction: { en: "Start Learning", ur: "سیکھنا شروع کریں" },
  introTitle: { en: "Learn to Book a Ride", ur: "سواری بک کرنا سیکھیں" },
  intro: { en: "You will practise booking a ride in a safe practice app. No real ride will be booked.", ur: "آپ ایک محفوظ مشق ایپ میں سواری بک کریں گے۔ کوئی اصل سواری بک نہیں ہوگی۔" },
  learnPoints: [
    { en: "Choose where you are and where you are going", ur: "کہاں ہیں اور کہاں جانا ہے منتخب کرنا" },
    { en: "Compare ride types and fares", ur: "سواری کی قسم اور کرایہ کا موازنہ" },
    { en: "Check the number plate before getting in", ur: "بیٹھنے سے پہلے نمبر پلیٹ چیک کرنا" },
  ],
  objective: { en: "Book a ride and check your driver safely.", ur: "سواری بک کریں اور ڈرائیور کو محفوظ طریقے سے چیک کریں۔" },
  safetyNote: { en: "This ride booking is only a simulation.", ur: "یہ سواری کی بکنگ صرف مشق ہے۔" },
  steps: [
    {
      id: "home",
      screen: "home",
      expected: "where-to",
      title: { en: "Tap \"Where are you going?\"", ur: "\"آپ کہاں جا رہے ہیں؟\" دبائیں" },
      body: { en: "Ride apps start with a box asking where you want to go.", ur: "سواری ایپس ایک خانے سے شروع ہوتی ہیں جو پوچھتا ہے کہ کہاں جانا ہے۔" },
      hint: { en: "It is the white box at the bottom of the map.", ur: "یہ نقشے کے نیچے سفید خانہ ہے۔" },
    },
    {
      id: "pickup",
      screen: "pickup",
      expected: "pickup-continue",
      title: { en: "Choose your pickup place", ur: "سوار ہونے کی جگہ منتخب کریں" },
      body: { en: "Pick where the driver should collect you, then tap Continue.", ur: "منتخب کریں کہ ڈرائیور آپ کو کہاں سے لے، پھر \"آگے بڑھیں\" دبائیں۔" },
      tip: { en: "These are practice places. The app does not use your real location.", ur: "یہ مشق کی جگہیں ہیں۔ ایپ آپ کا اصل مقام استعمال نہیں کرتی۔" },
      hint: { en: "Try \"Home — Gulshan-e-Iqbal\", then tap Continue.", ur: "\"گھر — گلشنِ اقبال\" منتخب کریں، پھر \"آگے بڑھیں\"۔" },
    },
    {
      id: "destination",
      screen: "destination",
      expected: "dest-continue",
      title: { en: "Choose where you are going", ur: "منزل منتخب کریں" },
      body: { en: "Pick a different place as your destination. The route preview will update.", ur: "منزل کے لیے کوئی دوسری جگہ منتخب کریں۔ راستہ اپڈیٹ ہو جائے گا۔" },
      hint: { en: "Try \"City Hospital — Saddar\", then tap Continue.", ur: "\"سٹی ہسپتال — صدر\" منتخب کریں، پھر \"آگے بڑھیں\"۔" },
    },
    {
      id: "ride",
      screen: "ride",
      expected: "ride-continue",
      title: { en: "Choose Car or Rickshaw", ur: "گاڑی یا رکشہ منتخب کریں" },
      body: { en: "Each option shows a fare. Pick one that suits you, then tap Continue.", ur: "ہر آپشن کا کرایہ دکھایا گیا ہے۔ اپنی پسند منتخب کریں، پھر \"آگے بڑھیں\"۔" },
      tip: { en: "Rickshaws are usually cheaper; cars are more comfortable.", ur: "رکشہ عموماً سستا اور گاڑی زیادہ آرام دہ ہوتی ہے۔" },
      hint: { en: "Tap Car or Rickshaw. A selected option gets a tick.", ur: "گاڑی یا رکشہ دبائیں۔ منتخب آپشن پر نشان لگ جائے گا۔" },
    },
    {
      id: "review",
      screen: "review",
      expected: "confirm-booking",
      title: { en: "Check your booking and confirm", ur: "بکنگ چیک کریں اور تصدیق کریں" },
      body: { en: "Make sure pickup, destination and fare look right. Then confirm.", ur: "سوار ہونے کی جگہ، منزل اور کرایہ چیک کریں۔ پھر تصدیق کریں۔" },
      hint: { en: "Tap the green Confirm Practice Booking button.", ur: "\"مشق بکنگ کی تصدیق\" کا بٹن دبائیں۔" },
    },
    {
      id: "assigned",
      screen: "assigned",
      expected: "see-vehicle",
      title: { en: "Remember your driver's number plate", ur: "ڈرائیور کی نمبر پلیٹ یاد رکھیں" },
      body: { en: "A practice driver is on the way. Note the number plate shown, then tap \"Vehicle has arrived\".", ur: "مشق ڈرائیور آ رہا ہے۔ نمبر پلیٹ یاد رکھیں، پھر \"گاڑی پہنچ گئی\" دبائیں۔" },
      tip: { en: "The number plate is the safest way to recognise your ride.", ur: "نمبر پلیٹ اپنی سواری پہچاننے کا سب سے محفوظ طریقہ ہے۔" },
      hint: { en: "The plate is KHI-4821. Then tap the button at the bottom.", ur: "پلیٹ KHI-4821 ہے۔ پھر نیچے والا بٹن دبائیں۔" },
    },
    {
      id: "verify",
      screen: "verify",
      expected: "plate-different",
      title: { en: "Does the number plate match?", ur: "کیا نمبر پلیٹ ملتی ہے؟" },
      body: { en: "Compare the plate on the arriving vehicle with the one in your booking.", ur: "آنے والی گاڑی کی پلیٹ کا اپنی بکنگ والی پلیٹ سے موازنہ کریں۔" },
      hint: { en: "Read each digit slowly: 4-8-2-1 versus the vehicle's plate.", ur: "ہر ہندسہ آہستہ پڑھیں: 4-8-2-1 اور گاڑی کی پلیٹ۔" },
      wrong: {
        "plate-match": {
          en: "Look again: your booking says KHI-4821, but this vehicle shows KHI-4281. Never get into a vehicle whose plate doesn't match.",
          ur: "دوبارہ دیکھیں: بکنگ میں KHI-4821 ہے لیکن گاڑی پر KHI-4281۔ پلیٹ نہ ملے تو کبھی گاڑی میں نہ بیٹھیں۔",
        },
      },
    },
    {
      id: "done",
      screen: "done",
      expected: null,
      title: { en: "Great! You stayed safe.", ur: "زبردست! آپ محفوظ رہے۔" },
      body: { en: "You practised booking a ride and checking your driver's details.", ur: "آپ نے سواری بک کرنے اور ڈرائیور کی تفصیل چیک کرنے کی مشق کی۔" },
      hint: { en: "", ur: "" },
    },
  ],
};

const pakIdStep = (id: string, title: string, titleUr: string, body: string, bodyUr: string): LessonStep => {
  const q = pakIdQuestions[id]!;
  const correct = q.options[0]!.id;
  return {
    id,
    screen: "question",
    expected: correct,
    title: { en: title, ur: titleUr },
    body: { en: body, ur: bodyUr },
    hint: { en: "Think about which answer keeps you safe and follows official rules.", ur: "سوچیں کون سا جواب آپ کو محفوظ رکھتا ہے اور سرکاری قواعد کے مطابق ہے۔" },
    wrong: Object.fromEntries(q.options.filter((o) => o.feedback).map((o) => [o.id, o.feedback!])),
  };
};

const proofOfLife: LearningModule = {
  id: "proof-of-life",
  title: { en: "Proof of Life (PakID)", ur: "زندگی کا ثبوت (پاک آئی ڈی)" },
  description: { en: "Understand how the PakID proof-of-life process works for pensioners.", ur: "سمجھیں کہ پنشنرز کے لیے پاک آئی ڈی کا عمل کیسے کام کرتا ہے۔" },
  cardAction: { en: "Explore Guided Practice", ur: "رہنمائی والی مشق دیکھیں" },
  introTitle: { en: "Understand Proof of Life", ur: "زندگی کا ثبوت سمجھیں" },
  intro: {
    en: "A short guided walkthrough with a few practice questions. This does not verify your identity and is not connected to NADRA.",
    ur: "چند سوالات کے ساتھ مختصر رہنمائی۔ یہ آپ کی شناخت کی تصدیق نہیں کرتا اور نادرا سے منسلک نہیں۔",
  },
  learnPoints: [
    { en: "How to recognise the official service", ur: "آفیشل سروس کیسے پہچانیں" },
    { en: "What the camera and fingerprint stages involve", ur: "کیمرہ اور انگلیوں کے نشان کے مراحل" },
    { en: "Where to get official help", ur: "سرکاری مدد کہاں سے لیں" },
  ],
  objective: { en: "Answer each question to understand the process.", ur: "عمل سمجھنے کے لیے ہر سوال کا جواب دیں۔" },
  safetyNote: { en: "This does not verify your identity.", ur: "یہ آپ کی شناخت کی تصدیق نہیں کرتا۔" },
  steps: [
    pakIdStep("official", "Recognise the official service", "آفیشل سروس پہچانیں", "PakID is NADRA's official app. Fake apps and links exist, so be careful where you download from.", "پاک آئی ڈی نادرا کی آفیشل ایپ ہے۔ جعلی ایپس اور لنک بھی ہوتے ہیں، احتیاط کریں۔"),
    pakIdStep("purpose", "Why proof of life?", "زندگی کا ثبوت کیوں؟", "Pension offices may ask pensioners to confirm they are alive from time to time.", "پنشن دفاتر وقتاً فوقتاً پنشنرز سے زندہ ہونے کی تصدیق مانگ سکتے ہیں۔"),
    pakIdStep("who", "For yourself or a family member", "اپنے لیے یا گھر کے فرد کے لیے", "Some services allow help from an eligible family member, but official verification rules decide this.", "کچھ سروسز میں اہل گھر کا فرد مدد کر سکتا ہے، لیکن یہ سرکاری قواعد طے کرتے ہیں۔"),
    pakIdStep("camera", "The camera stage", "کیمرے کا مرحلہ", "Apps like this may ask to see your face through the camera. This practice does NOT use your camera.", "ایسی ایپس کیمرے سے چہرہ دیکھ سکتی ہیں۔ یہ مشق آپ کا کیمرہ استعمال نہیں کرتی۔"),
    pakIdStep("fingerprint", "The fingerprint stage", "انگلیوں کے نشان کا مرحلہ", "Some processes may capture fingerprints. This practice does NOT collect any fingerprints.", "کچھ عمل انگلیوں کے نشان لے سکتے ہیں۔ یہ مشق کوئی نشان نہیں لیتی۔"),
    pakIdStep("nadra", "Who does the real check?", "اصل جانچ کون کرتا ہے؟", "Only NADRA completes actual verification through its official app, website or offices.", "صرف نادرا اپنی آفیشل ایپ، ویب سائٹ یا دفاتر کے ذریعے اصل تصدیق کرتا ہے۔"),
    {
      id: "done",
      screen: "done",
      expected: null,
      title: { en: "Walkthrough complete", ur: "رہنمائی مکمل" },
      body: {
        en: "You have completed this learning walkthrough. Actual proof-of-life verification must be completed through official authorized channels.",
        ur: "آپ نے یہ رہنمائی مکمل کر لی۔ زندگی کے ثبوت کی اصل تصدیق صرف سرکاری مجاز ذرائع سے ہوگی۔",
      },
      hint: { en: "" },
    },
  ],
};

const videoCall: LearningModule = {
  id: "video-call",
  title: { en: "Audio & Video Calls", ur: "آڈیو اور ویڈیو کالز" },
  description: { en: "Learn how to start, answer and manage calls on your smartphone.", ur: "اسمارٹ فون پر کال شروع کرنا، اٹھانا اور سنبھالنا سیکھیں۔" },
  cardAction: { en: "Start Learning", ur: "سیکھنا شروع کریں" },
  introTitle: { en: "Learn Video Calls", ur: "ویڈیو کال سیکھیں" },
  intro: { en: "You will practise a video call with a pretend family member. This is not a real phone call, and your camera is not used.", ur: "آپ ایک فرضی رشتہ دار کے ساتھ ویڈیو کال کی مشق کریں گے۔ یہ اصل کال نہیں اور کیمرہ استعمال نہیں ہوتا۔" },
  learnPoints: [
    { en: "Start a video call with a contact", ur: "کسی کانٹیکٹ کو ویڈیو کال کرنا" },
    { en: "Mute your microphone and turn your camera off", ur: "مائیک بند کرنا اور کیمرہ بند کرنا" },
    { en: "End the call", ur: "کال ختم کرنا" },
  ],
  objective: { en: "Video call Sara, mute, turn your camera off, then end the call.", ur: "سارہ کو ویڈیو کال کریں، مائیک اور کیمرہ بند کریں، پھر کال ختم کریں۔" },
  safetyNote: { en: "This is not a real phone call.", ur: "یہ اصل کال نہیں ہے۔" },
  steps: [
    {
      id: "start",
      screen: "start",
      expected: "choose-video",
      title: { en: "Choose Practise Video Call", ur: "\"ویڈیو کال کی مشق\" منتخب کریں" },
      body: { en: "We will practise a video call today.", ur: "آج ہم ویڈیو کال کی مشق کریں گے۔" },
      hint: { en: "Tap the button with the video camera.", ur: "ویڈیو کیمرے والا بٹن دبائیں۔" },
      wrong: { "choose-audio": { en: "Audio call practice is coming soon. Please choose Practise Video Call.", ur: "آڈیو کال کی مشق جلد آئے گی۔ براہ کرم ویڈیو کال منتخب کریں۔" } },
    },
    {
      id: "contacts",
      screen: "contacts",
      expected: "call-sara",
      title: { en: "Tap the video button next to Sara", ur: "سارہ کے ساتھ ویڈیو بٹن دبائیں" },
      body: { en: "Each contact has a video camera button on the right. Find Sara.", ur: "ہر کانٹیکٹ کے ساتھ ویڈیو کیمرے کا بٹن ہے۔ سارہ کو تلاش کریں۔" },
      hint: { en: "Sara (Daughter) is first in the list.", ur: "سارہ (بیٹی) فہرست میں پہلی ہیں۔" },
      wrong: { "call-other": { en: "That is a different person. Your task is to call Sara.", ur: "یہ کوئی اور ہے۔ آپ کو سارہ کو کال کرنی ہے۔" } },
    },
    {
      id: "calling",
      screen: "calling",
      expected: "connected",
      title: { en: "Wait while it rings", ur: "گھنٹی بجنے تک انتظار کریں" },
      body: { en: "The phone is calling Sara. Wait a moment for her to answer.", ur: "فون سارہ کو کال کر رہا ہے۔ ان کے اٹھانے کا انتظار کریں۔" },
      hint: { en: "Just wait. You don't need to press anything.", ur: "بس انتظار کریں۔ کچھ دبانے کی ضرورت نہیں۔" },
      wrong: { end: { en: "Wait — don't hang up yet. Let Sara answer first.", ur: "رکیں — ابھی کال بند نہ کریں۔ پہلے سارہ کو اٹھانے دیں۔" } },
    },
    {
      id: "mute",
      screen: "incall",
      expected: "mute",
      title: { en: "Mute your microphone", ur: "اپنا مائیک بند کریں" },
      body: { en: "Muting stops the other person hearing you. Tap the microphone button.", ur: "مائیک بند کرنے سے دوسرا شخص آپ کو نہیں سن سکتا۔ مائیک کا بٹن دبائیں۔" },
      hint: { en: "The microphone button is on the left of the bottom row.", ur: "مائیک کا بٹن نیچے والی قطار میں بائیں طرف ہے۔" },
      wrong: { end: { en: "Not yet! First mute the microphone.", ur: "ابھی نہیں! پہلے مائیک بند کریں۔" } },
    },
    {
      id: "camera",
      screen: "incall",
      expected: "camera-off",
      title: { en: "Turn your camera off", ur: "اپنا کیمرہ بند کریں" },
      body: { en: "Turning the camera off means they can't see you, but can still talk.", ur: "کیمرہ بند کرنے سے وہ آپ کو نہیں دیکھ سکیں گے، لیکن بات ہو سکتی ہے۔" },
      hint: { en: "The camera button is in the middle of the bottom row.", ur: "کیمرے کا بٹن نیچے والی قطار کے درمیان میں ہے۔" },
      wrong: {
        end: { en: "Not yet! First turn the camera off.", ur: "ابھی نہیں! پہلے کیمرہ بند کریں۔" },
        unmute: { en: "You already muted. Now tap the camera button.", ur: "آپ نے مائیک بند کر دیا۔ اب کیمرے کا بٹن دبائیں۔" },
      },
    },
    {
      id: "end",
      screen: "incall",
      expected: "end",
      title: { en: "End the call", ur: "کال ختم کریں" },
      body: { en: "When you are done talking, tap the red button to hang up.", ur: "بات ختم ہونے پر لال بٹن دبا کر کال بند کریں۔" },
      hint: { en: "The red phone button is on the right.", ur: "لال فون کا بٹن دائیں طرف ہے۔" },
    },
    {
      id: "done",
      screen: "done",
      expected: null,
      title: { en: "Call practice complete", ur: "کال کی مشق مکمل" },
      body: { en: "You started a video call, muted, turned your camera off and ended the call.", ur: "آپ نے ویڈیو کال کی، مائیک اور کیمرہ بند کیا اور کال ختم کی۔" },
      hint: { en: "" },
    },
  ],
};

export const modules: LearningModule[] = [sendMoney, bookRide, proofOfLife, videoCall];
export const moduleIds = modules.map((m) => m.id);
export const getModule = (id: string) => modules.find((m) => m.id === id) as LearningModule | undefined;
export const isModuleId = (id: string): id is ModuleId => moduleIds.includes(id as ModuleId);
