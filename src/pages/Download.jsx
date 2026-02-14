import { useState, useEffect, useMemo } from "react";
import {
    FaSearch,
    FaDownload,
    FaMicrochip,
    FaCalendarAlt,
    FaAndroid,
    FaFilter,
    FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DownloadButtonWithVariant from "./DownloadButtonWithVariant";

const Download = () => {
    const [devices, setDevices] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [brands, setBrands] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/devices.json"
            );
            const data = await response.json();

            const flatDevices = [];
            Object.keys(data).forEach(brand => {
                const brandDevices = Array.isArray(data[brand])
                    ? data[brand]
                    : [];
                brandDevices.forEach(device => {
                    flatDevices.push({
                        ...device,
                        brand,
                        image: `https://github.com/LumineDroid-Devices/official_devices/raw/refs/heads/bellflower/assets/devices/${device.codename}.webp`
                    });
                });
            });

            setDevices(flatDevices);
            setBrands(["All", ...new Set(flatDevices.map(d => d.brand))]);
        } catch (error) {
            console.error("Error loading devices:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(
        () =>
            devices.filter(
                d =>
                    (selectedBrand === "All" || d.brand === selectedBrand) &&
                    (d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.codename.toLowerCase().includes(search.toLowerCase()))
            ),
        [devices, selectedBrand, search]
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative p-12 rounded-3xl backdrop-blur-xl border border-pink-200/50 dark:border-pink-500/20 shadow-2xl">
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin opacity-20"></div>
                                <div
                                    className="absolute inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin"
                                    style={{ animationDuration: "0.8s" }}
                                ></div>
                                <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full"></div>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-xl font-semibold">
                                Loading devices
                            </p>
                            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                                Please wait a moment...
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-500/10 dark:to-purple-500/10 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-6 border border-pink-200/50 dark:border-pink-500/20 shadow-sm"
                    >
                        <FaAndroid className="text-base" />
                        <span>Official Devices</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6">
                        <span className="bg-gradient-to-r from-slate-900 via-pink-600 to-purple-600 dark:from-white dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Get LumineDroid
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Download the latest build for your device from our
                        collection of{" "}
                        <span className="font-semibold text-pink-600 dark:text-pink-400">
                            {devices.length}
                        </span>{" "}
                        officially supported devices.
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 lg:mb-12"
                >
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative flex items-center">
                            <FaSearch className="absolute left-5 text-slate-400 dark:text-slate-500 text-lg pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by device name or codename..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-pink-200/50 dark:border-pink-500/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-pink-400 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300 shadow-lg shadow-pink-500/5 text-base"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <FaTimes className="text-slate-400 dark:text-slate-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <FaFilter className="text-slate-500 dark:text-slate-400 text-sm" />
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Filter by Brand
                                </h3>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                {showFilters ? "Hide" : "Show"} Filters
                            </button>

                            <div className="text-sm">
                                <span className="text-slate-500 dark:text-slate-500">
                                    Showing{" "}
                                </span>
                                <span className="font-bold text-pink-600 dark:text-pink-400">
                                    {filtered.length}
                                </span>
                                <span className="text-slate-500 dark:text-slate-500">
                                    {" "}
                                    of {devices.length}
                                </span>
                            </div>
                        </div>

                        {/* Brand Filter Pills */}
                        <AnimatePresence>
                            {(showFilters || window.innerWidth >= 1024) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {brands.map((brand, index) => (
                                            <motion.button
                                                key={brand}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1
                                                }}
                                                transition={{
                                                    delay: index * 0.03
                                                }}
                                                onClick={() =>
                                                    setSelectedBrand(brand)
                                                }
                                                className={`group relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                    selectedBrand === brand
                                                        ? "text-white shadow-lg shadow-pink-500/30"
                                                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-500/30"
                                                }`}
                                            >
                                                {selectedBrand === brand && (
                                                    <motion.div
                                                        layoutId="selectedBrand"
                                                        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl"
                                                        transition={{
                                                            type: "spring",
                                                            duration: 0.5
                                                        }}
                                                    />
                                                )}
                                                <span className="relative z-10">
                                                    {brand}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Desktop filter always visible */}
                        <div className="hidden lg:flex flex-wrap gap-2">
                            {brands.map((brand, index) => (
                                <motion.button
                                    key={brand}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedBrand(brand)}
                                    className={`group relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        selectedBrand === brand
                                            ? "text-white shadow-lg shadow-pink-500/30"
                                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-500/30"
                                    }`}
                                >
                                    {selectedBrand === brand && (
                                        <motion.div
                                            layoutId="selectedBrand"
                                            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl"
                                            transition={{
                                                type: "spring",
                                                duration: 0.5
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10">
                                        {brand}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Device Grid */}
                {filtered.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.map((device, index) => (
                                <motion.div
                                    key={`${device.brand}-${device.codename}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.03
                                    }}
                                    className="group relative"
                                >
                                    {/* Gradient Background Blur */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                                    {/* Card */}
                                    <div className="relative h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-pink-200/50 dark:border-pink-500/20 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/20 transition-all duration-500 group-hover:border-pink-300 dark:group-hover:border-pink-500/40">
                                        {/* Device Image */}
                                        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]"></div>
                                            <img
                                                src={device.image}
                                                alt={device.name}
                                                className="w-full h-full object-contain p-6 lg:p-8 group-hover:scale-110 transition-transform duration-700"
                                                onError={e => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/300x300?text=" +
                                                        encodeURIComponent(
                                                            device.codename
                                                        );
                                                }}
                                            />

                                            {/* Floating Brand Badge */}
                                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-pink-200/50 dark:border-pink-500/30 shadow-lg">
                                                <span className="text-xs font-bold">
                                                    {device.brand}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 sm:p-6 lg:p-8">
                                            {/* Device Name & Codename */}
                                            <div className="mb-6">
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                                                    {device.name}
                                                </h3>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-500/10 dark:to-purple-500/10 border border-pink-200/50 dark:border-pink-500/30">
                                                    <FaMicrochip className="text-pink-600 dark:text-pink-400 text-xs" />
                                                    <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                                                        {device.codename}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Device Info */}
                                            <div className="space-y-3 mb-6">
                                                {device.supported_versions && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            Version
                                                        </span>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {device
                                                                .supported_versions[0]
                                                                ?.version_code ||
                                                                "Latest"}
                                                        </span>
                                                    </div>
                                                )}

                                                {device.maintainer && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            Maintainer
                                                        </span>
                                                        <span className="font-semibold text-slate-900 dark:text-white truncate ml-2 max-w-[60%]">
                                                            {device.maintainer}
                                                        </span>
                                                    </div>
                                                )}

                                                {device.supported_versions &&
                                                    device
                                                        .supported_versions[0] && (
                                                        <>
                                                            {device
                                                                .supported_versions[0]
                                                                .stable !==
                                                                undefined && (
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-slate-500 dark:text-slate-400">
                                                                        Build
                                                                        Status
                                                                    </span>
                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-xs ${
                                                                            device
                                                                                .supported_versions[0]
                                                                                .stable
                                                                                ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30"
                                                                                : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                                                                        }`}
                                                                    >
                                                                        <span
                                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                                device
                                                                                    .supported_versions[0]
                                                                                    .stable
                                                                                    ? "bg-green-500"
                                                                                    : "bg-amber-500"
                                                                            }`}
                                                                        ></span>
                                                                        {device
                                                                            .supported_versions[0]
                                                                            .stable
                                                                            ? "Stable"
                                                                            : "Beta"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {device
                                                                .supported_versions[0]
                                                                .deprecated !==
                                                                undefined && (
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-slate-500 dark:text-slate-400">
                                                                        Support
                                                                        Status
                                                                    </span>
                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold text-xs ${
                                                                            !device
                                                                                .supported_versions[0]
                                                                                .deprecated
                                                                                ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                                                                                : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                                                                        }`}
                                                                    >
                                                                        <span
                                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                                !device
                                                                                    .supported_versions[0]
                                                                                    .deprecated
                                                                                    ? "bg-blue-500"
                                                                                    : "bg-red-500"
                                                                            }`}
                                                                        ></span>
                                                                        {!device
                                                                            .supported_versions[0]
                                                                            .deprecated
                                                                            ? "Active"
                                                                            : "Deprecated"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-500/30 to-transparent my-6"></div>

                                            {/* Download Button */}
                                            <DownloadButtonWithVariant
                                                codename={device.codename}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-xl opacity-20"></div>
                            <div className="relative p-12 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-pink-200/50 dark:border-pink-500/20 shadow-2xl">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-500/10 dark:to-purple-500/10 flex items-center justify-center border border-pink-200 dark:border-pink-500/30">
                                    <FaSearch className="text-3xl text-pink-500 dark:text-pink-400" />
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-xl font-semibold mb-2">
                                    No devices found
                                </p>
                                <p className="text-slate-500 dark:text-slate-500 text-sm mb-6">
                                    Try adjusting your search or filters
                                </p>
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedBrand("All");
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Download;
