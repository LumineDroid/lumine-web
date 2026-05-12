import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  FaCalendar,
  FaSpinner,
  FaSearch,
  FaChevronDown,
  FaGithub,
  FaUser,
  FaCodeBranch,
  FaTimes,
} from "react-icons/fa";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.4 },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const slideInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const getRepoLabel = (url) => {
  if (!url) return null;
  const match = url.match(/github\.com\/LumineDroid\/([^/]+)/);
  if (!match) return null;
  const repo = match[1];
  const map = {
    platform_frameworks_base: "frameworks/base",
    platform_frameworks_native: "frameworks/native",
    platform_packages_apps_Launcher3: "Launcher3",
    platform_packages_apps_LumineSettings: "LumineSettings",
    platform_vendor_lumine: "vendor/lumine",
  };
  return map[repo] || repo.replace(/^platform_/, "").replace(/_/g, "/");
};

const repoColor = (label) => {
  if (!label) return { bg: "bg-neutral-500/10", text: "text-neutral-500" };
  if (label.includes("base"))
    return { bg: "bg-pink-500/10", text: "text-pink-500" };
  if (label.includes("native"))
    return { bg: "bg-orange-500/10", text: "text-orange-500" };
  if (label.includes("Launcher"))
    return { bg: "bg-blue-500/10", text: "text-blue-500" };
  if (label.includes("LumineSettings"))
    return { bg: "bg-purple-500/10", text: "text-purple-500" };
  if (label.includes("vendor"))
    return { bg: "bg-green-500/10", text: "text-green-500" };
  return { bg: "bg-cyan-500/10", text: "text-cyan-500" };
};

const parseChangelogMdx = (content) => {
  const lines = content.split(/\r?\n/);
  const entries = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();

    const dateMatch = trimmed.match(/^##\s+(\d{4}-\d{2}-\d{2})$/);
    if (dateMatch) {
      if (current) entries.push(current);
      current = { date: dateMatch[1], commits: [] };
      continue;
    }

    if (!current) continue;

    const commitMatch = trimmed.match(
      /^\[([a-f0-9]+)\]\((https?:\/\/[^\)]+)\)\s+(.+?)\s+_\(by (.+?)\)_\s*$/
    );
    if (commitMatch) {
      const [, hash, url, message, author] = commitMatch;
      current.commits.push({
        hash,
        url,
        message,
        author,
        repo: getRepoLabel(url),
      });
    }
  }

  if (current) entries.push(current);
  return entries;
};

