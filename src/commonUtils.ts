export const sleepBetweenMs = async (min: number, max: number): Promise<void> => {
  const sleepTime = Math.floor(Math.random() * (max - min + 1) + min);
  await new Promise((resolve) => setTimeout(resolve, sleepTime));
};
