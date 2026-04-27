"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSpinner, FaDownload, FaLayerGroup } from "react-icons/fa";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const branches = [
  {
    name: "bellflower",
    url: "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/bellflower/devices.json",
  },
  {
    name: "bynx",
    url: "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/bynx/devices.json",
  },
];

const countryFlagUrl = (countryName) => {
  const code = countries.getAlpha2Code(countryName, "en");
  if (!code) return "https://flagcdn.com/w20/un.png"; // fallback UN flag
  return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
};

const DeviceCard = ({ name, codename, downloads, index }) => (
  <motion.div
    variants={scaleUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    custom={index}
    className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-blue-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-md p-4 sm:p-5 flex items-center gap-4"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Rank Indicator */}
    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base border border-blue-200 dark:border-blue-800/50">
      #{index + 1}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg">
        {name}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
        {codename.toLowerCase()}
      </p>
    </div>

    {/* Downloads Badge */}
    <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <FaDownload className="text-xs sm:text-sm text-blue-500 dark:text-blue-400" />
      <span className="font-semibold text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
        {(downloads ?? 0).toLocaleString()}
      </span>
    </div>
  </motion.div>
);

const CountryCard = ({ country, downloads, index }) => (
  <motion.div
    variants={scaleUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    custom={index}
    className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-green-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-md p-4 sm:p-5 flex items-center gap-4"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Rank Indicator */}
    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm sm:text-base border border-green-200 dark:border-green-800/50">
      #{index + 1}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0 flex items-center gap-3">
      <img
        src={countryFlagUrl(country)}
        alt={`${country} flag`}
        className="w-8 h-6 object-cover rounded shadow-sm border border-neutral-200 dark:border-neutral-700"
      />
      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg">
        {country}
      </h3>
    </div>

    {/* Downloads Badge */}
    <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <FaDownload className="text-xs sm:text-sm text-green-500 dark:text-green-400" />
      <span className="font-semibold text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
        {downloads.toLocaleString()}
      </span>
    </div>
  </motion.div>
);

export default function Stats() {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({});
  const [countryStats, setCountryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllDevices, setShowAllDevices] = useState(false);
  const [showAllCountries, setShowAllCountries] = useState(false);

  useEffect(() => {
    const fetchDevicesAndStats = async () => {
      try {
        let allDevices = [];
        const branchData = await Promise.all(
          branches.map((branch) =>
            fetch(branch.url).then((res) => (res.ok ? res.json() : {})),
          ),
        );
        branchData.forEach((data) => {
          Object.values(data).forEach((brandDevices) => {
            brandDevices.forEach((device) =>
              allDevices.push({ codename: device.codename, name: device.name }),
            );
          });
        });

        const uniqueDevices = [];
        const seen = new Set();
        allDevices.forEach((d) => {
          const lower = d.codename.toLowerCase();
          if (!seen.has(lower)) {
            uniqueDevices.push(d);
            seen.add(lower);
          }
        });
        setDevices(uniqueDevices);

        const sfStats = {};
        const countryTotals = {};
        const fetchPromises = [];

        uniqueDevices.forEach((device) => {
          branches.forEach((branch) => {
            const url = `https://sourceforge.net/projects/luminedroid/files/${device.codename}/${branch.name}/stats/json?start_date=2000-01-01&end_date=${new Date().toISOString().split("T")[0]
              }`;
            fetchPromises.push(
              fetch(url)
                .then((res) =>
                  res.ok ? res.json() : { total: 0, countries: [] },
                )
                .then((js) => {
                  sfStats[device.codename.toLowerCase()] =
                    (sfStats[device.codename.toLowerCase()] ?? 0) +
                    (js.total ?? 0);
                  if (js.countries && Array.isArray(js.countries)) {
                    js.countries.forEach(([country, total]) => {
                      countryTotals[country] =
                        (countryTotals[country] ?? 0) + total;
                    });
                  }
                })
                .catch(() => {
                  sfStats[device.codename.toLowerCase()] =
                    (sfStats[device.codename.toLowerCase()] ?? 0) + 0;
                }),
            );
          });
        });

        await Promise.all(fetchPromises);
        setStats(sfStats);
        setCountryStats(countryTotals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevicesAndStats();
  }, []);

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.codename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedDevices = filteredDevices.sort(
    (a, b) =>
      (stats[b.codename.toLowerCase()] ?? 0) -
      (stats[a.codename.toLowerCase()] ?? 0),
  );

  const sortedCountries = Object.entries(countryStats).sort(
    (a, b) => b[1] - a[1],
  );

  const devicesToShow = showAllDevices
    ? sortedDevices
    : sortedDevices.slice(0, 5);
  const countriesToShow = showAllCountries
    ? sortedCountries
    : sortedCountries.slice(0, 5);

  const totalDownloads = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Device Downloads Statistics
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Total downloads for each supported device
          </p>
        </div>

        {/* Summary Cards */}
        {!loading && (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 sm:mb-12">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/30 overflow-hidden flex flex-col items-center shadow-lg dark:shadow-none"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

              <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 relative z-10 border border-neutral-100 dark:border-neutral-700">
                <FaLayerGroup className="text-3xl sm:text-4xl text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 relative z-10">
                {devices.length}
              </p>
              <p className="text-sm sm:text-base font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider relative z-10">
                Supported Devices
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/30 overflow-hidden flex flex-col items-center shadow-lg dark:shadow-none"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>

              <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 relative z-10 border border-neutral-100 dark:border-neutral-700">
                <FaDownload className="text-3xl sm:text-4xl text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 relative z-10">
                {totalDownloads.toLocaleString()}
              </p>
              <p className="text-sm sm:text-base font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider relative z-10">
                Total Downloads
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices..."
            className="w-full pl-4 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 focus:border-blue-500 dark:focus:border-blue-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm sm:text-base transition-colors outline-none"
          />
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Devices Column */}
          <div className="flex-1 flex flex-col bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg shadow-neutral-200/20 dark:shadow-none">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Most Device Downloads
              </h2>
              {!loading && (
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-200/50 dark:border-blue-800/50">
                  {devicesToShow.length} Devices
                </div>
              )}
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar rounded-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <FaSpinner className="text-2xl sm:text-3xl text-blue-500 animate-spin" />
                  <span className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-2 sm:mt-4">
                    Loading devices...
                  </span>
                </div>
              ) : (
                <>
                  {devicesToShow.map((device, i) => (
                    <DeviceCard
                      key={device.codename}
                      name={device.name}
                      codename={device.codename}
                      downloads={stats[device.codename.toLowerCase()]}
                      index={i}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Sticky Show All Button */}
            {!loading && sortedDevices.length > 5 && (
              <div className="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
                <button
                  onClick={() => setShowAllDevices(!showAllDevices)}
                  className="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex justify-center items-center shadow-sm"
                >
                  {showAllDevices ? "Show Less Devices" : "Show All Devices"}
                </button>
              </div>
            )}
          </div>

          {/* Country Column */}
          <div className="w-full lg:w-1/3 flex flex-col bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-lg shadow-neutral-200/20 dark:shadow-none">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Most Country Downloads
              </h2>
              {!loading && (
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-bold border border-green-200/50 dark:border-green-800/50">
                  {countriesToShow.length} Countries
                </div>
              )}
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar rounded-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {!loading &&
                countriesToShow.map(([country, total], i) => (
                  <CountryCard
                    key={country}
                    country={country}
                    downloads={total}
                    index={i}
                  />
                ))}
            </div>

            {/* Sticky Show All Button */}
            {!loading && sortedCountries.length > 5 && (
              <div className="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
                <button
                  onClick={() => setShowAllCountries(!showAllCountries)}
                  className="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-neutral-800/50 border border-green-100 dark:border-green-900/30 backdrop-blur-sm text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 flex justify-center items-center shadow-sm"
                >
                  {showAllCountries ? "Show Less Countries" : "Show All Countries"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
