import { clusterApiUrl } from "@solana/web3.js";
import { StreamflowSolana, Types } from "@streamflow/stream";
import { FC, PropsWithChildren } from "react";
import { StreamflowClient } from "../../hooks/useClient";

const cluster = Types.ICluster.Devnet;
const client = new StreamflowSolana.SolanaStreamClient(
  clusterApiUrl(cluster),
  cluster,
);

export const StreamflowClientProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <StreamflowClient.Provider value={client}>
      {children}
    </StreamflowClient.Provider>
  );
};
