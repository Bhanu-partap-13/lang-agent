"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleNext = () => {
    if (age.trim() !== "") {
      setStep(2);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    setEmailError("");
    const res = await signUp.email({
      email,
      password,
      name: name || "Learner",
      fetchOptions: {
        onSuccess: () => {
          setLoading(false);
          router.push("/learn");
        },
        onError: (ctx) => {
          const msg = ctx.error.message || "Something went wrong.";
          // If the error is about email, show it inline under the email field
          if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("user")) {
            setEmailError(msg);
          } else {
            setError(msg);
          }
          setLoading(false);
        },
      },
    });
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await signIn.social({
        provider: "google",
        callbackURL: "/learn",
      });
      if (res?.error) {
        setError(res.error.message || "Failed to connect to Google.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = age.trim() === "";
  const isCreateDisabled = email.trim() === "" || password.trim() === "";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{ backgroundColor: "#131F24", fontFamily: "'DIN Round Pro', 'Nunito', Arial, sans-serif" }}
    >
      {/* Top Left Back / Close Button */}
      <div className="absolute top-6 left-8 cursor-pointer hover:opacity-80 transition-opacity">
        {step === 1 ? (
          <svg
            onClick={() => router.push("/")}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#52565D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            onClick={() => setStep(1)}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#52565D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        )}
      </div>

      {/* Top Right Login Button */}
      <Link href="/login" className="absolute top-4 right-8">
        <button
          className="px-5 py-2 rounded-2xl font-bold transition-all text-sm uppercase tracking-wide"
          style={{
            border: "2px solid #37464F",
            color: "#42ADDF",
            background: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(66,173,223,0.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Login
        </button>
      </Link>

      <div className="w-full max-w-[440px] px-4">
        {/* ── STEP 1: AGE ── */}
        {step === 1 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-bold text-white text-center mb-8">How old are you?</h1>

            <div className="relative mb-4">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border-2 p-4 text-white placeholder-gray-400 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{
                  backgroundColor: "#202F36",
                  borderColor: "#37464F",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#50D3FF")}
                onBlur={(e) => (e.target.style.borderColor = "#37464F")}
              />
              {age.trim() !== "" && (
                <button
                  onClick={() => setAge("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full w-5 h-5"
                  style={{ backgroundColor: "#37464F", color: "#131F24" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <p className="text-sm mb-8 leading-relaxed" style={{ color: "#77858F" }}>
              Providing your age ensures you get the right Duolingo experience. For more details, please visit our{" "}
              <a href="#" className="font-bold hover:underline" style={{ color: "#42ADDF" }}>
                Privacy Policy
              </a>
              .
            </p>

            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className="w-full py-4 rounded-2xl font-bold text-[15px] tracking-widest transition-all uppercase"
              style={
                isNextDisabled
                  ? { backgroundColor: "#37464F", color: "#52565D", cursor: "not-allowed", boxShadow: "none" }
                  : { backgroundColor: "#1CB0F6", color: "#fff", boxShadow: "0 4px 0 0 #1899D6" }
              }
            >
              NEXT
            </button>
          </div>
        )}

        {/* ── STEP 2: CREATE PROFILE ── */}
        {step === 2 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-2xl font-bold text-white text-center mb-6">Create your profile</h1>

            <div className="flex flex-col gap-0 mb-2">
              {/* Name field */}
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 px-4 py-4 text-white placeholder-gray-400 focus:outline-none transition-all mb-3"
                style={{ backgroundColor: "#202F36", borderColor: "#37464F" }}
                onFocus={(e) => (e.target.style.borderColor = "#50D3FF")}
                onBlur={(e) => (e.target.style.borderColor = "#37464F")}
              />

              {/* Email field — red border on error */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className="w-full rounded-xl border-2 px-4 py-4 text-white placeholder-gray-400 focus:outline-none transition-all"
                style={{
                  backgroundColor: "#202F36",
                  borderColor: emailError ? "#FF4B4B" : "#37464F",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = emailError ? "#FF4B4B" : "#50D3FF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = emailError ? "#FF4B4B" : "#37464F";
                }}
              />

              {/* Inline email error — Duolingo style */}
              {emailError && (
                <div className="flex items-center gap-1.5 mt-1.5 mb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4B4B">
                    <circle cx="12" cy="12" r="12" />
                    <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">!</text>
                  </svg>
                  <span className="text-sm font-semibold" style={{ color: "#FF4B4B" }}>
                    {emailError}
                  </span>
                </div>
              )}

              {/* Password field */}
              <div className="relative mt-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 px-4 py-4 pr-14 text-white placeholder-gray-400 focus:outline-none transition-all"
                  style={{ backgroundColor: "#202F36", borderColor: "#37464F" }}
                  onFocus={(e) => (e.target.style.borderColor = "#50D3FF")}
                  onBlur={(e) => (e.target.style.borderColor = "#37464F")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#42ADDF" }}
                >
                  {showPassword ? (
                    // Eye-off
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    // Eye
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Generic error (non-email) */}
            {error && (
              <div className="flex items-center gap-1.5 mt-1.5 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4B4B">
                  <circle cx="12" cy="12" r="12" />
                  <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">!</text>
                </svg>
                <span className="text-sm font-semibold" style={{ color: "#FF4B4B" }}>{error}</span>
              </div>
            )}

            <button
              onClick={handleSignUp}
              disabled={isCreateDisabled || loading}
              className="w-full py-4 rounded-2xl font-bold text-[15px] tracking-widest transition-all uppercase mt-4"
              style={
                isCreateDisabled || loading
                  ? { backgroundColor: "#37464F", color: "#52565D", cursor: "not-allowed", boxShadow: "none" }
                  : { backgroundColor: "#1CB0F6", color: "#fff", boxShadow: "0 4px 0 0 #1899D6" }
              }
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </div>
        )}

        {/* ── SOCIAL / FOOTER (both steps) ── */}
        <div className="mt-7">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px flex-1" style={{ backgroundColor: "#37464F" }}></div>
            <span className="font-bold text-sm" style={{ color: "#52565D" }}>OR</span>
            <div className="h-px flex-1" style={{ backgroundColor: "#37464F" }}></div>
          </div>

          <div className="flex gap-3">
            {/* Google */}
            <button
              onClick={handleGoogle}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 py-3 transition-all font-bold text-[13px] tracking-widest uppercase"
              style={{ borderColor: "#37464F", color: "#42ADDF", backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(66,173,223,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            {/* Facebook */}
            <button
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 py-3 transition-all font-bold text-[13px] tracking-widest uppercase"
              style={{ borderColor: "#37464F", color: "#4267B2", backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(66,103,178,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B5998">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div className="mt-6 text-center text-xs leading-relaxed max-w-[380px] mx-auto" style={{ color: "#52565D" }}>
            <p className="mb-3">
              By signing in to Duolingo, you agree to our{" "}
              <a href="#" className="font-bold hover:underline">Terms</a> and{" "}
              <a href="#" className="font-bold hover:underline">Privacy Policy</a>.
            </p>
            <p>
              This site is protected by reCAPTCHA Enterprise and the Google{" "}
              <a href="#" className="font-bold hover:underline">Privacy Policy</a> and{" "}
              <a href="#" className="font-bold hover:underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
