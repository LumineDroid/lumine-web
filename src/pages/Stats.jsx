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
    className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-sm p-4 sm:p-6 flex justify-between items-center"
  >
    <motion.div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
        {name} ({codename.toLowerCase()})
      </span>
      <span className="mt-1 sm:mt-0 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
        {downloads ?? 0} downloads
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
    className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-green-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-sm p-4 sm:p-6 flex justify-between items-center"
  >
    <motion.div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex justify-between items-center w-full">
      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
        <img
          src={countryFlagUrl(country)}
          alt={`${country} flag`}
          className="w-5 h-3 object-cover rounded-sm"
        />
        <span>{country}</span>
      </span>
      <span className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
        {downloads.toLocaleString()} downloads
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
            const url = `https://sourceforge.net/projects/luminedroid/files/${device.codename}/${branch.name}/stats/json?start_date=2000-01-01&end_date=${
              new Date().toISOString().split("T")[0]
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
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-blue-200 dark:border-blue-900/30 flex flex-col items-center"
            >
              <FaLayerGroup className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {devices.length}
              </p>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                Total Devices
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="p-4 sm:p-6 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-purple-200 dark:border-purple-900/30 flex flex-col items-center"
            >
              <FaDownload className="text-2xl sm:text-3xl text-purple-600 dark:text-purple-400 mb-1 sm:mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalDownloads}
              </p>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
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
          <div className="flex-1 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Most Device Downloads
            </h2>
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
                {sortedDevices.length > 5 && (
                  <button
                    onClick={() => setShowAllDevices(!showAllDevices)}
                    className="w-full py-2 px-4 mt-2 rounded-xl bg-white/30 dark:bg-neutral-900/30 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-white/50 dark:hover:bg-neutral-900/50 transition-colors duration-200 flex justify-center items-center"
                  >
                    {showAllDevices ? "Show Less" : "Show All"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Country Column */}
          <div className="w-full lg:w-1/3 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Most Country Downloads
            </h2>
            {!loading &&
              countriesToShow.map(([country, total], i) => (
                <CountryCard
                  key={country}
                  country={country}
                  downloads={total}
                  index={i}
                />
              ))}
            {sortedCountries.length > 5 && (
              <button
                onClick={() => setShowAllCountries(!showAllCountries)}
                className="w-full py-2 px-4 mt-2 rounded-xl bg-white/30 dark:bg-neutral-900/30 backdrop-blur-sm text-green-600 dark:text-green-400 font-semibold hover:bg-white/50 dark:hover:bg-neutral-900/50 transition-colors duration-200 flex justify-center items-center"
              >
                {showAllCountries ? "Show Less" : "Show All"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
