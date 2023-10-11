import { PropsWithChildren, createContext } from "react";

import { useEffect, useState } from "react";
import {
  ProviderConnectReturnType,
  connectToWallet,
  getProvider,
} from "./phantom-provider";

import {
  Web3ReactHooks,
  Web3ReactProvider,
  initializeConnector,
} from "@web3-react/core";
import { Connector, Web3ReactStore } from "@web3-react/types";
import { Phantom } from "web3-react-phantom";

const phantom = initializeConnector<Phantom>(
  (actions) => new Phantom({ actions }),
);

const connectors: [Connector, Web3ReactHooks, Web3ReactStore][] = [phantom];
const connections: [Connector, Web3ReactHooks][] = connectors.map(
  ([connector, hooks]) => [connector, hooks],
);

export const WalletProvider = createContext(
  null as Awaited<ProviderConnectReturnType> | null,
);

export const WalletConnect = ({ children }: PropsWithChildren) => {
  const [isWalletNotAvailable, setWalletIsNotAvailable] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    try {
      connectToWallet()
        .then(() => {
          // @ts-expect-error adapter types
          setProvider(getProvider());
          // solanaClient
          //   .create(createStreamParams, solanaParams())
          //   .then(({ ixs, txId, metadataId }) => {
          //     console.log(ixs, txId, metadataId);
          //   })
          //   .catch((error) => {
          //     setWalletIsNotAvailable(error);
          //   }); // second argument differ depending on a chain
        })
        .catch((error) => {
          setWalletIsNotAvailable(error);
        });
    } catch (exception) {
      // handle exception
      console.error(exception);
    }
  }, []);

  return (
    <Web3ReactProvider connectors={connections}>
      <WalletProvider.Provider value={provider}>
        {isWalletNotAvailable ? (
          <div className="p-4 rounded-2xl bg-red-300 text-red-400">
            <span className="text-red-900">
              Phantom wallet is not available
            </span>{" "}
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
      </WalletProvider.Provider>
    </Web3ReactProvider>
  );
};
