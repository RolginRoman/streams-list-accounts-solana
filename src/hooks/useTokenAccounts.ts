import * as SPLToken from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { TokenItem, useTokensMap } from "./useTokensMap";

interface TokenAccountsWithBalance {
  publicKey: PublicKey;
  amount: bigint;
  name: string;
  decimals: number;
}

export const useTokenAccountsWithBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null as unknown);
  const tokens = useTokensMap();
  const [tokenAccountsWithBalance, setTokenAccountsWithBalance] = useState(
    [] as TokenAccountsWithBalance[],
  );

  useEffect(() => {
    const NATIVE_TOKEN = tokens.get(SPLToken.NATIVE_MINT.toString());
    setLoading(true);
    if (publicKey && connection && NATIVE_TOKEN) {
      const ownerPk = new PublicKey(publicKey);

      const getOwnerBalance = () =>
        connection.getBalance(ownerPk).then((ownBalance) => ({
          publicKey: ownerPk,
          amount: BigInt(ownBalance),
          name: NATIVE_TOKEN.symbol,
          decimals: NATIVE_TOKEN.decimals,
        }));

      const getAccountsBalances = () =>
        connection
          .getTokenAccountsByOwner(ownerPk, {
            programId: SPLToken.TOKEN_PROGRAM_ID,
          })
          .then(async (accounts) => {
            return await resolveTokenAccountsInfo(
              connection,
              accounts.value.map((account) => account.pubkey),
              tokens,
            );
          });

      Promise.all([getAccountsBalances(), getOwnerBalance()])
        .then(async ([balances, ownBalance]) => {
          setTokenAccountsWithBalance([ownBalance, ...balances]);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [publicKey, connection, tokens]);

  return { tokenAccountsWithBalance, isLoading, error };
};

async function resolveTokenAccountsInfo(
  connection: Connection,
  accountsPublicKeys: PublicKey[],
  tokens: Map<string, TokenItem>,
): Promise<TokenAccountsWithBalance[]> {
  const mints = await connection.getMultipleAccountsInfo(accountsPublicKeys);
  return mints.reduce((accounts, current) => {
    if (!current) {
      return accounts;
    }
    const accountInfo = SPLToken.AccountLayout.decode(current.data);
    const tokenInfo = tokens.get(accountInfo.mint.toString());
    if (!tokenInfo) {
      return accounts;
    }
    return [
      ...accounts,
      {
        publicKey: accountInfo.mint,
        amount: accountInfo.amount,
        decimals: tokenInfo.decimals,
        name: tokenInfo.symbol ?? accountInfo.mint.toString(),
      } as TokenAccountsWithBalance,
    ];
  }, [] as TokenAccountsWithBalance[]);
}
