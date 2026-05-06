import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';

/* ── EXPRESSIONS SAMPLE DATA ── */
const expressions = [
  {
    mot: 'Stricto sensu',
    nature: 'Locution latine',
    definition: 'Au sens strict, en s\'en tenant rigoureusement à la lettre d\'un texte ou d\'un principe.',
    exemple: '« Stricto sensu, cette disposition ne s\'applique qu\'aux contrats conclus après la promulgation de la loi. »',
    origine: 'Droit romain · Droit public',
  },
  {
    mot: 'Mutatis mutandis',
    nature: 'Locution latine',
    definition: 'En changeant ce qui doit être changé ; en faisant les adaptations nécessaires tout en conservant l\'essentiel.',
    exemple: '« Le même raisonnement vaut, mutatis mutandis, pour les collectivités territoriales. »',
    origine: 'Logique · Philosophie',
  },
  {
    mot: 'Partant',
    nature: 'Locution française soutenue',
    definition: 'Par conséquent, en conséquence de quoi. Marque une conclusion qui découle logiquement de ce qui précède.',
    exemple: '« Les ressources sont insuffisantes ; partant, toute expansion est à exclure à court terme. »',
    origine: 'Prose administrative · Essai',
  },
  {
    mot: 'A fortiori',
    nature: 'Locution latine',
    definition: 'À plus forte raison. Désigne un raisonnement où une conclusion s\'impose encore plus sûrement que celle d\'un argument déjà établi.',
    exemple: '« S\'il est sévère avec ses proches, il le sera a fortiori avec des inconnus. »',
    origine: 'Rhétorique · Argumentation',
  },
  {
    mot: 'Nonobstant',
    nature: 'Préposition française soutenue',
    definition: 'Malgré, en dépit de, sans tenir compte de. Marque l\'opposition ou la concession dans un registre formel.',
    exemple: '« Nonobstant les objections formulées, le tribunal a confirmé sa décision initiale. »',
    origine: 'Droit · Langue classique',
  },
  {
    mot: 'En l\'espèce',
    nature: 'Locution juridique',
    definition: 'Dans le cas présent, dans l\'affaire dont il s\'agit. Désigne les faits spécifiques soumis à l\'examen.',
    exemple: '« En l\'espèce, les circonstances ne permettent pas d\'invoquer la force majeure. »',
    origine: 'Droit · Jurisprudence',
  },
];

/* ── FEATURE CARDS ── */
const features = [
  {
    icone: '⏱',
    titre: 'Répétition espacée',
    texte: 'Chaque expression est révisée aux intervalles optimaux — J+1, J+3, J+7 — pour ancrer durablement le vocabulaire en mémoire à long terme.',
  },
  {
    icone: '📖',
    titre: 'Contexte littéraire',
    texte: 'Chaque locution est présentée dans son contexte d\'origine — texte juridique, discours philosophique ou prose académique — pour en comprendre l\'usage réel.',
  },
  {
    icone: '✦',
    titre: 'Micro-leçons quotidiennes',
    texte: 'Cinq minutes par jour. Une expression, sa définition précise, un exemple d\'usage correct, une erreur fréquente à éviter.',
  },
  {
    icone: '◈',
    titre: 'Parcours progressifs',
    texte: 'Des niveaux structurés du registre administratif à la prose philosophique — pour construire une maîtrise durable, expression après expression.',
  },
];

