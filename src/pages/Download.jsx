import { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaDownload,
  FaMicrochip,
  FaCalendarAlt,
  FaAndroid,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DownloadButtonWithVariant from "./DownloadButtonWithVariant";

const Download = () => {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [brands, setBrands] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/devices.json",
      );
      const data = await response.json();

      const flatDevices = [];
      Object.keys(data).forEach((brand) => {
        const brandDevices = Array.isArray(data[brand]) ? data[brand] : [];
        brandDevices.forEach((device) => {
          flatDevices.push({
            ...device,
            brand,
            image: `https://github.com/LumineDroid-Devices/official_devices/raw/refs/heads/bellflower/assets/devices/${device.codename}.webp`,
          });
        });
      });

      setDevices(flatDevices);
      setBrands(["All", ...new Set(flatDevices.map((d) => d.brand))]);
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      devices.filter(
        (d) =>
          (selectedBrand === "All" || d.brand === selectedBrand) &&
          (d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.codename.toLowerCase().includes(search.toLowerCase())),
      ),
    [devices, selectedBrand, search],
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-8 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 mb-4">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Loading devices...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100/50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-4 border border-pink-200/50 dark:border-pink-500/20">
            Download Now
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Get LumineDroid
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Download the latest build for your device. Choose from our
            collection of officially supported devices.
          </p>
        </div>

        <div className="mb-12">
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search device name or codename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-pink-200/50 dark:border-pink-500/20 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:focus:ring-pink-500/30 transition duration-300"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Filter by Brand
            </h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedBrand === brand
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            Showing {filtered.length} of {devices.length} devices
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((device, index) => (
              <motion.div
                key={`${device.brand}-${device.codename}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                }}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 border border-pink-200 dark:border-pink-500/20 rounded-2xl"></div>

                <div className="absolute -inset-px bg-gradient-to-br from-pink-400/30 to-blue-500/20 dark:from-pink-500/15 dark:to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative p-6 sm:p-8 flex flex-col h-full">
                  <div className="mb-6 flex justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 h-48 border border-slate-200/50 dark:border-slate-700/50">
                    <img
                      src={device.image}
                      alt={device.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=" +
                          encodeURIComponent(device.codename);
                      }}
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 flex-grow">
                          {device.name}
                        </h3>
                        <div className="flex items-center gap-2 bg-pink-100/70 dark:bg-pink-500/20 px-3 py-1.5 rounded-lg border border-pink-200/50 dark:border-pink-500/30 flex-shrink-0">
                          <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                            {device.codename}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      {device.supported_versions && (
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">
                              Version:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white ml-1">
                              {device.supported_versions[0]?.version_code ||
                                "Latest"}
                            </span>
                          </div>
                        </div>
                      )}

                      {device.maintainer && (
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">
                              Maintainer:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white ml-1">
                              {device.maintainer}
                            </span>
                          </div>
                        </div>
                      )}

                      {device.supported_versions &&
                        device.supported_versions[0] && (
                          <>
                            {device.supported_versions[0].stable !==
                              undefined && (
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Stable:
                                  </span>
                                  <span className="font-semibold text-slate-900 dark:text-white ml-1">
                                    {device.supported_versions[0].stable
                                      ? "Yes"
                                      : "No"}
                                  </span>
                                </div>
                              </div>
                            )}
                            {device.supported_versions[0].deprecated !==
                              undefined && (
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Supported:
                                  </span>
                                  <span className="font-semibold text-slate-900 dark:text-white ml-1">
                                    {!device.supported_versions[0].deprecated
                                      ? "Yes"
                                      : "No"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-500/30 to-transparent my-6"></div>

                  <DownloadButtonWithVariant codename={device.codename} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-8 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                No devices found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedBrand("All");
                }}
                className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Download;
