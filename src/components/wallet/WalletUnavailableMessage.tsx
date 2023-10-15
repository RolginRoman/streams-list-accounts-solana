export const WalletUnavailableMessage = () => {
  return (
    <div className="my-3 mx-2 p-4 rounded-2xl bg-red-100 border border-red-600 max-w-lg">
      <span>❗️ Phantom wallet is not available</span>
      <span className="block mt-4">
        Use the official site for downloading the plugin:{" "}
        <a
          className=" text-blue-700"
          href="https://phantom.app/"
          target="_blank"
        >
          phantom.app
        </a>
      </span>
    </div>
  );
};
