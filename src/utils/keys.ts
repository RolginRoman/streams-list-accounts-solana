import { PublicKey } from "@solana/web3.js";

export function shortifyPublicKey(publicKey: string | PublicKey): string {
    const key = publicKey.toString();
    
    return `${key.slice(0, 3)}..${key.slice(-2)}`;
}
