import { useState } from "react";
import {
  ArrowUpRight,
  History,
  Wallet,
  Landmark,
  Smartphone,
  UserRound,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Check,
  Search,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompletionActions, SimButton, SimInputWrapper, useLesson } from "@/components/learning/LessonContext";
import { PhoneFrame } from "@/components/learning/PhoneFrame";
import {
  TARGET_AMOUNT,
  TARGET_RECIPIENT,
  TARGET_BANK_BENEFICIARY,
  WALLET_BALANCE,
  digitsOnly,
  formatRs,
  paymentContacts,
  practiceBanks,
  bankBeneficiaries,
  type PracticeBank,
  type BankBeneficiary,
} from "@/data/scenarios";
import { sendMoneyWalletSteps, sendMoneyBankSteps } from "@/data/modules";
import { cn } from "@/lib/utils";

const tile =
  "flex w-full items-center gap-3 rounded-xl border-2 border-border bg-card p-3.5 text-start text-base sm:text-lg font-semibold text-heading transition-all hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function PaymentSimulator() {
  const { engine } = useLesson();
  const { t, tr, lang } = useLanguage();
  const ur = lang === "ur";

  // Transfer mode and draft state
  const [method, setMethod] = useState<"wallet" | "bank">("wallet");
  const [phone, setPhone] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string>("meezan");
  const [bankSearch, setBankSearch] = useState("");
  const [accountInput, setAccountInput] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isDeducted, setIsDeducted] = useState(false);
  const [reviewedCheckbox, setReviewedCheckbox] = useState(false);

  const isExcessBalance = Boolean(amount && Number(amount) > WALLET_BALANCE);

  // Beneficiary resolution
  const walletRecipient = paymentContacts.find((c) => digitsOnly(c.phone) === digitsOnly(phone));
  const selectedBank: PracticeBank | undefined = practiceBanks.find((b) => b.id === selectedBankId);

  // Account match strictly within selected bank
  const bankBeneficiary: BankBeneficiary | undefined = bankBeneficiaries.find(
    (b) =>
      b.bankId === selectedBankId &&
      (digitsOnly(b.accountNumber) === digitsOnly(accountInput) ||
        b.iban.replace(/\s+/g, "").toUpperCase() === accountInput.replace(/\s+/g, "").toUpperCase()),
  );

  // Cross-bank beneficiary match (to detect bank/account mismatch rather than silently corrupting state)
  const crossBankBeneficiary: BankBeneficiary | undefined = bankBeneficiaries.find(
    (b) =>
      digitsOnly(b.accountNumber) === digitsOnly(accountInput) ||
      b.iban.replace(/\s+/g, "").toUpperCase() === accountInput.replace(/\s+/g, "").toUpperCase(),
  );
  const isBankMismatch =
    Boolean(crossBankBeneficiary && selectedBankId && crossBankBeneficiary.bankId !== selectedBankId);
  const crossBank = isBankMismatch
    ? practiceBanks.find((b) => b.id === crossBankBeneficiary?.bankId)
    : undefined;

  // Filtered banks for bank search
  const filteredBanks = practiceBanks.filter((b) => {
    if (!bankSearch.trim()) return true;
    const query = bankSearch.toLowerCase().trim();
    return (
      tr(b.name).toLowerCase().includes(query) ||
      b.code.toLowerCase().includes(query) ||
      tr(b.tagline).toLowerCase().includes(query)
    );
  });

  // Simulated live balance (deducts practice amount upon valid confirmation)
  const currentBalance = isDeducted
    ? Math.max(0, WALLET_BALANCE - (Number(amount) || TARGET_AMOUNT))
    : WALLET_BALANCE;

  // Validation handlers
  const continueRecipient = () => {
    if (!digitsOnly(phone)) {
      return engine.mistake({
        en: "The number box is empty. Type a mobile number or tap a practice contact.",
        ur: "نمبر کا خانہ خالی ہے۔ نمبر لکھیں یا مشق کانٹیکٹس میں سے منتخب کریں۔",
      });
    }
    if (!walletRecipient) {
      return engine.mistake({
        en: "This number is not in the practice contacts. Tap Ahmed Ali from the list.",
        ur: "یہ نمبر مشق کانٹیکٹس میں نہیں ہے۔ فہرست سے احمد علی کو منتخب کریں۔",
      });
    }
    engine.act("recipient-continue");
  };

  const continueBankSelect = () => {
    if (!selectedBankId) {
      return engine.mistake({
        en: "Please select a bank from the list. Choose Meezan Bank for this practice.",
        ur: "براہ کرم فہرست سے بینک منتخب کریں۔ اس مشق کے لیے میزان بینک منتخب کریں۔",
      });
    }
    engine.act("bank-select-continue");
  };

  const continueBankAccount = () => {
    const cleanAccount = accountInput.trim();
    if (!cleanAccount) {
      return engine.mistake({
        en: "The account box is empty. Type an account number or tap Fatima Bibi from Practice Accounts.",
        ur: "اکاؤنٹ کا خانہ خالی ہے۔ اکاؤنٹ نمبر لکھیں یا پریکٹس اکاؤنٹس سے فاطمہ بی بی منتخب کریں۔",
      });
    }

    // Explicit check for cross-bank mismatch
    if (isBankMismatch && crossBank) {
      return engine.mistake({
        en: `Bank Mismatch! This account belongs to ${tr(crossBank.name)}, but you selected ${selectedBank ? tr(selectedBank.name) : "another bank"}. Please tap "Switch Bank" or select an account for ${selectedBank ? tr(selectedBank.name) : "this bank"}.`,
        ur: `بینک اور اکاؤنٹ کا فرق! یہ اکاؤنٹ ${tr(crossBank.name)} کا ہے، لیکن آپ نے ${selectedBank ? tr(selectedBank.name) : ""} منتخب کیا ہوا ہے۔ بینک تبدیل کریں یا درست اکاؤنٹ درج کریں۔`,
      });
    }

    if (!bankBeneficiary) {
      return engine.mistake({
        en: "Account not recognized for this bank. Tap Fatima Bibi under Practice Accounts to auto-fill.",
        ur: "اس بینک کے لیے یہ اکاؤنٹ تسلیم نہیں ہوا۔ پریکٹس اکاؤنٹس سے فاطمہ بی بی منتخب کریں۔",
      });
    }
    engine.act("account-continue");
  };

  const continueAmount = () => {
    const n = Number(amount);
    if (!amount || !Number.isFinite(n) || n <= 0) {
      const msg = {
        en: "Please enter a valid amount greater than zero, for example 1000.",
        ur: "براہ کرم صفر سے زیادہ رقم لکھیں، مثلاً 1000۔",
      };
      setAmountError(tr(msg));
      return engine.mistake(msg);
    }
    if (n > WALLET_BALANCE) {
      const msg = {
        en: `Insufficient balance! You entered ${formatRs(n)}, which exceeds your practice balance of ${formatRs(WALLET_BALANCE)}.`,
        ur: `ناکافی بیلنس! آپ نے ${formatRs(n)} درج کیا جو کہ آپ کے مشق بیلنس (${formatRs(WALLET_BALANCE)}) سے زیادہ ہے۔`,
      };
      setAmountError(tr(msg));
      return engine.mistake({
        en: `You entered ${formatRs(n)}. Your task is to send ${formatRs(TARGET_AMOUNT)}, and your practice balance is ${formatRs(WALLET_BALANCE)}. Check the amount and try again.`,
        ur: `آپ نے ${formatRs(n)} درج کیا۔ آپ کا کام ${formatRs(TARGET_AMOUNT)} بھیجنا ہے، اور آپ کا مشق بیلنس ${formatRs(WALLET_BALANCE)} ہے۔ رقم چیک کر کے دوبارہ کوشش کریں۔`,
      });
    }
    if (n !== TARGET_AMOUNT) {
      const msg = {
        en: `Your task is to send ${formatRs(TARGET_AMOUNT)}. You typed ${formatRs(n)}. Please change the amount to ${formatRs(TARGET_AMOUNT)}.`,
        ur: `آپ کا کام ${formatRs(TARGET_AMOUNT)} بھیجنا ہے۔ آپ نے ${formatRs(n)} لکھا۔ رقم تبدیل کر کے ${formatRs(TARGET_AMOUNT)} کریں۔`,
      };
      setAmountError(tr(msg));
      return engine.mistake(msg);
    }
    setAmountError("");
    engine.act("amount-continue");
  };

  const confirm = () => {
    // Deliberate Review Checkbox verification
    if (!reviewedCheckbox) {
      return engine.mistake({
        en: "Please verify the transfer details by ticking the confirmation box above before sending.",
        ur: "براہ کرم رقم بھیجنے سے پہلے اوپر دیے گئے تصدیقی خانے پر نشان لگا کر تفصیلات کی تصدیق کریں۔",
      });
    }

    // Safety check for wrong recipient
    if (method === "wallet" && walletRecipient?.id !== TARGET_RECIPIENT) {
      return engine.mistake({
        en: `Safety Warning! This transfer is addressed to ${walletRecipient?.name ?? "another contact"}, but your lesson task is to send money to Ahmed Ali. Tap Edit / Back to fix the recipient.`,
        ur: `حفاظتی انتباہ! یہ رقم ${walletRecipient?.name ?? "کسی اور"} کو جا رہی ہے، جبکہ مقصد احمد علی کو بھیجنا ہے۔ وصول کنندہ بدلنے کے لیے "ترمیم / واپس" دبائیں۔`,
      });
    }

    if (method === "bank" && bankBeneficiary?.id !== TARGET_BANK_BENEFICIARY) {
      return engine.mistake({
        en: `Safety Warning! This transfer is addressed to ${bankBeneficiary?.accountTitle ?? "another account"}, but your lesson task is to send money to Fatima Bibi. Tap Edit / Back to fix.`,
        ur: `حفاظتی انتباہ! یہ ٹرانسفر ${bankBeneficiary?.accountTitle ?? "کسی اور اکاؤنٹ"} کے لیے ہے، جبکہ مقصد فاطمہ بی بی کو بھیجنا ہے۔ "ترمیم / واپس" دبائیں۔`,
      });
    }

    setIsDeducted(true);
    engine.act("confirm");
  };

  const screen = engine.step.screen;

  // Active recipient display name
  const recipientName = method === "wallet" ? walletRecipient?.name : bankBeneficiary?.accountTitle;
  const recipientDetail =
    method === "wallet"
      ? walletRecipient?.phone
      : `${selectedBank ? tr(selectedBank.name) : "Bank"} • ${bankBeneficiary?.accountNumber || accountInput}`;

  return (
    <PhoneFrame appName={ur ? "مشق والیٹ" : "Practice Wallet"}>
      {/* SCREEN 1: HOME */}
      {screen === "home" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-4 flex-1 phone-scroll-area">
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Wallet className="h-4 w-4" /> {ur ? "مشق بیلنس" : "Practice Balance"}
              </p>
              <p className="mt-1 text-3xl font-extrabold" dir="ltr">
                {formatRs(currentBalance)}
              </p>
              <p className="text-xs opacity-90">{ur ? "فرضی رقم — اصل نہیں" : "Pretend money — not real"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SimButton
                action="send-money"
                hintLabel={{ en: "Tap Send Money", ur: "رقم بھیجیں دبائیں" }}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-4 text-base sm:text-lg font-bold text-heading shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-primary-strong">
                  <ArrowUpRight className="h-7 w-7" />
                </span>
                <span>{ur ? "رقم بھیجیں" : "Send Money"}</span>
              </SimButton>

              {/* Exploratory history: clicking does NOT penalize or add mistakes */}
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-border bg-card p-4 text-base sm:text-lg font-bold text-heading shadow-sm hover:border-primary transition-all"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky text-heading">
                  <History className="h-7 w-7" />
                </span>
                <span>{ur ? "ہسٹری" : "History"}</span>
              </button>
            </div>

            {showHistory && (
              <div className="rounded-xl border border-border bg-card p-4 text-base space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-heading">{ur ? "مشق ہسٹری" : "Practice History"}</p>
                  <span className="text-xs text-muted-foreground">{ur ? "محفوظ ریکارڈ" : "Safe Demo"}</span>
                </div>
                {isDeducted ? (
                  <div className="rounded-lg bg-muted p-2.5 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold">{recipientName}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {recipientDetail}
                      </p>
                    </div>
                    <span className="font-bold text-destructive" dir="ltr">
                      - {formatRs(Number(amount) || TARGET_AMOUNT)}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {ur ? "ابھی کوئی ٹرانزیکشن نہیں ہوئی۔" : "No practice transactions yet."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 2: TRANSFER TYPE */}
      {screen === "type" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-4 flex-1 phone-scroll-area">
            <div>
              <h3 className="text-xl font-bold text-heading">{ur ? "کہاں بھیجنا ہے؟" : "Where are you sending?"}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {ur
                  ? "موبائل والیٹ یا بینک اکاؤنٹ کا انتخاب کریں:"
                  : "Choose between mobile wallet or bank account:"}
              </p>
            </div>

            <SimButton
              action="wallet-to-wallet"
              hintLabel={{ en: "Tap for Mobile Wallet", ur: "موبائل والیٹ کے لیے ٹیپ کریں" }}
              onPress={() => {
                setMethod("wallet");
                engine.branch(sendMoneyWalletSteps, "recipient");
              }}
              className={tile}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-primary-strong">
                <Smartphone className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">{ur ? "والیٹ سے والیٹ" : "Wallet to Wallet"}</span>
                <span className="block text-xs sm:text-sm font-normal text-muted-foreground">
                  {ur ? "جاز کیش، ایزی پیسہ یا دیگر والیٹس" : "Easypaisa, JazzCash or other wallets"}
                </span>
              </span>
            </SimButton>

            <SimButton
              action="bank"
              hintLabel={{ en: "Tap for Bank Transfer", ur: "بینک ٹرانسفر کے لیے ٹیپ کریں" }}
              onPress={() => {
                setMethod("bank");
                engine.branch(sendMoneyBankSteps, "bank-select");
              }}
              className={tile}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky text-heading">
                <Landmark className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">{ur ? "بینک ٹرانسفر" : "Bank Transfer"}</span>
                <span className="block text-xs sm:text-sm font-normal text-muted-foreground">
                  {ur ? "میزان، HBL، UBL یا دیگر بینک اکاؤنٹس" : "Meezan, HBL, UBL or other bank accounts"}
                </span>
              </span>
            </SimButton>
          </div>
        </div>
      )}

      {/* SCREEN 3A: BANK SELECT (Bank flow only) */}
      {screen === "bank-select" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-3.5 flex-1 phone-scroll-area">
            <div>
              <h3 className="text-xl font-bold text-heading">{ur ? "بینک منتخب کریں" : "Choose a Bank"}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {ur
                  ? "وصول کنندہ کا بینک چنیں۔ اس مشق کے لیے میزان بینک منتخب کریں:"
                  : "Select the beneficiary's bank. For this practice, choose Meezan Bank:"}
              </p>
            </div>

            {/* Bank Search Input */}
            <div className="relative">
              <Search className="absolute start-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder={t("searchBank")}
                className="w-full h-11 ps-9 pe-3 rounded-xl border-2 border-input bg-card text-sm text-heading placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Bank List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pe-1 phone-scroll-area">
              {filteredBanks.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground bg-muted/40 rounded-xl">
                  {t("noBanksFound")}
                </p>
              ) : (
                filteredBanks.map((b) => {
                  const isSelected = selectedBankId === b.id;
                  const isPracticeTarget = b.id === "meezan";
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBankId(b.id)}
                      className={cn(
                        tile,
                        "p-3",
                        isSelected ? "border-primary bg-mint/50" : "border-border",
                      )}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white text-xs shadow-sm"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.code}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-heading flex items-center justify-between gap-1">
                          <span className="truncate">{tr(b.name)}</span>
                          {isPracticeTarget && (
                            <span className="text-[11px] shrink-0 bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full">
                              {ur ? "مشق ہدف" : "Target"}
                            </span>
                          )}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground truncate">{tr(b.tagline)}</span>
                      </span>
                      {isSelected && <Check className="h-5 w-5 text-primary shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-0 pt-2 pb-1 bg-background/95 backdrop-blur-sm border-t border-border/40 mt-auto">
            <SimButton
              action="bank-select-continue"
              hintLabel={{ en: "Tap to Continue", ur: "آگے بڑھنے کے لیے دبائیں" }}
              onPress={continueBankSelect}
              className="btn btn-primary w-full shadow-sm text-base"
            >
              {ur ? "آگے بڑھیں" : "Continue"}
            </SimButton>
          </div>
        </div>
      )}

      {/* SCREEN 3B: BANK ACCOUNT / IBAN (Bank flow only) */}
      {screen === "bank-account" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-3.5 flex-1 phone-scroll-area">
            {/* Selected Bank Header with quick change action */}
            <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white text-xs shadow-sm"
                style={{ backgroundColor: selectedBank?.color ?? "#4A154B" }}
              >
                {selectedBank?.code ?? "BNK"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{ur ? "منتخب شدہ بینک:" : "Selected Bank:"}</p>
                <p className="font-bold text-heading truncate">{selectedBank ? tr(selectedBank.name) : "Meezan Bank"}</p>
              </div>
              <button
                type="button"
                onClick={() => engine.goTo("bank-select")}
                className="text-xs font-bold text-primary underline hover:text-primary-strong"
              >
                {ur ? "تبدیل کریں" : "Change"}
              </button>
            </div>

            {/* Bank Mismatch Warning Banner */}
            {isBankMismatch && crossBank && (
              <div className="rounded-xl border-2 border-warning bg-warning-soft p-3.5 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-warning font-bold text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{t("bankMismatchTitle")}</span>
                </div>
                <p className="text-xs sm:text-sm text-heading leading-relaxed">
                  {ur
                    ? `یہ اکاؤنٹ نمبر ${tr(crossBank.name)} کا ہے، لیکن آپ نے ${selectedBank ? tr(selectedBank.name) : ""} منتخب کیا ہوا ہے۔`
                    : `This account belongs to ${tr(crossBank.name)}, but you currently selected ${selectedBank ? tr(selectedBank.name) : ""}.`}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedBankId(crossBank.id)}
                  className="btn btn-primary text-xs py-2 px-3 h-auto w-full gap-2"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{t("switchToBank")} {tr(crossBank.name)}</span>
                </button>
              </div>
            )}

            {/* Account input */}
            <label className="block">
              <span className="text-sm sm:text-base font-bold text-heading">
                {ur ? "اکاؤنٹ نمبر یا IBAN" : "Account Number or IBAN"}
              </span>
              <SimInputWrapper action="account-continue" label={{ en: "Enter account number", ur: "اکاؤنٹ نمبر درج کریں" }}>
                <input
                  inputMode="text"
                  dir="ltr"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  placeholder="02010100123456"
                  className="mt-1 h-13 w-full rounded-xl border-2 border-input bg-card px-4 text-base sm:text-lg font-mono tracking-wider text-heading focus:outline-none focus:border-primary"
                />
              </SimInputWrapper>
            </label>

            {/* Quick practice accounts list */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {ur ? "مشق اکاؤنٹس (ٹیپ کر کے بھریں):" : "Practice Accounts (Tap to auto-fill):"}
              </p>
              <div className="space-y-2 max-h-[190px] overflow-y-auto pe-1 phone-scroll-area">
                {bankBeneficiaries.map((b) => {
                  const isSelected = digitsOnly(accountInput) === digitsOnly(b.accountNumber);
                  const isTarget = b.id === TARGET_BANK_BENEFICIARY;
                  const beneficiaryBank = practiceBanks.find((pb) => pb.id === b.bankId);
                  const bankMatchesCurrent = b.bankId === selectedBankId;

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setAccountInput(b.accountNumber);
                      }}
                      className={cn(
                        tile,
                        "p-2.5",
                        isSelected ? "border-primary bg-mint/50" : "border-border",
                      )}
                    >
                      <UserRound className="h-5 w-5 text-primary shrink-0" />
                      <span className="flex-1 text-sm min-w-0">
                        <span className="block font-bold text-heading flex items-center justify-between gap-1">
                          <span className="truncate">{b.accountTitle}</span>
                          {isTarget && (
                            <span className="text-[10px] shrink-0 bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full">
                              {ur ? "مشق ہدف" : "Target"}
                            </span>
                          )}
                        </span>
                        <span className="block font-mono text-xs text-muted-foreground flex items-center justify-between gap-1" dir="ltr">
                          <span>{b.accountNumber}</span>
                          <span className={cn(
                            "text-[10px] font-sans px-1.5 py-0.2 rounded font-semibold",
                            bankMatchesCurrent ? "bg-muted text-foreground" : "bg-warning-soft text-warning border border-warning/30"
                          )}>
                            {beneficiaryBank?.code ?? b.bankId.toUpperCase()}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated 1Link Title Fetch Card */}
            {bankBeneficiary && (
              <div className="rounded-xl border-2 border-success bg-success-soft p-3.5 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-success font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{ur ? "تصدیق شدہ اکاؤنٹ ٹائٹل (1Link):" : "Verified Account Title (1Link):"}</span>
                </div>
                <p className="text-lg font-extrabold text-heading">{bankBeneficiary.accountTitle}</p>
                <p className="text-xs text-muted-foreground">{tr(bankBeneficiary.branch)}</p>
                <p className="text-xs font-semibold text-heading pt-1 border-t border-border/50">
                  {ur
                    ? "ہمیشہ تسلی کریں کہ تصدیق شدہ نام وہی ہے جسے آپ رقم بھیجنا چاہتے ہیں۔"
                    : "Always verify this name matches the person you intend to pay before confirming."}
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-0 pt-2 pb-1 bg-background/95 backdrop-blur-sm border-t border-border/40 mt-auto">
            <SimButton
              action="account-continue"
              hintLabel={{ en: "Tap to Continue", ur: "آگے بڑھنے کے لیے دبائیں" }}
              onPress={continueBankAccount}
              className="btn btn-primary w-full shadow-sm text-base"
            >
              {ur ? "آگے بڑھیں" : "Continue"}
            </SimButton>
          </div>
        </div>
      )}

      {/* SCREEN 3C: WALLET RECIPIENT (Wallet flow only) */}
      {screen === "recipient" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-4 flex-1 phone-scroll-area">
            <label className="block">
              <span className="text-base sm:text-lg font-bold text-heading">{ur ? "موبائل نمبر" : "Mobile number"}</span>
              <SimInputWrapper action="recipient-continue" label={{ en: "Enter mobile number", ur: "موبائل نمبر درج کریں" }}>
                <input
                  inputMode="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="mt-1 h-13 w-full rounded-xl border-2 border-input bg-card px-4 text-lg tracking-wider text-heading focus:outline-none focus:border-primary"
                />
              </SimInputWrapper>
            </label>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {ur ? "مشق کانٹیکٹس (ٹیپ کر کے بھریں):" : "Practice Contacts (Tap to fill):"}
              </p>
              <div className="space-y-2">
                {paymentContacts.map((c) => {
                  const isSelected = digitsOnly(phone) === digitsOnly(c.phone);
                  const isTarget = c.id === TARGET_RECIPIENT;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPhone(c.phone)}
                      className={cn(tile, "p-3", isSelected && "border-primary bg-mint/50")}
                    >
                      <UserRound className="h-6 w-6 text-primary shrink-0" />
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-heading flex items-center justify-between">
                          <span>{c.name}</span>
                          {isTarget && (
                            <span className="text-xs bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full">
                              {ur ? "مشق ہدف" : "Target"}
                            </span>
                          )}
                        </span>
                        <span className="block text-sm font-normal text-muted-foreground" dir="ltr">
                          {c.phone}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-0 pt-2 pb-1 bg-background/95 backdrop-blur-sm border-t border-border/40 mt-auto">
            <SimButton
              action="recipient-continue"
              hintLabel={{ en: "Tap to Continue", ur: "آگے بڑھنے کے لیے دبائیں" }}
              onPress={continueRecipient}
              className="btn btn-primary w-full shadow-sm text-base"
            >
              {ur ? "آگے بڑھیں" : "Continue"}
            </SimButton>
          </div>
        </div>
      )}

      {/* SCREEN 4: AMOUNT (Shared flow) */}
      {screen === "amount" && (
        <div className="flex flex-col min-h-full justify-between space-y-4">
          <div className="space-y-4 flex-1 phone-scroll-area">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{ur ? "بھیج رہے ہیں:" : "Sending to:"}</p>
              <p className="text-lg font-bold text-heading">{recipientName}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {recipientDetail}
              </p>
            </div>

            <label className="block">
              <span className="text-base sm:text-lg font-bold text-heading">{ur ? "رقم (روپے)" : "Amount (Rs.)"}</span>
              <SimInputWrapper action="amount-continue" label={{ en: "Type 1000", ur: "1000 درج کریں" }}>
                <input
                  inputMode="numeric"
                  dir="ltr"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value.replace(/[^\d]/g, ""));
                    setAmountError("");
                  }}
                  placeholder="0"
                  className={cn(
                    "mt-1 h-15 w-full rounded-xl border-2 bg-card px-4 text-2xl sm:text-3xl font-bold text-heading focus:outline-none transition-colors",
                    isExcessBalance || amountError
                      ? "border-destructive focus:border-destructive ring-2 ring-destructive/20 bg-rose-50/20 dark:bg-rose-950/20"
                      : "border-input focus:border-primary",
                  )}
                />
              </SimInputWrapper>
            </label>

            {/* Mobile screen prominent error response */}
            {(isExcessBalance || amountError) && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs sm:text-sm font-semibold text-destructive flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-destructive mt-0.5" />
                <span className="leading-snug">
                  {amountError ||
                    (ur
                      ? `ناکافی بیلنس! آپ نے ${formatRs(Number(amount))} درج کیا جو کہ آپ کے مشق بیلنس (${formatRs(WALLET_BALANCE)}) سے زیادہ ہے۔`
                      : `Insufficient balance! You entered ${formatRs(Number(amount))}, which exceeds your practice balance (${formatRs(WALLET_BALANCE)}).`)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{ur ? "مشق بیلنس:" : "Practice Balance:"}</span>
              <span className={cn("font-bold text-heading", isExcessBalance && "text-destructive font-extrabold")} dir="ltr">
                {formatRs(WALLET_BALANCE)}
              </span>
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-0 pt-2 pb-1 bg-background/95 backdrop-blur-sm border-t border-border/40 mt-auto">
            <SimButton
              action="amount-continue"
              hintLabel={{ en: "Tap Continue", ur: "آگے بڑھیں دبائیں" }}
              onPress={continueAmount}
              className="btn btn-primary w-full shadow-sm text-base"
            >
              {ur ? "آگے بڑھیں" : "Continue"}
            </SimButton>
          </div>
        </div>
      )}

      {/* SCREEN 5: REVIEW (Shared flow) */}
      {screen === "review" && (
        <div className="flex flex-col min-h-full justify-between space-y-3.5">
          <div className="space-y-3 flex-1 phone-scroll-area">
            <div>
              <h3 className="text-xl font-bold text-heading">{ur ? "تفصیل چیک کریں" : "Review Transfer"}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ur
                  ? "رقم بھیجنے سے پہلے تمام معلومات احتیاط سے پڑھیں:"
                  : "Check all transfer details carefully before confirming:"}
              </p>
            </div>

            <dl className="divide-y divide-border rounded-xl border-2 border-border bg-card text-sm sm:text-base shadow-sm">
              <div className="flex justify-between gap-3 p-3">
                <dt className="text-muted-foreground">{ur ? "طریقہ" : "Method"}</dt>
                <dd className="font-bold text-heading">
                  {method === "wallet" ? (ur ? "والیٹ سے والیٹ" : "Wallet to Wallet") : (ur ? "بینک ٹرانسفر" : "Bank Transfer")}
                </dd>
              </div>
              {method === "bank" && (
                <div className="flex justify-between gap-3 p-3">
                  <dt className="text-muted-foreground">{ur ? "بینک" : "Bank"}</dt>
                  <dd className="font-bold text-heading">{selectedBank ? tr(selectedBank.name) : "Meezan Bank"}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3 p-3">
                <dt className="text-muted-foreground">{ur ? "وصول کنندہ" : "Recipient"}</dt>
                <dd className="font-bold text-heading">{recipientName}</dd>
              </div>
              <div className="flex justify-between gap-3 p-3">
                <dt className="text-muted-foreground">
                  {method === "wallet" ? (ur ? "موبائل نمبر" : "Number") : (ur ? "اکاؤنٹ نمبر" : "Account / IBAN")}
                </dt>
                <dd className="font-bold text-heading" dir="ltr">
                  {method === "wallet" ? walletRecipient?.phone : (bankBeneficiary?.accountNumber || accountInput)}
                </dd>
              </div>
              <div className="flex justify-between gap-3 p-3">
                <dt className="text-muted-foreground">{ur ? "رقم" : "Amount"}</dt>
                <dd className="font-extrabold text-heading" dir="ltr">{formatRs(Number(amount))}</dd>
              </div>
              <div className="flex justify-between gap-3 p-3">
                <dt className="text-muted-foreground">{ur ? "فیس" : "Transfer Fee"}</dt>
                <dd className="font-bold text-success text-xs sm:text-sm" dir="ltr">
                  {formatRs(0)} ({t("illustrativeFeeNotice")})
                </dd>
              </div>
            </dl>

            {/* Deliberate Review Checkbox */}
            <label className="flex items-start gap-3 rounded-xl border-2 border-primary/30 bg-mint/30 p-3.5 cursor-pointer hover:bg-mint/50 transition-colors">
              <input
                type="checkbox"
                checked={reviewedCheckbox}
                onChange={(e) => setReviewedCheckbox(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-2 border-primary text-primary focus:ring-primary shrink-0"
              />
              <span className="text-xs sm:text-sm font-bold text-heading leading-snug">
                {t("reviewCheckboxLabel")}
              </span>
            </label>

            <p className="rounded-lg bg-warning-soft p-2.5 text-center text-xs font-bold text-warning flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{ur ? "فرضی ٹرانزیکشن — اصل رقم منتقل نہیں ہوگی" : "Fictional Practice — No real money transferred"}</span>
            </p>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="sticky bottom-0 pt-2 pb-1 bg-background/95 backdrop-blur-sm border-t border-border/40 space-y-2 mt-auto">
            <SimButton
              action="confirm"
              hintLabel={{ en: "Tap Confirm Practice Transfer", ur: "مشق ٹرانسفر کی تصدیق کریں" }}
              onPress={confirm}
              className="btn btn-primary w-full shadow-sm text-base"
            >
              {ur ? "مشق ٹرانسفر کی تصدیق" : "Confirm Practice Transfer"}
            </SimButton>

            <button
              type="button"
              onClick={() => {
                if (method === "bank") {
                  engine.goTo("bank-account");
                } else {
                  engine.goTo("recipient");
                }
              }}
              className="btn btn-outline w-full text-sm sm:text-base"
            >
              {ur ? "ترمیم / واپس" : "Edit / Back"}
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 6: RECEIPT (Educational completion screen) */}
      {screen === "receipt" && (
        <div className="flex flex-col min-h-full justify-between space-y-4 text-center">
          <div className="space-y-4 flex-1 phone-scroll-area">
            <CheckCircle2 className="mx-auto h-16 w-16 text-success animate-in zoom-in duration-300" />
            <div>
              <h3 className="text-2xl font-extrabold text-heading">
                {ur ? "شاباش! رقم منتقل ہو گئی" : "Well Done! Transfer Sent"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {ur ? "آپ نے محفوظ طریقے سے مشق مکمل کر لی۔" : "You have safely completed this practice transfer."}
              </p>
            </div>

            <p className="rounded-lg border-2 border-dashed border-warning bg-warning-soft p-3 text-xs sm:text-sm font-extrabold text-warning">
              {ur ? "مشق مکمل — کوئی اصل رقم منتقل نہیں ہوئی" : "PRACTICE COMPLETED — NO REAL MONEY SENT"}
            </p>

            <dl className="rounded-xl border border-border bg-card p-4 text-start text-sm sm:text-base space-y-2 shadow-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{ur ? "طریقہ" : "Method"}</dt>
                <dd className="font-bold">
                  {method === "wallet" ? (ur ? "والیٹ سے والیٹ" : "Wallet to Wallet") : (ur ? "بینک ٹرانسفر" : "Bank Transfer")}
                </dd>
              </div>
              {method === "bank" && selectedBank && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{ur ? "بینک" : "Bank"}</dt>
                  <dd className="font-bold">{tr(selectedBank.name)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{ur ? "رقم" : "Amount"}</dt>
                <dd className="font-extrabold text-primary" dir="ltr">{formatRs(Number(amount))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{ur ? "وصول کنندہ" : "To"}</dt>
                <dd className="font-bold">{recipientName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{ur ? "باقی مشق بیلنس" : "New Practice Balance"}</dt>
                <dd className="font-bold" dir="ltr">{formatRs(currentBalance)}</dd>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <dt className="text-muted-foreground">{ur ? "حوالہ نمبر" : "Reference"}</dt>
                <dd className="font-mono font-bold text-xs" dir="ltr">
                  {method === "bank" ? "PRACTICE-BNK-8492" : "PRACTICE-WLT-3819"}
                </dd>
              </div>
            </dl>

            <p className="text-xs text-muted-foreground">
              {tr({
                en: "This is an educational simulation. It cannot be used as proof of payment.",
                ur: "یہ ایک تعلیمی مشق ہے۔ یہ ادائیگی کے ثبوت کے طور پر استعمال نہیں ہو سکتی۔",
              })}
            </p>
          </div>

          {/* Bottom Completion Actions */}
          <div className="pt-2 pb-1">
            <CompletionActions />
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
