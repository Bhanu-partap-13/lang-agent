"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  {
    name: "LEARN",
    href: "/learn",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        {/* House base */}
        <path d="M10 24v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V24" fill="#EFA400" />
        <path d="M10 24v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V24" fill="#E85D04" opacity="0.3" />
        {/* Roof */}
        <path d="M6 24L24 8l18 16" fill="none" stroke="#EFA400" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 22L24 4l20 18" fill="#F4B000" />
        {/* Bird hole */}
        <circle cx="24" cy="26" r="5" fill="#A84400" />
      </svg>
    ),
  },
  {
    name: "LETTERS",
    href: "/letters",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#42ADDF" fontSize="30" fontWeight="bold">क</text>
      </svg>
    ),
  },
  {
    name: "LEADERBOARDS",
    href: "/leaderboards",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <path d="M24 6L10 10v12c0 12 14 20 14 20s14-8 14-20V10z" fill="#F4B000" />
        <path d="M24 6L10 10v12c0 12 14 20 14 20s14-8 14-20V10z" fill="#D98A00" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: "QUESTS",
    href: "/quests",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <rect x="8" y="24" width="32" height="16" rx="2" fill="#F4B000" />
        <path d="M8 24v-6c0-6 32-6 32 0v6H8z" fill="#EFA400" />
        <rect x="20" y="20" width="8" height="8" rx="1" fill="#FFF" />
        <circle cx="24" cy="24" r="2" fill="#D98A00" />
      </svg>
    ),
  },
  {
    name: "SHOP",
    href: "/shop",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <rect x="10" y="24" width="28" height="16" fill="#F06048" />
        <path d="M8 24h32v-6L36 6H12L8 18v6z" fill="#42ADDF" />
        <path d="M16 24v16M24 24v16M32 24v16" stroke="#C44834" strokeWidth="2" />
        <rect x="18" y="30" width="12" height="10" fill="#FFC9B4" />
      </svg>
    ),
  },
  {
    name: "PROFILE",
    href: "/profile",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <circle cx="24" cy="18" r="9" fill="#52565D" />
        <path d="M10 42c0-10 28-10 28 0" fill="#52565D" />
        <circle cx="24" cy="24" r="22" fill="none" stroke="#52565D" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    name: "MORE",
    href: "/more",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 mr-4">
        <circle cx="24" cy="24" r="18" fill="#C460FF" />
        <circle cx="16" cy="24" r="2.5" fill="#FFF" />
        <circle cx="24" cy="24" r="2.5" fill="#FFF" />
        <circle cx="32" cy="24" r="2.5" fill="#FFF" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen w-[280px] flex flex-col border-r-2 border-[#202F36] bg-[#131F24] p-4">
      {/* Logo */}
      <div className="pl-4 pt-6 pb-8">
        <Image src="/logo.svg" alt="Duolingo" width={140} height={36} priority />
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/learn" && pathname === "/");
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-2xl transition-all cursor-pointer border-2 ${
                isActive 
                  ? "border-[#42ADDF] bg-[#202F36] bg-opacity-50 text-[#42ADDF]" 
                  : "border-transparent text-white hover:bg-[#202F36]"
              }`}
            >
              {item.icon}
              <span className={`font-bold tracking-wide text-sm ${isActive ? "text-[#42ADDF]" : "text-white"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
