"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        });
      }}
      className="rounded-xl border-2 border-b-4 border-slate-200 px-4 py-2 font-bold text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-500 active:border-b-2 active:translate-y-[2px]"
    >
      LOG OUT
    </button>
  );
}
