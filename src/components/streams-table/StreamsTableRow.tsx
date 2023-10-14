import { Types } from "@streamflow/stream";
import { useTokens } from "../../hooks/useTokens";
import { formatBN } from "../../utils/format-bn";
import { shortifyPublicKey } from "../../utils/keys";
import { NonDefinedCellValue } from "./NonDefinedCellContent";

interface Props {
  id: string;
  stream: Types.Stream;
}

export const StreamsTableRow = ({ stream, id }: Props) => {
  const tokens = useTokens();
  const depositedToken = tokens.get(stream.mint);
  return (
    <tr>
      <td className="border" title={id}>
        {shortifyPublicKey(id)}
      </td>
      <td className="border">
        {stream.name.length ? stream.name : <NonDefinedCellValue />}
      </td>
      <td className="border">
        {depositedToken?.decimals ? (
          formatBN(stream.depositedAmount, depositedToken.decimals)
        ) : (
          <NonDefinedCellValue />
        )}
      </td>
      <td className="flex items-center border space-x-1">
        {depositedToken?.logoURI ? (
          <img
            className="hidden md:inline-block rounded-md"
            src={depositedToken.logoURI}
            width="12"
            height="12"
          />
        ) : null}
        <span className="overflow-x-hidden text-ellipsis max-w-full">
          {depositedToken?.name ? (
            depositedToken?.name
          ) : (
            <NonDefinedCellValue />
          )}
        </span>
      </td>
      <td className="border" title={stream.recipient}>
        {shortifyPublicKey(stream.recipient)}
      </td>
    </tr>
  );
};
