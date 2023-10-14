import BN from "bn.js";

export function formatBN(
  number: BN,
  tokenDecimals: number,
  toFixedDecimals: number | null = 2,
): string {
  const numberString = number.toString();
  const fullFormat = formatFullDecimal(numberString, tokenDecimals);
  if (toFixedDecimals !== null) {
    const parseGroup = new RegExp(`(\\d*.\\d{${toFixedDecimals}})`).exec(
      fullFormat,
    );
    return parseGroup ? parseGroup[0] : fullFormat;
  }
  return fullFormat;
}

function formatFullDecimal(numberString: string, decimals: number) {
  if (numberString.length > decimals) {
    return numberString.replace(new RegExp(`(\\d{${decimals}})$`), ".$1");
  } else {
    return `0.${numberString.padStart(decimals, "0")}`;
  }
}
