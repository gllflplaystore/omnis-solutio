import { useState } from "react";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CardForm {
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OmnisLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {/* DS Mark */}
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#E05C2A]">
        <span className="text-sm font-bold leading-none text-white tracking-tight">
          DS
        </span>
      </div>
      <div
        className={cn(
          "flex flex-col leading-none",
          dark ? "text-gray-900" : "text-gray-900",
        )}
      >
        <span className="text-[11px] font-bold tracking-widest uppercase">
          OMNIS
        </span>
        <span className="text-[11px] font-bold tracking-widest uppercase">
          SOLUTIO
        </span>
      </div>
    </div>
  );
}

function CardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function GlobeIllustration() {
  return (
    <div className="mt-3 overflow-hidden rounded-lg">
      <svg
        viewBox="0 0 232 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <ellipse cx="116" cy="52" rx="100" ry="52" fill="#DBEAFE" />
        <ellipse
          cx="116"
          cy="52"
          rx="60"
          ry="52"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1"
        />
        <ellipse
          cx="116"
          cy="52"
          rx="100"
          ry="30"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1"
        />
        <ellipse
          cx="116"
          cy="52"
          rx="100"
          ry="10"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="0.5"
        />
        <line
          x1="16"
          y1="52"
          x2="216"
          y2="52"
          stroke="#93C5FD"
          strokeWidth="1"
        />
        {/* Dots for network nodes */}
        {[
          [60, 35],
          [100, 25],
          [145, 30],
          [175, 45],
          [160, 65],
          [120, 72],
          [80, 68],
          [50, 55],
          [130, 48],
          [95, 50],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#3B82F6" opacity="0.7" />
        ))}
        {/* Connection lines */}
        <line
          x1="60"
          y1="35"
          x2="100"
          y2="25"
          stroke="#60A5FA"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="100"
          y1="25"
          x2="145"
          y2="30"
          stroke="#60A5FA"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="145"
          y1="30"
          x2="175"
          y2="45"
          stroke="#60A5FA"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="80"
          y1="68"
          x2="130"
          y2="48"
          stroke="#60A5FA"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="95"
          y1="50"
          x2="130"
          y2="48"
          stroke="#60A5FA"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────

interface PaymentModalProps {
  onClose: () => void;
}

function PaymentModal({ onClose }: PaymentModalProps) {
  const [form, setForm] = useState<CardForm>({
    holderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const isFormValid =
    form.holderName.trim().length > 0 &&
    form.cardNumber.replace(/\s/g, "").length === 16 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3;

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Modal card */}
      <div className="relative w-full max-w-215 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <OmnisLogo />
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.207 4.207a1 1 0 0 0-1.414-1.414L8 5.586 5.207 2.793a1 1 0 0 0-1.414 1.414L6.586 8l-2.793 2.793a1 1 0 1 0 1.414 1.414L8 10.414l2.793 2.793a1 1 0 0 0 1.414-1.414L9.414 8l2.793-2.793z" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex min-h-135">
          {/* Left sidebar */}
          <aside className="flex w-65 shrink-0 flex-col gap-4 border-r border-gray-100 bg-gray-50/60 p-5">
            {/* Merchant card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Apex</p>
                  <p className="text-xs text-gray-500">Finance &amp; Banking</p>
                </div>
              </div>
              <div className="mt-4 border-t border-dashed border-gray-200 pt-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Price Summary
                </p>
                <p className="mt-0.5 text-xl font-bold text-gray-900">
                  AED 84,999
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="mt-auto">
              <p className="text-xs font-medium text-gray-500">
                Having trouble with transfer?
              </p>
              <GlobeIllustration />
            </div>
          </aside>

          {/* Right content */}
          <div className="flex flex-1 flex-col">
            {/* Section header */}
            <div className="border-b border-gray-100 px-6 py-3">
              <p className="text-sm font-semibold text-gray-700">
                Payment Options
              </p>
            </div>

            <div className="flex flex-1 gap-0">
              {/* Tab sidebar */}
              <div className="w-45 shrink-0 border-r border-gray-100 py-4 px-3">
                <button className="flex w-full items-center gap-2.5 rounded-lg bg-orange-50 px-3 py-2.5 text-sm font-medium text-orange-600">
                  <CardIcon />
                  Cards
                </button>
                <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Net Banking
                </button>
                <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                  >
                    <rect
                      x="5"
                      y="2"
                      width="14"
                      height="20"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                  </svg>
                  UPI
                </button>
                <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Wallets
                </button>
              </div>

              {/* Card form */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="mb-4 text-sm font-semibold text-gray-800">
                    Add a new card
                  </p>

                  <div className="space-y-3">
                    {/* Card Holder Name */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John doe"
                        value={form.holderName}
                        onChange={(e) =>
                          setForm({ ...form, holderName: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={form.cardNumber}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cardNumber: formatCardNumber(e.target.value),
                            })
                          }
                          maxLength={19}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                          {/* Visa/Mastercard placeholder icons */}
                          <div className="h-4 w-6 rounded bg-blue-700" />
                          <div className="h-4 w-6 rounded bg-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={form.expiry}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              expiry: formatExpiry(e.target.value),
                            })
                          }
                          maxLength={5}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={form.cvv}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cvv: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                          maxLength={4}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    </div>

                    {/* Save card */}
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={form.saveCard}
                        onChange={(e) =>
                          setForm({ ...form, saveCard: e.target.checked })
                        }
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-orange-500"
                      />
                      <span className="text-xs text-gray-500">
                        Save this card securely for future payments
                      </span>
                    </label>
                  </div>
                </div>

                {/* Continue button */}
                <div className="mt-5">
                  <button
                    disabled={!isFormValid}
                    className={cn(
                      "w-full rounded-lg py-2.5 text-sm font-semibold transition-all",
                      isFormValid
                        ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
                        : "cursor-not-allowed bg-gray-100 text-gray-400",
                    )}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-3 text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                By proceeding, I agree to Swordedge&apos;s Privacy Notice
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Merchant Checkout Page ───────────────────────────────────────────────────

export default function CheckoutPage() {
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("8652491309");
  const [state, setState] = useState("Andaman and Nicobar Islands");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const PRICE = 49999;
  const DISCOUNT = appliedCoupon ? 15000 : 0;
  const PAYABLE = PRICE - DISCOUNT;

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  function handleApplyCoupon() {
    if (couponInput.trim().toUpperCase() === "PMF15KEARLYBIRD") {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setCouponInput("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Top banner ── */}
      <div className="bg-blue-50 py-2.5 text-center text-sm text-gray-700">
        <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-200 align-middle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
          </svg>
        </span>
        Rishabh Khare from the previous cohort bagged a product role at{" "}
        <strong>Metal Power Analytical Pvt. Ltd.</strong> 🎉
      </div>

      {/* ── Header ── */}
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          nextLeap
        </span>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Left: Product & Contact ── */}
          <section className="flex-1 space-y-6">
            {/* Product info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Manager Fellowship
              </h1>
              <p className="mt-1 text-sm text-gray-500">Feb 7 – May 10</p>

              <div className="mt-4 flex items-center gap-2">
                <label className="text-sm text-gray-600">Qty:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-800">
                Contact Information
              </h2>

              {/* Phone */}
              <div>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                  <div className="flex items-center gap-1.5 border-r border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                    <span>🇮🇳</span>
                    <span>+91</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    className="flex-1 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Select State{" "}
                  <span className="text-gray-400">(required for GST)</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 appearance-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Right: Order Summary ── */}
          <aside className="w-full space-y-4 lg:w-85">
            {/* Coupons */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Available Coupons
                </p>
                <button className="text-xs font-medium text-orange-500 hover:underline">
                  See All
                </button>
              </div>

              {/* Coupon card */}
              {!appliedCoupon ? (
                <div className="rounded-lg border border-dashed border-green-300 bg-green-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        PMF15KEARLYBIRD
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Save ₹15,000
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Valid Till: Sun, Jan 11 | 11:59 PM
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCouponInput("PMF15KEARLYBIRD");
                        setAppliedCoupon("PMF15KEARLYBIRD");
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-green-400 bg-green-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600 font-semibold">
                        ✓ {appliedCoupon} applied
                      </p>
                      <p className="text-xs text-green-700">
                        You save ₹15,000!
                      </p>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Custom coupon input */}
              {!appliedCoupon && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Program Cost</span>
                <span className="font-medium text-gray-800">
                  ₹{PRICE.toLocaleString("en-IN")}
                </span>
              </div>

              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-green-600">Coupon Discount</span>
                  <span className="font-medium text-green-600">
                    −₹{DISCOUNT.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <hr className="my-3 border-dashed border-gray-200" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Amount Payable
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    EMI from ₹1,577/month
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{PAYABLE.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Terms */}
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 accent-orange-500"
                />
                <span className="text-xs text-gray-500">
                  I agree to the{" "}
                  <Link to="#" className="text-orange-500 underline">
                    terms and conditions
                  </Link>
                </span>
              </label>

              {/* Pay Now */}
              <button
                onClick={() => agreeTerms && setShowModal(true)}
                disabled={!agreeTerms}
                className={cn(
                  "mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3 text-sm font-semibold transition-all",
                  agreeTerms
                    ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
                    : "cursor-not-allowed bg-gray-200 text-gray-400",
                )}
              >
                <span>Pay Now</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Secured by */}
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="text-[10px] text-gray-400">Secured by</span>
                <OmnisLogo />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Payment Modal ── */}
      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
