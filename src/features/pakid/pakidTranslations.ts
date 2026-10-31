export interface PakIDTranslation {
  en: string;
  ur: string;
}

export const pakidText: Record<string, PakIDTranslation> = {
  // Landing Page
  moduleTitle: {
    en: "Learn to Get Your Proof-of-Life Certificate",
    ur: "زندگی کا ثبوت (سرٹیفیکیٹ برائے حیات) حاصل کرنا سیکھیں",
  },
  moduleSubtitle: {
    en: "Learn how to use the PakID application for pension verification through pictures and safe practice.",
    ur: "تصاویر اور محفوظ مشق کے ذریعے پنشن کی تصدیق کے لیے پاک آئی ڈی ایپ استعمال کرنا سیکھیں۔",
  },
  disclaimerNotice: {
    en: "This is an educational simulation. No official verification takes place.",
    ur: "یہ ایک تعلیمی مشق ہے۔ یہاں کوئی سرکاری تصدیق نہیں ہوتی۔",
  },
  cardPictureTitle: {
    en: "Learn with Pictures",
    ur: "تصاویر سے سمجھیں",
  },
  cardPictureDesc: {
    en: "See the steps using pictures of the real application.",
    ur: "اصل پاک آئی ڈی ایپ کی تصاویر کے ساتھ مرحلہ وار رہنمائی دیکھیں۔",
  },
  cardPictureBtn: {
    en: "Start Picture Tutorial",
    ur: "تصویری ٹیوٹوریل شروع کریں",
  },
  cardPracticeTitle: {
    en: "Practise Yourself",
    ur: "خود مشق کریں",
  },
  cardPracticeDesc: {
    en: "Practise the steps on a safe virtual phone.",
    ur: "محفوظ ورچوئل فون پر تمام مراحل کی خود مشق کریں۔",
  },
  cardPracticeBtn: {
    en: "Start Practice",
    ur: "مشق شروع کریں",
  },
  guidedMode: {
    en: "Guided Practice (Step-by-Step Help)",
    ur: "رہنمائی والی مشق (ساتھ ساتھ مدد)",
  },
  independentMode: {
    en: "Practise Alone (Test Yourself)",
    ur: "بغیر مدد کے مشق (خود کو آزمائیں)",
  },

  // Steps Guidance
  step1Title: {
    en: "Open PakID and Sign In",
    ur: "پاک آئی ڈی کھولیں اور لاگ اِن کریں",
  },
  step1Instruction: {
    en: "Open PakID and tap the green Login button to access your practice account.",
    ur: "پاک آئی ڈی کھولیں اور اپنے مشق اکاؤنٹ تک رسائی کے لیے سبز 'لاگ اِن' بٹن دبائیں۔",
  },
  step1Hint: {
    en: "Look for the large green button labeled 'Login (لاگ اِن)' in the middle of the screen.",
    ur: "اسکرین کے درمیان میں 'Login (لاگ اِن)' لکھا ہوا بڑا سبز بٹن تلاش کریں۔",
  },

  step2Title: {
    en: "Find Proof of Life Service",
    ur: "سرٹیفیکیٹ برائے حیات تلاش کریں",
  },
  step2Instruction: {
    en: "Scroll down to 'Biometric Attestation' and tap 'Proof of Life'.",
    ur: "'بائیو میٹرک تصدیق' کے خانے میں جائیں اور 'Proof of Life (سرٹیفیکیٹ برائے حیات)' کو دبائیں۔",
  },
  step2Hint: {
    en: "Scroll down past ID Documents until you see Biometric Attestation, then tap Proof of Life with the document icon.",
    ur: "نیچے اسکرول کریں، بائیو میٹرک تصدیق میں کاغذ اور انگوٹھے والے نشان پر 'Proof of Life' دبائیں۔",
  },

  step3Title: {
    en: "Choose Applicant",
    ur: "درخواست گزار منتخب کریں",
  },
  step3Instruction: {
    en: "Choose whether this is for 'Myself' or a family member, then tap Next.",
    ur: "منتخب کریں کہ کیا یہ 'میں خود (Myself)' کے لیے ہے، پھر آگے بڑھیں کا بٹن دبائیں۔",
  },
  step3Hint: {
    en: "Select 'Myself (میں خود)' to practise getting your own pension certificate.",
    ur: "اپنی پنشن کی مشق کے لیے 'Myself (میں خود)' منتخب کریں۔",
  },

  step4Title: {
    en: "Review Application Fee & Priority",
    ur: "درخواست کی فیس اور ترجیح دیکھیں",
  },
  step4Instruction: {
    en: "Notice that the fee is PKR 0. Tap the green button to proceed to face verification.",
    ur: "دیکھیں کہ فیس 0 روپے ہے۔ چہرے کی تصدیق کی طرف بڑھنے کے لیے نیچے سبز بٹن دبائیں۔",
  },
  step4Hint: {
    en: "Proof-of-Life is completely free. Tap 'Please verify applicant's face liveliness' at the bottom.",
    ur: "یہ سروس بالکل مفت ہے۔ نیچے والا سبز بٹن دبائیں۔",
  },

  step5Title: {
    en: "Understand Biometric Verification",
    ur: "بائیو میٹرک تصدیق کو سمجھیں",
  },
  step5Instruction: {
    en: "Read the alert: Facial verification is followed by fingerprint verification. Tap Proceed.",
    ur: "ہدایت پڑھیں: پہلے چہرے کی تصدیق اور پھر انگلیوں کے نشانات کی تصدیق ہوگی۔ 'Proceed' دبائیں۔",
  },
  step5Hint: {
    en: "Tap the green 'Proceed (آگے بڑھیں)' button inside the alert box.",
    ur: "الرٹ باکس کے اندر سبز 'Proceed (آگے بڑھیں)' بٹن دبائیں۔",
  },

  step6Title: {
    en: "Prepare for Facial Verification",
    ur: "چہرے کی تصویر کے اصول سمجھیں",
  },
  step6Instruction: {
    en: "Tap the CORRECT sample photo that shows clear lighting and no face covering.",
    ur: "درست تصویر کے نمونے کو دبائیں جس میں چہرہ صاف، سامنے اور بغیر ٹوپی یا چشمے کے ہو۔",
  },
  step6Hint: {
    en: "Tap the first sample photo labeled CORRECT (صحیح) with the green checkmark.",
    ur: "سبز نشان والی پہلی تصویر دبائیں جس میں چہرہ سیدھا اور واضح ہے۔",
  },

  step7Title: {
    en: "Simulate Face Positioning",
    ur: "چہرہ فریم کے اندر رکھنے کی مشق",
  },
  step7Instruction: {
    en: "Hold the virtual phone steady and tap 'Start Face Positioning' to complete the exercise.",
    ur: "ورچوئل فون کو سیدھا رکھیں اور مشق مکمل کرنے کے لیے 'چہرے کی سیدھ شروع کریں' دبائیں۔",
  },
  step7Hint: {
    en: "Tap the blue button to run the positioning check, then tap Continue when verified.",
    ur: "پہلے مشق شروع کرنے کا بٹن دبائیں اور پھر 'Continue' دبائیں۔",
  },

  step8Title: {
    en: "Fingerprint Positioning Practice",
    ur: "انگلیوں کے نشانات کی پوزیشننگ",
  },
  step8Instruction: {
    en: "Select a hand or thumb, adjust into the guide frame, and complete the exercise.",
    ur: "ہاتھ یا انگوٹھا منتخب کریں، فریم میں رکھیں اور فنگر پرنٹ مشق مکمل کریں۔",
  },
  step8Hint: {
    en: "Tap 'Left Hand' or 'Right Hand', then tap 'Capture Fingerprint Exercise'.",
    ur: "'بایاں ہاتھ' یا 'دایاں ہاتھ' منتخب کریں اور پھر مشق مکمل کرنے کا بٹن دبائیں۔",
  },

  step9Title: {
    en: "Review and Submit Practice Application",
    ur: "تفصیلات دیکھیں اور مشق جمع کروائیں",
  },
  step9Instruction: {
    en: "Review your verified details and tap 'Submit Practice Application'.",
    ur: "درخواست کی تصدیق شدہ تفصیلات چیک کریں اور 'مشق درخواست جمع کریں' دبائیں۔",
  },
  step9Hint: {
    en: "This is an educational screen. Tap the green 'Submit Practice Application' button.",
    ur: "یہ ایک تعلیمی اسکرین ہے۔ نیچے سبز بٹن دبا کر آگے بڑھیں۔",
  },

  step10Title: {
    en: "Application Submitted Successfully",
    ur: "درخواست کامیابی سے جمع ہو گئی",
  },
  step10Instruction: {
    en: "Note your practice tracking ID and tap 'Go to ID Vault' to see where certificates live.",
    ur: "مشق کا ٹریکنگ نمبر دیکھیں اور 'آئی ڈی والٹ پر جائیں' کا بٹن دبائیں۔",
  },
  step10Hint: {
    en: "Tap the green 'Go to ID Vault (آئی ڈی والٹ پر جائیں)' button at the bottom.",
    ur: "نیچے سبز 'Go to ID Vault' بٹن دبائیں۔",
  },

  step11Title: {
    en: "Open ID Vault and My Documents",
    ur: "آئی ڈی والٹ میں 'میرے دستاویزات' کھولیں",
  },
  step11Instruction: {
    en: "In the ID Vault, tap 'My Documents' to view official certificates.",
    ur: "آئی ڈی والٹ میں 'My Documents (میرے دستاویزات)' کے خانے کو دبائیں۔",
  },
  step11Hint: {
    en: "Tap the card on the right that says 'My Documents (میرے دستاویزات)'.",
    ur: "دائیں طرف 'My Documents (میرے دستاویزات)' والا کارڈ دبائیں۔",
  },

  step12Title: {
    en: "Find Proof of Life Certificate (POLC)",
    ur: "سرٹیفیکیٹ برائے حیات (POLC) تلاش کریں",
  },
  step12Instruction: {
    en: "Tap the 'POLC' card to see where your processed certificate is stored.",
    ur: "دستاویزات کی فہرست میں 'POLC (سرٹیفیکیٹ برائے حیات)' کو دبائیں۔",
  },
  step12Hint: {
    en: "POLC stands for Proof of Life Certificate. Tap the highlighted POLC tile.",
    ur: "پی او ایل سی (POLC) کا مطلب سرٹیفیکیٹ برائے حیات ہے۔ اس کارڈ کو دبائیں۔",
  },

  step13Title: {
    en: "Practice Complete!",
    ur: "مشق کامیابی سے مکمل!",
  },
  step13Instruction: {
    en: "Congratulations! You have practised the entire Proof-of-Life process.",
    ur: "مبارک ہو! آپ نے زندگی کے ثبوت کا پورا طریقہ سیکھ لیا ہے۔",
  },

  // Generic Buttons & Badges
  next: { en: "Next Step", ur: "اگلا مرحلہ" },
  back: { en: "Back", ur: "پیچھے" },
  hintBtn: { en: "Need a Hint?", ur: "مدد چاہیے؟" },
  hideHint: { en: "Hide Hint", ur: "مدد چھپائیں" },
  restart: { en: "Restart", ur: "دوبارہ شروع کریں" },
  exit: { en: "Exit", ur: "باہر نکلیں" },
  enlarge: { en: "Enlarge Screenshot", ur: "تصویر بڑی کریں" },
  close: { en: "Close", ur: "بند کریں" },
  officialBadge: { en: "Official PakID Screenshot", ur: "پاک آئی ڈی کی اصل اسکرین" },
  reconstructedBadge: { en: "Educational Training Screen", ur: "تعلیمی مشق کی اسکرین" },
  simulationBanner: {
    en: "Simulation Only — No camera or biometrics are used",
    ur: "صرف تعلیمی مشق — کیمرہ یا بائیو میٹرک کا استعمال نہیں ہوتا",
  },
  wrongOption: {
    en: "That option is for a different service. Please follow the highlighted step.",
    ur: "یہ آپشن کسی اور خدمت کے لیے ہے۔ برائے کرم رہنمائی کے مطابق مطلوبہ آپشن دبائیں۔",
  },
};

