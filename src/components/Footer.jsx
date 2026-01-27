import { FaGithub, FaTelegram, FaEnvelope, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-pink-200 dark:border-pink-500/20 text-slate-600 dark:text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                    {/* Brand Section */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                                LumineDroid
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Custom ROM
                            </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Experience the next-gen open-source Android ROM with
                            stability, performance, and customization.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                            Navigation
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/download"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    Download
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://github.com/LumineDroid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://t.me/LumineDroidChat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    Telegram Chat
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://t.me/LumineDroidNews"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300"
                                >
                                    News Channel
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                            Follow Us
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/LumineDroid"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800/50 hover:bg-pink-200 dark:hover:bg-pink-500/20 border border-slate-300 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500/30 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300"
                                aria-label="GitHub"
                            >
                                <FaGithub size={18} />
                            </a>
                            <a
                                href="https://t.me/LumineDroidChat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800/50 hover:bg-pink-200 dark:hover:bg-pink-500/20 border border-slate-300 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500/30 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300"
                                aria-label="Telegram"
                            >
                                <FaTelegram size={18} />
                            </a>
                            <a
                                href="mailto:contact@luminedroid.com"
                                className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800/50 hover:bg-pink-200 dark:hover:bg-pink-500/20 border border-slate-300 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500/30 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300"
                                aria-label="Email"
                            >
                                <FaEnvelope size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-500/20 to-transparent"></div>

                {/* Bottom Section */}
                <div className="py-8 space-y-4 text-center sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        &copy; {currentYear} LumineDroid. All rights reserved.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>Made with</span>
                        <FaHeart className="text-pink-500" size={14} />
                        <span>by the community</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        LumineDroid is not affiliated with Google or Android.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
