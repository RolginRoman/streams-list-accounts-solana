import { PropsWithChildren } from "react";
import {
  TokensAccountsContext,
  useTokenAccountsWithBalance,
} from "../../hooks/useTokenAccounts";

export const TokensAccountsProvider = ({
  children,
}: PropsWithChildren) => {
  const tokenBalances = useTokenAccountsWithBalance();
  return (
    <TokensAccountsContext.Provider value={tokenBalances}>
      {children}
    </TokensAccountsContext.Provider>
  );
};
