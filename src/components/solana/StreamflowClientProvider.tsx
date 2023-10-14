import { clusterApiUrl } from "@solana/web3.js";
import { StreamflowSolana } from "@streamflow/stream";
import { ICluster } from "@streamflow/stream/dist/common/types";
import { FC, PropsWithChildren } from "react";
import { StreamflowClient } from "../../hooks/useClient";

const client = new StreamflowSolana.SolanaStreamClient(
  clusterApiUrl("devnet"),
  ICluster.Devnet,
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
