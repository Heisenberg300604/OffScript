import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getTopicById } from "@/lib/queries/challenges";
import RecordingClient from "./recording-client";

export const metadata: Metadata = { title: "Speaking challenge — OffScript" };

export const dynamic = "force-dynamic";

export default async function RecordingPage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string }>;
}) {
  await requireUser();

  const { topicId } = await searchParams;
  if (!topicId) redirect("/dashboard");

  // Resolved server-side so the page can't be opened with arbitrary topic text.
  const topic = await getTopicById(topicId);
  if (!topic) redirect("/dashboard");

  return <RecordingClient topicId={topic.id} topicPrompt={topic.prompt} />;
}
