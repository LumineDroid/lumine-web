import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FaDownload,
    FaArrowLeft,
    FaCalendarAlt,
    FaMicrochip,
    FaUserTie,
    FaCodeBranch,
    FaFileArchive,
    FaCopy,
    FaExclamationTriangle,
    FaCheckCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DownloadDetail = () => {
    const { codename, variant: routeVariant } = useParams();
    const navigate = useNavigate();

    const allowedVariants = ["bellflower", "bynx"];

    const variant = allowedVariants.includes(routeVariant)
        ? routeVariant
        : "bellflower";
    const [showVariantMenu, setShowVariantMenu] = useState(false);

    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);
    const [changelog, setChangelog] = useState("");
    const [showFullChangelog, setShowFullChangelog] = useState(false);
    const [activeTab, setActiveTab] = useState("changelog");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState("");

    const MAX_LINES = 10;

    useEffect(() => {
        if (routeVariant && !allowedVariants.includes(routeVariant)) {
            navigate(`/download/devices/${codename}/bellflower`, {
                replace: true
            });
        }
    }, [routeVariant, codename, navigate]);

    useEffect(() => {
        fetchDeviceDetails();
    }, [codename, variant]);

    useEffect(() => {
        const handleClickOutside = e => {
            if (!e.target.closest(".relative")) {
                setShowVariantMenu(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const fetchDeviceDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const devicesResponse = await fetch(
                "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/devices.json"
            );
            const devicesData = await devicesResponse.json();
            let baseDevice = null;
            Object.keys(devicesData).forEach(brand => {
                const devices = Array.isArray(devicesData[brand])
                    ? devicesData[brand]
                    : [];
                const d = devices.find(d => d.codename === codename);
                if (d && !baseDevice) {
                    baseDevice = {
                        ...d,
                        brand,
                        image: `https://github.com/LumineDroid-Devices/official_devices/raw/refs/heads/bellflower/assets/devices/${d.codename}.webp`
                    };
                }
            });
            if (!baseDevice) {
                setError("Device not found.");
                setLoading(false);
                return;
            }
            let buildData = null;
            try {
                const apiUrl = `https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/${variant}/API/${codename}.json`;
                const res = await fetch(apiUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data.response && data.response.length > 0) {
                        buildData = { ...data.response[0], branch: variant };
                    }
                }
            } catch {}
            const detailedDevice = buildData
                ? { ...baseDevice, ...buildData }
                : baseDevice;
            setDevice(detailedDevice);
            try {
                const changelogRes = await fetch(
                    `https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/${variant}/changelogs/${codename}.txt`
                );
                if (changelogRes.ok) {
                    setChangelog(await changelogRes.text());
                } else {
                    setChangelog("Changelog not available for this device.");
                }
            } catch {
                setChangelog("Changelog not available for this device.");
            }
        } catch (err) {
            setError("Failed to fetch device details.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    const formatDate = timestamp => {
        if (!timestamp) return "Unknown";
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const formatFileSize = bytes => {
        if (!bytes) return "Unknown";
        const gb = bytes / (1024 * 1024 * 1024);
        return `${gb.toFixed(2)} GB`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-pink-200 dark:border-pink-900 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-pink-600 dark:border-t-pink-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Loading device...
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="inline-block p-8 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                        <FaExclamationTriangle className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-4" />
                        <p className="text-slate-900 dark:text-white font-semibold mb-2">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate("/download")}
                            className="mt-4 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition text-sm"
                        >
                            Back to Downloads
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!device) return null;

    return (
        <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/download")}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 font-medium mb-6 transition text-sm"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </motion.button>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Device Header Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                            {/* Device Image - 2 cols on desktop */}
                            <div className="lg:col-span-2 relative aspect-square lg:aspect-auto bg-slate-50 dark:bg-slate-900 p-8 lg:p-12 flex items-center justify-center">
                                <img
                                    src={device.image}
                                    alt={device.name}
                                    className="w-full h-full object-contain max-h-80 lg:max-h-full"
                                    onError={e => {
                                        e.target.src =
                                            "https://via.placeholder.com/400x400?text=" +
                                            encodeURIComponent(device.codename);
                                    }}
                                />
                            </div>

                            {/* Device Info - 3 cols on desktop */}
                            <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="space-y-4 mb-6">
                                    {/* Brand Badge */}
                                    <div className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold">
                                        {device.brand}
                                    </div>

                                    {/* Device Name */}
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                            {device.name}
                                        </h1>

                                        {/* Chips */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                                <FaMicrochip className="text-pink-600 dark:text-pink-400 text-xs" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {device.codename}
                                                </span>
                                            </div>
                                            {device.branch && (
                                                <div className="relative">
                                                    {/* Trigger */}
                                                    <button
                                                        onClick={() =>
                                                            setShowVariantMenu(
                                                                !showVariantMenu
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500 transition group"
                                                    >
                                                        <FaCodeBranch className="text-purple-600 dark:text-purple-400 text-xs" />

                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                                            {variant}
                                                        </span>

                                                        <svg
                                                            className={`w-3 h-3 transition-transform ${
                                                                showVariantMenu
                                                                    ? "rotate-180"
                                                                    : ""
                                                            } text-slate-500`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* Dropdown */}
                                                    <AnimatePresence>
                                                        {showVariantMenu && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 8,
                                                                    scale: 0.95
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                    scale: 1
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: 8,
                                                                    scale: 0.95
                                                                }}
                                                                transition={{
                                                                    duration: 0.15
                                                                }}
                                                                className="absolute mt-2 w-40 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50 overflow-hidden"
                                                            >
                                                                {allowedVariants.map(
                                                                    v => (
                                                                        <button
                                                                            key={
                                                                                v
                                                                            }
                                                                            onClick={() => {
                                                                                setShowVariantMenu(
                                                                                    false
                                                                                );
                                                                                navigate(
                                                                                    `/download/devices/${codename}/${v}`
                                                                                );
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 text-sm capitalize transition ${
                                                                                v ===
                                                                                variant
                                                                                    ? "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-semibold"
                                                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                                            }`}
                                                                        >
                                                                            {v}
                                                                        </button>
                                                                    )
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats - 2 Column Responsive Grid */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        {device.datetime && (
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                    Build Date
                                                </p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatDate(
                                                        device.datetime
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        {device.version && <div></div>}
                                    </div>
                                </div>

                                {/* Download Button - Bottom */}
                                <a
                                    href={device.download || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-bold text-sm transition ${
                                        device.download
                                            ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-500/25"
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                    }`}
                                    disabled={!device.download}
                                >
                                    <FaDownload className="text-base" />
                                    <span>
                                        {device.download
                                            ? "Download ROM"
                                            : "Link Unavailable"}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Build Information Grid - 2 Columns on Desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Maintainer */}
                        {device.maintainer && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <FaUserTie className="text-white text-base" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                                        Maintainer
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {device.maintainer}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* File Size */}
                        {device.size && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                    <FaFileArchive className="text-white text-base" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                                        File Size
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatFileSize(device.size)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SHA256 */}
                        {device.sha256 && (
                            <div className="group p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 transition-colors lg:col-span-2">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        SHA256
                                    </p>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                device.sha256,
                                                "sha256"
                                            )
                                        }
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                                        title="Copy SHA256"
                                    >
                                        {copied === "sha256" ? (
                                            <FaCheckCircle className="text-xs text-green-600 dark:text-green-400" />
                                        ) : (
                                            <FaCopy className="text-xs text-slate-400 dark:text-slate-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                                    {device.sha256}
                                </p>
                            </div>
                        )}

                        {/* MD5 */}
                        {device.md5 && (
                            <div className="group p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 transition-colors lg:col-span-2">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        MD5
                                    </p>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(device.md5, "md5")
                                        }
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                                        title="Copy MD5"
                                    >
                                        {copied === "md5" ? (
                                            <FaCheckCircle className="text-xs text-green-600 dark:text-green-400" />
                                        ) : (
                                            <FaCopy className="text-xs text-slate-400 dark:text-slate-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                                    {device.md5}
                                </p>
                            </div>
                        )}

                        {/* Filename */}
                        {device.filename && (
                            <div className="group p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 transition-colors lg:col-span-2">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Filename
                                    </p>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                device.filename,
                                                "filename"
                                            )
                                        }
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                                        title="Copy Filename"
                                    >
                                        {copied === "filename" ? (
                                            <FaCheckCircle className="text-xs text-green-600 dark:text-green-400" />
                                        ) : (
                                            <FaCopy className="text-xs text-slate-400 dark:text-slate-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                                    {device.filename}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Support Group */}
                    {device.forum && (
                        <a
                            href={device.forum}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                            <span>Join Support Group</span>
                        </a>
                    )}

                    {/* Tabs Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveTab("changelog")}
                                className={`flex-1 px-6 py-4 font-semibold text-sm transition ${
                                    activeTab === "changelog"
                                        ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                Changelog
                            </button>
                            <button
                                onClick={() => setActiveTab("flashing")}
                                className={`flex-1 px-6 py-4 font-semibold text-sm transition ${
                                    activeTab === "flashing"
                                        ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                Installation
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === "changelog" && (
                                    <motion.div
                                        key="changelog"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="max-h-96 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                                                {showFullChangelog
                                                    ? changelog
                                                    : changelog
                                                          .split("\n")
                                                          .slice(0, MAX_LINES)
                                                          .join("\n")}
                                            </pre>
                                        </div>
                                        {changelog.split("\n").length >
                                            MAX_LINES && (
                                            <button
                                                onClick={() =>
                                                    setShowFullChangelog(
                                                        !showFullChangelog
                                                    )
                                                }
                                                className="mt-4 text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition"
                                            >
                                                {showFullChangelog
                                                    ? "Show Less"
                                                    : "View All"}
                                            </button>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === "flashing" && (
                                    <motion.div
                                        key="flashing"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <ol className="space-y-3">
                                            {[
                                                "Unlock the bootloader of your device",
                                                "Install a custom recovery (TWRP/OrangeFox)",
                                                "Boot into recovery and wipe data, cache, dalvik",
                                                "Flash the LumineDroid ZIP file",
                                                "Reboot and enjoy LumineDroid"
                                            ].map((step, index) => (
                                                <li
                                                    key={index}
                                                    className="flex gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                                                >
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs">
                                                        {index + 1}
                                                    </span>
                                                    <span className="flex-1 pt-0.5">
                                                        {step}
                                                    </span>
                                                </li>
                                            ))}
                                        </ol>

                                        {/* Warning */}
                                        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                                            <div className="flex gap-3">
                                                <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 text-sm" />
                                                <div>
                                                    <p className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">
                                                        Warning
                                                    </p>
                                                    <p className="text-xs text-amber-800 dark:text-amber-400">
                                                        Flashing custom ROMs may
                                                        void warranty. Always
                                                        backup your data first.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DownloadDetail;
