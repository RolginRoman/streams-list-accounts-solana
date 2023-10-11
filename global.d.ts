export declare global {
  interface Window {
    // TODO where to get actual phantom integration typings
    phantom: {
      solana: {
        isPhantom: boolean;
        connect: () => Promise<{ publicKey: string }>;
      };
    };
  }
}
