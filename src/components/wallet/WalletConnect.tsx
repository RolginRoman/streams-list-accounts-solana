import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PropsWithChildren } from "react";

const DisabledWalletStates = [
  WalletReadyState.NotDetected,
  WalletReadyState.Unsupported,
];

export const WalletConnect = ({ children }: PropsWithChildren) => {
  const { wallets, publicKey } = useWallet();

  const isEveryWalletsDisabled = wallets.every((wallet) =>
    DisabledWalletStates.includes(wallet.readyState),
  );

  if (isEveryWalletsDisabled) {
    return (
      <div className="my-3 mx-2 p-4 rounded-2xl bg-red-100 border border-red-600  max-w-md">
        <span>❗️ Phantom wallet is not available</span>
        <span className="block mt-4">
          Refer to official site for installation:{" "}
          <a
            className=" text-blue-700"
            href="https://phantom.app/"
            target="_blank"
          >
            phantom.app
          </a>
        </span>
      </div>
    );
  }

  return (
    <div className="m-2">
      <WalletMultiButton style={{ height: "2rem" }} />
      {publicKey ? (
        children
      ) : (
        <div className="my-2">Please connect your wallet</div>
      )}
    </div>
  );
};
