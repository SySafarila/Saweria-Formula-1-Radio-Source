import makeDistortionCurve from "./makeDistortionCurve";

const makeRadioEffect = (audio: HTMLAudioElement): AudioContext => {
  const lowpassValue = 3000;
  const highpassValue = 500;
  const distortionValue = 200;

  const audioContext = new window.AudioContext();
  const source = audioContext.createMediaElementSource(audio);

  const lowpassFilter = audioContext.createBiquadFilter();
  lowpassFilter.type = "lowpass";
  lowpassFilter.frequency.value = lowpassValue;

  const highpassFilter = audioContext.createBiquadFilter();
  highpassFilter.type = "highpass";
  highpassFilter.frequency.value = highpassValue;

  const distortion = audioContext.createWaveShaper();
  distortion.curve = makeDistortionCurve(distortionValue);
  distortion.oversample = "4x";

  source.connect(highpassFilter);
  highpassFilter.connect(lowpassFilter);
  lowpassFilter.connect(distortion);
  distortion.connect(audioContext.destination);

  return audioContext;
};

export default makeRadioEffect;
