"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useUserStats } from "@/lib/hooks/useUserStats";
import { motion, AnimatePresence } from "framer-motion";

// ─── Toggle Switch ────────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        enabled ? "bg-[#58CC02]" : "bg-[#37464F]"
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Settings Section Wrapper ─────────────────────────────────────
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b-2 border-[#202F36]">
        <h2 className="text-[#AFAFAF] font-black text-xs uppercase tracking-widest">{title}</h2>
      </div>
      <div className="divide-y-2 divide-[#202F36]">{children}</div>
    </div>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────
function SettingsRow({
  icon,
  label,
  description,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#202F36]/50 transition-colors group">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-2xl bg-[#202F36] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-white font-bold text-sm">{label}</p>
          {description && (
            <p className="text-[#AFAFAF] text-xs font-semibold mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {right && <div className="ml-4 flex-shrink-0">{right}</div>}
    </div>
  );
}

export default function SettingsPage() {
  const { stats } = useUserStats();

  // Notification toggles
  const [notifLessons, setNotifLessons] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifLeaderboard, setNotifLeaderboard] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);

  // Learning preferences
  const [soundEffects, setSoundEffects] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:pl-[280px] flex flex-col items-center min-h-screen text-white select-none">
        <div className="w-full max-w-2xl mx-auto px-6 py-8 space-y-8">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
              <p className="text-[#AFAFAF] text-sm font-semibold mt-1">
                Manage your account and learning preferences
              </p>
            </div>
            <div className="w-12 h-12 relative flex-shrink-0">
              <Image
                src="/practice-mascot.svg"
                alt="Duo"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Saved Toast */}
          <AnimatePresence>
            {savedToast && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-[#58CC02] border-b-4 border-[#46A302] text-black font-extrabold text-sm px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
                Settings saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ACCOUNT ───────────────────────────────────────── */}
          <SettingsSection title="Account">
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1CB0F6] fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              }
              label="Username"
              description={stats?.username || "Loading..."}
              right={
                <span className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider bg-[#202F36] px-3 py-1.5 rounded-xl border border-[#37464F]">
                  VIEW PROFILE
                </span>
              }
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#CE82FF] fill-current">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
              label="Email"
              description="Connected via email & password"
              right={
                <span className="text-[#58CC02] text-xs font-bold flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  VERIFIED
                </span>
              }
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FFC800] fill-current">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              }
              label="Password"
              description="Last changed never"
              right={
                <button className="text-[#1CB0F6] text-xs font-black uppercase tracking-wider hover:underline">
                  CHANGE
                </button>
              }
            />
          </SettingsSection>

          {/* ── LEARNING PREFERENCES ──────────────────────────── */}
          <SettingsSection title="Learning Preferences">
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#58CC02] fill-current">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              }
              label="Sound Effects"
              description="Plays audio feedback during lessons"
              right={<Toggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1CB0F6] fill-current">
                  <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
              }
              label="Listening Exercises"
              description="Includes audio-based questions in lessons"
              right={<Toggle enabled={listeningExercises} onToggle={() => setListeningExercises(!listeningExercises)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF9600] fill-current">
                  <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                </svg>
              }
              label="Speaking Exercises"
              description="Microphone required for pronunciation"
              right={<Toggle enabled={speakingExercises} onToggle={() => setSpeakingExercises(!speakingExercises)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#CE82FF] fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              }
              label="Auto-advance"
              description="Automatically moves to next exercise after correct answer"
              right={<Toggle enabled={autoplay} onToggle={() => setAutoplay(!autoplay)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00CD9C] fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              }
              label="Animations"
              description="Enable UI transitions and celebratory effects"
              right={<Toggle enabled={animationsEnabled} onToggle={() => setAnimationsEnabled(!animationsEnabled)} />}
            />
          </SettingsSection>

          {/* ── NOTIFICATIONS ─────────────────────────────────── */}
          <SettingsSection title="Notifications">
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF9600] fill-current">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              }
              label="Lesson Reminders"
              description="Daily nudges to keep your streak alive"
              right={<Toggle enabled={notifLessons} onToggle={() => setNotifLessons(!notifLessons)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF4B4B] fill-current">
                  <path d="M17.66 11c-.11-.19-.24-.37-.39-.54-.42-.48-1.01-.84-1.63-.98C14.22 9.25 13 9 12 9c-1 0-2.22.25-3.64.48-.62.14-1.21.5-1.63.98-.15.17-.28.35-.39.54C6.12 11.37 6 11.68 6 12c0 2.76 2.69 5 6 5s6-2.24 6-5c0-.32-.12-.63-.34-.89z" />
                </svg>
              }
              label="Streak Alerts"
              description="Warns you before your streak is at risk"
              right={<Toggle enabled={notifStreak} onToggle={() => setNotifStreak(!notifStreak)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FFC800] fill-current">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              }
              label="Leaderboard Updates"
              description="Rankings and position changes"
              right={<Toggle enabled={notifLeaderboard} onToggle={() => setNotifLeaderboard(!notifLeaderboard)} />}
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1CB0F6] fill-current">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
              label="Email Newsletter"
              description="Tips, learning insights and product updates"
              right={<Toggle enabled={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} />}
            />
          </SettingsSection>

          {/* ── ABOUT & LEGAL ─────────────────────────────────── */}
          <SettingsSection title="About & Legal">
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#AFAFAF] fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              }
              label="Terms of Service"
              right={
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#52565D] fill-current">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              }
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#AFAFAF] fill-current">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              }
              label="Privacy Policy"
              right={
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#52565D] fill-current">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              }
            />
            <SettingsRow
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#AFAFAF] fill-current">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
                </svg>
              }
              label="App Version"
              description="Duolingo Clone v1.0.0"
            />
          </SettingsSection>

          {/* ── DANGER ZONE ───────────────────────────────────── */}
          <SettingsSection title="Danger Zone">
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4B4B]/10 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF4B4B] fill-current">
                    <path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.52 1.11-2.8 2.57-3.06L8.73 11H8v2h2.73l2 2H8v1.9h5.46l2.01 2.01L17 17.73 3.27 4 2 4.27z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Sign Out</p>
                  <p className="text-[#AFAFAF] text-xs font-semibold mt-0.5">Sign out of your account on this device</p>
                </div>
              </div>
              <Link
                href="/logout"
                className="px-5 py-2.5 bg-[#FF4B4B]/10 border-2 border-[#FF4B4B]/20 text-[#FF4B4B] font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-[#FF4B4B]/20 transition-colors"
              >
                SIGN OUT
              </Link>
            </div>
          </SettingsSection>

          {/* Save Button */}
          <div className="pb-8">
            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#58CC02] border-b-4 border-[#46A302] text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
            >
              Save Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
