import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LearningPath from "@/components/LearningPath";

export default async function LearnPage() {
  // Fetch session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <LearningPath />
    </>
  );
}
