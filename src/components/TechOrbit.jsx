export default function TechOrbit({
  size = 380,
  photoSize = 132,
  orbitRadius = 130,
  innerRingRadius = 88,
  neonThickness = 20,
  animateOrbit = true,
  orbitPeriod = 36,
  neonPeriod = 14,
  showFounderBand = true,
}) {
  const items = [
    { name: "Python",       src: "/logos/python.png" },
    { name: "TensorFlow",   src: "/logos/tensorflow.png" },
    { name: "Pandas",       src: "/logos/pandas.png" },
    { name: "MetaTrader 5", src: "/logos/mt5.png" },
    { name: "PyPi",         src: "/logos/pypi.png" },
    { name: "Numpy",        src: "/logos/numpy.png" },
  ];

  // Taille des tuiles logo
  const tile = 56;     // wrapper carré arrondi
  const icon = 32;     // taille de l’icône à l’intérieur

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: size, height: size }}
      aria-label="Tech orbit"
    >
      {/* HALO global doux */}
      <div
        className="absolute inset-0 -z-10 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.22), rgba(59,130,246,0.14), transparent 70%)",
        }}
      />

      {/* Anneau NÉON dégradé (conic-gradient) + glow — ANIMÉ */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #8B5CF6, #3B82F6, #22D3EE, #8B5CF6)",
          WebkitMask: `radial-gradient(farthest-side, transparent calc(50% - ${neonThickness}px), black calc(50% - ${neonThickness}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(50% - ${neonThickness}px), black calc(50% - ${neonThickness}px))`,
          filter:
            "drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 8px rgba(59,130,246,0.35))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: neonPeriod, ease: "linear", repeat: Infinity }}
      />

      {/* Bandeau FOUNDER qui coupe le cercle */}
      {showFounderBand && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-20">
          <div className="px-4 py-1 rounded-full border border-white/25 bg-black/55 backdrop-blur-md text-[11px] tracking-[0.18em] font-semibold text-white/95 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
            FOUNDER
          </div>
        </div>
      )}

      {/* Anneau fin interne (entre photo et logos) */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full border border-white/15"
        style={{
          width: innerRingRadius * 2,
          height: innerRingRadius * 2,
          transform: "translate(-50%, -50%)",
          boxShadow: "inset 0 0 12px rgba(139,92,246,0.25)",
        }}
      />

      {/* Photo centrale (rectangle arrondi, style comme la ref) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/15 shadow-xl bg-black/40"
        style={{ width: photoSize, height: photoSize }}
      >
        <img
          src="/founder.png"
          alt="Anthony Gocmen"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Orbite des logos */}
      <motion.div
        className="absolute inset-0"
        animate={animateOrbit ? { rotate: 360 } : undefined}
        transition={
          animateOrbit
            ? { duration: orbitPeriod, ease: "linear", repeat: Infinity }
            : undefined
        }
      >
        {items.map((it, i) => {
          const angle = (i / items.length) * 360;
          const base = `translate(-50%, -50%) rotate(${angle}deg) translate(${orbitRadius}px)`;

          return (
            <div
              key={it.name}
              className="absolute top-1/2 left-1/2"
              style={{ transform: base }}
              title={it.name}
              aria-label={it.name}
            >
              {/* Contre-rotation pour garder le logo droit si l’orbite tourne */}
              <motion.div
                animate={animateOrbit ? { rotate: -360 } : undefined}
                transition={
                  animateOrbit
                    ? { duration: orbitPeriod, ease: "linear", repeat: Infinity }
                    : undefined
                }
                className="rounded-xl bg-white/6 backdrop-blur-md border border-white/12 shadow-lg flex items-center justify-center"
                style={{ width: tile, height: tile }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <img
                  src={it.src}
                  alt={`${it.name} logo`}
                  className="object-contain"
                  style={{ width: icon, height: icon }}
                  draggable={false}
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
