import type { PakIDStepDefinition, PhotoCaptureSample } from "./types";

export const practiceSteps: PakIDStepDefinition[] = [
  {
    id: "step-login",
    stepNumber: 1,
    screen: "login",
    title: {
      en: "Step 1: Open PakID and Sign In",
      ur: "مرحلہ ۱: پاک آئی ڈی کھولیں اور لاگ اِن کریں",
    },
    instruction: {
      en: "Tap the green 'Login (لاگ اِن)' button to access the practice app.",
      ur: "مشق ایپ میں داخل ہونے کے لیے سبز 'Login (لاگ اِن)' بٹن دبائیں۔",
    },
    hint: {
      en: "Tap the large green button labeled 'Login (لاگ اِن)'.",
      ur: "درمیان میں موجود سبز 'Login (لاگ اِن)' بٹن دبائیں۔",
    },
    tip: {
      en: "In TechSaathi practice mode, credentials are simulated. You do not need to enter your actual password.",
      ur: "ٹیک ساتھی پر پاس ورڈ فرضی ہے۔ آپ کو اپنا اصل پاس ورڈ لکھنے کی ضرورت نہیں ہے۔",
    },
    expectedAction: "login",
  },
  {
    id: "step-dashboard",
    stepNumber: 2,
    screen: "dashboard",
    title: {
      en: "Step 2: Find Proof of Life (سرٹیفیکیٹ برائے حیات)",
      ur: "مرحلہ ۲: 'Proof of Life' کا انتخاب کریں",
    },
    instruction: {
      en: "Scroll down to 'Biometric Attestation' and tap 'Proof of Life'.",
      ur: "'بائیو میٹرک تصدیق' کے خانے میں جائیں اور 'Proof of Life' کو دبائیں۔",
    },
    hint: {
      en: "Look under 'Biometric Attestation (بائیو میٹرک تصدیق)' for the icon labeled 'Proof of Life'.",
      ur: "بائیو میٹرک تصدیق میں کاغذ اور سبز بینر والا 'Proof of Life' بٹن تلاش کریں۔",
    },
    tip: {
      en: "Proof-of-Life is grouped under Biometric Attestation because it verifies the pensioner's live presence.",
      ur: "یہ سروس بائیو میٹرک تصدیق کے تحت ہے کیونکہ یہ پنشنر کے زندہ ہونے کی تصدیق کرتی ہے۔",
    },
    expectedAction: "choose-polc",
  },
  {
    id: "step-applicant",
    stepNumber: 3,
    screen: "applicant",
    title: {
      en: "Step 3: Choose Applicant",
      ur: "مرحلہ ۳: درخواست گزار منتخب کریں",
    },
    instruction: {
      en: "Select 'Myself (میں خود)' and tap 'Next (آگے بڑھیں)'.",
      ur: "'Myself (میں خود)' منتخب کریں اور پھر 'Next (آگے بڑھیں)' دبائیں۔",
    },
    hint: {
      en: "Tap the first box with 'Myself (میں خود)', then tap the green 'Next' button at the bottom.",
      ur: "پہلے 'Myself (میں خود)' پر کلک کریں اور پھر نیچے سبز 'Next' دبائیں۔",
    },
    tip: {
      en: "Eligible family members can assist through their own account, but the pensioner must participate in biometric checks.",
      ur: "اگر کوئی عزیز درخواست دے رہا ہو تو 'My Blood Relatives' چنا جاتا ہے مگر تصدیق بزرگ کی ہی ہوگی۔",
    },
    expectedAction: "applicant-continue",
  },
  {
    id: "step-fee",
    stepNumber: 4,
    screen: "fee",
    title: {
      en: "Step 4: Review Fee (PKR 0 — Free Service)",
      ur: "مرحلہ ۴: فیس دیکھیں (0 روپے — بالکل مفت)",
    },
    instruction: {
      en: "Confirm the fee is PKR 0. Tap the green button to continue to verification.",
      ur: "تصدیق کریں کہ فیس 0 روپے ہے۔ آگے بڑھنے کے لیے نیچے سبز بٹن دبائیں۔",
    },
    hint: {
      en: "Tap the button at the bottom: 'Please verify applicant's face liveliness'.",
      ur: "نیچے لکھا ہوا سبز بٹن دبائیں: 'Please verify applicant's face liveliness'۔",
    },
    tip: {
      en: "NADRA does not charge any fee for Proof-of-Life Certificates. Do not pay any agent.",
      ur: "نادرا زندگی کے ثبوت کے کوئی پیسے نہیں لیتا۔ کسی دکاندار کو فیس نہ دیں۔",
    },
    expectedAction: "fee-continue",
  },
  {
    id: "step-biometric-alert",
    stepNumber: 5,
    screen: "biometric-alert",
    title: {
      en: "Step 5: Understand Biometric Verification",
      ur: "مرحلہ ۵: بائیو میٹرک کی ترتیب سمجھیں",
    },
    instruction: {
      en: "Read the alert explaining facial verification comes first, then tap 'Proceed'.",
      ur: "الرٹ پڑھیں کہ پہلے چہرہ اور پھر انگلیوں کے نشانات چیک ہوں گے، پھر 'Proceed' دبائیں۔",
    },
    hint: {
      en: "Tap the green 'Proceed (آگے بڑھیں)' button inside the popup.",
      ur: "سامنے الرٹ باکس میں سبز 'Proceed' کا بٹن دبائیں۔",
    },
    expectedAction: "alert-proceed",
  },
  {
    id: "step-face-prepare",
    stepNumber: 6,
    screen: "face-prepare",
    title: {
      en: "Step 6: Select the Correct Photo Pose",
      ur: "مرحلہ ۶: تصویر کا درست انداز منتخب کریں",
    },
    instruction: {
      en: "Tap the CORRECT sample photo that shows clear lighting and no face covering.",
      ur: "درست نمونہ تصویر منتخب کریں جو سامنے سیدھی اور بغیر کسی رکاوٹ کے ہو۔",
    },
    hint: {
      en: "Tap the first photo marked CORRECT with the green checkmark.",
      ur: "سبز نشان اور 'CORRECT' والی پہلی تصویر منتخب کریں۔",
    },
    tip: {
      en: "Never wear sunglasses, caps or masks during biometric face capture.",
      ur: "چہرے کی تصدیق کے دوران چشمہ، ٹوپی یا ماسک ہرگز نہ پہنیں۔",
    },
    expectedAction: "face-photo-chosen",
  },
  {
    id: "step-face-capture",
    stepNumber: 7,
    screen: "face-capture",
    title: {
      en: "Step 7: Simulated Face Positioning",
      ur: "مرحلہ ۷: چہرے کی تصدیق کی مشق",
    },
    instruction: {
      en: "Tap 'Start Face Positioning Check', then tap 'Continue' when verified.",
      ur: "چہرے کی مشق کے لیے بٹن دبائیں اور کامیابی پر 'Continue' دبائیں۔",
    },
    hint: {
      en: "Tap the blue button to run the positioning check, then tap Continue in the success dialog.",
      ur: "پہلے نیلا بٹن دبائیں اور تصدیق کا ڈائیلاگ آنے پر 'Continue' دبائیں۔",
    },
    tip: {
      en: "This is a safe simulation. Your real smartphone camera is never accessed or turned on.",
      ur: "یہ ایک محفوظ مشق ہے۔ آپ کے فون کا کیمرہ آن نہیں ہوتا۔",
    },
    expectedAction: "face-success-continue",
  },
  {
    id: "step-fingerprints",
    stepNumber: 8,
    screen: "fingerprints",
    title: {
      en: "Step 8: Fingerprint Positioning Practice",
      ur: "مرحلہ ۸: انگلیوں کے نشانات کی مشق",
    },
    instruction: {
      en: "Select a hand, line up the fingers, and tap 'Complete Fingerprint Practice'.",
      ur: "کوئی ایک ہاتھ چنیں، انگلیاں فریم میں رکھیں اور مشق مکمل کرنے کا بٹن دبائیں۔",
    },
    hint: {
      en: "Choose 'Left Hand' or 'Right Hand' from the options, then tap the green capture button.",
      ur: "نیچے سے 'بایاں ہاتھ' یا 'دایاں ہاتھ' منتخب کریں، پھر سبز بٹن دبائیں۔",
    },
    tip: {
      en: "PakID captures fingerprints contactlessly using the camera. Keep fingers steady for 30–90 seconds.",
      ur: "پاک آئی ڈی کیمرے سے فنگر پرنٹ لیتی ہے۔ انگلیاں ملا کر ۳۰ سے ۹۰ سیکنڈ تک ساکت رکھیں۔",
    },
    expectedAction: "fingerprint-continue",
  },
  {
    id: "step-review-submission",
    stepNumber: 9,
    screen: "review-submission",
    title: {
      en: "Step 9: Review and Submit Practice Application",
      ur: "مرحلہ ۹: درخواست کا جائزہ اور جمع کروانا",
    },
    instruction: {
      en: "Review the application details and tap 'Submit Practice Application'.",
      ur: "درخواست کی تمام تفصیلات کا جائزہ لیں اور 'مشق درخواست جمع کریں' دبائیں۔",
    },
    hint: {
      en: "Tap the green 'Submit Practice Application (مشق درخواست جمع کریں)' button at the bottom.",
      ur: "نیچے سبز رنگ کا 'Submit Practice Application' بٹن دبائیں۔",
    },
    tip: {
      en: "Notice that both facial and fingerprint stages are marked completed, and the fee is PKR 0.",
      ur: "دیکھیں کہ چہرہ اور فنگر پرنٹ دونوں مکمل ہیں اور فیس 0 روپے ہے۔",
    },
    expectedAction: "submit-practice-app",
  },
  {
    id: "step-submitted",
    stepNumber: 10,
    screen: "submitted",
    title: {
      en: "Step 10: Application Submitted Successfully",
      ur: "مرحلہ ۱۰: درخواست جمع ہو گئی",
    },
    instruction: {
      en: "Note the tracking ID. Tap 'Go to ID Vault' to learn where your certificate is stored.",
      ur: "ٹریکنگ نمبر دیکھیں اور 'Go to ID Vault (آئی ڈی والٹ پر جائیں)' دبائیں۔",
    },
    hint: {
      en: "Tap the green button at the bottom: 'Go to ID Vault (آئی ڈی والٹ پر جائیں)'.",
      ur: "نیچے سبز بٹن 'Go to ID Vault (آئی ڈی والٹ پر جائیں)' دبائیں۔",
    },
    tip: {
      en: "In the real app, you can track the status using your Tracking ID anytime.",
      ur: "اصل ایپ میں آپ اس ٹریکنگ نمبر سے کسی بھی وقت اپنی درخواست دیکھ سکتے ہیں۔",
    },
    expectedAction: "goto-id-vault",
  },
  {
    id: "step-id-vault",
    stepNumber: 11,
    screen: "id-vault",
    title: {
      en: "Step 11: Open ID Vault and My Documents",
      ur: "مرحلہ ۱۱: آئی ڈی والٹ میں 'میرے دستاویزات' کھولیں",
    },
    instruction: {
      en: "In the ID Vault, tap the 'My Documents (میرے دستاویزات)' tile on the right.",
      ur: "آئی ڈی والٹ میں دائیں جانب 'My Documents (میرے دستاویزات)' کا خانہ دبائیں۔",
    },
    hint: {
      en: "Tap the card labeled 'My Documents' next to 'Digital Card'.",
      ur: "ڈیجیٹل کارڈ کے ساتھ موجود 'My Documents (میرے دستاویزات)' والا کارڈ دبائیں۔",
    },
    tip: {
      en: "The ID Vault holds all digital identity documents, family certificates, and pension verification.",
      ur: "آئی ڈی والٹ میں آپ کے تمام ڈیجیٹل کارڈز اور سرٹیفیکیٹس محفوظ ہوتے ہیں۔",
    },
    expectedAction: "open-my-documents",
  },
  {
    id: "step-my-documents",
    stepNumber: 12,
    screen: "my-documents",
    title: {
      en: "Step 12: Find POLC (Proof of Life Certificate)",
      ur: "مرحلہ ۱۲: پی او ایل سی (سرٹیفیکیٹ برائے حیات) تلاش کریں",
    },
    instruction: {
      en: "Find and tap the 'POLC (سرٹیفیکیٹ برائے حیات)' tile in the documents grid.",
      ur: "دستاویزات کی فہرست میں سے 'POLC (سرٹیفیکیٹ برائے حیات)' کو دبائیں۔",
    },
    hint: {
      en: "Tap the elevated card labeled 'POLC' with the certificate illustration.",
      ur: "کاغذ کی تصویر والے 'POLC' کارڈ کو دبائیں۔",
    },
    tip: {
      en: "POLC stands for Proof-of-Life Certificate. You can show it to your pension office or bank.",
      ur: "پی او ایل سی سرٹیفیکیٹ برائے حیات ہے جسے بینک یا پنشن ادارے کو دکھایا جا سکتا ہے۔",
    },
    expectedAction: "open-polc",
  },
  {
    id: "step-document-view",
    stepNumber: 13,
    screen: "document-view",
    title: {
      en: "Step 13: View Certificate & Finish Lesson",
      ur: "مرحلہ ۱۳: سرٹیفیکیٹ دیکھیں اور مشق مکمل کریں",
    },
    instruction: {
      en: "Read the certificate explanation and tap 'Complete Lesson & See Results'.",
      ur: "سرٹیفیکیٹ کی وضاحت دیکھیں اور 'مشق مکمل کریں' کا بٹن دبائیں۔",
    },
    hint: {
      en: "Tap the green button: 'Complete Lesson & See Results'.",
      ur: "نیچے سبز بٹن دبائیں: 'Complete Lesson & See Results'۔",
    },
    tip: {
      en: "Once processed by NADRA, the actual certificate appears here for viewing and verification.",
      ur: "نادرا کی منظوری کے بعد اصل سرٹیفیکیٹ یہاں دستیاب ہو جاتا ہے۔",
    },
    expectedAction: "finish-lesson",
  },
];

