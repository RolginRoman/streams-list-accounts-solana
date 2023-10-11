import { useContext } from "react";
import { CreateNewStreamForm } from "./CreateNewStreamForm";
import { WalletProvider } from "./WalletProvider";
/*
 * const data: Types.IGetAllData = {
  address: "99h00075bKjVg000000tLdk4w42NyG3Mv0000dc0M99",
  type: Types.StreamType.All,
  direction: Types.StreamDirection.All,
};

try {
  const streams = client.get(data);
} catch (exception) {
  // handle exception
}
 */
export const Streams = () => {
  const walletProvider = useContext(WalletProvider);
  const currentWalletAddress = walletProvider?.publicKey.toString();

  return (
    <>
      {currentWalletAddress && (
        <div className="flex flex-col w-full">
          <div>Current Address: </div>
          <div>{currentWalletAddress}</div>
        </div>
      )}
      <section className="w-1/2 mx-auto">
        <CreateNewStreamForm></CreateNewStreamForm>
      </section>
    </>
  );
};
