import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const DownloadDetail = () => {
    const { codename } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [error, setError] = useState(null);
    const [changelog, setChangelog] = useState("");
    const [showFullChangelog, setShowFullChangelog] = useState(false);
    const [activeTab, setActiveTab] = useState("changelog");
    const [loading, setLoading] = useState(true);
    const MAX_LINES = 15;

    useEffect(() => {
        fetchDeviceDetails();
    }, [codename]);

    const fetchDeviceDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // First, fetch from devices.json to get the device info
            const devicesResponse = await fetch(
                "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/devices.json"
            );
            const devicesData = await devicesResponse.json();

            // Find device across all brands
            let baseDevice = null;
            Object.keys(devicesData).forEach(brand => {
                const devices = Array.isArray(devicesData[brand])
                    ? devicesData[brand]
                    : [];
                const device = devices.find(d => d.codename === codename);
                if (device && !baseDevice) {
                    baseDevice = {
                        ...device,
                        brand,
                        image: `https://github.com/LumineDroid-Devices/official_devices/raw/refs/heads/bellflower/assets/devices/${device.codename}.webp`
                    };
                }
            });

            if (!baseDevice) {
                setError("Device not found.");
                setLoading(false);
                return;
            }

            // Fetch device details from API
            const apiUrl = `https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/API/${codename}.json`;
            let detailedDevice = baseDevice;

            try {
                const apiResponse = await fetch(apiUrl);
                if (apiResponse.ok) {
                    const apiData = await apiResponse.json();
                    if (apiData.response && apiData.response.length > 0) {
                        const apiInfo = apiData.response[0];
                        detailedDevice = {
                            ...baseDevice,
                            ...apiInfo
                        };
                    }
                }
            } catch {
                // If API fetch fails, continue with base device info
                console.log("API data not available, using base device info");
            }

            setDevice(detailedDevice);

            // Fetch changelog
            const changelogUrl = `https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/changelogs/${codename}.txt`;
            try {
                const changelogRes = await fetch(changelogUrl);
                if (changelogRes.ok) {
                    const text = await changelogRes.text();
                    setChangelog(text);
                } else {
                    setChangelog("Changelog not available for this device.");
                }
            } catch {
                setChangelog("Changelog not available for this device.");
            }
        } catch (err) {
            console.error("Error fetching device details:", err);
            setError("Failed to fetch device details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-8 pb-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 mb-4">
                        <div className="animate-spin w-8 h-8 border-4 border-pink-500/20 border-t-pink-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            Loading device details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-8 pb-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block p-8 rounded-2xl bg-red-100/50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/30">
                        <p className="text-red-700 dark:text-red-400 text-lg font-medium mb-4">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate("/download")}
                            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition duration-300"
                        >
                            Back to Download
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!device) return null;

    return (
        <div className="min-h-screen pt-8 pb-4">
            <div className="mx-auto px-2">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate("/download")}
                    className="flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium mb-8 transition duration-300"
                >
                    <FaArrowLeft size={18} />
                    Back to Downloads
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 border border-pink-200 dark:border-pink-500/20 rounded-2xl"></div>

                    <div className="absolute -inset-px bg-gradient-to-br from-pink-400/30 to-blue-500/20 dark:from-pink-500/15 dark:to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="relative p-8 sm:p-12 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-grow">
                                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                                        {device.name}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {device.brand} Device
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-pink-100/70 dark:bg-pink-500/20 px-4 py-2 rounded-lg border border-pink-200/50 dark:border-pink-500/30 flex-shrink-0">
                                    <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                                        {device.codename}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-yellow-100/70 dark:bg-yellow-500/10 border border-yellow-200/50 dark:border-yellow-500/30 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    <span className="font-semibold">
                                        ⚠️ Warning:
                                    </span>{" "}
                                    This ROM is provided as-is without any
                                    warranty. Please make a full backup before
                                    flashing.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 flex justify-center">
                                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 w-full max-w-xs h-64 border border-slate-200/50 dark:border-slate-700/50">
                                    <img
                                        src={device.image}
                                        alt={device.name}
                                        className="w-full h-full object-contain p-4"
                                        onError={e => {
                                            e.target.src =
                                                "https://via.placeholder.com/300x400?text=" +
                                                encodeURIComponent(device.name);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Maintainer
                                    </h3>
                                    <p className="text-lg text-pink-600 dark:text-pink-400 font-medium">
                                        {device.maintainer || "N/A"}
                                    </p>
                                </div>

                                <div className="space-y-3 text-sm">
                                    {device.version && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Version:
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white ml-2">
                                                {device.version}
                                            </span>
                                        </div>
                                    )}

                                    {device.buildtype && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Build Type:
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white ml-2">
                                                {device.buildtype}
                                            </span>
                                        </div>
                                    )}

                                    {device.currently_maintained !==
                                        undefined && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Supported:
                                            </span>
                                            <span
                                                className={`font-semibold ml-2 ${
                                                    device.currently_maintained
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {device.currently_maintained
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>
                                    )}

                                    {device.size && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Size:
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white ml-2">
                                                {(
                                                    device.size /
                                                    1024 ** 3
                                                ).toFixed(2)}{" "}
                                                GB
                                            </span>
                                        </div>
                                    )}

                                    {device.md5 && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                MD5:
                                            </span>
                                            <span className="font-mono text-xs text-slate-700 dark:text-slate-300 ml-2 break-all">
                                                {device.md5}
                                            </span>
                                        </div>
                                    )}

                                    {device.sha256 && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                SHA256:
                                            </span>
                                            <span className="font-mono text-xs text-slate-700 dark:text-slate-300 ml-2 break-all">
                                                {device.sha256}
                                            </span>
                                        </div>
                                    )}

                                    {device.forum && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Forum:
                                            </span>
                                            <a
                                                href={device.forum}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 ml-2 font-medium"
                                            >
                                                Join Discussion
                                            </a>
                                        </div>
                                    )}

                                    {device.github && (
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                GitHub:
                                            </span>
                                            <a
                                                href={device.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 ml-2 font-medium"
                                            >
                                                View Profile
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={device.download || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 mt-4 ${
                                        device.download
                                            ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-0.5"
                                            : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                    }`}
                                    disabled={!device.download}
                                >
                                    <FaDownload size={18} />
                                    {device.download
                                        ? "Download ROM"
                                        : "Link Unavailable"}
                                </a>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-500/30 to-transparent"></div>

                        <div className="space-y-6">
                            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setActiveTab("changelog")}
                                    className={`pb-3 font-medium transition-all duration-300 ${
                                        activeTab === "changelog"
                                            ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                                    }`}
                                >
                                    Changelog
                                </button>
                                <button
                                    onClick={() => setActiveTab("flashing")}
                                    className={`pb-3 font-medium transition-all duration-300 ${
                                        activeTab === "flashing"
                                            ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                                    }`}
                                >
                                    Flashing Instructions
                                </button>
                            </div>

                            {activeTab === "changelog" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                            Latest Changes
                                        </h3>
                                        <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono overflow-x-auto max-h-96">
                                            {showFullChangelog
                                                ? changelog
                                                : changelog
                                                      .split("\n")
                                                      .slice(0, MAX_LINES)
                                                      .join("\n")}
                                        </pre>
                                        {changelog.split("\n").length >
                                            MAX_LINES && (
                                            <button
                                                onClick={() =>
                                                    setShowFullChangelog(
                                                        !showFullChangelog
                                                    )
                                                }
                                                className="mt-4 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium transition duration-300"
                                            >
                                                {showFullChangelog
                                                    ? "Show Less"
                                                    : "View All"}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "flashing" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                                            Installation Steps
                                        </h3>
                                        <ol className="space-y-3 text-slate-700 dark:text-slate-300">
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                                                    1.
                                                </span>
                                                <span>
                                                    Unlock the bootloader of
                                                    your device.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                                                    2.
                                                </span>
                                                <span>
                                                    Install a custom recovery
                                                    (e.g., TWRP).
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                                                    3.
                                                </span>
                                                <span>
                                                    Boot into recovery and wipe
                                                    data, cache, and dalvik /
                                                    format data.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                                                    4.
                                                </span>
                                                <span>
                                                    Flash the LumineDroid ZIP
                                                    file.
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-pink-600 dark:text-pink-400 flex-shrink-0">
                                                    5.
                                                </span>
                                                <span>
                                                    Reboot your device and enjoy
                                                    LumineDroid!
                                                </span>
                                            </li>
                                        </ol>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DownloadDetail;
