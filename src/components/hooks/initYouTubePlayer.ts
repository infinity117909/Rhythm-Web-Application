export function initYouTubePlayer(event: any, {
  width = 640,
  height = 390
} = {}) {
  const player = event.target;

  // Resize iframe
  try {
    const iframe = player.getIframe();
    iframe.width = width;
    iframe.height = height;
  } catch (err) {
    console.warn("Could not resize iframe:", err);
  }

  console.log("YouTube Player Ready");

  return player;
}
