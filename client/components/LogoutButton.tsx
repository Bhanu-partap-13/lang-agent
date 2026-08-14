"use client";

import Link from "next/link";

export default function LogoutButton() {
  return (
    <Link
      href="/logout"
      className="rounded-xl border-2 border-b-4 border-slate-200 px-4 py-2 font-bold text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-500 active:border-b-2 active:translate-y-[2px]"
    >
      LOG OUT
    </Link>
  );
}

