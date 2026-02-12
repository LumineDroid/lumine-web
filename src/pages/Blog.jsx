import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaArrowRight,
  FaSpinner,
  FaSearch,
  FaChevronDown,
  FaCode,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

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

const slideInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Parse changelog content with date-based structure
const parseChangelog = (content) => {
  const lines = content.split(/\r?\n/);
  const entries = [];
  let currentEntry = null;

  lines.forEach((line) => {
    const trimmed = line.trim();

    const headerMatch = trimmed.match(/^===\s*(.+?)\s*===$/);

    if (headerMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }

      currentEntry = {
        date: headerMatch[1],
        changes: [],
      };
      return;
    }

    if (currentEntry && trimmed.startsWith("-")) {
      currentEntry.changes.push(trimmed.replace(/^-+\s*/, "").trim());
    }
  });

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries;
};

// Format date to readable format
const formatDate = (dateStr) => {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const date = new Date(dateMatch[1], dateMatch[2] - 1, dateMatch[3]);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return dateStr;
};

// Get unique dates for dropdown
const getUniqueDates = (entries) => {
  const dates = [...new Set(entries.map((e) => e.date))];
  return dates.sort().reverse(); // Newest first
};

// Convert changes array to markdown format
const convertToMarkdown = (changes) => {
  return changes.map((change) => `- ${change}`).join("\n");
};

