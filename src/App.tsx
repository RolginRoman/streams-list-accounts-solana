import { Streams } from "./Streams";
import { WalletConnect } from "./WalletProvider";


function App() {
  return (
    <div className="m-2">
      <WalletConnect>
        <Streams />
      </WalletConnect>
    </div>
  );
}

export default App;
