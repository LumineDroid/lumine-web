import { motion } from "framer-motion";

const screenshots = [
  "/ss/1.jpg",
  "/ss/2.jpg",
  "/ss/3.jpg",
  "/ss/4.jpg",
  "/ss/5.jpg",
  "/ss/6.jpg",
];

const ScreenshotShowcase = () => {
  return (
    <section className="mb-14 sm:mb-20 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center"
      >
        Screenshot
      </motion.h2>

      <div className="relative max-w-6xl mx-auto">
        {/* glow */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[320px] h-[320px] bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />
        </div>

        <motion.div
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...screenshots, ...screenshots].map((src, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06, y: -6 }}
              className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px]
                         rounded-xl overflow-hidden
                         bg-white/60 dark:bg-gray-900/60
                         backdrop-blur-lg
                         border border-gray-200 dark:border-gray-800
                         shadow-lg"
            >
              <div className="p-1.5">
                <img
                  src={src}
                  alt="LumineDroid UI"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ScreenshotShowcase;
