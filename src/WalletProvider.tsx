import {
  WalletAdapterNetwork,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import { FC, PropsWithChildren, useMemo } from "react";

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          {/* <WalletDisconnectButton /> */}
          <WalletConnect>{children}</WalletConnect>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

// export const WalletProvider = createContext(
//   null as Awaited<ProviderConnectReturnType> | null,
// );

const DisabledWalletStates = [
  WalletReadyState.NotDetected,
  WalletReadyState.Unsupported,
];

const WalletConnect = ({ children }: PropsWithChildren) => {
  const { wallets } = useWallet();

  const isEveryWalletsDisabled = wallets.every((wallet) =>
    DisabledWalletStates.includes(wallet.readyState),
  );
  return (
    <>
      {isEveryWalletsDisabled ? (
        <div className="p-4 rounded-2xl bg-red-300 text-red-400">
          <span className="text-red-900">Phantom wallet is not available</span>{" "}
          <a
            className="block mt-4 text-slate-800"
            href="https://phantom.app/"
            target="_blank"
          >
            Go to https://phantom.app/ to install it
          </a>{" "}
        </div>
      ) : (
        children
      )}
    </>
  );
};
