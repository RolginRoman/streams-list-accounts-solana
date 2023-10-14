import BN from "bn.js";

export const formatBN = (number: BN, decimals: number): string => {
  const numberString = number.toString();
  if (numberString.length > decimals) {
    return numberString.replace(new RegExp(`(\\d{${decimals}})$`), ".$1");
  } else {
    return `0.${numberString.padStart(decimals, "0")}`;
  }
};
