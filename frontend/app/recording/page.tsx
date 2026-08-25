import { Suspense } from "react";
import RecordingClient from "./recording-client";

export default function RecordingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground font-semibold">Loading practice session...</div>}>
      <RecordingClient />
    </Suspense>
  );
}
