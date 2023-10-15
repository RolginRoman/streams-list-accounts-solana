import { useState, useEffect, useContext, createContext } from "react";
import { TokenItem } from "../types/token";

interface TokensListResponse {
  tokens: TokenItem[];
}

const SOLFLARE_TOKENS_LIST_JSON_URL =
  "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json";

const fetchTokensJson = async (): Promise<TokensListResponse> => {
  return fetch(SOLFLARE_TOKENS_LIST_JSON_URL).then((res) => res.json());
};

export const TokensMapContext = createContext(
  new Map() as Map<string, TokenItem>,
);

export const useFetchTokensMap = () => {
  const [tokensMap, setTokensMap] = useState(new Map<string, TokenItem>());

  useEffect(() => {
    fetchTokensJson().then((tokensList) => {
      setTokensMap(
        new Map<string, TokenItem>(
          tokensList.tokens.map((tokenItem) => [tokenItem.address, tokenItem]),
        ),
      );
    });
  }, []);

  return tokensMap;
};

export const useTokens = () => {
  return useContext(TokensMapContext);
};
