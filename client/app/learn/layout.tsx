import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#131F24" }}>
      <Sidebar />
      <div className="flex-1 lg:pl-[250px] lg:pr-[360px] relative">
        <main className="w-full h-full flex flex-col pt-6">
          {children}
        </main>
      </div>
      <RightPanel />
    </div>
  );
}
