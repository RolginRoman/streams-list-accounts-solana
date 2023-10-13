import { Types } from "@streamflow/stream";

export type CreateStreamRequest = Pick<
  Types.ICreateStreamData,
  "recipient" | "canTopup" | "name" | "tokenId"
> & { amount: number; decimals: number };
