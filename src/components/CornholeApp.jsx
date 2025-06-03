import { useState } from "react";
import VideoRoundRecorder from "./VideoRoundRecorder";

export default function CornholeApp() {
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

  return (
    <VideoRoundRecorder
      recordedBlobUrl={recordedBlobUrl}
      setRecordedBlobUrl={setRecordedBlobUrl}
    />
  );
}