import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTelegram,
    FaCodeBranch,
    FaShieldAlt,
    FaCogs,
    FaDownload,
    FaUserTie,
    FaArrowRight,
    FaGithub
} from "react-icons/fa";

const fade = {
    hidden: { opacity: 0, y: 12 },
    show: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.08 * i, duration: 0.4 }
    })
};

const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const features = [
    {
        icon: FaCodeBranch,
        title: "Source-Based",
        desc: "Built directly from AOSP with optimizations, keeping modifications minimal and readable.",
        color: "from-pink-500 to-rose-500",
        bgColor: "bg-pink-500/10",
        iconColor: "text-pink-600 dark:text-pink-400"
    },
    {
        icon: FaShieldAlt,
        title: "Stability & Security",
        desc: "Prioritizes stability, upstream fixes, and timely security patch integration.",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
        icon: FaCogs,
        title: "Minimal & Clean",
        desc: "No unnecessary features or UI clutter. Focused on real-world daily usage.",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400"
    }
];

const philosophy = [
    "Minimal changes over AOSP",
    "Readable and maintainable source code",
    "No unnecessary features or UI clutter",
    "Focused on real-world daily usage",
    "Regular security updates",
    "Community-driven development"
];

// Full size illustration for hero
const AnimatedIllustration = () => {
    const floatingVariants = {
        animate: {
            y: [0, -15, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const rotateVariants = {
        animate: {
            rotate: [0, 360],
            transition: { duration: 25, repeat: Infinity, ease: "linear" }
        }
    };

    const floatingIcon = delay => ({
        animate: {
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0]
        },
        transition: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" }
    });

    return (
        <motion.div
            className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Gradient Circles - Responsive */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={rotateVariants.animate}
                transition={rotateVariants.transition}
            >
                <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
            </motion.div>

            {/* Main Phone Illustration - Responsive */}
            <motion.div
                className="relative z-10"
                animate={floatingVariants.animate}
            >
                <div className="relative w-24 h-48 sm:w-28 sm:h-56 md:w-32 md:h-64 lg:w-40 lg:h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl border-4 sm:border-8 border-slate-700 overflow-hidden flex-shrink-0">
                    {/* Phone Screen */}
                    <div className="absolute inset-1.5 sm:inset-2 bg-gradient-to-b from-cyan-400/30 to-blue-500/30 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 sm:gap-4">
                        {/* Screen Content - Animated Elements */}
                        <motion.div
                            className="text-white text-center space-y-2 sm:space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-5 h-5 sm:w-8 sm:h-8 bg-pink-500 rounded-full mx-auto" />
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-12 h-1 sm:w-20 sm:h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Notch */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-3 sm:h-5 bg-slate-800 rounded-b-lg z-20" />
                </div>
            </motion.div>

            {/* Floating Icons Around Phone - Responsive Positioning */}
            {/* Icon 1 - Code Branch */}
            <motion.div
                className="absolute top-8 left-4 sm:top-12 sm:left-8 md:top-16 md:left-12 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg flex-shrink-0 z-20"
                animate={floatingIcon(0.2).animate}
                transition={floatingIcon(0.2).transition}
            >
                <FaCodeBranch className="text-base sm:text-lg md:text-xl" />
            </motion.div>

            {/* Icon 2 - Shield */}
            <motion.div
                className="absolute bottom-8 right-4 sm:bottom-12 sm:right-8 md:bottom-16 md:right-12 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg flex-shrink-0 z-20"
                animate={floatingIcon(0.4).animate}
                transition={floatingIcon(0.4).transition}
            >
                <FaShieldAlt className="text-base sm:text-lg md:text-xl" />
            </motion.div>

            {/* Icon 3 - Cogs */}
            <motion.div
                className="absolute top-16 sm:top-24 md:top-32 right-4 sm:right-8 md:right-12 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg flex-shrink-0 z-20"
                animate={floatingIcon(0.3).animate}
                transition={floatingIcon(0.3).transition}
            >
                <FaCogs className="text-base sm:text-lg md:text-xl" />
            </motion.div>
        </motion.div>
    );
};

const Home = () => {
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-4 sm:pt-8 px-4 sm:px-6 md:px-10 lg:px-20 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-7xl mx-auto w-full">
                {/* Hero Section */}
                <section className="mb-16 sm:mb-24 lg:mb-28 pt-8 sm:pt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={slideInLeft}
                            initial="hidden"
                            animate="show"
                            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
                        >
                            <motion.div
                                variants={fade}
                                custom={0}
                                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full 
                                           bg-gradient-to-r from-pink-500/10 to-rose-500/10 
                                           border border-pink-500/20 dark:border-pink-500/30 w-fit"
                            >
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                <span className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 font-medium">
                                    Open Source Project
                                </span>
                            </motion.div>

                            <motion.div variants={fade} custom={1}>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 leading-tight">
                                    LumineDroid
                                </h1>
                            </motion.div>

                            <motion.p
                                variants={fade}
                                custom={2}
                                className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 
                                           leading-relaxed"
                            >
                                A clean, stable, and secure Android custom ROM
                                built from AOSP. Minimal modifications, maximum
                                stability. Open source, community-driven, and
                                built for the future.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={fade}
                                custom={3}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 w-full sm:w-auto"
                            >
                                <motion.button
                                    onClick={() => navigate("/download")}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl
                                               bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-sm sm:text-base
                                               shadow-lg hover:shadow-2xl hover:shadow-pink-600/50
                                               transition-all duration-300 relative overflow-hidden flex-shrink-0 w-full sm:w-auto"
                                >
                                    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                                        <FaDownload className="text-base" />
                                        <span>Download ROM</span>
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600"
                                        initial={{ x: "100%" }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ zIndex: 0 }}
                                    />
                                </motion.button>

                                <motion.a
                                    href="https://t.me/LumineDroidChat/3579"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl
                                               bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm sm:text-base
                                               shadow-lg hover:shadow-2xl hover:shadow-purple-600/50
                                               transition-all duration-300 relative overflow-hidden flex-shrink-0 w-full sm:w-auto"
                                >
                                    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                                        <FaUserTie className="text-base" />
                                        <span>Apply Maintainer</span>
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ x: "100%" }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ zIndex: 0 }}
                                    />
                                </motion.a>
                            </motion.div>
                        </motion.div>

                        {/* Right Illustration */}
                        <motion.div
                            variants={slideInRight}
                            initial="hidden"
                            animate="show"
                            className="order-1 lg:order-2 w-full flex justify-center"
                        >
                            {mounted && <AnimatedIllustration />}
                        </motion.div>
                    </div>
                </section>

                {/* Core Features */}
                <section className="mb-16 sm:mb-24 lg:mb-28">
                    <motion.h2
                        variants={fade}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center"
                    >
                        Core Features
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={i}
                                    variants={scaleUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    custom={i}
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    className="group relative rounded-xl sm:rounded-2xl border border-gray-200/70 
                                               dark:border-gray-800 p-6 sm:p-8
                                               bg-white/60 dark:bg-gray-900/60
                                               backdrop-blur-md hover:shadow-2xl
                                               dark:hover:shadow-2xl dark:hover:shadow-pink-500/10
                                               transition-all duration-300 overflow-hidden"
                                >
                                    {/* Animated Background Gradient */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                    />

                                    {/* Icon Box - FIXED */}
                                    <motion.div
                                        className={`mb-4 sm:mb-6 w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-2xl ${feature.bgColor} flex items-center justify-center
                                                    transform group-hover:scale-110 transition-transform duration-300
                                                    relative z-10 flex-shrink-0`}
                                    >
                                        <Icon
                                            className={`text-2xl sm:text-3xl ${feature.iconColor}`}
                                        />
                                    </motion.div>

                                    <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 relative z-10">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">
                                        {feature.desc}
                                    </p>

                                    {/* Bottom gradient line */}
                                    <motion.div
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}
                                                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Project Philosophy */}
                <section className="mb-16 sm:mb-24 lg:mb-28">
                    <motion.div
                        variants={fade}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                                   dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50
                                   rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 border border-pink-100 
                                   dark:border-gray-800 relative overflow-hidden"
                    >
                        {/* Background Animation */}
                        <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{
                                background: [
                                    "radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
                                    "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
                                ]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 lg:mb-12 text-center">
                                Project Philosophy
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {philosophy.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fade}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        custom={i}
                                        className="flex items-start gap-3 sm:gap-4 group p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300"
                                    >
                                        <motion.div
                                            className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 rounded-full 
                                                        bg-gradient-to-br from-pink-500 to-rose-500 
                                                        flex items-center justify-center mt-0.5 sm:mt-1
                                                        group-hover:scale-125 transition-transform"
                                        >
                                            <svg
                                                className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </motion.div>
                                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                            {item}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="mb-16 sm:mb-24 lg:mb-28">
                    <motion.div
                        variants={fade}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        custom={2}
                        className="flex flex-wrap justify-center gap-3 sm:gap-4"
                    >
                        {[
                            "AOSP",
                            "CodeLinaro",
                            "Android 16",
                            "Security Patches",
                            "Open Source Project"
                        ].map((tech, i) => (
                            <motion.span
                                key={tech}
                                whileHover={{ scale: 1.08, y: -4 }}
                                whileTap={{ scale: 0.96 }}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold
                                           bg-gradient-to-r from-pink-100 to-purple-100
                                           dark:from-pink-950/50 dark:to-purple-950/50
                                           text-pink-700 dark:text-pink-300
                                           border border-pink-200 dark:border-pink-800
                                           shadow-md hover:shadow-lg
                                           transition-all duration-300 cursor-pointer whitespace-nowrap"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>
                </section>

                {/* Credits */}
                <section className="mb-16 sm:mb-24 lg:mb-28">
                    <motion.div
                        variants={fade}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md
                                   rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200 
                                   dark:border-gray-800 hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                ❤️
                            </motion.span>
                            <span>Credits</span>
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            LumineDroid is made possible thanks to the Android
                            Open Source Project (AOSP), CodeLinaro, and
                            contributions from the vibrant open-source Android
                            development community. Special thanks to all
                            maintainers and contributors who make this project a
                            reality.
                        </p>
                    </motion.div>
                </section>

                {/* Community CTA */}
                <section className="mb-8 sm:mb-12 lg:mb-16">
                    <motion.div
                        variants={scaleUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600
                                   rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-white text-center
                                   shadow-2xl shadow-pink-600/50 relative overflow-hidden"
                    >
                        {/* Animated Background */}
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%"]
                            }}
                            transition={{ duration: 15, repeat: Infinity }}
                            style={{
                                backgroundImage:
                                    "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
                                backgroundSize: "40px 40px"
                            }}
                        />

                        <motion.div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                                Join Our Community
                            </h2>
                            <p className="text-pink-50 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                                Contribute to LumineDroid, report issues, get
                                support. Be part of something great!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                                <motion.a
                                    href="https://t.me/LumineDroidChat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5
                                               rounded-xl bg-white text-pink-600
                                               font-bold text-sm sm:text-base shadow-lg hover:shadow-2xl
                                               transition-all duration-300 whitespace-nowrap"
                                >
                                    <FaTelegram className="text-base sm:text-xl" />
                                    <span>Telegram</span>
                                </motion.a>

                                <motion.a
                                    href="https://github.com/LumineDroid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5
                                               rounded-xl bg-white/20 text-white
                                               font-bold text-sm sm:text-base border-2 border-white/50
                                               shadow-lg hover:shadow-2xl hover:bg-white/30
                                               transition-all duration-300 whitespace-nowrap"
                                >
                                    <FaGithub className="text-base sm:text-xl" />
                                    <span>GitHub</span>
                                    <FaArrowRight className="text-sm sm:text-base" />
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default Home;
