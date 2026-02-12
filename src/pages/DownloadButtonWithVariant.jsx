import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

const DownloadButtonWithVariant = ({ codename }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const variants = ["bynx", "bellflower"];

  const handleSelect = (variant) => {
    setOpen(false);
    navigate(`/download/devices/${codename}?variant=${variant}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-0.5"
      >
        <FaDownload size={16} />
        Download
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* semi-transparent background */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            ></div>

            {/* modal card */}
            <div className="relative bg-slate-100 dark:bg-slate-900 border border-pink-200/50 dark:border-pink-500/20 rounded-2xl shadow-lg p-6 w-80 sm:w-96 flex flex-col gap-4 z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose Variant
              </h3>
              {variants.map((v) => (
                <button
                  key={v}
                  onClick={() => handleSelect(v)}
                  className="w-full flex justify-center py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-shadow shadow-md hover:shadow-lg"
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}

              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default DownloadButtonWithVariant;
