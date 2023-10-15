import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PropsWithChildren } from "react";
import { WalletUnavailableMessage } from "./WalletUnavailableMessage";

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
    return <WalletUnavailableMessage />;
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
