import * as SPLToken from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { createContext, useContext, useEffect, useState } from "react";
import { useTokens } from "./useTokens";
import BN from "bn.js";
import { TokenItem } from "../types/token";

interface TokenAccountsWithBalance {
  publicKey: PublicKey;
  amount: BN;
  name: string;
  decimals: number;
}

export const TokensAccountsContext = createContext({
  tokenAccountsWithBalance: [],
  isLoading: false,
  error: undefined,
} as ReturnType<typeof useTokenAccountsWithBalance>);

export const useTokenAccounts = () => {
  return useContext(TokensAccountsContext);
};

export const useTokenAccountsWithBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null as unknown);
  const tokens = useTokens();
  const [tokenAccountsWithBalance, setTokenAccountsWithBalance] = useState(
    [] as TokenAccountsWithBalance[],
  );

  useEffect(() => {
    const NATIVE_TOKEN = tokens.get(SPLToken.NATIVE_MINT.toString());
    setLoading(true);
    if (publicKey && connection && NATIVE_TOKEN) {
      const ownerPk = new PublicKey(publicKey);
      const balances = Promise.all([
        getOwnerBalance(connection, ownerPk, NATIVE_TOKEN),
        getSplTokensBalance(connection, ownerPk, tokens),
      ]).then(([nativeBalance, splTokensBalance]) => [
        nativeBalance,
        ...splTokensBalance,
      ]);

      balances
        .then((allAccounts) => setTokenAccountsWithBalance(allAccounts))
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

async function getOwnerBalance(
  connection: Connection,
  ownerPk: PublicKey,
  solToken: TokenItem,
) {
  return connection.getBalance(ownerPk).then((ownBalance) => ({
    publicKey: SPLToken.NATIVE_MINT,
    amount: new BN(ownBalance),
    name: solToken.symbol,
    decimals: solToken.decimals,
  }));
}

async function getSplTokensBalance(
  connection: Connection,
  ownerPk: PublicKey,
  tokens: Map<string, TokenItem>,
) {
  return connection
    .getTokenAccountsByOwner(ownerPk, {
      programId: SPLToken.TOKEN_PROGRAM_ID,
    })
    .then(async (accounts) =>
      resolveTokenAccountsInfo(
        connection,
        accounts.value.map((account) => account.pubkey),
        tokens,
      ),
    );
}

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
    const amount = new BN(accountInfo.amount.toString());
    return [
      ...accounts,
      {
        publicKey: accountInfo.mint,
        amount: amount,
        decimals: tokenInfo.decimals,
        name: tokenInfo.symbol ?? accountInfo.mint.toString(),
      } as TokenAccountsWithBalance,
    ];
  }, [] as TokenAccountsWithBalance[]);
}
