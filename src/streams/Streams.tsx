import { CreateNewStreamForm } from "./CreateNewStreamForm";
import { StreamsList } from "./StreamsList";
import { useAllStreams } from "../hooks/useStreams";
import { useTokenAccountsWithBalance } from "../hooks/useTokenAccounts";

export const Streams = () => {
  const { streams, reload } = useAllStreams();
  const { error, isLoading } = useTokenAccountsWithBalance();

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
      <section className="w-3/4">
        <CreateNewStreamForm></CreateNewStreamForm>
      </section>
      {streams?.length ? (
        <div className="mt-6">
          <h2 className="my-2 font-semibold">
            All streams
            <button
              className="ml-2 inline-flex justify-center items-center w-6 h-6 rounded-md text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700"
              title="Reload"
              onClick={() => reload()}
            >
              ↻
            </button>
          </h2>
          <div className="mt-2">
            <StreamsList streams={streams}></StreamsList>
          </div>
        </div>
      ) : null}
    </>
  );
};
