"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const authMutation = useMutation({
    mutationFn: async () => {
      if (isSignUp) {
        const { data, error } = await signUp.email({
          email,
          password,
          name: name || "Learner",
        });
        if (error) throw new Error(error.message || "Failed to sign up.");
        return data;
      } else {
        const { data, error } = await signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message || "Failed to sign in.");
        return data;
      }
    },
    onSuccess: () => {
      router.push("/learn");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authMutation.mutate();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#131F24] px-4 font-sans text-white">
      <div className="w-full max-w-md rounded-2xl border-2 border-slate-700 bg-[#202F36] p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          {isSignUp ? "Create your profile" : "Log in to Duolingo"}
        </h1>

        {authMutation.error && (
          <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-center text-sm font-medium text-red-400">
            {authMutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border-2 border-slate-700 bg-[#131F24] px-4 text-white placeholder-slate-400 outline-none focus:border-[#1CB0F6]"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-slate-700 bg-[#131F24] px-4 text-white placeholder-slate-400 outline-none focus:border-[#1CB0F6]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border-2 border-slate-700 bg-[#131F24] px-4 text-white placeholder-slate-400 outline-none focus:border-[#1CB0F6]"
          />
          <button
            type="submit"
            disabled={authMutation.isPending}
            className="mt-4 h-12 w-full rounded-2xl bg-[#1CB0F6] font-bold text-white shadow-[0_4px_0_0_#1899D6] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#1899D6] disabled:opacity-50"
          >
            {authMutation.isPending ? "Please wait..." : isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
          </button>
        </form>

        <div className="relative mt-8 flex items-center justify-center">
          <div className="absolute w-full border-t border-slate-700"></div>
          <span className="relative bg-[#202F36] px-4 text-sm font-bold text-slate-400">OR</span>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <p className="text-center text-sm font-medium text-slate-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                authMutation.reset();
              }}
              className="ml-2 font-bold text-[#1CB0F6] hover:underline"
            >
              {isSignUp ? "LOG IN" : "SIGN UP"}
            </button>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          By signing in to Duolingo, you agree to our{" "}
          <span className="font-bold cursor-pointer hover:text-slate-300">Terms</span> and{" "}
          <span className="font-bold cursor-pointer hover:text-slate-300">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
