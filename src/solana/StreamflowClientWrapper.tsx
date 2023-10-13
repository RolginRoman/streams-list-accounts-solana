import { clusterApiUrl } from "@solana/web3.js";
import { StreamflowSolana } from "@streamflow/stream";
import { FC, PropsWithChildren, useMemo } from "react";
import { StreamflowClient } from "../hooks/useClient";
import { ICluster } from "@streamflow/stream/dist/common/types";

export const StreamflowClientWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  const client = useMemo(() => {
    return new StreamflowSolana.SolanaStreamClient(
      clusterApiUrl("devnet"),
      ICluster.Devnet,
    );
  }, []);

  return (
    <StreamflowClient.Provider value={client}>
      {children}
    </StreamflowClient.Provider>
  );
};
