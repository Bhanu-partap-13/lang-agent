import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#131F24] px-4 font-sans text-white">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-12 text-center md:flex-row md:text-left">
        <div className="flex-1 flex justify-center">
          {/* We can use a simple placeholder or an image if available */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
             <div className="w-full h-full rounded-full bg-[#1CB0F6] flex items-center justify-center text-8xl font-bold">
               🦉
             </div>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
          <h1 className="max-w-sm text-3xl font-bold leading-snug text-white md:text-4xl">
            The free, fun, and effective way to learn a language!
          </h1>
          
          <div className="flex w-full max-w-sm flex-col gap-4 mt-4">
            <Link 
              href="/sign-up"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#58CC02] px-5 font-bold text-white shadow-[0_4px_0_0_#58A700] transition-all hover:bg-[#46A302] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#58A700]"
            >
              GET STARTED
            </Link>
            
            <Link 
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-[#37464F] bg-transparent px-5 font-bold text-[#1CB0F6] shadow-[0_4px_0_0_#37464F] transition-all hover:bg-[#202F36] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#37464F]"
            >
              I ALREADY HAVE AN ACCOUNT
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

