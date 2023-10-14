import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { StreamflowSolana, Types, getBN } from "@streamflow/stream";
import { useCallback, useEffect, useState } from "react";
import { CreateStreamRequest } from "../types/stream";
import { minutesFromNow, minutesInSeconds } from "../utils/time";
import { useStreamflowClient } from "./useClient";
import { NATIVE_MINT } from "@solana/spl-token";

const SPREAD_PERIODS_COUNT = 10;

export const useAllStreams = () => {
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

export const useCreateStream = (onCreate: () => void) => {
  const { wallet } = useWallet();
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
      const isNative = data.tokenId === NATIVE_MINT.toString();
      return client
        .create(
          getCreateStreamRequestParams(data),
          createSolanaParams(wallet, isNative),
        )
        .then(() => onCreate())
        .catch((error) => {
          console.error(error);
          setError(error);
        })
        .finally(() => setLoading(false));
    },
    [wallet, client, onCreate],
  );

  return { createStream, isLoading, error };
};

const createSolanaParams = (wallet: Wallet, isNative: boolean) => {
  return {
    sender: wallet.adapter,
    isNative,
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

  const { amount, ...createStreamPayload } = data;
  const amountPerPeriod = amount.divn(SPREAD_PERIODS_COUNT);

  return {
    ...predefinedCreateStreamParams,
    ...createStreamPayload,
    amount,
    amountPerPeriod,
    period: minutesInSeconds(5), // Time step (period) in seconds per which the unlocking occurs.
    start: minutesFromNow(2),
  };
};
