import { useState, useEffect, useContext, createContext } from "react";
import { TokenItem } from "../types/token";

interface TokensListResponse {
  tokens: TokenItem[];
}
const SOLFLARE_TOKENS_LIST_JSON_URL =
  "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json";

export const TokensMapContext = createContext(
  new Map() as Map<string, TokenItem>,
);

export const useFetchTokensMap = () => {
  const [tokensMap, setTokensMap] = useState(new Map<string, TokenItem>());

  useEffect(() => {
    fetch(SOLFLARE_TOKENS_LIST_JSON_URL, {
      cache: "default",
    })
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

export const useTokens = () => {
  return useContext(TokensMapContext);
};
