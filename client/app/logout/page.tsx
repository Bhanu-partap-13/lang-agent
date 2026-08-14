"use client";

import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"signing-out" | "done" | "error">("signing-out");

  useEffect(() => {
    let cancelled = false;

    const performSignOut = async () => {
      try {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              if (!cancelled) {
                setStatus("done");
                // Small delay so the user sees the "See you soon" message
                setTimeout(() => {
                  router.replace("/login");
                }, 1500);
              }
            },
            onError: () => {
              if (!cancelled) {
                // Still redirect on error — session is effectively invalid
                setStatus("done");
                setTimeout(() => {
                  router.replace("/login");
                }, 1500);
              }
            },
          },
        });
      } catch {
        if (!cancelled) {
          setStatus("error");
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }
      }
    };

    performSignOut();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-white"
      style={{ backgroundColor: "#131F24" }}
    >
      <div className="flex flex-col items-center space-y-8 text-center max-w-sm">

        {/* Duo Mascot waving goodbye */}
        <div className="relative">
          <div className="w-36 h-36 relative">
            <Image
              src="/practice-mascot.svg"
              alt="Duo waving goodbye"
              width={144}
              height={144}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
          {/* Animated ripple glow behind mascot */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-[#58CC02]/10 animate-ping" />
          </div>
        </div>

        {/* Heading */}
        {status === "signing-out" && (
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Signing you out…
            </h1>
            <p className="text-[#AFAFAF] text-sm font-semibold">
              Saving your progress and ending your session.
            </p>

            {/* Spinner */}
            <div className="flex justify-center pt-2">
              <div className="w-8 h-8 rounded-full border-4 border-[#202F36] border-t-[#58CC02] animate-spin" />
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              See you soon! 👋
            </h1>
            <p className="text-[#AFAFAF] text-sm font-semibold">
              You&apos;ve been signed out. Redirecting you to the sign-in page…
            </p>

            {/* Green check */}
            <div className="flex justify-center pt-2">
              <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Something went wrong
            </h1>
            <p className="text-[#AFAFAF] text-sm font-semibold">
              Don&apos;t worry — redirecting you to sign in shortly.
            </p>
          </div>
        )}

        {/* Motivational streak reminder */}
        <div className="bg-[#182830] border-2 border-[#202F36] rounded-2xl px-6 py-4 flex items-center space-x-4 w-full shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-[#FF9600]/10 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF9600] fill-current animate-pulse">
              <path d="M17.66 11c-.11-.19-.24-.37-.39-.54C16.85 9.98 16.26 9.62 15.64 9.48 14.22 9.25 13 9 12 9c-1 0-2.22.25-3.64.48-.62.14-1.21.5-1.63.98-.15.17-.28.35-.39.54C6.12 11.37 6 11.68 6 12c0 2.76 2.69 5 6 5s6-2.24 6-5c0-.32-.12-.63-.34-.89z" />
            </svg>
          </div>
          <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed text-left">
            Your <span className="text-[#FF9600] font-extrabold">streak</span> and progress are safely saved. Come back tomorrow to keep it going!
          </p>
        </div>

      </div>
    </div>
  );
}
