import { useWallet } from "@solana/wallet-adapter-react";

import { StreamflowSolana, Types, getBN } from "@streamflow/stream";
import BN from "bn.js";
import { useForm } from "react-hook-form";

const solanaClient = new StreamflowSolana.SolanaStreamClient(
  // "entrypoint.devnet.solana.com:8001",
  "https://api.devnet.solana.com",
);

const createStreamParams: Types.ICreateStreamData = {
  recipient: "FrzJcAWGyMnfYb6imyjb85Qs4LB8gmswNnb7tsf1JTDw", // Recipient address.
  tokenId: "DNw99999M7e24g99999999WJirKeZ5fQc6KY999999gK", // Token mint address.
  start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
  amount: getBN(100, 9), // depositing 100 tokens with 9 decimals mint.
  period: 1, // Time step (period) in seconds per which the unlocking occurs.
  cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
  cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
  amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
  name: "Transfer to Jane Doe.", // The stream name or subject.
  canTopup: false, // setting to FALSE will effectively create a vesting contract.
  cancelableBySender: true, // Whether or not sender can cancel the stream.
  cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
  transferableBySender: true, // Whether or not sender can transfer the stream.
  transferableByRecipient: false, // Whether or not recipient can transfer the stream.
  automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
  withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
  // partner: null, //  (optional) Partner's wallet address (string | null).
};

const solanaParams: () => StreamflowSolana.ICreateStreamSolanaExt = () => {
  return {
    sender:
      null as unknown as StreamflowSolana.ICreateStreamSolanaExt["sender"], // SignerWalletAdapter or Keypair of Sender account
  };
};

// const provider = getProvider(); // see "Detecting the Provider"
// try {
//   const resp = await provider.connect();
//   console.log(resp.publicKey.toString());
//   // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
// } catch (err) {
//   // { code: 4001, message: 'User rejected the request.' }
// }
type FormValues = Pick<
  Types.ICreateStreamData,
  "recipient" | "canTopup" | "name" | "amount"
>;

export const CreateNewStreamForm = () => {
  const { publicKey } = useWallet();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      recipient: "",
      canTopup: false,
    },
  });

  const onCreateNewStream = (data: FormValues) => {
    console.log(data);
    console.log(publicKey?.toString());
  };

  return (
    <form
      onSubmit={form.handleSubmit(onCreateNewStream)}
      className="space-y-4 mt-6 w-full"
    >
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Stream name
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Stream name"
              required
              {...form.register("name")}
            />
          </div>
        </div>
      </label>

      <label className="block text-sm font-medium leading-6 text-gray-900">
        Recipient Address
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Recipient address"
              required
              {...form.register("recipient")}
            />
          </div>
        </div>
      </label>

      <label className="block text-sm font-medium leading-6 text-gray-900">
        Enable Top-up
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            {...form.register("canTopup")}
          />
        </div>
      </label>
      <button className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700">
        Create stream
      </button>
    </form>
  );
};
