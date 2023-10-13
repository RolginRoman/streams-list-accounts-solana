import { StreamflowSolana } from "@streamflow/stream";
import { createContext, useContext } from "react";

export const StreamflowClient = createContext(
  null as null | StreamflowSolana.SolanaStreamClient,
);

export const useStreamflowClient = () => {
  return useContext(StreamflowClient);
};
