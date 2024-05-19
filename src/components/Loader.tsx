import { FC } from "react";

interface LoaderProps { }

const Loader: FC<LoaderProps> = () => {
  return (
    <div className="flex" style={{ width: "100%", padding: "20px 10px" }}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
