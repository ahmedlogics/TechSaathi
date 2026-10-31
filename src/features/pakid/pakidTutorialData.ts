import type { TutorialStep } from "./types";

export const tutorialSteps: TutorialStep[] = [
  {
    id: "tut-login",
    stepNumber: 1,
    totalSteps: 13,
    title: {
      en: "Step 1: Open PakID & Sign In",
      ur: "مرحلہ ۱: پاک آئی ڈی کھولیں اور لاگ اِن کریں",
    },
    instruction: {
      en: "Start by opening the official PakID application on your smartphone. Tap the green Login button to sign in.",
      ur: "اپنے اسمارٹ فون پر نادرا کی پاک آئی ڈی ایپ کھولیں۔ داخل ہونے کے لیے سبز لاگ اِن بٹن دبائیں۔",
    },
    imagePath: "/images/pakid/1.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Login Button (لاگ اِن)",
      ur: "لاگ اِن کا سبز بٹن",
    },
    highlightArea: { top: 60.5, left: 6, width: 68, height: 8 },
    details: {
      en: "The Login button is located in the center. If you do not have an account yet, tap 'Register here' below the button to create one.",
      ur: "لاگ اِن کا بٹن درمیان میں ہے۔ اگر اکاؤنٹ نہ ہو تو نیچے 'Register here (یہاں رجسٹر کریں)' پر جا سکتے ہیں۔",
    },
    keyPoints: {
      en: [
        "Use official PakID app downloaded from Google Play Store or Apple App Store.",
        "Never share your password or OTP code with anyone.",
        "You can practice all steps safely on TechSaathi without an account.",
      ],
      ur: [
        "صرف گوگل پلے اسٹور یا ایپل ایپ اسٹور سے اصل پاک آئی ڈی ایپ ڈاؤن لوڈ کریں۔",
        "اپنا پاس ورڈ یا او ٹی پی کوڈ کسی سے شیئر نہ کریں۔",
        "ٹیک ساتھی پر آپ بغیر کسی پاس ورڈ کے باحفاظت مشق کر سکتے ہیں۔",
      ],
    },
  },
  {
    id: "tut-dashboard-home",
    stepNumber: 2,
    totalSteps: 13,
    title: {
      en: "Step 2: Understand the Main Dashboard",
      ur: "مرحلہ ۲: مرکزی ڈیش بورڈ کو سمجھیں",
    },
    instruction: {
      en: "After signing in, you will see your name and the main services dashboard. To get a Proof-of-Life certificate, scroll down to Biometric Attestation.",
      ur: "لاگ اِن ہونے کے بعد مرکزی اسکرین پر آپ کا نام نظر آئے گا۔ زندگی کے ثبوت کے لیے اسکرین کو نیچے اسکرول کریں۔",
    },
    imagePath: "/images/pakid/2.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Applications & Services",
      ur: "مرکزی خدمات اور درخواستیں",
    },
    highlightArea: { top: 28, left: 5, width: 90, height: 38 },
    details: {
      en: "The home screen displays tracking, digital ID view, and application categories. Scroll down past ID Documents to find Biometric Attestation.",
      ur: "ہوم اسکرین پر درخواستوں کا اسٹیٹس اور خدمات نظر آتی ہیں۔ نیچے اسکرول کرنے پر بائیو میٹرک سروسز سامنے آتی ہیں۔",
    },
    keyPoints: {
      en: [
        "Your name appears at the top left under 'Welcome'.",
        "The bottom bar lets you access Home, ID Vault, and Complaints.",
        "Proof of Life is located in the Biometric Attestation category.",
      ],
      ur: [
        "اوپر بائیں جانب 'Welcome' کے نیچے آپ کا نام آئے گا۔",
        "نیچے دی گئی پٹی سے ہوم، آئی ڈی والٹ اور شکایات تک رسائی ہوتی ہے۔",
        "سرٹیفیکیٹ برائے حیات بائیو میٹرک تصدیق والے حصے میں موجود ہے۔",
      ],
    },
  },
  {
    id: "tut-find-polc",
    stepNumber: 3,
    totalSteps: 13,
    title: {
      en: "Step 3: Find Proof of Life (سرٹیفیکیٹ برائے حیات)",
      ur: "مرحلہ ۳: 'Proof of Life' کا انتخاب کریں",
    },
    instruction: {
      en: "Under 'Biometric Attestation (بائیو میٹرک تصدیق)', locate and tap the 'Proof of Life (سرٹیفیکیٹ برائے حیات)' icon.",
      ur: "'بائیو میٹرک تصدیق' کے خانے میں جائیں اور چوتھے نمبر پر موجود 'Proof of Life' کو دبائیں۔",
    },
    imagePath: "/images/pakid/3.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Proof of Life Option",
      ur: "سرٹیفیکیٹ برائے حیات",
    },
    highlightArea: { top: 38.8, left: 74, width: 22.5, height: 16.5 },
    details: {
      en: "This service is specifically created for pensioners who need to submit verification that they are alive to pension authorities and banks.",
      ur: "یہ خدمت خاص طور پر پنشنرز کے لیے ہے تاکہ وہ بینک یا پنشن محکمے کو زندگی کا ثبوت پیش کر سکیں۔",
    },
    keyPoints: {
      en: [
        "Biometric Attestation contains multiple services; choose 'Proof of Life'.",
        "The icon shows a document with a green 'VERIFY POL' banner.",
        "Other buttons like Succession or Passport are for different procedures.",
      ],
      ur: [
        "بائیو میٹرک تصدیق میں سے صرف 'Proof of Life' پر ٹیپ کریں۔",
        "اس کے آئیکن پر سبز پٹی میں 'VERIFY POL' لکھا ہوتا ہے۔",
        "دیگر آپشنز جیسے جانشینی یا پاسپورٹ کسی اور کام کے لیے ہیں۔",
      ],
    },
  },
  {
    id: "tut-choose-applicant",
    stepNumber: 4,
    totalSteps: 13,
    title: {
      en: "Step 4: Choose the Applicant",
      ur: "مرحلہ ۴: درخواست گزار منتخب کریں",
    },
    instruction: {
      en: "Select whether the application is for 'Myself' or 'My Blood Relatives'. Choose Myself if you are verifying your own pension.",
      ur: "منتخب کریں کہ آیا درخواست آپ کے اپنے لیے ہے (Myself) یا خون کے قریبی رشتہ دار کے لیے۔ عام طور پر پنشنر 'Myself' منتخب کرتے ہیں۔",
    },
    imagePath: "/images/pakid/4.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Myself (میں خود)",
      ur: "میں خود (Myself) کا انتخاب",
    },
    highlightArea: { top: 18.5, left: 4, width: 92, height: 11.5 },
    details: {
      en: "Eligible family members (parents, spouse, children) can assist an older relative through their account, but the pensioner's own face and fingerprints must be verified.",
      ur: "خاندان کا کوئی فرد بھی بزرگ کی مدد کر سکتا ہے، تاہم بائیو میٹرک تصدیق خود بزرگ پنشنر کی ہی ہوگی۔",
    },
    keyPoints: {
      en: [
        "Select 'Myself (میں خود)' when applying for yourself.",
        "Select 'My Blood Relatives' if an eligible son/daughter is assisting.",
        "Tap the green 'Next (آگے بڑھیں)' button at the bottom.",
      ],
      ur: [
        "اپنے لیے 'Myself (میں خود)' منتخب کریں۔",
        "اگر اولاد مدد کر رہی ہو تو 'My Blood Relatives' منتخب کیا جا سکتا ہے۔",
        "نیچے سبز رنگ کا 'Next (آگے بڑھیں)' بٹن دبائیں۔",
      ],
    },
  },
  {
    id: "tut-fee-summary",
    stepNumber: 5,
    totalSteps: 13,
    title: {
      en: "Step 5: Review Fee — It Is 100% Free",
      ur: "مرحلہ ۵: فیس کی تصدیق — یہ خدمت بالکل مفت ہے",
    },
    instruction: {
      en: "NADRA provides Proof-of-Life Certificate verification completely free of charge. Notice that Application Fee and Payable Fee are both PKR 0.",
      ur: "نادرا نے پنشنرز کے لیے سرٹیفیکیٹ برائے حیات کی فیس بالکل معاف کر رکھی ہے۔ اسکرین پر فیس 0 روپے نظر آئے گی۔",
    },
    imagePath: "/images/pakid/5.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Payable Fee: PKR 0",
      ur: "قابلِ ادائیگی فیس: 0 روپے",
    },
    highlightArea: { top: 44, left: 4, width: 92, height: 26.5 },
    details: {
      en: "Beware of any agent or third party asking for payment. In the official PakID app, Proof-of-Life is completely free (PKR 0).",
      ur: "کسی ایجنٹ یا دکاندار کو پیسے نہ دیں۔ سرکاری ایپ پر یہ سروس بالکل مفت ہے۔",
    },
    keyPoints: {
      en: [
        "Application Fee: PKR 0.",
        "Card Delivery Fee: PKR 0.",
        "Payable Fee: PKR 0.",
        "Tap 'Please verify applicant's face liveliness' to proceed.",
      ],
      ur: [
        "درخواست فیس: 0 روپے۔",
        "ترسیل فیس: 0 روپے۔",
        "کل قابلِ ادائیگی فیس: 0 روپے۔",
        "چہرے کی تصدیق کے لیے نیچے سبز بٹن دبائیں۔",
      ],
    },
  },
  {
    id: "tut-alert",
    stepNumber: 6,
    totalSteps: 13,
    title: {
      en: "Step 6: Understand the Biometric Sequence",
      ur: "مرحلہ ۶: بائیو میٹرک کا طریقہ کار سمجھیں",
    },
    instruction: {
      en: "An alert will inform you that the process consists of two stages: first facial recognition, followed by fingerprint verification.",
      ur: "ایک وضاحتی الرٹ آئے گا جس میں بتایا گیا ہے کہ پہلے چہرے کی تصدیق ہوگی اور اس کے بعد انگلیوں کے نشانات کی جانچ ہوگی۔",
    },
    imagePath: "/images/pakid/6.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Proceed Button (آگے بڑھیں)",
      ur: "آگے بڑھنے کا بٹن",
    },
    // In 6.jpeg (289x367), Proceed button is at y=316 to y=361 (86.1% to 98.4%)
    highlightArea: { top: 86.0, left: 12.5, width: 73, height: 12.5 },
    details: {
      en: "Read the instructions calmly. Tap 'Proceed (آگے بڑھیں)' when you and the applicant are ready in a bright room.",
      ur: "اطمینان سے پڑھیں اور روشن کمرے میں بیٹھ کر 'Proceed' کا بٹن دبائیں۔",
    },
    keyPoints: {
      en: [
        "First stage: Facial recognition camera check.",
        "Second stage: Contactless fingerprint scanning.",
        "Both checks verify the live presence of the pensioner.",
      ],
      ur: [
        "پہلا مرحلہ: کیمرے کے ذریعے چہرے کا معائنہ۔",
        "دوسرا مرحلہ: کیمرے سے انگلیوں کے نشانات کا معائنہ۔",
        "دونوں تصدیقات سے پنشنر کے حیات ہونے کا ثبوت مکمل ہوتا ہے۔",
      ],
    },
  },
  {
    id: "tut-face-guidance",
    stepNumber: 7,
    totalSteps: 13,
    title: {
      en: "Step 7: Prepare for Facial Verification",
      ur: "مرحلہ ۷: چہرے کی تصویر کے اصول",
    },
    instruction: {
      en: "Make sure you are in a brightly lit place. Ensure your face stays within the oval guide frame. Do not wear hats, glasses, or masks.",
      ur: "کمرے میں اچھی روشنی ہونی چاہیے۔ چہرہ فریم کے اندر رکھیں۔ ٹوپی، عینک یا ماسک اتار دیں۔",
    },
    imagePath: "/images/pakid/8.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "CORRECT Pose (صحیح نمونہ)",
      ur: "درست نمونہ (CORRECT)",
    },
    highlightArea: { top: 57.5, left: 5.5, width: 23, height: 17 },
    details: {
      en: "The screen shows examples: looking straight with good light is CORRECT. Wearing glasses, masks, or turning sideways is INCORRECT. You can use Front or Back camera.",
      ur: "اسکرین پر مثالیں دکھائی گئی ہیں: سیدھا دیکھنا صحیح ہے؛ چشمہ، ماسک یا چہرہ موڑنا غلط ہے۔ آپ سامنے یا پیچھے کا کیمرہ چن سکتے ہیں۔",
    },
    keyPoints: {
      en: [
        "Find a well-lit area without strong shadows.",
        "Remove eyeglasses, sunglasses, caps, and face masks.",
        "Look straight ahead into the camera.",
      ],
      ur: [
        "ایسی جگہ بیٹھیں جہاں چہرے پر برابر روشنی ہو۔",
        "عینک، چشمہ، ٹوپی یا ماسک اتار دیں۔",
        "کیمرے کے بالکل سامنے سیدھا دیکھیں۔",
      ],
    },
  },
  {
    id: "tut-face-success",
    stepNumber: 8,
    totalSteps: 13,
    title: {
      en: "Step 8: Facial Verification Complete",
      ur: "مرحلہ ۸: چہرے کی تصدیق کی کامیابی",
    },
    instruction: {
      en: "When the camera detects your face in the oval guide, a green circular progress ring finishes and a dialog confirms: 'Success! Applicant Facial is Verified'.",
      ur: "جب چہرہ دائرے میں صحیح آ جائے گا تو سبز دائرہ مکمل ہوگا اور 'Success! Applicant Facial is Verified' کا پیغام آئے گا۔",
    },
    imagePath: "/images/pakid/7.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Success Dialog & Continue",
      ur: "کامیابی کا پیغام اور Continue بٹن",
    },
    highlightArea: { top: 24, left: 6, width: 88, height: 38 },
    details: {
      en: "Tap 'Continue' to move on to the second stage: fingerprint verification.",
      ur: "انگلیوں کے نشانات کی تصدیق کے دوسرے مرحلے پر جانے کے لیے 'Continue' دبائیں۔",
    },
    keyPoints: {
      en: [
        "Green ring indicates successful alignment and liveliness check.",
        "Pop-up confirms facial verification.",
        "Tap Continue to proceed to fingerprint scan.",
      ],
      ur: [
        "سبز نشان کا مطلب ہے کہ چہرہ صحیح طور پر جانچ لیا گیا ہے۔",
        "سامنے کامیابی کا پیغام نظر آئے گا۔",
        "انگلیوں کی تصدیق کے لیے 'Continue' دبائیں۔",
      ],
    },
  },
  {
    id: "tut-fingerprints",
    stepNumber: 9,
    totalSteps: 13,
    title: {
      en: "Step 9: Fingerprint Positioning Guidance",
      ur: "مرحلہ ۹: انگلیوں کے نشانات کی پوزیشننگ",
    },
    instruction: {
      en: "PakID scans fingerprints contactlessly using the smartphone camera. Select Left Hand, Right Hand, Left Thumb, or Right Thumb, and place your 4 fingers flat in the guide box.",
      ur: "پاک آئی ڈی فون کے کیمرے سے انگلیوں کے نشانات اسکین کرتی ہے۔ بایاں یا دایاں ہاتھ منتخب کریں اور 4 انگلیاں فریم میں سیدھی رکھیں۔",
    },
    imagePath: "/images/pakid/9.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Hand Options (ہاتھ کے آپشنز)",
      ur: "ہاتھ کے آپشنز",
    },
    highlightArea: { top: 82, left: 4, width: 92, height: 16.5 },
    details: {
      en: "Watch the distance indicator on the left: move closer if it says 'TOO FAR' until the indicator turns green in the optimal zone.",
      ur: "بائیں جانب موجود فاصلے کا میٹر دیکھیں: اگر 'TOO FAR' ہو تو ہاتھ قریب لائیں جب تک سبز تیر درمیان میں نہ آ جائے۔",
    },
    keyPoints: {
      en: [
        "No ink or biometric machine needed — uses your phone camera.",
        "Keep fingers together and flat against a plain background.",
        "Keep hand still for 30–90 seconds while the app captures ridge details.",
      ],
      ur: [
        "کسی سیاہی یا فنگر پرنٹ مشین کی ضرورت نہیں — فون کیمرہ استعمال ہوتا ہے۔",
        "چاروں انگلیاں ملا کر فریم میں سیدھی رکھیں۔",
        "تقریباً ۳۰ سے ۹۰ سیکنڈ ہاتھ ساکت رکھیں تاکہ اسکین مکمل ہو سکے۔",
      ],
    },
  },
  {
    id: "tut-review-submit",
    stepNumber: 10,
    totalSteps: 13,
    title: {
      en: "Step 10: Application Review & Submission",
      ur: "مرحلہ ۱۰: درخواست کا جائزہ اور جمع کروانا",
    },
    instruction: {
      en: "Review the application summary showing Service: Proof of Life, Applicant name, Fee: PKR 0, and confirmation that both biometrics are completed. Tap Submit.",
      ur: "درخواست کا حتمی خلاصہ دیکھیں جس میں سروس، نام، 0 روپے فیس اور بائیو میٹرک کی تکمیل دکھائی گئی ہے۔ پھر جمع کروانے کا بٹن دبائیں۔",
    },
    imagePath: "/images/pakid/review-submit.svg",
    sourceType: "educational reconstruction",
    highlightLabel: {
      en: "Submit Application",
      ur: "درخواست جمع کروائیں",
    },
    highlightArea: { top: 83.3, left: 6.2, width: 87.5, height: 8.5 },
    details: {
      en: "This intermediate review lets you verify all information before official submission to NADRA.",
      ur: "یہ اسکرین آپ کو نادرا کو حتمی طور پر درخواست بھیجنے سے پہلے تمام تفصیلات چیک کرنے کا موقع دیتی ہے۔",
    },
    keyPoints: {
      en: [
        "Verify your personal details and pensioner CNIC.",
        "Ensure both facial and fingerprint stages are marked completed.",
        "Confirm total payable fee is PKR 0.",
      ],
      ur: [
        "اپنی ذاتی تفصیل اور شناختی کارڈ نمبر دیکھیں۔",
        "یقینی بنائیں کہ چہرہ اور فنگر پرنٹ دونوں مکمل ہو چکے ہیں۔",
        "تصدیق کریں کہ فیس 0 روپے ہے۔",
      ],
    },
  },
  {
    id: "tut-submitted",
    stepNumber: 11,
    totalSteps: 13,
    title: {
      en: "Step 11: Application Submitted Successfully",
      ur: "مرحلہ ۱۱: درخواست کامیابی کے ساتھ جمع ہو گئی",
    },
    instruction: {
      en: "You will receive a confirmation screen with a Tracking ID. In the real application, your receipt and certificate will be stored in your ID Vault.",
      ur: "درخواست جمع ہونے پر ٹریکنگ آئی ڈی کے ساتھ تصدیقی پیغام آئے گا۔ آپ کی رسید اور سرٹیفیکیٹ آئی ڈی والٹ میں دستیاب ہوں گے۔",
    },
    imagePath: "/images/pakid/10.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "Go to ID Vault Button",
      ur: "آئی ڈی والٹ پر جائیں (سبز بٹن)",
    },
    highlightArea: { top: 86.7, left: 5.9, width: 87.3, height: 7.7 },
    details: {
      en: "Save or note your tracking reference for inquiries. Tap the green 'Go to ID Vault (آئی ڈی والٹ پر جائیں)' button to see where to find your certificate.",
      ur: "ٹریکنگ نمبر اپنے پاس نوٹ رکھیں۔ سرٹیفیکیٹ دیکھنے کے لیے نیچے سبز بٹن 'Go to ID Vault' دبائیں۔",
    },
    keyPoints: {
      en: [
        "Heading says: 'Application Submitted Successfully'.",
        "A 12-digit tracking ID is issued for your records.",
        "Tap 'Go to ID Vault' to navigate to your documents.",
      ],
      ur: [
        "'درخواست کامیابی کے ساتھ جمع ہو گئی' کا پیغام ظاہر ہوگا۔",
        "ریکارڈ کے لیے ۱۲ ہندسوں کی ٹریکنگ آئی ڈی دی جاتی ہے۔",
        "دستاویزات دیکھنے کے لیے 'Go to ID Vault' پر ٹیپ کریں۔",
      ],
    },
  },
  {
    id: "tut-id-vault",
    stepNumber: 12,
    totalSteps: 13,
    title: {
      en: "Step 12: Open ID Vault & My Documents",
      ur: "مرحلہ ۱۲: آئی ڈی والٹ میں 'میرے دستاویزات' کھولیں",
    },
    instruction: {
      en: "In the ID Vault tab, you will see two tiles: 'Digital Card' and 'My Documents'. Tap 'My Documents (میرے دستاویزات)'.",
      ur: "آئی ڈی والٹ کے صفحے پر دو خانے نظر آئیں گے: ڈیجیٹل کارڈ اور میرے دستاویزات۔ دائیں جانب 'My Documents' کو دبائیں۔",
    },
    imagePath: "/images/pakid/11.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "My Documents (میرے دستاویزات)",
      ur: "میرے دستاویزات (My Documents)",
    },
    // In 11.jpeg (463x637), My Documents tile is at y=400 to y=525, x=222 to x=436
    highlightArea: { top: 62.8, left: 48, width: 46.2, height: 19.5 },
    details: {
      en: "The ID Vault is your digital locker where NADRA places official certificates and identity documents.",
      ur: "آئی ڈی والٹ آپ کا محفوظ ڈیجیٹل لاؤکر ہے جہاں نادرا آپ کے سرکاری سرٹیفیکیٹ محفوظ کرتا ہے۔",
    },
    keyPoints: {
      en: [
        "ID Vault is accessible anytime from the bottom navigation bar.",
        "Tile on the left shows your Digital ID Card.",
        "Tile on the right ('My Documents') holds certificates including POLC.",
      ],
      ur: [
        "آئی ڈی والٹ تک نیچے والی پٹی سے کسی بھی وقت جایا جا سکتا ہے۔",
        "بایاں خانہ ڈیجیٹل شناختی کارڈ کے لیے ہے۔",
        "دایاں خانہ 'میرے دستاویزات' سرٹیفیکیٹس بشمول زندگی کا ثبوت رکھتا ہے۔",
      ],
    },
  },
  {
    id: "tut-polc",
    stepNumber: 13,
    totalSteps: 13,
    title: {
      en: "Step 13: Access Your POLC Certificate",
      ur: "مرحلہ ۱۳: پی او ایل سی (سرٹیفیکیٹ برائے حیات) دیکھیں",
    },
    instruction: {
      en: "Inside My Documents, look for 'POLC (سرٹیفیکیٹ برائے حیات)'. When your application is processed, your official Proof-of-Life Certificate appears here.",
      ur: "'میرے دستاویزات' کے اندر 'POLC' تلاش کریں۔ جب درخواست منظور ہو جائے گی تو آپ کا سرکاری سرٹیفیکیٹ برائے حیات یہاں نظر آئے گا۔",
    },
    imagePath: "/images/pakid/12.jpeg",
    sourceType: "official screenshot",
    highlightLabel: {
      en: "POLC Card (Proof-of-Life Certificate)",
      ur: "پی او ایل سی (سرٹیفیکیٹ برائے حیات)",
    },
    // In 12.jpeg (437x629), POLC card is at y=195 to y=410, x=15 to x=225
    highlightArea: { top: 31, left: 3.5, width: 48, height: 34 },
    details: {
      en: "POLC stands for Proof-of-Life Certificate. You can view, present, or download it to show your pension office or bank.",
      ur: "پی او ایل سی (POLC) کا مطلب Proof-of-Life Certificate ہے۔ آپ اسے بینک یا پنشن دفتر کو دکھانے کے لیے استعمال کر سکتے ہیں۔",
    },
    keyPoints: {
      en: [
        "POLC stands for Proof of Life Certificate (سرٹیفیکیٹ برائے حیات).",
        "Other certificates like FRC or Vehicle Cards also live here.",
        "The real certificate is officially issued by NADRA after processing.",
      ],
      ur: [
        "پی او ایل سی کا مطلب 'سرٹیفیکیٹ برائے حیات' ہے۔",
        "یہاں ایف آر سی یا گاڑی کے کارڈ بھی ہوتے ہیں۔",
        "اصل سرٹیفیکیٹ نادرا کی جانچ کے بعد باقاعدہ جاری ہوتا ہے۔",
      ],
    },
  },
];
