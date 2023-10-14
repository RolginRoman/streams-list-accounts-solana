import { HTMLAttributes, PropsWithChildren } from "react";

export const TableHeadCell = ({
  className,
  children,
}: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) => {
  return (
    <th className={`bg-gray-100 text-left border ${className}`}>{children}</th>
  );
};