/* ── EXPRESSION CARD ── */
function ExpressionCard({ expr, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="border border-amber-500/15 rounded-xl overflow-hidden bg-[#0d0b08] hover:border-amber-500/30 transition-colors duration-300 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-500/50">
              {expr.nature}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-amber-100/90 tracking-tight italic">
            {expr.mot}
          </h3>
          {!open && (
            <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed line-clamp-1">
              {expr.definition}
            </p>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-amber-500/40 flex-shrink-0 mt-1.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-amber-500/10 pt-4 space-y-3">
              <p className="text-neutral-300 text-sm leading-relaxed">
                {expr.definition}
              </p>
              <div className="pl-3 border-l-2 border-amber-500/20">
                <p className="text-neutral-400 text-xs leading-relaxed italic">
                  {expr.exemple}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500/30">Domaines</span>
                <span className="text-[10px] text-amber-500/50 font-mono">{expr.origine}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── MAIN PAGE ── */
export default function Faconde() {
  return (
    <>
      <Helmet>
        <title>Faconde — Maîtrisez le français d'excellence</title>
        <meta
          name="description"
          content="Application mobile d'apprentissage des locutions savantes et expressions soutenues du français. Stricto sensu, mutatis mutandis, partant — une expression par jour."
        />
      </Helmet>

      <div className="min-h-screen text-[#e8dfc8] font-sans antialiased" style={{ backgroundColor: '#08070a' }}>

        {/* ── AMBIENT GLOWS ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(196,151,58,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(180,130,50,0.04) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(150,100,40,0.03) 0%, transparent 70%)' }} />
        </div>

        {/* ── NAV ── */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/[0.06]"
          style={{ backgroundColor: 'rgba(8,7,10,0.85)' }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center relative">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md opacity-80" />
                <span className="text-[14px] font-medium text-neutral-400 tracking-tight">AG Algo Lab</span>
              </Link>
              {/* Centered quill */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <span className="text-xl" style={{ color: 'rgba(196,151,58,0.5)' }}>✒</span>
              </div>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">

            {/* Building badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-10"
              style={{
                background: 'rgba(196,151,58,0.06)',
                borderColor: 'rgba(196,151,58,0.2)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c4973a' }} />
              <span className="text-xs font-mono tracking-wide" style={{ color: 'rgba(196,151,58,0.75)' }}>
                En développement · Android
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-semibold tracking-[-0.04em] mb-6 leading-[1.0]"
              style={{
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                color: '#e8dfc8',
              }}
            >
              Faconde
            </motion.h1>

            {/* Ornement */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-px w-16" style={{ background: 'rgba(196,151,58,0.3)' }} />
              <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: 'rgba(196,151,58,0.5)' }}>
                n.f. — Facilité, élégance du discours
              </span>
              <div className="h-px w-16" style={{ background: 'rgba(196,151,58,0.3)' }} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'rgba(232,223,200,0.5)' }}
            >
              Une application mobile pour apprendre, comprendre et maîtriser les expressions soutenues
              du français — locutions latines, tournures savantes, registre d'excellence.
            </motion.p>

            {/* Expressions preview tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-2.5 mt-10"
            >
              {['stricto sensu', 'mutatis mutandis', 'partant', 'a fortiori', 'nonobstant', 'en l\'espèce'].map((expr) => (
                <span
                  key={expr}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono italic border"
                  style={{
                    background: 'rgba(196,151,58,0.04)',
                    borderColor: 'rgba(196,151,58,0.12)',
                    color: 'rgba(196,151,58,0.65)',
                  }}
                >
                  {expr}
                </span>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ── QU'EST-CE QUE FACONDE ── */}
        <section className="py-28 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(196,151,58,0.4)' }}>
                Le projet
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6" style={{ color: '#e8dfc8' }}>
                La langue comme héritage.
              </h2>
              <div className="max-w-3xl space-y-4">
                <p className="text-base leading-relaxed" style={{ color: 'rgba(232,223,200,0.55)' }}>
                  Le français soutenu — celui des grands textes, des plaidoiries, des essais — n'est plus enseigné
                  systématiquement. Les expressions qui distinguent un écrit d'excellence d'un écrit ordinaire
                  s'acquièrent aujourd'hui par osmose, ou pas du tout.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(232,223,200,0.55)' }}>
                  Faconde est une application mobile qui change cela. Elle enseigne les locutions latines et les
                  tournures soutenues du français à travers des micro-leçons quotidiennes — chaque expression
                  présentée dans son contexte d'origine, avec sa définition exacte, son usage correct et les
                  erreurs à éviter.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(232,223,200,0.55)' }}>
                  Conçue pour les étudiants en droit, en sciences politiques, en classes préparatoires —
                  et pour tous ceux qui exigent de leur expression la même précision qu'ils accordent à leurs idées.
                </p>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { val: '300+', lbl: 'Expressions au lancement' },
                { val: '5 min', lbl: 'Par jour suffisent' },
                { val: 'J+1 · J+3 · J+7', lbl: 'Répétition espacée' },
                { val: 'Android', lbl: 'Première version' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 border text-center"
                  style={{
                    background: 'rgba(196,151,58,0.03)',
                    borderColor: 'rgba(196,151,58,0.1)',
                  }}
                >
                  <div className="text-lg font-semibold font-mono mb-1" style={{ color: '#c4973a' }}>{s.val}</div>
                  <div className="text-[11px] uppercase tracking-wider" style={{ color: 'rgba(232,223,200,0.35)' }}>{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── EXPRESSIONS ── */}
        <section className="py-28 px-6 relative">
          {/* Séparateur */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: 'rgba(196,151,58,0.1)' }} />
              <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(196,151,58,0.4)' }}>
                Quelques expressions
              </span>
              <div className="h-px flex-1" style={{ background: 'rgba(196,151,58,0.1)' }} />
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3" style={{ color: '#e8dfc8' }}>
                Ce que vous apprendrez.
              </h2>
              <p className="text-sm" style={{ color: 'rgba(232,223,200,0.4)' }}>
                Cliquez sur une expression pour en voir la définition complète et un exemple d'usage.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3">
              {expressions.map((expr, i) => (
                <ExpressionCard key={expr.mot} expr={expr} index={i} />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center text-xs font-mono mt-8 italic"
              style={{ color: 'rgba(196,151,58,0.3)' }}
            >
              et des centaines d'autres — locutions latines, prépositions archaïques, connecteurs logiques, formules rhétoriques.
            </motion.p>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-28 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(196,151,58,0.4)' }}>
                Fonctionnalités
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: '#e8dfc8' }}>
                Conçu pour mémoriser.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="rounded-xl p-6 border"
                  style={{
                    background: 'rgba(196,151,58,0.02)',
                    borderColor: 'rgba(196,151,58,0.1)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-4 border"
                    style={{
                      background: 'rgba(196,151,58,0.07)',
                      borderColor: 'rgba(196,151,58,0.15)',
                    }}
                  >
                    {f.icone}
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#e8dfc8' }}>{f.titre}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,223,200,0.45)' }}>{f.texte}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POUR QUI ── */}
        <section className="py-28 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1" style={{ background: 'rgba(196,151,58,0.1)' }} />
              <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(196,151,58,0.4)' }}>
                Pour qui
              </span>
              <div className="h-px flex-1" style={{ background: 'rgba(196,151,58,0.1)' }} />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  titre: 'Étudiants en concours',
                  texte: 'Droit, Sciences Po, IEP, classes préparatoires, CRPE, concours administratifs. Là où le registre de l\'expression est évalué et déterminant.',
                },
                {
                  titre: 'Professionnels exigeants',
                  texte: 'Juristes, fonctionnaires, consultants, journalistes. Pour qui la précision du mot juste n\'est pas une coquetterie mais une exigence professionnelle.',
                },
                {
                  titre: 'Amateurs de la langue',
                  texte: 'Ceux qui considèrent le français comme un patrimoine vivant et qui tiennent à en préserver — et à en transmettre — la richesse.',
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl p-6 border"
                  style={{
                    background: 'rgba(196,151,58,0.02)',
                    borderColor: 'rgba(196,151,58,0.1)',
                  }}
                >
                  <h3 className="text-base font-semibold mb-3" style={{ color: '#e8dfc8' }}>{p.titre}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,223,200,0.45)' }}>{p.texte}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-28 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl border p-10 md:p-14 relative overflow-hidden"
              style={{
                background: 'rgba(196,151,58,0.04)',
                borderColor: 'rgba(196,151,58,0.15)',
              }}
            >
              {/* Glow interne */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(196,151,58,0.4), transparent)' }}
              />

              <span className="text-4xl mb-5 block">✒</span>

              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#e8dfc8' }}>
                Bientôt disponible.
              </h2>
              <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: 'rgba(232,223,200,0.5)' }}>
                La première version est en cours de développement sur Android. Le lancement approche.
              </p>

              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-mono"
                style={{
                  background: 'rgba(196,151,58,0.08)',
                  borderColor: 'rgba(196,151,58,0.2)',
                  color: 'rgba(196,151,58,0.8)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#c4973a' }} />
                En cours de développement
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-8 border-t" style={{ borderColor: 'rgba(196,151,58,0.08)' }}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
              <img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain rounded-md opacity-60" />
              <span className="text-xs text-neutral-500 font-mono">AG Algo Lab · Faconde</span>
            </Link>
            <p className="text-[11px] font-mono" style={{ color: 'rgba(196,151,58,0.25)' }}>
              Une application pour ceux qui croient que les mots précis font les idées claires.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
