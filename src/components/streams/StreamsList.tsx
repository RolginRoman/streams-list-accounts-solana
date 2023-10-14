import { Types } from "@streamflow/stream";
import { StreamsTable } from "../streams-table/StreamsTable";

interface Props {
  streams: [string, Types.Stream][] | null;
  reload: () => void;
  isLoading: boolean;
}

export const StreamsList = ({ streams, reload, isLoading }: Props) => {
  return (
    <div className="mt-6">
      <h2 className="my-2 font-semibold">
        All streams
        <button
          className="ml-2 inline-flex justify-center items-center w-6 h-6 rounded-md text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700"
          title="Reload"
          onClick={reload}
        >
          <span className={isLoading ? "animate-spin" : ""}>↻</span>
        </button>
      </h2>
      <div className="mt-2">
        {streams?.length ? (
          <StreamsTable streams={streams} />
        ) : (
          "No streams available"
        )}
      </div>
    </div>
  );
};
