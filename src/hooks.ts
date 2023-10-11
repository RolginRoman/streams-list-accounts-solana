import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import * as SPLToken from "@solana/spl-token";
import BN from "bn.js";

interface TokenItem {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

interface TokensListResponse {
  tokens: TokenItem[];
}

export const useTokensMap = () => {
  const [tokensMap, setTokensMap] = useState(new Map<string, TokenItem>());

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json",
    )
      .then((res) => res.json())
      .then((tokensList: TokensListResponse) => {
        setTokensMap(
          new Map<string, TokenItem>(
            tokensList.tokens.map((tokenItem) => [
              tokenItem.address,
              tokenItem,
            ]),
          ),
        );
      });
  }, []);

  return tokensMap;
};

interface TokenAccountsWithBalance {
  publicKey: PublicKey;
  amount: BN;
  name: string;
}

export const useTokenAccountsWithBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokenAccountsWithBalance, setTokenAccountsWithBalance] = useState(
    [] as TokenAccountsWithBalance[],
  );

  useEffect(() => {
    if (publicKey && connection) {
      const ownerPk = new PublicKey(publicKey);
      //   connection
      //     .getBalanceAndContext(ownerPk)
      //     .then((balance) => setBalance(balance));
      // console.log("Balance", connection.getBalance(ownerPk));

      Promise.all([
        connection.getTokenAccountsByOwner(ownerPk, {
          programId: TOKEN_PROGRAM_ID,
        }),
      ]).then(([accounts]) => {
        return connection
          .getMultipleAccountsInfo([
            ownerPk,
            ...accounts.value.map((account) => account.pubkey),
          ])
          .then((mints) => {
            mints.map((mint) => {
              if (mint) {
                const accountInfo = SPLToken.AccountLayout.decode(mint.data);
                console.log(`mint: ${new PublicKey(accountInfo.mint)}`);
                console.log(`amount: ${accountInfo.amount}`);
              }
            });
          });
      });
    }
  }, [publicKey, connection]);

  return tokenAccountsWithBalance;
};
