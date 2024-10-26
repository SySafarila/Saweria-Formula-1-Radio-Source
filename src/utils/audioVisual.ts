const audioVisuals = document.querySelectorAll("#audio-visual div");
let intervals: NodeJS.Timeout[] = [];

export const startAudioVisual = () => {
  audioVisuals.forEach((el) => {
    const intervalId = setInterval(() => {
      el.setAttribute("style", `height: ${Math.random() * 100}%`);
    }, 150);
    intervals.push(intervalId);
  });
};

export const stopAudioVisual = () => {
  audioVisuals.forEach((el) => {
    el.setAttribute("style", "height: 5%");
  });

  intervals.forEach((interval) => {
    clearInterval(interval);
  });
  intervals = [];
};
