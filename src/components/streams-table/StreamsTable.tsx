import { Types } from "@streamflow/stream";
import { StreamsTableRow } from "./StreamsTableRow";
import { TableHeadCell } from "./TableHeadCell";

interface Props {
  streams: [string, Types.Stream][];
}

export const StreamsTable = ({ streams }: Props) => {
  return (
    <table className="mt-4 w-full max-w-6xl table-auto border-collapse border">
      <thead>
        <tr>
          <TableHeadCell className="w-1/12">Key</TableHeadCell>
          <TableHeadCell className="w-4/12">Name</TableHeadCell>
          <TableHeadCell className="w-2/12">Amount</TableHeadCell>
          <TableHeadCell className="w-2/12">Token</TableHeadCell>
          <TableHeadCell className="w-1/12">Recipient</TableHeadCell>
        </tr>
      </thead>
      <tbody>
        {streams.map(([key, stream]) => (
          <StreamsTableRow key={key} id={key} stream={stream} />
        ))}
      </tbody>
    </table>
  );
};