// Changelog Card Component
const ChangelogCard = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const markdownContent = convertToMarkdown(entry.changes);

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      custom={index}
      className="group relative rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 
                       overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl
                       dark:hover:shadow-blue-500/10 bg-white dark:bg-neutral-900/50 backdrop-blur-sm"
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card Content */}
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* Date Badge - Improved */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                           bg-gradient-to-r from-blue-500 to-blue-600
                                           shadow-md shadow-blue-500/20"
                whileHover={{
                  scale: 1.05,
                  shadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
                }}
              >
                <FaCalendar className="text-xs text-white" />
                <span className="text-sm font-bold text-white">
                  {formatDate(entry.date)}
                </span>
              </motion.div>

              {/* Version Badge - Improved */}
              {entry.version && (
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                               bg-gradient-to-r from-purple-500 to-pink-500
                                               shadow-md shadow-purple-500/20"
                  whileHover={{
                    scale: 1.05,
                    shadow: "0 8px 16px rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <FaCode className="text-xs text-white" />
                  <span className="text-sm font-bold text-white">
                    {entry.version}
                  </span>
                </motion.div>
              )}
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                                       from-blue-600 via-purple-600 to-pink-600
                                       dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
            >
              Changelog Update
            </h3>
          </div>

          {/* Expand Button */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 p-3 rounded-xl transition-all duration-300
                                   bg-gradient-to-br from-blue-500 to-purple-600
                                   text-white shadow-lg shadow-blue-500/30
                                   hover:shadow-xl hover:shadow-blue-500/40"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaArrowRight size={20} />
            </motion.div>
          </motion.button>
        </div>

        {/* Markdown Changes List */}
        <motion.div
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
                                    prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100
                                    prose-p:text-neutral-700 dark:prose-p:text-neutral-300
                                    prose-li:text-neutral-700 dark:prose-li:text-neutral-300
                                    prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100
                                    prose-code:text-purple-600 dark:prose-code:text-purple-400
                                    prose-code:bg-purple-50 dark:prose-code:bg-purple-950/30
                                    prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                    prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800
                                    prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-700
                                    prose-ul:list-disc prose-ul:pl-5
                                    prose-li:marker:text-blue-500 dark:prose-li:marker:text-blue-400"
          >
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Blog = () => {
  const [allChangelogs, setAllChangelogs] = useState([]);
  const [filteredChangelogs, setFilteredChangelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("bellflower");

  // Fetch changelog on mount
  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        setLoading(true);

        const branches = ["bellflower", "bynx"];

        const responses = await Promise.all(
          branches.map((branch) =>
            fetch(
              `https://raw.githubusercontent.com/LumineDroid-Devices/official_devices/refs/heads/${branch}/changelogs/source.txt`,
            ),
          ),
        );

        const texts = await Promise.all(
          responses.map((res) => {
            if (!res.ok) throw new Error("Failed to fetch changelog");
            return res.text();
          }),
        );

        const parsedAll = texts.flatMap((text) => parseChangelog(text));

        const sorted = parsedAll.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        setAllChangelogs(sorted);
        setFilteredChangelogs(sorted);
        setAvailableDates(getUniqueDates(sorted));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  // Filter changelogs based on search and date
  useEffect(() => {
    let filtered = allChangelogs;

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((entry) => entry.date === selectedDate);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter((entry) => {
        const dateMatch = entry.date?.toLowerCase().includes(query);

        const changesMatch = entry.changes?.some((change) =>
          change.toLowerCase().includes(query),
        );

        return dateMatch || changesMatch;
      });
    }

    setFilteredChangelogs(filtered);
  }, [searchQuery, selectedDate, allChangelogs]);

  return (
    <div
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-20 text-center">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            custom={1}
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6
             leading-tight sm:leading-snug md:leading-snug lg:leading-normal
             bg-clip-text text-transparent bg-gradient-to-r 
             from-blue-600 via-purple-600 to-pink-600
             dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
            >
              Changelog
            </h1>
            <p className="text-lg sm:text-l text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Stay up to date with the latest changes and improvements to
              LumineDroid ROM
            </p>
          </motion.div>
        </section>

        {/* Search & Filter Section */}
        {!loading && !error && allChangelogs.length > 0 && (
          <section className="mb-8 sm:mb-12">
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search changelogs..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl
                                                   bg-white dark:bg-neutral-900
                                                   border-2 border-neutral-200 dark:border-neutral-800
                                                   focus:border-blue-500 dark:focus:border-blue-500
                                                   text-neutral-900 dark:text-neutral-100
                                                   placeholder-neutral-400
                                                   transition-colors outline-none"
                  />
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative sm:w-64">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3.5 rounded-xl flex items-center justify-between
                                                   bg-white dark:bg-neutral-900
                                                   border-2 border-neutral-200 dark:border-neutral-800
                                                   hover:border-purple-500 dark:hover:border-purple-500
                                                   text-neutral-900 dark:text-neutral-100
                                                   transition-colors outline-none"
                  >
                    <span className="text-sm font-medium">
                      {selectedDate ? formatDate(selectedDate) : "All Dates"}
                    </span>
                    <motion.div
                      animate={{
                        rotate: isDropdownOpen ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="text-neutral-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                      >
                        <div
                          className="bg-white dark:bg-neutral-900 rounded-xl 
                                                               border-2 border-neutral-200 dark:border-neutral-800 
                                                               shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                        >
                          <motion.button
                            onClick={() => {
                              setSelectedDate("");
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors
                                                                   ${
                                                                     !selectedDate
                                                                       ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                                                                       : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                                                   }`}
                          >
                            All Dates
                          </motion.button>
                          {availableDates.map((date) => (
                            <motion.button
                              key={date}
                              onClick={() => {
                                setSelectedDate(date);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm transition-colors
                                                                       ${
                                                                         selectedDate ===
                                                                         date
                                                                           ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                                                                           : "hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                                                       }`}
                            >
                              {formatDate(date)}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || selectedDate) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDate("");
                    }}
                    className="px-6 py-3.5 rounded-xl
                                                   bg-gradient-to-r from-red-500 to-pink-500
                                                   text-white font-semibold text-sm whitespace-nowrap
                                                   shadow-md shadow-red-500/30
                                                   hover:shadow-lg hover:shadow-red-500/40
                                                   transition-all"
                  >
                    Clear Filters
                  </motion.button>
                )}
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {(searchQuery || selectedDate) && (
                  <motion.div
                    variants={fade}
                    initial="hidden"
                    animate="show"
                    className="text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    Filters: {filteredChangelogs.length} result
                    {filteredChangelogs.length !== 1 ? "s" : ""}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {/* Changelog Content */}
        <section className="mb-16 sm:mb-24">
          {loading && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="flex items-center justify-center gap-4 py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <FaSpinner className="text-2xl text-blue-500" />
              </motion.div>
              <span className="text-lg text-neutral-600 dark:text-neutral-400">
                Loading changelogs...
              </span>
            </motion.div>
          )}

          {error && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="p-6 sm:p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 
                                       border border-red-200 dark:border-red-900/50"
            >
              <p className="text-red-700 dark:text-red-400">
                <span className="font-bold">Error:</span> {error}
              </p>
            </motion.div>
          )}

          {!loading && !error && filteredChangelogs.length === 0 && (
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="show"
              className="p-6 sm:p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-800 
                                       border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <p className="text-neutral-600 dark:text-neutral-400">
                {searchQuery || selectedDate
                  ? "No changelogs match your search. Try adjusting your filters."
                  : "No changelogs found. Check back later for updates!"}
              </p>
            </motion.div>
          )}

          {!loading && !error && filteredChangelogs.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {filteredChangelogs.map((entry, index) => (
                <ChangelogCard
                  key={`${entry.date}-${index}`}
                  entry={entry}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        {!loading && !error && allChangelogs.length > 0 && (
          <section className="mb-16 sm:mb-24">
            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="p-6 sm:p-8 md:p-12 rounded-2xl 
                                       bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
                                       dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20
                                       border border-blue-200 dark:border-blue-900/30"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                About These Updates
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                LumineDroid continuously improves with regular updates. Our
                changelog tracks all changes, bug fixes, and new features added
                to the ROM.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {allChangelogs.length}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Total Updates
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {availableDates.length}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Release Dates
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    2026
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Active Development
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Blog;
