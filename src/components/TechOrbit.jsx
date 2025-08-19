import { motion } from "framer-motion";

export default function TechOrbit() {
  const items = [
    { name: "Python",       src: "/logos/python.png" },
    { name: "TensorFlow",   src: "/logos/tensorflow.png" },
    { name: "Pandas",       src: "/logos/pandas.png" },
    { name: "MetaTrader 5", src: "/logos/mt5.png" },
    { name: "PyPi", src: "/logos/pypi.png" },
    { name: "Numpy", src: "/logos/numpy.png" },
  ];

   // Tailles
  const box = 360;           // taille du composant
  const orbitRadius = 120;   // distance centre -> logos
  const innerRing = 80;      // rayon anneau fin interne
  const neonThickness = 18;  // épaisseur de l’anneau néon

  return (
    <div className="relative mx-auto" style={{ width: box, height: box }}>
      {/* Halo doux de fond */}
      <div className="absolute inset-0 -z-10 rounded-full blur-2xl"
           style={{
             background: "radial-gradient(closest-side, rgba(139,92,246,0.25), rgba(59,130,246,0.15), transparent 70%)"
           }}
      />

      {/* Anneau NEON (conic-gradient animé, avec masque pour ne garder que le bord) */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, #8B5CF6, #3B82F6, #22D3EE, #8B5CF6)",
          WebkitMask:
            `radial-gradient(farthest-side, transparent calc(50% - ${neonThickness}px), black calc(50% - ${neonThickness}px))`,
          mask:
            `radial-gradient(farthest-side, transparent calc(50% - ${neonThickness}px), black calc(50% - ${neonThickness}px))`,
          borderRadius: "9999px",
          filter: "drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 8px rgba(59,130,246,0.35))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      />

      {/* Badge FOUNDER qui “coupe” l’anneau */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-20">
        <div className="px-4 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-xs tracking-widest font-semibold">
          FOUNDER
        </div>
      </div>

      {/* Anneau fin interne (entre la photo et les logos) */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full border border-white/15"
        style={{
          width: innerRing * 2,
          height: innerRing * 2,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* léger glow */}
        <div className="absolute inset-0 rounded-full blur-[2px] opacity-50"
             style={{ boxShadow: "0 0 10px rgba(139,92,246,0.35) inset" }}/>
      </div>

      {/* Photo centrale */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden border border-white/20 shadow-xl"
           style={{ width: 128, height: 128 }}>
        <img src="/founder.png" alt="Anthony Gocmen" className="w-full h-full object-cover" />
      </div>

      {/* Conteneur orbitant */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((it, i) => {
          const angle = (i / items.length) * 360;
          const wrapperStyle = {
            transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${orbitRadius}px) rotate(${-angle}deg)`,
          };
          return (
            <div
              key={it.name}
              className="absolute top-1/2 left-1/2"
              style={wrapperStyle}
              title={it.name}
              aria-label={it.name}
            >
              {/* Contre-rotation pour rester droit malgré l’orbite globale */}
              <motion.div
                // annule la rotation du conteneur parent (même durée/sens opposé)
                animate={{ rotate: -360 }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.12, y: -2 }}
              >
                <img
                  src={it.src}
                  alt={`${it.name} logo`}
                  className="w-8 h-8 md:w-9 md:h-9 object-contain"
                  loading="lazy"
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
