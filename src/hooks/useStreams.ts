import { useWallet } from "@solana/wallet-adapter-react";
import { Types } from "@streamflow/stream";
import { useCallback, useEffect, useState } from "react";
import { useStreamflowClient } from "./useClient";

export const useStreams = () => {
  const { publicKey } = useWallet();
  const client = useStreamflowClient();
  const [isLoading, setLoading] = useState(false);
  const [streams, setStreams] = useState(
    null as [string, Types.Stream][] | null,
  );

  const loadStreams = useCallback(() => {
    if (!publicKey || !client) {
      return;
    }
    const streamsRequestData = {
      address: publicKey.toString(),
      type: Types.StreamType.All,
      direction: Types.StreamDirection.All,
    } as Types.IGetAllData;

    setLoading(true);
    client
      .get(streamsRequestData)
      .then((data) => setStreams(data))
      .finally(() => setLoading(false));
  }, [publicKey, client]);

  useEffect(() => loadStreams(), [loadStreams]);

  return { streams, reload: loadStreams, isLoading };
};
