import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { StreamflowSolana, Types, getBN } from "@streamflow/stream";
import { useCallback, useEffect, useState } from "react";
import { CreateStreamRequest } from "../types";
import { minutesFromNow, minutesInSeconds } from "../utils/time";
import { useStreamflowClient } from "./useClient";

const SPREAD_PERIODS_COUNT = 10;

const createSolanaParams = (wallet: Wallet) => {
  return {
    sender: wallet.adapter,
  } as StreamflowSolana.ICreateStreamSolanaExt;
};

const getCreateStreamRequestParams = (
  data: CreateStreamRequest,
): Types.ICreateStreamData => {
  const predefinedCreateStreamParams: Omit<
    Types.ICreateStreamData,
    keyof CreateStreamRequest | "start" | "period" | "amountPerPeriod"
  > = {
    cliffAmount: getBN(0, 0),
    cliff: 0,
    cancelableBySender: true,
    cancelableByRecipient: false,
    transferableBySender: true,
    transferableByRecipient: false,
  };

  const { amount, decimals, ...createStreamPayload } = data;
  const effectiveAmount = getBN(amount, decimals);
  const amountPerPeriod = effectiveAmount.divn(SPREAD_PERIODS_COUNT);

  return {
    ...predefinedCreateStreamParams,
    ...createStreamPayload,
    amount: effectiveAmount,
    amountPerPeriod,
    period: minutesInSeconds(5), // Time step (period) in seconds per which the unlocking occurs.
    start: minutesFromNow(2),
  };
};

export const useCreateStream = () => {
  const { wallet } = useWallet();
  const { reload: reloadAllStreams } = useAllStreams();
  const client = useStreamflowClient();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createStream = useCallback(
    async (data: CreateStreamRequest) => {
      if (!wallet || !client) {
        throw new Error(
          "[create stream]: impossible to create stream outside of wallet context",
        );
      }
      setLoading(true);
      setError(null);
      return client
        .create(getCreateStreamRequestParams(data), createSolanaParams(wallet))
        .then(() => reloadAllStreams())
        .catch((error) => {
          console.error(error);
          setError(error);
        })
        .finally(() => setLoading(false));
    },
    [wallet, client, reloadAllStreams],
  );

  return { createStream, isLoading, error };
};

export const useAllStreams = () => {
  const { publicKey } = useWallet();
  const client = useStreamflowClient();
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

    client.get(streamsRequestData).then((data) => setStreams(data));
  }, [publicKey, client]);

  useEffect(() => loadStreams(), [loadStreams]);

  return { streams, reload: loadStreams };
};
