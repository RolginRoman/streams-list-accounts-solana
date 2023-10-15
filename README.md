# Streamflow Solana Integration

Basic app for create and review Streamflow program streams

Required:

- Phantom wallet

Available features:

- creation stream with `@streamflow/stream` library (Create payment /src/hooks/useCreateStream.ts)
- load current wallet balance for NATIVE_MINT and other available spl tokens (/src/hooks/useTokenAccounts.ts)
- overview of all created streams (payments & vesting)
- info about mints loaded from `solflare-wallet` dictionary (/src/hooks/useTokens.ts)
- in case of `phantom wallet` unavailability show a message/link for the installation

# Dev environment

How to start work here:

- npm i
- npm run dev

# Known minors

- Rate-limits rpc?
- bundle size (all web3 js stuff is really massive. need futher investigation)

# Room for improvements

- global state management (like tanstack-query, redux, etc.)
- deep styling for Wallet adapter lib
- work with BN from the chain balance and the creation form (need to check edge cases) 
- snappy design
