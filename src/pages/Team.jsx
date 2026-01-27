import React, { useEffect, useState } from "react";
import {
    FaTelegramPlane,
    FaGithub,
    FaEnvelope,
    FaLinkedin
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Team = () => {
    const [coreTeam, setCoreTeam] = useState([]);
    const [maintainers, setMaintainers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const getMaintainerAvatarUrl = githubUrl => {
        if (!githubUrl) {
            return `https://ui-avatars.com/api/?name=Avatar&background=0D8ABC&color=fff&bold=true`;
        }

        const match = githubUrl.match(/github\.com\/([a-zA-Z0-9-]+)/);
        const username = match ? match[1] : null;

        if (username) {
            return `https://github.com/${username}.png`;
        }

        return `https://ui-avatars.com/api/?name=Avatar&background=0D8ABC&color=fff&bold=true`;
    };

    const fetchTeamData = async () => {
        try {
            setLoading(true);

            const teamResponse = await fetch("/team.json");
            const teamData = await teamResponse.json();

            const enrichedTeam = teamData.map(member => ({
                ...member,
                type: member.type || "team",
                description: member.description || member.role
            }));

            const devicesUrl =
                "https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/bellflower/devices.json";
            const response = await fetch(devicesUrl);
            const devicesData = await response.json();

            const maintainerMap = {};

            Object.keys(devicesData).forEach(brand => {
                const devices = Array.isArray(devicesData[brand])
                    ? devicesData[brand]
                    : [];

                devices.forEach(device => {
                    if (!device.maintainer) return;

                    const name = device.maintainer;
                    const deviceName = device.name;
                    const codename = device.codename;
                    const github = device.github || "";
                    const telegram = device.telegram || "";

                    const key = name.toLowerCase();

                    if (!maintainerMap[key]) {
                        maintainerMap[key] = {
                            name,
                            github,
                            telegram,
                            devices: []
                        };
                    }

                    maintainerMap[key].devices.push({
                        name: deviceName,
                        codename
                    });
                });
            });

            const maintainersList = Object.values(maintainerMap).map(m => {
                return {
                    name: m.name,
                    type: "maintainer",
                    github: m.github,
                    telegram: m.telegram,
                    devices: m.devices,
                    role:
                        m.devices.length === 1
                            ? `${m.devices[0].name} (${m.devices[0].codename})`
                            : `${m.devices
                                  .map(d => `${d.name} (${d.codename})`)
                                  .join(", ")}`,
                    image: getMaintainerAvatarUrl(m.github)
                };
            });

            const mergedTeam = enrichedTeam.map(core => {
                const maintData = maintainerMap[core.name.toLowerCase()];
                return {
                    ...core,
                    image: core.image || getMaintainerAvatarUrl(core.github),
                    devices: maintData?.devices || [],
                    maintainerRole: maintData?.role || null,
                    isCoreMaintainer: !!maintData
                };
            });

            const additionalMaintainers = maintainersList.filter(
                m =>
                    !enrichedTeam.some(
                        c => c.name.toLowerCase() === m.name.toLowerCase()
                    )
            );

            setCoreTeam(mergedTeam);
            setMaintainers(additionalMaintainers);

            console.log(
                `Loaded ${mergedTeam.length} core team and ${additionalMaintainers.length} device maintainers`
            );
        } catch (error) {
            console.error("Error fetching team data:", error);
            try {
                const teamResponse = await fetch("/team.json");
                const teamData = await teamResponse.json();
                const enrichedTeam = teamData.map(member => ({
                    ...member,
                    type: member.type || "team",
                    description: member.description || member.role,
                    image: member.image || getMaintainerAvatarUrl(member.github)
                }));
                setCoreTeam(enrichedTeam);
            } catch (fallbackError) {
                console.error("Fallback error:", fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const MemberCard = ({ member, isMaintainer = false }) => {
        const githubUrl = member.github?.startsWith("http")
            ? member.github
            : member.github
            ? `https://github.com/${member.github}`
            : "";

        const telegramUrl = member.telegram?.startsWith("http")
            ? member.telegram
            : member.telegram
            ? `https://t.me/${member.telegram}`
            : "";

        const avatarUrl = member.image?.startsWith("http")
            ? member.image
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name
              )}&background=0D8ABC&color=fff&bold=true`;

        return (
            <div
                className="group relative overflow-hidden rounded-2xl transition-all duration-500"
                data-aos="fade-up"
            >
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 border border-pink-200 dark:border-pink-500/20 rounded-2xl"></div>

                <div className="absolute -inset-px bg-gradient-to-br from-pink-400/30 to-blue-500/20 dark:from-pink-500/15 dark:to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute -inset-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>

                            <img
                                src={avatarUrl}
                                alt={member.name}
                                className="relative w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full ring-1 ring-pink-200 dark:ring-pink-500/30 group-hover:ring-pink-500/50 dark:group-hover:ring-pink-500/50 transition-all duration-500 shadow-lg"
                                loading="lazy"
                                onError={e => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        member.name
                                    )}&background=0D8ABC&color=fff&bold=true`;
                                }}
                            />
                        </div>
                    </div>

                    <div className="text-center space-y-2 flex-grow">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                            {member.name}
                        </h3>

                        {member.type === "team" && (
                            <>
                                {member.role && (
                                    <p className="text-sm sm:text-base font-medium text-cyan-600 dark:text-cyan-400">
                                        {member.role}
                                    </p>
                                )}

                                {member.devices &&
                                    member.devices.length > 0 && (
                                        <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {member.devices.length === 1
                                                ? `Maintains: ${member.devices[0].name} (${member.devices[0].codename})`
                                                : `Maintains: ${member.devices
                                                      .map(
                                                          d =>
                                                              `${d.name} (${d.codename})`
                                                      )
                                                      .join(", ")}`}
                                        </p>
                                    )}
                            </>
                        )}

                        {member.type === "maintainer" && member.role && (
                            <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                                {member.role}
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-500/30 to-transparent my-6"></div>

                    <div className="flex justify-center gap-3">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <FaGithub size={16} />
                            </a>
                        )}
                        {telegramUrl && (
                            <a
                                href={telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-cyan-100/50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-300 hover:scale-110"
                                aria-label="Telegram"
                            >
                                <FaTelegramPlane size={16} />
                            </a>
                        )}
                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-blue-100/50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={16} />
                            </a>
                        )}
                        {member.email && (
                            <a
                                href={`mailto:${member.email}`}
                                className="p-2.5 rounded-xl bg-red-100/50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 hover:scale-110"
                                aria-label="Email"
                            >
                                <FaEnvelope size={16} />
                            </a>
                        )}
                    </div>

                    {isMaintainer && (
                        <div className="mt-6 flex justify-center">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-pink-100/70 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-500/30">
                                Maintainer
                            </span>
                        </div>
                    )}

                    {member.type === "team" && !isMaintainer && (
                        <div className="mt-6 flex justify-center">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-pink-100/70 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-500/30">
                                Core Team
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-8 pb-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 mb-4">
                        <div className="animate-spin w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            Loading team members...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20" data-aos="fade-down">
                    <span className="inline-block px-4 py-2 rounded-full bg-cyan-100/50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-4 border border-cyan-200/50 dark:border-cyan-500/20">
                        Our Community
                    </span>
                    <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        Meet the Team
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Passionate developers and designers building the future
                        of Android customization with innovation and dedication.
                    </p>
                </div>

                {coreTeam.length > 0 && (
                    <div className="mb-24">
                        <div
                            className="flex items-center gap-3 mb-12"
                            data-aos="fade-right"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Core Team
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coreTeam.map((member, index) => (
                                <MemberCard
                                    key={index}
                                    member={member}
                                    isMaintainer={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {coreTeam.length > 0 && maintainers.length > 0 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent my-24"></div>
                )}

                {maintainers.length > 0 && (
                    <div>
                        <div
                            className="flex items-center gap-3 mb-12"
                            data-aos="fade-right"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                Device Maintainers ({maintainers.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {maintainers.map((member, index) => (
                                <MemberCard
                                    key={index}
                                    member={member}
                                    isMaintainer={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {coreTeam.length === 0 && maintainers.length === 0 && (
                    <div className="text-center py-20" data-aos="fade-up">
                        <div className="inline-block p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                No team members found
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
