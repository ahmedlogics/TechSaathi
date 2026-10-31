import type { LearningModule, LessonStep, ModuleId } from "@/types/learning";
import { pakIdQuestions } from "./scenarios";

export const sendMoneyWalletSteps: LessonStep[] = [
  {
    id: "home",
    screen: "home",
    expected: "send-money",
    title: { en: "Tap Send Money", ur: "\"رقم بھیجیں\" دبائیں" },
    body: { en: "This is your practice wallet. To send money, start with the Send Money button.", ur: "یہ آپ کا مشق والیٹ ہے۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" کا بٹن دبائیں۔" },
    hint: { en: "Look for the large button with an arrow, near the top of the phone screen.", ur: "فون اسکرین کے اوپر تیر والا بڑا بٹن دیکھیں۔" },
    whyItMatters: { en: "Digital wallets let you transfer money quickly without visiting a bank branch or shop.", ur: "ڈیجیٹل والیٹ بینک یا دکان جائے بغیر فوری رقم منتقل کرنے میں مدد دیتا ہے۔" },
    checklist: [
      { en: "Check your available practice balance", ur: "اپنا موجودہ مشق بیلنس چیک کریں" },
      { en: "Find the primary Send Money action", ur: "\"رقم بھیجیں\" کا بٹن دیکھیں" },
    ],
    wrong: {
      history: {
        en: "That opens your past transactions. To send money, tap Send Money instead.",
        ur: "اس سے پرانی ٹرانزیکشنز کھلتی ہیں۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" دبائیں۔",
      },
    },
  },
  {
    id: "type",
    screen: "type",
    expected: "wallet-to-wallet",
    title: { en: "Choose Transfer Method", ur: "رقم بھیجنے کا طریقہ چنیں" },
    body: { en: "Choose Wallet to Wallet to send money to Ahmed Ali, or Bank Transfer to send to a bank.", ur: "احمد علی کو بھیجنے کے لیے \"والیٹ سے والیٹ\" منتخب کریں، یا بینک ٹرانسفر منتخب کریں۔" },
    hint: { en: "Tap Wallet to Wallet for mobile wallets, or Bank Transfer for bank accounts.", ur: "\"والیٹ سے والیٹ\" یا \"بینک ٹرانسفر\" پر ٹیپ کریں۔" },
    whyItMatters: { en: "Wallets transfer instantly between mobile numbers, while banks require account numbers.", ur: "والیٹ ٹرانسفر فون نمبر پر ہوتا ہے، جبکہ بینک کے لیے اکاؤنٹ نمبر درکار ہوتا ہے۔" },
    checklist: [
      { en: "Identify how the recipient receives funds", ur: "دیکھیں کہ وصول کنندہ والیٹ استعمال کر رہا ہے یا بینک" },
      { en: "Select Wallet to Wallet for this task", ur: "اس کام کے لیے \"والیٹ سے والیٹ\" منتخب کریں" },
    ],
  },
  {
    id: "recipient",
    screen: "recipient",
    expected: "recipient-continue",
    title: { en: "Enter Ahmed's mobile number", ur: "احمد کا موبائل نمبر درج کریں" },
    body: { en: "Type the number, or tap a name in Practice Contacts to fill it in. Then tap Continue.", ur: "نمبر لکھیں، یا مشق کانٹیکٹس میں نام دبائیں۔ پھر \"آگے بڑھیں\" دبائیں۔" },
    tip: { en: "Always double-check the number. Money sent to a wrong number is hard to get back.", ur: "نمبر ہمیشہ دوبارہ چیک کریں۔ غلط نمبر پر بھیجی گئی رقم واپس لینا مشکل ہوتا ہے۔" },
    hint: { en: "Ahmed Ali's number is 0300 1234567.", ur: "احمد علی کا نمبر 0300 1234567 ہے۔" },
    whyItMatters: { en: "Money sent to an incorrect number cannot be automatically reversed. Double-check every digit.", ur: "غلط نمبر پر بھیجی گئی رقم خود بخود واپس نہیں آتی۔ ہر ہندسہ تسلی سے چیک کریں۔" },
    checklist: [
      { en: "Format is an 11-digit mobile number (03XX-XXXXXXX)", ur: "نمبر 11 ہندسوں پر مشتمل ہو" },
      { en: "Recipient name matches Ahmed Ali", ur: "وصول کنندہ کا نام احمد علی ہو" },
    ],
    commonMistake: { en: "Transposing two digits (e.g. 0300-1234576 instead of 1234567) sends money to a stranger.", ur: "ہندسوں کی ترتیب بدلنے سے رقم کسی اور کے والیٹ میں چلی جاتی ہے۔" },
  },
  {
    id: "amount",
    screen: "amount",
    expected: "amount-continue",
    title: { en: "Enter the amount: 1,000", ur: "رقم درج کریں: 1,000" },
    body: { en: "Type how much to send. Your task is Rs. 1,000.", ur: "کتنی رقم بھیجنی ہے لکھیں۔ آپ کا کام 1,000 روپے ہے۔" },
    hint: { en: "Type 1000 using the number keys, then tap Continue.", ur: "نمبر سے 1000 لکھیں، پھر \"آگے بڑھیں\" دبائیں۔" },
    whyItMatters: { en: "Entering an accidental extra zero means sending 10x more money (Rs. 10,000 instead of Rs. 1,000).", ur: "ایک فالتو صفر لگانے سے رقم 1,000 کی جگہ 10,000 چلی جائے گی۔" },
    checklist: [
      { en: "Amount is exactly Rs. 1,000", ur: "رقم 1,000 روپے ہو" },
      { en: "Amount does not exceed your Rs. 25,000 balance", ur: "رقم آپ کے 25,000 روپے کے بیلنس سے کم ہو" },
    ],
    commonMistake: { en: "Typing an extra zero or accidentally tapping zero twice.", ur: "غلطی سے دو بار صفر دبانا یا فالتو صفر لگانا۔" },
  },
  {
    id: "review",
    screen: "review",
    expected: "confirm",
    title: { en: "Check details, then confirm", ur: "تفصیل چیک کریں، پھر تصدیق کریں" },
    body: { en: "Read the name, number and amount carefully. If anything is wrong, tap Edit.", ur: "نام، نمبر اور رقم غور سے پڑھیں۔ اگر کچھ غلط ہو تو \"ترمیم\" دبائیں۔" },
    tip: { en: "This review screen is your last chance to catch a mistake.", ur: "یہ جائزہ اسکرین غلطی پکڑنے کا آخری موقع ہے۔" },
    hint: { en: "If it says Ahmed Ali and Rs. 1,000, tap Confirm Practice Transfer.", ur: "اگر احمد علی اور 1,000 روپے لکھا ہو تو \"تصدیق کریں\" دبائیں۔" },
    whyItMatters: { en: "Review is your final safety barrier before funds leave your account. Once sent, transfers are final.", ur: "یہ اسکرین پیسے اکاؤنٹ سے نکلنے سے پہلے آخری رکاوٹ ہے۔ ایک بار کنفرم ہو جائے تو واپسی مشکل ہے۔" },
    checklist: [
      { en: "Recipient is Ahmed Ali (not Bilal Khan)", ur: "وصول کنندہ احمد علی ہو (بلال خان نہیں)" },
      { en: "Mobile number matches 0300 1234567", ur: "موبائل نمبر 0300 1234567 ہو" },
      { en: "Transfer amount is Rs. 1,000", ur: "رقم 1,000 روپے ہو" },
    ],
    commonMistake: { en: "Rushing to press Confirm without reading the recipient name on the summary.", ur: "خلاصے میں نام پڑھے بغیر جلدی میں کنفرم دبا دینا۔" },
  },
  {
    id: "receipt",
    screen: "receipt",
    expected: null,
    title: { en: "You sent the practice money!", ur: "آپ نے مشق کی رقم بھیج دی!" },
    body: { en: "This receipt shows what a confirmation looks like. Remember: no real money was sent.", ur: "یہ رسید دکھاتی ہے کہ تصدیق کیسی ہوتی ہے۔ یاد رکھیں: کوئی اصل رقم نہیں بھیجی گئی۔" },
    hint: { en: "", ur: "" },
    whyItMatters: { en: "Keep transaction IDs for your financial records and customer support inquiries.", ur: "حوالہ نمبر ہمیشہ اپنے پاس ریکارڈ اور ضرورت کے لیے محفوظ رکھیں۔" },
  },
];

export const sendMoneyBankSteps: LessonStep[] = [
  {
    id: "home",
    screen: "home",
    expected: "send-money",
    title: { en: "Tap Send Money", ur: "\"رقم بھیجیں\" دبائیں" },
    body: { en: "This is your practice wallet. To send money, start with the Send Money button.", ur: "یہ آپ کا مشق والیٹ ہے۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" کا بٹن دبائیں۔" },
    hint: { en: "Look for the large button with an arrow, near the top of the phone screen.", ur: "فون اسکرین کے اوپر تیر والا بڑا بٹن دیکھیں۔" },
    whyItMatters: { en: "Mobile wallets allow transferring funds directly into any commercial or Islamic bank in Pakistan.", ur: "موبائل والیٹ پاکستان کے کسی بھی بینک اکاؤنٹ میں رقم بھیجنے کی سہولت دیتے ہیں۔" },
    checklist: [
      { en: "Check your available practice balance", ur: "اپنا موجودہ مشق بیلنس چیک کریں" },
      { en: "Tap Send Money to begin", ur: "شروع کرنے کے لیے \"رقم بھیجیں\" دبائیں" },
    ],
    wrong: {
      history: {
        en: "That opens your past transactions. To send money, tap Send Money instead.",
        ur: "اس سے پرانی ٹرانزیکشنز کھلتی ہیں۔ رقم بھیجنے کے لیے \"رقم بھیجیں\" دبائیں۔",
      },
    },
  },
  {
    id: "type",
    screen: "type",
    expected: "bank",
    title: { en: "Choose Bank Transfer", ur: "\"بینک ٹرانسفر\" منتخب کریں" },
    body: { en: "Choose Bank Transfer to send money to a Pakistani bank account.", ur: "پاکستانی بینک اکاؤنٹ میں رقم بھیجنے کے لیے \"بینک ٹرانسفر\" منتخب کریں۔" },
    hint: { en: "Tap the second option: Bank Transfer.", ur: "دوسرا آپشن دبائیں: بینک ٹرانسفر۔" },
    whyItMatters: { en: "Selecting Bank Transfer routes the payment through the 1Link interbank switch.", ur: "بینک ٹرانسفر منتخب کرنے سے رقم بین البینک نیٹ ورک سے گزرتی ہے۔" },
    checklist: [
      { en: "Select Bank Transfer for bank accounts", ur: "بینک اکاؤنٹ کے لیے \"بینک ٹرانسفر\" منتخب کریں" },
    ],
  },
  {
    id: "bank-select",
    screen: "bank-select",
    expected: "bank-select-continue",
    title: { en: "Choose the Bank", ur: "بینک منتخب کریں" },
    body: { en: "Select the recipient's bank from the list. For this practice, choose Meezan Bank.", ur: "فہرست سے وصول کنندہ کا بینک منتخب کریں۔ اس مشق کے لیے میزان بینک منتخب کریں۔" },
    hint: { en: "Tap on Meezan Bank in the list, then tap Continue.", ur: "میزان بینک پر ٹیپ کریں، پھر آگے بڑھیں۔" },
    whyItMatters: { en: "Selecting the wrong bank will cause the transfer to bounce or route to an unintended account.", ur: "غلط بینک منتخب کرنے سے رقم غلط جگہ چلی جائے گی یا واپس آ جائے گی۔" },
    checklist: [
      { en: "Search or tap Meezan Bank in the list", ur: "فہرست میں میزان بینک تلاش کریں یا ٹیپ کریں" },
      { en: "Verify the selected bank badge", ur: "منتخب شدہ بینک کی تصدیق کریں" },
    ],
    commonMistake: { en: "Selecting a similarly named bank (e.g., Bank Alfalah instead of Meezan Bank).", ur: "ایک جیسے نام والے کسی دوسرے بینک کا انتخاب کر لینا۔" },
  },
  {
    id: "bank-account",
    screen: "bank-account",
    expected: "account-continue",
    title: { en: "Enter Account / IBAN", ur: "اکاؤنٹ نمبر یا IBAN درج کریں" },
    body: { en: "Enter the account number or tap Fatima Bibi under Practice Accounts to auto-fill.", ur: "اکاؤنٹ نمبر درج کریں یا پریکٹس اکاؤنٹس سے فاطمہ بی بی کا نام منتخب کریں۔" },
    tip: { en: "Pakistani banks verify the account title before money is transferred. Always confirm the recipient's name matches.", ur: "پاکستانی بینک رقم بھیجنے سے پہلے نام کی تصدیق کرتے ہیں۔ ہمیشہ تسلی کریں کہ نام درست ہے۔" },
    hint: { en: "Tap Fatima Bibi under Practice Accounts to fill her Meezan Bank account.", ur: "پریکٹس اکاؤنٹس میں فاطمہ بی بی کے نام پر ٹیپ کریں۔" },
    whyItMatters: { en: "The 1Link system fetches the real account title registered with the bank. Always verify it.", ur: "1Link سسٹم بینک میں درج اصل نام دکھاتا ہے۔ ہمیشہ اس نام کی تسلی کریں۔" },
    checklist: [
      { en: "Account number belongs to selected bank", ur: "اکاؤنٹ منتخب شدہ بینک کا ہو" },
      { en: "Verified title shows Fatima Bibi", ur: "تصدیق شدہ نام فاطمہ بی بی ظاہر ہو" },
    ],
    commonMistake: { en: "Entering a CNIC or phone number instead of an account number or IBAN.", ur: "اکاؤنٹ نمبر کی جگہ شناختی کارڈ یا فون نمبر لکھ دینا۔" },
  },
  {
    id: "amount",
    screen: "amount",
    expected: "amount-continue",
    title: { en: "Enter the amount: 1,000", ur: "رقم درج کریں: 1,000" },
    body: { en: "Type how much to send to Fatima Bibi. Your task is Rs. 1,000.", ur: "فاطمہ بی بی کو بھیجنے کی رقم درج کریں۔ آپ کا کام 1,000 روپے ہے۔" },
    hint: { en: "Type 1000 using number keys, then tap Continue.", ur: "1000 لکھیں اور آگے بڑھیں۔" },
    whyItMatters: { en: "Banks enforce daily transfer limits and overdraft protection. Review your entered amount.", ur: "بینکوں میں رقم بھیجنے کی حد ہوتی ہے۔ رقم ہمیشہ احتیاط سے لکھیں۔" },
    checklist: [
      { en: "Amount is Rs. 1,000", ur: "رقم 1,000 روپے ہو" },
      { en: "Amount is within your Rs. 25,000 balance", ur: "رقم 25,000 روپے کے اندر ہو" },
    ],
    commonMistake: { en: "Entering an extra zero (Rs. 10,000 instead of Rs. 1,000).", ur: "غلطی سے فالتو صفر لگا دینا (1,000 کی جگہ 10,000)۔" },
  },
  {
    id: "review",
    screen: "review",
    expected: "confirm",
    title: { en: "Check bank details & title", ur: "بینک تفصیل اور نام چیک کریں" },
    body: { en: "Verify the bank name, account number, title (Fatima Bibi) and amount carefully.", ur: "بینک، اکاؤنٹ نمبر، نام (فاطمہ بی بی) اور رقم کی تسلی کریں، پھر تصدیق کریں۔" },
    tip: { en: "Money sent to a wrong bank account cannot be automatically reversed. Check carefully!", ur: "غلط بینک اکاؤنٹ میں بھیجی گئی رقم خود بخود واپس نہیں آتی۔ دھیان سے چیک کریں!" },
    hint: { en: "Tap Confirm Practice Transfer if all details are correct.", ur: "اگر تمام تفصیلات درست ہیں تو تصدیق کریں۔" },
    whyItMatters: { en: "Interbank transfers are irreversible once processed. This screen is your final checkpoint.", ur: "بینک ٹرانسفر مکمل ہونے کے بعد منسوخ نہیں ہو سکتا۔ یہ آخری موقع ہے۔" },
    checklist: [
      { en: "Bank is Meezan Bank", ur: "بینک میزان بینک ہو" },
      { en: "Account Title is Fatima Bibi", ur: "اکاؤنٹ ٹائٹل فاطمہ بی بی ہو" },
      { en: "Amount is Rs. 1,000", ur: "رقم 1,000 روپے ہو" },
      { en: "Check the deliberate review box before confirming", ur: "تصدیق کا خانہ چیک کریں" },
    ],
    commonMistake: { en: "Ignoring a mismatched title and tapping Confirm anyway.", ur: "غلط نام کو نظر انداز کر کے کنفرم کر دینا۔" },
  },
  {
    id: "receipt",
    screen: "receipt",
    expected: null,
    title: { en: "Practice bank transfer sent!", ur: "مشق بینک ٹرانسفر مکمل!" },
    body: { en: "Your simulated bank transfer was successful. Practice balance has been updated.", ur: "آپ کا مشق بینک ٹرانسفر کامیاب رہا۔ مشق بیلنس اپڈیٹ کر دیا گیا ہے۔" },
    hint: { en: "", ur: "" },
    whyItMatters: { en: "Keep the bank reference number for future reconciliation and proof of transfer.", ur: "حوالہ نمبر ہمیشہ ٹرانسفر کے ثبوت کے طور پر محفوظ رکھیں۔" },
  },
];

const sendMoney: LearningModule = {
  id: "send-money",
  title: { en: "Send Money", ur: "رقم بھیجیں" },
  description: { en: "Learn how to send money safely using mobile wallet or bank transfer.", ur: "موبائل والیٹ یا بینک ٹرانسفر سے محفوظ طریقے سے رقم بھیجنا سیکھیں۔" },
  cardAction: { en: "Start Learning", ur: "سیکھنا شروع کریں" },
  introTitle: { en: "Learn to Send Money", ur: "رقم بھیجنا سیکھیں" },
  intro: {
    en: "Practise sending money via Mobile Wallet or Bank Transfer. No real money will be transferred.",
    ur: "موبائل والیٹ یا بینک ٹرانسفر سے رقم بھیجنے کی مشق کریں۔ کوئی اصل رقم منتقل نہیں ہوگی۔",
  },
  learnPoints: [
    { en: "Find the Send Money option in a wallet app", ur: "والیٹ ایپ میں رقم بھیجنے کا آپشن تلاش کرنا" },
    { en: "Choose between Wallet to Wallet and Bank Transfer", ur: "والیٹ سے والیٹ اور بینک ٹرانسفر میں سے انتخاب" },
    { en: "Enter account or mobile number and verify recipient name", ur: "اکاؤنٹ یا موبائل نمبر درج کرنا اور نام کی تصدیق" },
    { en: "Review and confirm before sending", ur: "بھیجنے سے پہلے جائزہ اور تصدیق کرنا" },
  ],
  objective: { en: "Send Rs. 1,000 to Ahmed Ali (Wallet) or Fatima Bibi (Bank).", ur: "احمد علی (والیٹ) یا فاطمہ بی بی (بینک) کو 1,000 روپے بھیجیں۔" },
  safetyNote: { en: "No real money will be sent.", ur: "کوئی اصل رقم نہیں بھیجی جائے گی۔" },
  steps: sendMoneyWalletSteps,
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
      id: "contacts",
      screen: "contacts",
      expected: "call-sara",
      title: { en: "Tap the call icon next to Sara", ur: "سارہ کے ساتھ کال کا بٹن دبائیں" },
      body: { en: "Each contact has video and voice call buttons on the right. Tap the video camera icon next to Sara.", ur: "ہر رابطے کے دائیں طرف ویڈیو اور وائس کال کے بٹن ہیں۔ سارہ کے ساتھ ویڈیو کیمرے والا بٹن دبائیں۔" },
      hint: { en: "Sara (Daughter) is first in the list. Tap the video camera button with the arrow.", ur: "سارہ (بیٹی) فہرست میں پہلی ہیں۔ تیر والے ویڈیو بٹن کو دبائیں۔" },
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
      body: { en: "Muting stops the other person hearing you. Tap the microphone button with the arrow.", ur: "مائیک بند کرنے سے دوسرا شخص آپ کو نہیں سن سکتا۔ تیر والے مائیکروفون کے بٹن کو دبائیں۔" },
      hint: { en: "The microphone button is highlighted with the bouncing arrow.", ur: "تیر والے مائیکروفون کے بٹن کو دبائیں۔" },
      wrong: { end: { en: "Not yet! First mute the microphone.", ur: "ابھی نہیں! پہلے مائیک بند کریں۔" } },
    },
    {
      id: "camera",
      screen: "incall",
      expected: "camera-off",
      title: { en: "Turn your camera off", ur: "اپنا کیمرہ بند کریں" },
      body: { en: "Turning the camera off means they can't see you, but can still talk. Tap the camera button with the arrow.", ur: "کیمرہ بند کرنے سے وہ آپ کو نہیں دیکھ سکیں گے، لیکن بات ہو سکتی ہے۔ تیر والے کیمرے کے بٹن کو دبائیں۔" },
      hint: { en: "The camera button is highlighted with the bouncing arrow.", ur: "تیر والے کیمرے کے بٹن کو دبائیں۔" },
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
      body: { en: "When you are done talking, tap the red button with the arrow to hang up.", ur: "بات ختم ہونے پر تیر والے لال بٹن کو دبا کر کال بند کریں۔" },
      hint: { en: "The red phone button is highlighted with the bouncing arrow.", ur: "تیر والے لال فون کے بٹن کو دبائیں۔" },
    },
    {
      id: "done",
      screen: "done",
      expected: null,
      title: { en: "Call practice complete", ur: "کال کی مشق مکمل" },
      body: { en: "You started a call, muted, managed your camera and ended the call safely.", ur: "آپ نے کال شروع کی، مائیک اور کیمرہ سنبھالا اور کال بحفاظت ختم کی۔" },
      hint: { en: "" },
    },
  ],
};

export const modules: LearningModule[] = [sendMoney, bookRide, proofOfLife, videoCall];
export const moduleIds = modules.map((m) => m.id);
export const getModule = (id: string) => modules.find((m) => m.id === id) as LearningModule | undefined;
export const isModuleId = (id: string): id is ModuleId => moduleIds.includes(id as ModuleId);
