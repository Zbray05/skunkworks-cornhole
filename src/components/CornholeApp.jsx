import { useState } from "react";
import VideoRoundRecorder from "./VideoRoundRecorder";
import Scoreboard from "./Scoreboard";

export default function CornholeApp() {
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);

  return (
    <div style={{background: "#FAF5EA", padding: "20px", maxWidth: "800px", margin: "auto"}}>
      <VideoRoundRecorder
        recordedBlobUrl={recordedBlobUrl}
        setRecordedBlobUrl={setRecordedBlobUrl}
      />
      <Scoreboard />
    </div>
  );
}