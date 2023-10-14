import { TokensAccountsContextProvider } from "./components/accounts/TokenAccountsContext";
import { StreamflowClientWrapper } from "./components/solana/StreamflowClientWrapper";
import { TokensMapProvider } from "./components/tokens/TokensMapContext";
import { Streams } from "./components/streams/Streams";
import { WalletProvider } from "./components/wallet/WalletProvider";

export default function App() {
  return (
    <WalletProvider>
      <StreamflowClientWrapper>
        <TokensMapProvider>
          <TokensAccountsContextProvider>
            <Streams />
          </TokensAccountsContextProvider>
        </TokensMapProvider>
      </StreamflowClientWrapper>
    </WalletProvider>
  );
}
