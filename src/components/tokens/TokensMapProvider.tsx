import { PropsWithChildren } from "react";
import { TokensMapContext, useFetchTokensMap } from "../../hooks/useTokens";

export const TokensMapProvider = ({ children }: PropsWithChildren) => {
  const tokensMap = useFetchTokensMap();
  return (
    <TokensMapContext.Provider value={tokensMap}>
      {children}
    </TokensMapContext.Provider>
  );
};
