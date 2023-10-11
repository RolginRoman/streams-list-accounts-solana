import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  RpcResponseAndContext,
} from "@solana/web3.js";
import { StreamflowSolana, Types } from "@streamflow/stream";
import { useEffect, useState } from "react";
import { CreateNewStreamForm } from "./CreateNewStreamForm";
import { useTokensList, useTokensMap } from "./hooks";

const solanaClient = new StreamflowSolana.SolanaStreamClient(
  // "entrypoint.devnet.solana.com:8001",
  "https://api.devnet.solana.com",
);

const getAllStreams = async (walletAddress: string) => {
  const data: Types.IGetAllData = {
    address: walletAddress,
    type: Types.StreamType.All,
    direction: Types.StreamDirection.All,
  };

  try {
    return solanaClient.get(data);
  } catch (exception) {
    // handle exception
  }
};

export const Streams = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [streams, setStreams] = useState(
    undefined as [string, Types.Stream][] | undefined,
  );
  const [balance, setBalance] = useState(
    undefined as RpcResponseAndContext<number> | undefined,
  );

  // useEffect(() => {
  //   if (publicKey && connection) {
  //     const ownerPk = new PublicKey(publicKey);
  //     connection
  //       .getBalanceAndContext(ownerPk)
  //       .then((balance) => setBalance(balance));
  //     // console.log("Balance", connection.getBalance(ownerPk));

  //     Promise.all([
  //       connection.getTokenAccountsByOwner(ownerPk, {
  //         programId: TOKEN_PROGRAM_ID,
  //       }),
  //     ]).then(([accounts]) => {
  //       console.log("Accounts", accounts);

  //       return connection
  //         .getMultipleParsedAccounts([
  //           ownerPk,
  //           ...accounts.value.map((account) => account.pubkey),
  //         ])
  //         .then((mints) => {
  //           console.log("Resolve mints", mints);
  //         });

  //       // return connection
  //       //   .getMultipleAccountsInfoAndContext(
  //       //     accounts.value.map(
  //       //       (account) =>
  //       //         new PublicKey(account.account.data.parsed.info.mint),
  //       //     ),
  //       //   )
  //       //   .then((mints) => console.log("Resolve mints", mints));

  //       // return Promise.allSettled(
  //       //   accounts.value.map((account) => {
  //       //     console.log(
  //       //       "mint address",
  //       //       account.account.data.parsed.info.mint,
  //       //     );
  //       //     return connection.getAccountInfo(
  //       //       new PublicKey(account.account.data.parsed.info.mint),
  //       //     );
  //       //   }),
  //       // ).then((mints) => console.log("Resolve mints", mints));
  //     });

  //     // connection
  //     //   .getProgramAccounts(ownerPk, {
  //     //     filters: [
  //     //       {
  //     //         dataSize: 17,
  //     //       },
  //     //       {
  //     //         memcmp: {
  //     //           offset: 4,
  //     //           bytes: "3Mc6vR",
  //     //         },
  //     //       },
  //     //     ],
  //     //   })
  //     //   .then((accounts) => console.log("Program Accounts", accounts));
  //   }
  // }, [publicKey, connection]);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    getAllStreams(publicKey.toString()).then((streams) => setStreams(streams));
  }, [publicKey]);

  return (
    <>
      {publicKey && (
        <div className="flex flex-col w-full">
          <div>Current Address (Solana) publicKey: </div>
          <div>{publicKey.toString()}</div>
        </div>
      )}
      {balance && (
        <div className="flex flex-col w-full">
          <div>Balance: </div>
          <div>{JSON.stringify(balance)}</div>
          <div>{balance.value / LAMPORTS_PER_SOL}</div>
        </div>
      )}
      <section className="w-3/4">
        <CreateNewStreamForm></CreateNewStreamForm>
      </section>
      {streams?.length && <div>{JSON.stringify(streams)}</div>}
    </>
  );
};
