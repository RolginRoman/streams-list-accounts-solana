import { Types } from "@streamflow/stream";
import { StreamsTableRow } from "./StreamsTableRow";
import { HTMLAttributes, PropsWithChildren } from "react";

interface Props {
  streams: [string, Types.Stream][];
}

export const StreamsTable = ({ streams }: Props) => {
  return (
    <table className="mt-4 w-full table-fixed border-collapse border">
      <thead>
        <tr>
          <TableHeadCell>key</TableHeadCell>
          <TableHeadCell className="w-1/3">name</TableHeadCell>
          <TableHeadCell className="w-1/3">amount</TableHeadCell>
          <TableHeadCell>recipient</TableHeadCell>
          {/* <th className="bg-gray-100 text-left border">key</th>
          <th className="bg-gray-100 text-left border w-1/3">stream name</th>
          <th className="bg-gray-100 text-left border w-1/3">amount</th>
          <th className="bg-gray-100 text-left border">recipient</th> */}
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

const TableHeadCell = ({
  className,
  children,
}: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) => {
  return (
    <th className={`bg-gray-100 text-left border ${className}`}>{children}</th>
  );
};
