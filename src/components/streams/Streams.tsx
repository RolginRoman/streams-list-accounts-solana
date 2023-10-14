import { useAllStreams } from "../../hooks/useStreams";
import { useTokenAccounts } from "../../hooks/useTokenAccounts";
import { CreateNewStreamForm } from "./CreateNewStreamForm";
import { StreamsList } from "./StreamsList";

export const Streams = () => {
  const { error, isLoading } = useTokenAccounts();
  const { streams, reload, isLoading: areStreamsLoading } = useAllStreams();

  if (isLoading) {
    return <p className="my-2">Loading...</p>;
  } else if (error) {
    return <p className="my-2">Something went wrong</p>;
  }

  return (
    <>
      <section className="mt-6 w-full md:w-3/4">
        <CreateNewStreamForm onCreate={reload}></CreateNewStreamForm>
      </section>
      <StreamsList
        streams={streams}
        reload={reload}
        isLoading={areStreamsLoading}
      />
    </>
  );
};
