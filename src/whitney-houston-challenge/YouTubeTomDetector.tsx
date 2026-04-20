import YouTube from "react-youtube";
import { useEffect, useRef, useState } from "react";
import { initYouTubePlayer } from "@/components/hooks/initYouTubePlayer";

interface YouTubeTomDetectorProps {
  videoId: string;
  tomTimestamp: number;
  onTomHit?: () => void;
}

export default function YouTubeTomDetector({
  videoId,
  tomTimestamp,
  onTomHit
}: YouTubeTomDetectorProps) {
  const START_TIME_SECONDS = 176;
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "fail" | null>(null);
  const [offByText, setOffByText] = useState<string | null>(null);
  const [isTomLocked, setIsTomLocked] = useState(false);
  const [requiresReapply, setRequiresReapply] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floorTomAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/drums/A2.mp3");
    audio.preload = "auto";
    floorTomAudioRef.current = audio;

    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
      floorTomAudioRef.current = null;
    };
  }, []);

  const formatTimingDifference = (diffSeconds: number) => {
    const absSeconds = Math.abs(diffSeconds);

    if (absSeconds >= 60) {
      return `${(absSeconds / 60).toFixed(2)} minutes`;
    }

    if (absSeconds >= 1) {
      return `${absSeconds.toFixed(2)} seconds`;
    }

    return `${Math.round(absSeconds * 1000)} milliseconds`;
  };

  const showSuccessFeedback = (diffSeconds: number) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }

    setIsTomLocked(true);
    setOffByText(formatTimingDifference(diffSeconds));
    setFeedback("success");
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setOffByText(null);
      feedbackTimerRef.current = null;
      unlockTimerRef.current = setTimeout(() => {
        setIsTomLocked(false);
        unlockTimerRef.current = null;
      }, 500);
    }, 1800);
  };

  const showFailFeedback = (diffSeconds: number) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }

    setIsTomLocked(true);
    setRequiresReapply(true);
    setOffByText(formatTimingDifference(diffSeconds));
    setFeedback("fail");
  };

  const handleReady = (event: any) => {
    playerRef.current = initYouTubePlayer(event, { width: 640, height: 390 });
    playerRef.current.cueVideoById({ videoId, startSeconds: START_TIME_SECONDS });
    playerRef.current.pauseVideo();
    setReady(true);
  };

  const handleApplyAgain = () => {
    if (!playerRef.current) return;
    playerRef.current.pauseVideo();
    playerRef.current.seekTo(START_TIME_SECONDS, true);
    setFeedback(null);
    setOffByText(null);
    setRequiresReapply(false);
    setIsTomLocked(false);
  };

  const onTime = () => {
    if (isTomLocked) return;

    const floorTomAudio = floorTomAudioRef.current;
    if (floorTomAudio) {
      floorTomAudio.currentTime = 0;
      floorTomAudio.play().catch((error) => {
        console.error("Floor tom playback failed:", error);
      });
    }

    if (!playerRef.current) return;

    const time = playerRef.current.getCurrentTime();
    const diff = tomTimestamp - time;

    if (Math.abs(diff) < 0.1) {
      console.log("YOU DID IT", time);
      onTomHit?.();
      showSuccessFeedback(diff);
    } else if (diff > 0) {
      console.log("Too early...", time);
      playerRef.current.pauseVideo();
      showFailFeedback(diff);
    } else {
      console.log("Too late...", time);
      playerRef.current.pauseVideo();
      showFailFeedback(diff);
    }
  };

  return (
    <>
      
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-6 text-center transition-all duration-500 ${
          requiresReapply ? "pointer-events-auto" : "pointer-events-none"
        } ${
          feedback ? "opacity-100" : "opacity-0"
        } ${feedback === "success" ? "bg-[rgba(22,101,52,0.72)]" : feedback === "fail" ? "bg-[rgba(153,27,27,0.72)]" : "bg-transparent"}`}
      >
        {feedback === "fail" ? (
          <div className="flex flex-col items-center gap-6">
            <p className="animate-pulse text-4xl font-extrabold tracking-wide text-white drop-shadow-lg md:text-6xl">
              YOU'RE FIRED!!!
            </p>
            {offByText ? (
              <p className="text-lg font-semibold text-red-50 md:text-2xl">
                You were off by {offByText}.
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleApplyAgain}
              className="rounded-xl bg-white px-6 py-3 text-base font-bold text-red-700 shadow-lg transition hover:bg-red-50"
            >
              Apply Again?
            </button>
          </div>
        ) : null}

        {feedback === "success" ? (
          <div className="flex flex-col items-center gap-4">
            <p className="animate-pulse text-3xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl">
              Great job!
              <br />
              You can keep the job ☺
            </p>
            {offByText ? (
              <p className="text-base font-semibold text-green-50 md:text-xl">
                You were off by {offByText}.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="text-center mb-4">
        YouTube Player Status: {ready ? "Ready" : "Loading..."}
      </div>

      <div className="flex justify-center">
        <YouTube
          videoId={videoId}
          opts={{
            width: 640,
            height: 390,
            playerVars: {
              autoplay: 0,
              rel: 0,
              modestbranding: 1,
            }
          }}
          onReady={handleReady}
          onError={(e) => console.log("YT error:", e)}
        />
      </div>

      <svg
        width="100"
        height="100"
        viewBox="120 300 320 360"
        className={`mx-auto mt-4 ${isTomLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer"} focus:outline-none active:scale-[0.98] transition-transform duration-150`}
        onClick={onTime}
        role="button"
        tabIndex={isTomLocked ? -1 : 0}
        aria-disabled={isTomLocked}
        onKeyDown={(event) => {
          if (isTomLocked) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onTime();
          }
        }}
      >
        <g id="Floor-Tom" className="">
          <g id="Floor-Tom-Drum">
            <path d="M160.34,314.87H402.83V585.25H160.34V314.87Z" transform="translate(-0.23)" fill="#eb495d" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
            <path d="M399.45,339.38H163.72" transform="translate(-0.23)" fill="none" stroke="#e61c35" strokeMiterlimit="10" strokeWidth="8"></path>
            <g>
              <path d="M167.1,367.26a6.76,6.76,0,0,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Zm242.49,0a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <path d="M241.45,343.6v-11" transform="translate(-0.23)" fill="none" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
              <path d="M248.21,367.26a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <g>
                <path d="M321.72,343.6v-11" transform="translate(-0.23)" fill="none" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
                <path d="M328.48,367.26a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              </g>
            </g>
            <path d="M152.74,314.87H409.59v17.74H152.74V314.87Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
            <path d="M156.12,327.55h250.1" transform="translate(-0.23)" fill="none" stroke="#bcece8" strokeMiterlimit="10" strokeWidth="4"></path>
            <g>
              <g>
                <path d="M409.59,549.76a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Zm-242.49,0a6.76,6.76,0,0,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
                <path d="M321.72,556.52v11" transform="translate(-0.23)" fill="none" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
                <path d="M328.48,549.76a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
                <g>
                  <path d="M241.45,556.52v11" transform="translate(-0.23)" fill="none" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
                  <path d="M248.21,549.76a6.76,6.76,0,1,1-13.52,0v-16.9a6.76,6.76,0,0,1,13.52,0v16.9Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
                </g>
              </g>
              <path d="M153.58,567.51H410.44v17.74H153.58V567.51Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
              <path d="M157,580.18h250.1" transform="translate(-0.23)" fill="none" stroke="#bcece8" strokeMiterlimit="10" strokeWidth="4"></path>
            </g>
          </g>
          <g id="Floor-Tom-Legs">
            <path d="M147.92,521.71l-9.55,44.53v64.38a4.73,4.73,0,0,0,4.65,4.82,4.67,4.67,0,0,0,4.65-4.82V567.25l9.55-44.53,9.38-44.53,3-14-9.21-1.86-12.42,59.4h0Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
            <path d="M153.92,625l-5.75-9.29h-9.29L133.3,625a11.43,11.43,0,0,0-1.69,6.17,12,12,0,0,0,12,12,12.13,12.13,0,0,0,12-12.17,14.12,14.12,0,0,0-1.69-6h0Z" transform="translate(-0.23)" fill="#5c5c5c" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
            <path d="M170.48,429.78a8.88,8.88,0,0,0-17.74,0v49h17.74v-49Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
            <g>
              <path d="M278.63,630.62a4.73,4.73,0,0,0,4.65,4.82,4.67,4.67,0,0,0,4.65-4.82V477.1h-9.29V630.62Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <path d="M294.18,625l-5.75-9.29h-9.29L273.56,625a11.43,11.43,0,0,0-1.69,6.17,12,12,0,0,0,12,12,12.13,12.13,0,0,0,12-12.17,14.12,14.12,0,0,0-1.69-6h0Z" transform="translate(-0.23)" fill="#5c5c5c" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <path d="M292.15,429.78a8.88,8.88,0,0,0-17.74,0v49h17.74v-49Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
            </g>
            <g>
              <path d="M416,521.71l-12-59.57L395,464l2.87,14,9,44.53,8.79,44.53v63.37a4.73,4.73,0,0,0,4.65,4.82,4.67,4.67,0,0,0,4.65-4.82V566.07L416,521.71h0Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <path d="M431.05,625l-5.75-9.29H416L410.44,625a11.43,11.43,0,0,0-1.69,6.17,12,12,0,0,0,12,12,12.13,12.13,0,0,0,12-12.17,14.12,14.12,0,0,0-1.69-6h0Z" transform="translate(-0.23)" fill="#5c5c5c" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
              <path d="M392.7,429.78a8.88,8.88,0,0,1,17.74,0v49H392.7v-49Z" transform="translate(-0.23)" fill="#eefaf9" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6"></path>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}
