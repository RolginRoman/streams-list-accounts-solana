export const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;
    // TODO where to get actual phantom integration typings
    if (provider?.isPhantom) {
      return provider;
    }
  }

  throw new Error("Phantom wallet is not installed");
};

export type ProviderConnectReturnType = ReturnType<
  ReturnType<typeof getProvider>["connect"]
>;

export const connectToWallet: () => ProviderConnectReturnType = () => {
  return new Promise((resolve, reject) => {
    try {
      const provider = getProvider();
      provider
        .connect()
        .then((data) => resolve(data))
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
