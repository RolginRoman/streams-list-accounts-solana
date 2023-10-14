import { TokensAccountsProvider } from "./components/accounts/TokenAccountsProvider";
import { StreamflowClientProvider } from "./components/solana/StreamflowClientProvider";
import { TokensMapProvider } from "./components/tokens/TokensMapProvider";
import { Streams } from "./components/streams/Streams";
import { WalletProvider } from "./components/wallet/WalletProvider";

export default function App() {
  return (
    <WalletProvider>
      <StreamflowClientProvider>
        <TokensMapProvider>
          <TokensAccountsProvider>
            <Streams />
          </TokensAccountsProvider>
        </TokensMapProvider>
      </StreamflowClientProvider>
    </WalletProvider>
  );
}
