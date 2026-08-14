"use client";

import React, { useState, useEffect, use } from "react";
import { LessonLoader } from "@/components/LessonLoader";
import { LessonPlayer } from "@/components/LessonPlayer";
import { useQuery } from "@tanstack/react-query";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  // Un-wrap params using React.use for Next.js 15+ App Router
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);

  // Fetch exercises using TanStack Query
  const { data, isLoading: isQueryLoading, error } = useQuery({
    queryKey: ["lesson-exercises", resolvedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/lessons/${resolvedParams.id}/exercises`);
      if (!res.ok) throw new Error("Failed to fetch exercises");
      return res.json();
    },
  });

  useEffect(() => {
    // Artificial 3-second loader screen delay to match Duolingo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show the loader until both the 3s artificial timer AND the data fetch are complete
  if (loading || isQueryLoading) {
    return <LessonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold text-[#FF4B4B] mb-4">Failed to load lesson</h1>
          <p className="text-[#AFAFAF]">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.exercises || data.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center p-6 text-center text-white">
        <h1 className="text-2xl font-bold text-[#FFC800]">No exercises found for this lesson!</h1>
      </div>
    );
  }

  // Once loaded, mount the Lesson Player
  return <LessonPlayer lessonId={resolvedParams.id} exercises={data.exercises} />;
}
