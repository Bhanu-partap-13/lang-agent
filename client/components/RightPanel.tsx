"use client";

import Link from "next/link";

export default function RightPanel() {
  return (
    <div className="fixed top-0 right-0 h-screen w-[360px] flex flex-col p-6 hidden lg:flex bg-[#131F24]">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between mb-8 px-2">
        {/* Flag */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#202F36] p-2 rounded-xl transition-colors">
          <svg viewBox="0 0 64 64" className="w-8 h-8 rounded-md border-2 border-[#37464F]">
            {/* Simple India Flag */}
            <rect width="64" height="21.3" fill="#FF9933" />
            <rect y="21.3" width="64" height="21.3" fill="#FFFFFF" />
            <rect y="42.6" width="64" height="21.3" fill="#138808" />
            <circle cx="32" cy="32" r="8" fill="none" stroke="#000080" strokeWidth="2" />
            <circle cx="32" cy="32" r="2" fill="#000080" />
          </svg>
        </div>

        {/* Streak */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#202F36] p-2 rounded-xl transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#52565D]">
            <path d="M12 2c0 0-4 7-4 11s2 7 4 7 6-3 6-7-6-11-6-11z" fill="currentColor"/>
          </svg>
          <span className="font-bold text-[#52565D] text-[15px]">0</span>
        </div>

        {/* Gems */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#202F36] p-2 rounded-xl transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1CB0F6]">
            <path d="M12 2l8 6v8l-8 6-8-6V8l8-6z" fill="currentColor"/>
            <path d="M12 2l-8 6v8l8 6" fill="#1483B8"/>
          </svg>
          <span className="font-bold text-[#1CB0F6] text-[15px]">500</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-[#202F36] p-2 rounded-xl transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF4B4B]">
            <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" fill="currentColor"/>
          </svg>
          <span className="font-bold text-[#FF4B4B] text-[15px]">5</span>
        </div>
      </div>

      <div className="flex flex-col space-y-6 overflow-y-auto pr-2 pb-10 custom-scrollbar">
        
        {/* Super Widget */}
        <div className="rounded-2xl border-2 border-[#37464F] p-4 relative overflow-hidden flex flex-col">
          {/* Super Gradient Logo */}
          <div className="bg-gradient-to-r from-[#FF79CA] to-[#A05CFF] text-white font-black italic rounded-md px-2 py-0.5 w-max mb-3 text-sm transform -skew-x-12 ml-1">
            <div className="transform skew-x-12">SUPER</div>
          </div>
          
          <h2 className="text-white font-bold text-lg mb-2 z-10 w-[65%]">Try Super for free</h2>
          <p className="text-[#AFAFAF] text-[15px] mb-6 z-10 leading-snug w-[75%]">
            No ads, personalized practice, and unlimited Legendary!
          </p>

          <button className="w-full py-3 rounded-xl font-bold text-white bg-[#58CC02] border-b-4 border-[#58A700] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 transition-all z-10 uppercase tracking-wide text-sm" style={{ backgroundColor: "#3E44FF", borderColor: "#2B2FA6" }}>
            TRY 1 WEEK FREE
          </button>

          {/* Placeholder Owl Graphic */}
          <div className="absolute top-4 right-2 w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              {/* Abstract glowing owl shape mimicking the screenshot */}
              <defs>
                <linearGradient id="owlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A05CFF" />
                  <stop offset="100%" stopColor="#1CB0F6" />
                </linearGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="30" ry="25" fill="url(#owlGrad)" transform="rotate(-15 50 50)" />
              <path d="M 20 40 Q 30 20 50 30" stroke="url(#owlGrad)" strokeWidth="15" strokeLinecap="round" />
              <circle cx="40" cy="45" r="5" fill="#FFF" />
              <circle cx="55" cy="42" r="5" fill="#FFF" />
              <circle cx="39" cy="45" r="2" fill="#000" />
              <circle cx="54" cy="42" r="2" fill="#000" />
              <path d="M 45 50 L 50 55 L 42 58 Z" fill="#F4B000" />
              <ellipse cx="70" cy="75" rx="4" ry="6" fill="#FF79CA" transform="rotate(30 70 75)" />
              <ellipse cx="85" cy="70" rx="4" ry="6" fill="#FF79CA" transform="rotate(30 85 70)" />
            </svg>
          </div>
        </div>

        {/* Leaderboards Widget */}
        <div className="rounded-2xl border-2 border-[#37464F] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg">Unlock Leaderboards!</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#202F36" }}>
              {/* Gray Shield */}
              <svg viewBox="0 0 48 48" className="w-10 h-10">
                <path d="M24 6L10 10v12c0 12 14 20 14 20s14-8 14-20V10z" fill="#37464F" />
                <path d="M24 6L10 10v12c0 12 14 20 14 20s14-8 14-20V10z" fill="#52565D" opacity="0.5" />
                <rect x="21" y="20" width="6" height="8" rx="3" fill="#202F36" />
                <circle cx="24" cy="20" r="3" fill="#202F36" />
              </svg>
            </div>
            <p className="text-[#AFAFAF] text-[15px] leading-snug flex-1">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quests Widget */}
        <div className="rounded-2xl border-2 border-[#37464F] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-bold text-lg">Daily Quests</h2>
            <Link href="/quests" className="text-[#42ADDF] font-bold text-sm hover:brightness-125">
              VIEW ALL
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              {/* Lightning Bolt */}
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FFC800]">
                <path d="M13 2L3 14h8l-2 8 10-12h-8z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold mb-2 text-md">Earn 10 XP</p>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-4 rounded-full bg-[#37464F] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#FFC800] w-0"></div>
                  {/* Highlight reflection */}
                  <div className="absolute top-1 left-2 h-1 rounded-full bg-white opacity-20 w-0"></div>
                </div>
                {/* Chest Icon */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#D98A00]">
                  <rect x="2" y="10" width="20" height="10" fill="currentColor"/>
                  <path d="M2 10v-2c0-2 20-2 20 0v2H2z" fill="#F4B000"/>
                  <rect x="10" y="8" width="4" height="4" fill="#A84400"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
