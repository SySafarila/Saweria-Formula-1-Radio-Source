const obsDetector = (): boolean => {
  const userAgent = window.navigator.userAgent;
  if (userAgent.includes("OBS")) {
    return true;
  }
  return false;
};

export default obsDetector;
