import { FunctionComponent } from "react";

const Loader: FunctionComponent = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="inline-block h-96 w-96 animate-spin rounded-full border-8 border-solid border-current border-e-transparent align-[-0.125em] text-gray-400 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
