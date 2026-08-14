"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    name: "LEARN",
    href: "/learn",
    icon: (
      <Image src="/learn.svg" alt="Learn" width={32} height={32} className="mr-4 w-8 h-8" />
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
      <Image src="/leaderboard.svg" alt="Leaderboards" width={32} height={32} className="mr-4 w-8 h-8" />
    ),
  },
  {
    name: "QUESTS",
    href: "/quests",
    icon: (
      <Image src="/quests.svg" alt="Quests" width={32} height={32} className="mr-4 w-8 h-8" />
    ),
  },
  {
    name: "SHOP",
    href: "/shop",
    icon: (
      <Image src="/shop.svg" alt="Shop" width={32} height={32} className="mr-4 w-8 h-8" />
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
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMoreOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 150);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[270px] flex flex-col border-r-2 border-[#202F36] bg-[#131F24] p-5 z-40">
      {/* Logo */}
      <div className="pl-4 pt-4 pb-6">
        <Image
          src="/logo.svg"
          alt="Duolingo"
          width={130}
          height={32}
          style={{ height: "auto" }}
          priority
        />
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col space-y-2 flex-1 relative">
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

        {/* MORE Menu Trigger (Hoverable) */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all cursor-pointer border-2 ${
              isMoreOpen 
                ? "border-[#C460FF] bg-[#202F36] text-[#C460FF]" 
                : "border-transparent text-white hover:bg-[#202F36]"
            }`}
          >
            <Image src="/menu.svg" alt="More" width={32} height={32} className="mr-4 w-8 h-8" />
            <span className={`font-bold tracking-wide text-sm ${isMoreOpen ? "text-[#C460FF]" : "text-white"}`}>
              MORE
            </span>
          </button>

          {/* MORE Flyout Dropdown Popover (Positioned to the right of Sidebar) */}
          <AnimatePresence>
            {isMoreOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute left-full top-[-100px] ml-3 w-64 bg-[#131F24] border-2 border-[#202F36] rounded-2xl p-3 shadow-2xl z-50 overflow-hidden"
              >
                {/* Top Section with Icons */}
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/english-test"
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-[#202F36] transition-colors cursor-pointer"
                  >
                    {/* Badge Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#58CC02] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="font-extrabold text-xs tracking-wider text-white">DUOLINGO ENGLISH TEST</span>
                  </Link>

                  <Link
                    href="/schools"
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-[#202F36] transition-colors cursor-pointer"
                  >
                    {/* Globe Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#1CB0F6] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="font-extrabold text-xs tracking-wider text-white">SCHOOLS</span>
                  </Link>

                  <Link
                    href="/podcast"
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-[#202F36] transition-colors cursor-pointer"
                  >
                    {/* Headphones Icon */}
                    <div className="w-8 h-8 rounded-full bg-[#CE82FF] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                        <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="font-extrabold text-xs tracking-wider text-white">PODCAST</span>
                  </Link>
                </div>

                {/* Divider Line */}
                <div className="border-t-2 border-[#202F36] my-2"></div>

                {/* Bottom Section Plain Links */}
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/settings"
                    className="px-4 py-2.5 rounded-xl hover:bg-[#202F36] transition-colors font-extrabold text-xs tracking-wider text-[#AFAFAF] hover:text-white uppercase"
                  >
                    SETTINGS
                  </Link>

                  <Link
                    href="/help"
                    className="px-4 py-2.5 rounded-xl hover:bg-[#202F36] transition-colors font-extrabold text-xs tracking-wider text-[#AFAFAF] hover:text-white uppercase"
                  >
                    HELP
                  </Link>

                  <Link
                    href="/logout"
                    className="px-4 py-2.5 rounded-xl hover:bg-[#202F36] transition-colors font-extrabold text-xs tracking-wider text-[#AFAFAF] hover:text-white uppercase"
                  >
                    LOG OUT
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Promo Card (Matching Image 2) */}
        <div className="mt-auto bg-[#182830] border-2 border-[#202F36] rounded-2xl p-4 flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-[#202F36] flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#AFAFAF]">
              <path d="M19 22H5v-2h14v2zm-2-4H7v-2h10v2zm-1.5-4h-7l.8-4h5.4l.8 4zM12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2H9.5L9 8.5V10h6V8.5l-.5-1.5h-.3c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3z" fill="currentColor"/>
            </svg>
          </div>
          <h4 className="font-extrabold text-sm text-white mb-0.5">Want to learn chess?</h4>
          <p className="text-[#AFAFAF] text-xs font-semibold mb-3">Duolingo makes it easy!</p>
          <Link href="/chess" className="font-extrabold text-[#1CB0F6] uppercase text-xs tracking-wider hover:underline">
            TRY CHESS
          </Link>
        </div>
      </nav>
    </div>
  );
}


