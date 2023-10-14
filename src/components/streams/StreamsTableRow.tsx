import { Types } from "@streamflow/stream";
import { useTokens } from "../../hooks/useTokens";
import { formatBN } from "../../utils/format-bn";
import { shortifyPublicKey } from "../../utils/keys";

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
      <td className="border w-1/2 break-all">{stream.name ?? "non defined"}</td>
      <td className="border w-1/2 break-all">
        {depositedToken?.decimals
          ? formatBN(stream.depositedAmount, depositedToken.decimals)
          : "non defined"}
      </td>
      <td className="border" title={stream.recipient}>
        {shortifyPublicKey(stream.recipient)}
      </td>
    </tr>
  );
};
