import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <HashLoader size={100} margin={2} color="#ec4899" speedMultiplier={1} />
    </div>
  );
};

export default Loader;
