import { motion } from "framer-motion";

export default function TechOrbit() {
  const items = [
    { name: "Python",       src: "/logos/python.svg" },
    { name: "TensorFlow",   src: "/logos/tensorflow.svg" },
    { name: "Pandas",       src: "/logos/pandas.svg" },
    { name: "MetaTrader 5", src: "/logos/metatrader5.svg" },
    { name: "Scikit-learn", src: "/logos/scikit-learn.svg" },
  ];

  const radius = 120; // distance logos-photo

  return (
    <div className="relative w-[360px] h-[360px] mx-auto">
      {/* Anneau lumineux */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 blur-3xl -z-10" />

      {/* Photo centrale */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-xl overflow-hidden border border-white/20 shadow-xl">
        <img
          src="/founder.png"
          alt="Anthony Gocmen"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rotation des logos */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((it, i) => {
          const angle = (i / items.length) * 360;
          const style = {
            transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
          };
          return (
            <div
              key={it.name}
              className="absolute top-1/2 left-1/2"
              style={style}
            >
              <motion.div
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-14 h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
              >
                <img src={it.src} alt={it.name} className="w-9 h-9 object-contain" />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
