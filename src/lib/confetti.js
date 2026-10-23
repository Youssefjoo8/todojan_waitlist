import confetti from "canvas-confetti";

/**
 * Fires confetti using a dynamically created canvas that runs on a worker thread.
 * Once the confetti animation loop finishes, the canvas is cleanly destroyed and
 * removed from the DOM to free resources immediately.
 * 
 * @param {Object} options - Standard canvas-confetti configuration options
 */
export function fireConfetti(options) {
  if (typeof window === "undefined") return;

  // Enforce a particle ceiling on mobile viewports (< 1024px)
  const finalOptions = { ...options };
  if (window.innerWidth < 1024) {
    if (typeof finalOptions.particleCount === "number") {
      finalOptions.particleCount = Math.min(finalOptions.particleCount, 20);
    } else {
      finalOptions.particleCount = 15;
    }
  }

  // Create a dedicated, clean canvas element for this confetti trigger
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  // Initialize the confetti instance on the dedicated canvas
  // useWorker: true delegates rendering/calculations to a background thread
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });

  // Execute confetti trigger
  myConfetti(finalOptions)
    .then(() => {
      // Clean up memory and remove from DOM
      myConfetti.reset();
      canvas.remove();
    })
    .catch((err) => {
      console.error("Confetti rendering error: ", err);
      // Fallback cleanup in case of error
      try {
        canvas.remove();
      } catch (_) {}
    });
}
