import { useForm } from "react-hook-form";
import { useCreateStream } from "../hooks/useStreams";
import { useTokenAccountsWithBalance } from "../hooks/useTokenAccounts";
import { CreateStreamRequest } from "../types";
import { useCallback, useMemo } from "react";

export const CreateNewStreamForm = () => {
  const { createStream, isLoading, error } = useCreateStream();
  const { tokenAccountsWithBalance } = useTokenAccountsWithBalance();
  const nonEmptyAccounts = useMemo(
    () =>
      tokenAccountsWithBalance?.filter((account) => account.amount > 0) ?? [],
    [tokenAccountsWithBalance],
  );

  const form = useForm<CreateStreamRequest>({
    defaultValues: {
      name: "",
      recipient: "",
      canTopup: false,
      tokenId: undefined,
      amount: undefined,
    },
  });

  const onCreateNewStream = useCallback(
    (data: CreateStreamRequest) => {
      const tokenInfo = nonEmptyAccounts.find(
        ({ publicKey }) => publicKey.toString() === data.tokenId,
      );

      if (!tokenInfo) {
        throw new Error("[create stream]: unrecognized token selected");
      }

      createStream({
        ...data,
        decimals: tokenInfo.decimals,
      });
    },
    [createStream, nonEmptyAccounts],
  );

  return (
    <form
      onSubmit={form.handleSubmit(onCreateNewStream)}
      className="space-y-4 mt-6 md:w-[520px] w-full"
    >
      <h2 className="font-semibold">Create new payment</h2>
      <div className="w-full flex gap-4">
        <label className="w-3/4 block text-sm font-medium leading-6 text-gray-900">
          Token
          <div className="mt-2">
            <select
              {...form.register("tokenId")}
              className="block w-full max-w-none  h-8 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {nonEmptyAccounts.map((tokenAccount) => (
                <option
                  key={tokenAccount.publicKey.toString()}
                  value={tokenAccount.publicKey.toString()}
                >
                  {tokenAccount.name}{" "}
                  {(
                    tokenAccount.amount /
                    BigInt(Math.pow(10, tokenAccount.decimals))
                  ).toString()}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="w-1/4 block text-sm font-medium leading-6 text-gray-900">
          Amount
          <div className="mt-2">
            <div className="flex rounded-md h-8 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
              <input
                type="number"
                className="block flex-1 border-0 px-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="0.00"
                step="any"
                required
                {...form.register("amount")}
              />
            </div>
          </div>
        </label>
      </div>

      <label className="block text-sm font-medium leading-6 text-gray-900">
        Stream name
        <div className="mt-2">
          <div className="flex rounded-md h-8 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="text"
              className="block flex-1 border-0 px-2 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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
          <div className="flex rounded-md h-8 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <input
              type="text"
              className="block flex-1 border-0 bg-transparent px-2 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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
            className="w-4 rounded h-8 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            {...form.register("canTopup")}
          />
        </div>
      </label>
      <button
        disabled={isLoading}
        className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
      >
        {error
          ? "Retry (check console)"
          : isLoading
          ? "Creating stream..."
          : "Create stream"}
      </button>
    </form>
  );
};
