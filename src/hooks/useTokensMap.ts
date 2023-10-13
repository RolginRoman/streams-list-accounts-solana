import { useState, useEffect } from "react";

export interface TokenItem {
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
