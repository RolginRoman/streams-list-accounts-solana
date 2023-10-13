import { Types } from "@streamflow/stream";
import { shortifyPublicKey } from "../utils/keys";

interface Props {
  streams: [string, Types.Stream][];
}

export const StreamsList = ({ streams }: Props) => {
  return (
    <table className="mt-4 w-full table-fixed border-collapse border">
      <thead>
        <tr>
          <th className="border">key</th>
          <th className="border w-1/2">stream name</th>
          <th className="border">recipient</th>
        </tr>
      </thead>
      <tbody>
        {streams.map(([key, stream]) => {
          return (
            <tr key={key}>
              <td className="border" title={key}>
                {shortifyPublicKey(key)}
              </td>
              <td className="border w-1/2 break-all">{stream.name}</td>
              <td className="border" title={stream.recipient}>
                {shortifyPublicKey(stream.recipient)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
