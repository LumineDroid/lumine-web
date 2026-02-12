import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaGithub,
  FaChevronDown,
} from "react-icons/fa";

const GITHUB_URL = "https://github.com/LumineDroid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);
  const menuRef = useRef(null);

  /* =========================
     THEME INIT
  ========================== */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const dark = savedTheme === "dark" || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  /* =========================
     SCROLL DETECTION
  ========================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     CLOSE MENU ON ROUTE CHANGE
  ========================== */
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  /* =========================
     CLOSE MENU ON CLICK OUTSIDE
  ========================== */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  /* =========================
     LOCK BODY SCROLL ON MOBILE MENU OPEN
  ========================== */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative inline-block px-3 py-2 text-sm font-medium transition-all duration-300 group whitespace-nowrap ${
      isActive(path)
        ? isDark
          ? "text-pink-400"
          : "text-pink-600"
        : isDark
          ? "text-slate-300 hover:text-white"
          : "text-slate-600 hover:text-slate-900"
    }`;

  const underlineClass = (path) =>
    `absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ${
      isActive(path)
        ? "w-full bg-gradient-to-r from-pink-500 to-rose-500"
        : isDark
          ? "group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500"
          : "group-hover:w-full bg-gradient-to-r from-pink-400 to-rose-400"
    }`;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? isDark
            ? "bg-slate-950/95 shadow-lg shadow-pink-500/10 border-b border-pink-500/20 backdrop-blur-sm"
            : "bg-white/95 shadow-lg shadow-pink-400/10 border-b border-pink-400/20 backdrop-blur-sm"
          : isDark
            ? "bg-slate-950 border-b border-pink-500/10"
            : "bg-white border-b border-pink-400/10"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 flex-shrink-0 transition-all duration-300 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                LumineDroid
              </h1>
              <p
                className={`text-xs hidden sm:block ${
                  isDark ? "text-pink-400" : "text-pink-600"
                }`}
              >
                OPENSOURCE
              </p>
            </div>
          </Link>

          {/* Desktop Menu - Always visible on desktop, no hamburger */}
          <div
            className={`hidden md:flex items-center gap-1 flex-1 justify-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Link to="/" className={navLinkClass("/")}>
              Home
              <span className={underlineClass("/")}></span>
            </Link>

            <Link to="/team" className={navLinkClass("/team")}>
              Team
              <span className={underlineClass("/team")}></span>
            </Link>

            <Link to="/download" className={navLinkClass("/download")}>
              Download
              <span className={underlineClass("/download")}></span>
            </Link>

            <Link to="/changelog" className={navLinkClass("/changelog")}>
              Changelog
              <span className={underlineClass("/changelog")}></span>
            </Link>

            <Link to="/stats" className={navLinkClass("/stats")}>
              Stats
              <span className={underlineClass("/stats")}></span>
            </Link>
          </div>

          {/* Desktop Action Buttons - Always visible on desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Divider */}
            <div
              className={`h-6 w-px ${
                isDark ? "bg-pink-500/20" : "bg-pink-400/20"
              }`}
            ></div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              <FaGithub size={16} />
              <span>GitHub</span>
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                isDark
                  ? "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 hover:text-pink-300"
                  : "bg-pink-400/10 hover:bg-pink-400/20 text-pink-600 hover:text-pink-700"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
          </div>

          {/* Mobile Only: Theme Toggle & Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400"
                  : "bg-pink-400/10 hover:bg-pink-400/20 text-pink-600"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400"
                  : "bg-pink-400/10 hover:bg-pink-400/20 text-pink-600"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only visible on mobile/small screens */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`pb-4 pt-2 space-y-1 ${
              isDark
                ? "bg-slate-900/50 border-t border-pink-500/10"
                : "bg-white/50 border-t border-pink-400/10"
            }`}
          >
            <Link
              to="/"
              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                isActive("/")
                  ? isDark
                    ? "bg-pink-500/20 text-pink-400 font-medium"
                    : "bg-pink-400/20 text-pink-600 font-medium"
                  : isDark
                    ? "text-slate-300 hover:bg-pink-500/10 hover:text-slate-100"
                    : "text-slate-600 hover:bg-pink-400/10 hover:text-slate-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/team"
              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                isActive("/team")
                  ? isDark
                    ? "bg-pink-500/20 text-pink-400 font-medium"
                    : "bg-pink-400/20 text-pink-600 font-medium"
                  : isDark
                    ? "text-slate-300 hover:bg-pink-500/10 hover:text-slate-100"
                    : "text-slate-600 hover:bg-pink-400/10 hover:text-slate-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Team
            </Link>

            <Link
              to="/download"
              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                isActive("/download")
                  ? isDark
                    ? "bg-pink-500/20 text-pink-400 font-medium"
                    : "bg-pink-400/20 text-pink-600 font-medium"
                  : isDark
                    ? "text-slate-300 hover:bg-pink-500/10 hover:text-slate-100"
                    : "text-slate-600 hover:bg-pink-400/10 hover:text-slate-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Download
            </Link>

            <Link
              to="/changelog"
              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                isActive("/changelog")
                  ? isDark
                    ? "bg-pink-500/20 text-pink-400 font-medium"
                    : "bg-pink-400/20 text-pink-600 font-medium"
                  : isDark
                    ? "text-slate-300 hover:bg-pink-500/10 hover:text-slate-100"
                    : "text-slate-600 hover:bg-pink-400/10 hover:text-slate-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Changelog
            </Link>

            <Link
              to="/stats"
              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                isActive("/stats")
                  ? isDark
                    ? "bg-pink-500/20 text-pink-400 font-medium"
                    : "bg-pink-400/20 text-pink-600 font-medium"
                  : isDark
                    ? "text-slate-300 hover:bg-pink-500/10 hover:text-slate-100"
                    : "text-slate-600 hover:bg-pink-400/10 hover:text-slate-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Stats
            </Link>

            <div
              className={`h-px my-2 ${
                isDark ? "bg-pink-500/10" : "bg-pink-400/10"
              }`}
            ></div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-base transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/40 active:translate-y-0.5"
              onClick={() => setIsOpen(false)}
            >
              <FaGithub size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