export const photoSamples: PhotoCaptureSample[] = [
  {
    id: "correct",
    isCorrect: true,
    label: {
      en: "CORRECT (صحیح)",
      ur: "صحیح (CORRECT)",
    },
    explanation: {
      en: "Well-lit room, looking directly forward, no hats, glasses, or masks.",
      ur: "اچھی روشنی، سیدھا کیمرے کی طرف دیکھنا، بغیر ٹوپی یا چشمے کے۔",
    },
    statusText: {
      en: "Excellent! This pose meets all official NADRA guidelines.",
      ur: "شاباش! یہ تصویر نادرا کے تمام تقاضوں پر پوری اترتی ہے۔",
    },
    iconType: "check",
  },
  {
    id: "hat-glasses",
    isCorrect: false,
    label: {
      en: "INCORRECT (ٹوپی، عینک غلط)",
      ur: "غلط: ٹوپی اور عینک",
    },
    explanation: {
      en: "Hats, caps, and sunglasses obstruct face detection and are rejected.",
      ur: "ٹوپی، کیپ یا کالا چشمہ چہرے کی شناخت میں رکاوٹ بنتے ہیں اور مسترد ہو جاتے ہیں۔",
    },
    statusText: {
      en: "Not suitable: Please remove any caps, hats, or dark glasses.",
      ur: "ناقابلِ قبول: برائے کرم ٹوپی اور چشمہ اتار دیں۔",
    },
    iconType: "hat",
  },
  {
    id: "mask",
    isCorrect: false,
    label: {
      en: "INCORRECT (ماسک غلط)",
      ur: "غلط: چہرے پر ماسک",
    },
    explanation: {
      en: "Face masks conceal nose and mouth contours essential for verification.",
      ur: "ماسک منہ اور ناک کو چھپاتا ہے جس سے شناخت ممکن نہیں رہتی۔",
    },
    statusText: {
      en: "Not suitable: Please pull down or remove your face mask.",
      ur: "ناقابلِ قبول: برائے کرم چہرے سے ماسک ہٹا دیں۔",
    },
    iconType: "mask",
  },
  {
    id: "side",
    isCorrect: false,
    label: {
      en: "INCORRECT (سائیڈ پوز غلط)",
      ur: "غلط: چہرہ مڑا ہوا",
    },
    explanation: {
      en: "Turning your head sideways prevents symmetrical feature detection.",
      ur: "چہرہ ایک طرف موڑنے سے کیمرہ دونوں آنکھیں اور خدوخال نہیں دیکھ سکتا۔",
    },
    statusText: {
      en: "Not suitable: Please look straight into the camera lens.",
      ur: "ناقابلِ قبول: کیمرے کے عین سامنے سیدھا دیکھیں۔",
    },
    iconType: "side",
  },
];

