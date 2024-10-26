const startDelay = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Success!");
    }, ms);
  });
};

export default startDelay;
