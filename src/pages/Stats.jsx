"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaSpinner, FaDownload, FaLayerGroup } from "react-icons/fa";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.4 },
  }),
};

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

const DeviceCard = ({ device, downloads, index }) => (
  <motion.div
    variants={scaleUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    custom={index}
    className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 
               overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl
               dark:hover:shadow-blue-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-sm 
               p-4 sm:p-6 flex justify-between items-center"
  >
    {/* Gradient Top Line */}
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
        {device.name} ({device.codename.toLowerCase()})
      </span>
      <span className="mt-1 sm:mt-0 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
        {downloads ?? 0} downloads
      </span>
    </div>
  </motion.div>
);

export default function Stats() {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

        // Remove duplicates
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

        // Fetch download stats
        const sfStats = {};
        const fetchPromises = [];
        uniqueDevices.forEach((device) => {
          branches.forEach((branch) => {
            const url = `https://sourceforge.net/projects/luminedroid/files/${device.codename}/${branch.name}/stats/json?start_date=2000-01-01&end_date=${new Date().toISOString().split("T")[0]}`;
            fetchPromises.push(
              fetch(url)
                .then((res) => (res.ok ? res.json() : { total: 0 }))
                .then((js) => ({
                  codename: device.codename.toLowerCase(),
                  total: js.total ?? 0,
                }))
                .catch(() => ({
                  codename: device.codename.toLowerCase(),
                  total: 0,
                })),
            );
          });
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(
          (r) => (sfStats[r.codename] = (sfStats[r.codename] ?? 0) + r.total),
        );
        setStats(sfStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevicesAndStats();
  }, []);

  // Filter devices by search query
  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.codename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort filtered devices by downloads (descending)
  const sortedDevices = filteredDevices.sort(
    (a, b) =>
      (stats[b.codename.toLowerCase()] ?? 0) -
      (stats[a.codename.toLowerCase()] ?? 0),
  );

  const totalDownloads = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-purple-50/30 
                 dark:from-neutral-950 dark:via-blue-950/20 dark:to-purple-950/20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 
                       bg-clip-text text-transparent bg-gradient-to-r 
                       from-blue-600 via-purple-600 to-pink-600
                       dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
          >
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
            className="w-full pl-4 pr-4 py-3 rounded-xl
                       bg-white dark:bg-neutral-900
                       border-2 border-neutral-200 dark:border-neutral-800
                       focus:border-blue-500 dark:focus:border-blue-500
                       text-neutral-900 dark:text-neutral-100
                       placeholder-neutral-400
                       text-sm sm:text-base
                       transition-colors outline-none"
          />
        </div>

        {/* Devices List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <FaSpinner className="text-2xl sm:text-3xl text-blue-500 animate-spin" />
            <span className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-2 sm:mt-4">
              Loading devices...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDevices.length === 0 && (
              <p className="text-center text-neutral-600 dark:text-neutral-400 py-8">
                No devices found.
              </p>
            )}
            {sortedDevices.map((device, i) => (
              <DeviceCard
                key={device.codename}
                device={device}
                downloads={stats[device.codename.toLowerCase()]}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
