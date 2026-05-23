import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Brain, BookOpen, BarChart3, ArrowRight, CheckCircle2,
  Star, Users, Trophy, Zap, Globe, MessageSquare,
} from 'lucide-react';

const stats = [
  { value: '10k+', label: 'Élèves actifs' },
  { value: '500+', label: 'Cours disponibles' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '24/7', label: 'Disponibilité IA' },
];

const features = [
  {
    icon: Brain,
    title: 'Assistant IA Intelligent',
    desc: 'Posez vos questions scolaires et obtenez des explications adaptées à votre niveau, étape par étape.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Zap,
    title: 'Quiz Génératif',
    desc: 'L\'IA crée des quiz personnalisés pour tester vos connaissances avec correction automatique.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: BarChart3,
    title: 'Suivi de Progression',
    desc: 'Tableau de bord analytique pour visualiser vos progrès et recevoir des recommandations.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: BookOpen,
    title: 'Bibliothèque Pédagogique',
    desc: 'Accès à des centaines de cours, documents et vidéos organisés par matière et niveau.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Globe,
    title: 'Accessible Partout',
    desc: 'Interface mobile-first, accessible depuis n\'importe quel appareil, même avec une connexion lente.',
    color: 'from-sky-500 to-sky-600',
  },
  {
    icon: Users,
    title: 'Multi-rôles',
    desc: 'Espace dédié aux élèves, enseignants et administrateurs avec des fonctionnalités adaptées.',
    color: 'from-rose-500 to-rose-600',
  },
];

const testimonials = [
  {
    name: 'Aicha Randrianarivelo',
    role: 'Élève, Terminale',
    text: 'e-Anatra a complètement changé ma façon d\'apprendre. L\'assistant IA m\'explique les maths d\'une façon que je comprends enfin !',
    rating: 5,
  },
  {
    name: 'Mr. Rakoto Jean',
    role: 'Enseignant, Collège',
    text: 'Créer des quiz pour mes élèves en quelques secondes, c\'est révolutionnaire. Mes élèves sont beaucoup plus engagés.',
    rating: 5,
  },
  {
    name: 'Fidy Ramiandrisoa',
    role: 'Élève, 3ème',
    text: 'Je comprends maintenant des concepts que je n\'arrivais pas à saisir en cours. L\'IA explique vraiment bien !',
    rating: 5,
  },
];

const demoMessages = [
  { role: 'user',      text: 'Explique-moi le théorème de Pythagore' },
  { role: 'assistant', text: 'Bien sûr ! 😊 Le théorème de Pythagore dit que dans un triangle rectangle, le carré de l\'hypoténuse (le côté le plus long) est égal à la somme des carrés des deux autres côtés.\n\n**Formule :** a² + b² = c²\n\nImagine un triangle avec les côtés 3, 4 et 5 : 3² + 4² = 9 + 16 = 25 = 5² ✓' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg">e-Anatra</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Connexion</Link>
            <Link to="/register" className="btn-primary text-sm">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Propulsé par l'Intelligence Artificielle
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              L'éducation{' '}
              <span className="gradient-text">intelligente</span>
              <br />pour tous
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              L'intelligence artificielle peut rendre l'éducation plus accessible,
              personnalisée et inclusive — même là où les ressources pédagogiques sont limitées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center">
                Commencer maintenant <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#demo" className="btn-secondary text-base px-8 py-3 flex items-center gap-2 justify-center">
                <MessageSquare className="w-4 h-4" /> Voir la démo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <motion.div key={s.label} {...fadeUp} className="text-center">
                <p className="text-3xl lg:text-4xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin pour apprendre
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Une plateforme complète qui s'adapte à chaque élève grâce à l'IA
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card hover:border-slate-600 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo IA */}
      <section id="demo" className="py-20 px-4 sm:px-6 bg-surface-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Voyez l'IA en action
            </h2>
            <p className="text-slate-400">Posez n'importe quelle question scolaire et obtenez une réponse claire</p>
          </motion.div>
          <motion.div {...fadeUp} className="card overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-300">Assistant e-Anatra</span>
              <span className="ml-auto badge bg-emerald-500/20 text-emerald-400">En ligne</span>
            </div>
            <div className="space-y-4">
              {demoMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-surface-800 text-slate-200 rounded-bl-sm border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <Link
                to="/register"
                className="w-full btn-primary text-sm flex items-center justify-center gap-2"
              >
                Essayer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="card"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="card bg-gradient-to-br from-primary-900/50 to-accent-900/30 border-primary-700/30">
              <Trophy className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3">Prêt à commencer votre apprentissage ?</h2>
              <p className="text-slate-400 mb-8 text-lg">
                Rejoignez des milliers d'élèves qui apprennent mieux grâce à e-Anatra.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center">
                  Créer un compte gratuit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                {['Gratuit pour toujours', 'Aucune carte requise', 'Accès instantané'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">e-Anatra</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 e-Anatra — Plateforme éducative intelligente. L'IA au service du développement.
          </p>
        </div>
      </footer>
    </div>
  );
}