const formatDate = (dateStr) => {
  const m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return dateStr;
  return new Date(m[1], m[2] - 1, m[3]).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CommitRow = ({ commit, index }) => {
  const color = repoColor(commit.repo);
  return (
    <motion.a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className="group flex items-start gap-3 py-3 px-4 rounded-xl
                 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60
                 transition-all duration-200 -mx-4"
    >
      {/* Commit hash badge */}
      <span
        className="flex-shrink-0 font-mono text-xs px-2 py-1 rounded-md mt-0.5
                       bg-neutral-100 dark:bg-neutral-800
                       text-neutral-500 dark:text-neutral-400
                       group-hover:text-pink-500 dark:group-hover:text-pink-400
                       transition-colors"
      >
        {commit.hash.slice(0, 7)}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {commit.message}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {commit.repo && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${color.bg} ${color.text}`}
            >
              <FaCodeBranch className="text-[10px]" />
              {commit.repo}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <FaUser className="text-[10px]" />
            {commit.author}
          </span>
        </div>
      </div>

      <FaGithub className="flex-shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors mt-1 text-sm" />
    </motion.a>
  );
};

const ChangelogCard = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const count = entry.commits.length;

  const repos = [...new Set(entry.commits.map((c) => c.repo).filter(Boolean))];

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="group relative rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60
                 overflow-hidden
                 bg-white/60 dark:bg-gray-900/60
                 backdrop-blur-md
                 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-pink-500/10
                 transition-all duration-300"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 sm:p-8">
        {/* Header row */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-md shadow-pink-500/20">
              <FaCalendar className="text-[11px] text-white" />
              <span className="text-sm font-bold text-white">
                {formatDate(entry.date)}
              </span>
            </div>

            {/* Stats */}
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {count} commit{count !== 1 ? "s" : ""}
            </span>

            {/* Repo chips */}
            <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
              {repos.slice(0, 4).map((r) => {
                const c = repoColor(r);
                return (
                  <span
                    key={r}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}
                  >
                    {r}
                  </span>
                );
              })}
              {repos.length > 4 && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  +{repos.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 w-8 h-8 rounded-xl
                       bg-gradient-to-br from-pink-500/10 to-purple-500/10
                       dark:from-pink-500/20 dark:to-purple-500/20
                       flex items-center justify-center
                       group-hover:from-pink-500/20 group-hover:to-purple-500/20
                       transition-all"
          >
            <FaChevronDown className="text-pink-500 dark:text-pink-400 text-sm" />
          </motion.div>
        </button>

        {/* Commit list */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="commits"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-0.5">
                {entry.commits.map((commit, i) => (
                  <CommitRow key={commit.hash} commit={commit} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Blog = () => {
  const [allEntries, setAllEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://raw.githubusercontent.com/LumineDroid/cl_gen/refs/heads/main/changelogs.mdx"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const parsed = parseChangelogMdx(text);
        setAllEntries(parsed);
        setFiltered(parsed);
        setAvailableDates(parsed.map((e) => e.date));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChangelog();
  }, []);

  useEffect(() => {
    let result = allEntries;
    if (selectedDate) {
      result = result.filter((e) => e.date === selectedDate);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.date.includes(q) ||
          e.commits.some(
            (c) =>
              c.message.toLowerCase().includes(q) ||
              c.author.toLowerCase().includes(q) ||
              c.hash.startsWith(q) ||
              (c.repo && c.repo.toLowerCase().includes(q))
          )
      );
    }
    setFiltered(result);
  }, [searchQuery, selectedDate, allEntries]);

  const totalCommits = allEntries.reduce((s, e) => s + e.commits.length, 0);
  const hasFilters = searchQuery || selectedDate;

  return (
    <div className="min-h-screen pt-4 sm:pt-8 px-4 sm:px-6 md:px-10 lg:px-20 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto w-full">

        {/* Hero */}
        <section className="mb-12 sm:mb-16 pt-8 sm:pt-12 text-center">
          <motion.div variants={fade} initial="hidden" animate="show" custom={1}>
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full 
                         bg-gradient-to-r from-pink-500/10 to-rose-500/10 
                         border border-pink-500/20 dark:border-pink-500/30 mb-6"
              variants={fade}
              custom={0}
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 font-medium">
                Source Changelog
              </span>
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4
                         bg-clip-text text-transparent bg-gradient-to-r 
                         from-pink-600 via-purple-600 to-blue-600
                         dark:from-pink-400 dark:via-purple-400 dark:to-blue-400
                         leading-tight"
            >
              Changelog
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Every commit that lands in LumineDroid — tracked, attributed, and linked.
            </p>
          </motion.div>
        </section>

        {/* Stats row */}
        {!loading && !error && allEntries.length > 0 && (
          <motion.div
            variants={slideInUp}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12"
          >
            {[
              { label: "Total Commits", value: totalCommits, color: "text-pink-600 dark:text-pink-400" },
              { label: "Release Dates", value: availableDates.length, color: "text-purple-600 dark:text-purple-400" },
              { label: "Active Since", value: "2026", color: "text-blue-600 dark:text-blue-400" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60
                           bg-white/60 dark:bg-gray-900/60 backdrop-blur-md
                           p-4 text-center"
              >
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search & Filter */}
        {!loading && !error && allEntries.length > 0 && (
          <motion.section
            variants={slideInUp}
            initial="hidden"
            animate="show"
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commits, authors, repos..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl
                             bg-white/60 dark:bg-gray-900/60 backdrop-blur-md
                             border border-neutral-200/60 dark:border-neutral-800/60
                             focus:border-pink-400 dark:focus:border-pink-500
                             text-neutral-900 dark:text-neutral-100
                             placeholder-neutral-400 text-sm
                             transition-colors outline-none"
                />
              </div>

              {/* Date dropdown */}
              <div className="relative sm:w-56" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="w-full px-4 py-3 rounded-xl flex items-center justify-between gap-2
                             bg-white/60 dark:bg-gray-900/60 backdrop-blur-md
                             border border-neutral-200/60 dark:border-neutral-800/60
                             hover:border-pink-400 dark:hover:border-pink-500
                             text-neutral-900 dark:text-neutral-100
                             text-sm transition-colors outline-none"
                >
                  <span className="font-medium truncate">
                    {selectedDate ? formatDate(selectedDate) : "All Dates"}
                  </span>
                  <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <FaChevronDown className="text-neutral-400 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50
                                 bg-white dark:bg-neutral-900 rounded-xl
                                 border border-neutral-200 dark:border-neutral-800
                                 shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {["", ...availableDates].map((date) => (
                        <button
                          key={date || "__all__"}
                          onClick={() => { setSelectedDate(date); setIsDropdownOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                            ${selectedDate === date
                              ? "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-semibold"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            }`}
                        >
                          {date ? formatDate(date) : "All Dates"}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear */}
              <AnimatePresence>
                {hasFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSearchQuery(""); setSelectedDate(""); }}
                    className="px-4 py-3 rounded-xl flex items-center gap-2
                               bg-gradient-to-r from-red-500 to-pink-500
                               text-white text-sm font-semibold whitespace-nowrap
                               shadow-md shadow-red-500/20 hover:shadow-lg
                               transition-all"
                  >
                    <FaTimes />
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {hasFilters && (
              <motion.p
                variants={fade}
                initial="hidden"
                animate="show"
                className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 pl-1"
              >
                {filtered.length} date{filtered.length !== 1 ? "s" : ""} ·{" "}
                {filtered.reduce((s, e) => s + e.commits.length, 0)} commits
              </motion.p>
            )}
          </motion.section>
        )}

        {/* Content */}
        <section className="mb-20">
          {loading && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="flex items-center justify-center gap-3 py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <FaSpinner className="text-xl text-pink-500" />
              </motion.div>
              <span className="text-neutral-500 dark:text-neutral-400">
                Fetching changelogs...
              </span>
            </motion.div>
          )}

          {error && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">
                <span className="font-bold">Error:</span> {error}
              </p>
            </motion.div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="p-8 rounded-2xl
                         bg-white/60 dark:bg-gray-900/60 backdrop-blur-md
                         border border-neutral-200/60 dark:border-neutral-800/60
                         text-center"
            >
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                {hasFilters
                  ? "No commits match your search. Try adjusting filters."
                  : "No changelogs found."}
              </p>
            </motion.div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((entry, i) => (
                <ChangelogCard key={entry.date} entry={entry} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;

