// LandingPage.tsx
// Ultra-immersive e-Anatra landing page — Cyber-Luxury Cyan Edition
// Dependencies: framer-motion, react-router-dom, lucide-react
// OPTIONAL 3D (comment out if R3F not installed): @react-three/fiber, @react-three/drei, three

import { useRef, useEffect, useState, useCallback } from "react";
import HeroSphere from "@/components/layout/HeroSphere";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles,
  Brain,
  BookOpen,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Trophy,
  Zap,
  Globe,
  MessageSquare,
  ChevronRight,
  Cpu,
  Layers,
  Network,
} from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  { value: "10k+", label: "Élèves actifs" },
  { value: "500+", label: "Cours disponibles" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "24/7", label: "Disponibilité IA" },
];

const features = [
  {
    icon: Brain,
    title: "Assistant IA Intelligent",
    desc: "Posez vos questions scolaires et obtenez des explications adaptées à votre niveau, étape par étape.",
    color: "from-cyan-400 to-sky-500",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-500/20",
  },
  {
    icon: Zap,
    title: "Quiz Génératif",
    desc: "L'IA crée des quiz personnalisés pour tester vos connaissances avec correction automatique.",
    color: "from-teal-400 to-cyan-500",
    glow: "shadow-teal-500/30",
    border: "border-teal-500/20",
  },
  {
    icon: BarChart3,
    title: "Suivi de Progression",
    desc: "Tableau de bord analytique pour visualiser vos progrès et recevoir des recommandations.",
    color: "from-sky-400 to-teal-500",
    glow: "shadow-sky-500/30",
    border: "border-sky-500/20",
  },
  {
    icon: BookOpen,
    title: "Bibliothèque Pédagogique",
    desc: "Accès à des centaines de cours, documents et vidéos organisés par matière et niveau.",
    color: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/20",
    border: "border-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Accessible Partout",
    desc: "Interface mobile-first, accessible depuis n'importe quel appareil, même avec une connexion lente.",
    color: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-500/20",
  },
  {
    icon: Users,
    title: "Multi-rôles",
    desc: "Espace dédié aux élèves, enseignants et administrateurs avec des fonctionnalités adaptées.",
    color: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-500/30",
    border: "border-sky-500/20",
  },
];

const testimonials = [
  {
    name: "Aicha Randrianarivelo",
    role: "Élève, Terminale",
    text: "e-Anatra a complètement changé ma façon d'apprendre. L'assistant IA m'explique les maths d'une façon que je comprends enfin !",
    rating: 5,
    avatar: "AR",
  },
  {
    name: "Mr. Rakoto Jean",
    role: "Enseignant, Collège",
    text: "Créer des quiz pour mes élèves en quelques secondes, c'est révolutionnaire. Mes élèves sont beaucoup plus engagés.",
    rating: 5,
    avatar: "RJ",
  },
  {
    name: "Fidy Ramiandrisoa",
    role: "Élève, 3ème",
    text: "Je comprends maintenant des concepts que je n'arrivais pas à saisir en cours. L'IA explique vraiment bien !",
    rating: 5,
    avatar: "FR",
  },
];

const demoConversation = [
  { role: "user", text: "Explique-moi le théorème de Pythagore" },
  {
    role: "assistant",
    text: "Bien sûr ! 😊 Le théorème de Pythagore dit que dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.\n\n**Formule :** a² + b² = c²\n\nExemple : un triangle 3, 4, 5 → 9 + 16 = 25 = 5² ✓",
  },
];

/* ─────────────────────────────── HOOKS ─────────────────────────────── */

function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      x.set(nx);
      y.set(ny);
    },
    [x, y],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { springX, springY };
}

function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(cx * 14);
    rx.set(-cy * 14);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return { ref, srx, sry, onMove, onLeave };
}

/* ─────────────────────────────── COMPONENTS ─────────────────────────────── */

/** Animated particle field using canvas */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 80;
    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      pulse: number;
    };
    const particles: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${a})`;
        ctx.fill();
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}

/** SVG holographic orb for hero */
function HolographicOrb() {
  return (
    <div className="relative w-[380px] h-[380px] md:w-[500px] md:h-[500px] mx-auto">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_4px_rgba(34,211,238,0.6)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_3px_rgba(45,212,191,0.5)]" />
      </motion.div>

      {/* Mid ring */}
      <motion.div
        className="absolute inset-6 rounded-full border border-sky-400/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_3px_rgba(56,189,248,0.5)]" />
        <div className="absolute left-0 top-1/3 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-300" />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute inset-16 rounded-full border border-teal-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Core glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow layers */}
          <div className="absolute inset-0 -m-16 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute inset-0 -m-8 rounded-full bg-sky-500/12 blur-2xl" />

          {/* Central sphere */}
          <div
            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(103,232,249,0.25), rgba(14,165,233,0.1) 50%, rgba(13,148,136,0.05))",
              boxShadow:
                "0 0 60px rgba(34,211,238,0.25), inset 0 0 40px rgba(34,211,238,0.1), 0 0 120px rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.3)",
            }}
          >
            {/* Scan line animation */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                maskImage: "radial-gradient(circle, white, transparent)",
              }}
            >
              <motion.div
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain
                className="w-16 h-16 md:w-20 md:h-20 text-cyan-300"
                strokeWidth={1}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating data nodes */}
      {[
        { angle: 30, r: 0.88, label: "Neural", size: "sm" },
        { angle: 150, r: 0.82, label: "Learn", size: "sm" },
        { angle: 260, r: 0.86, label: "Adapt", size: "sm" },
      ].map(({ angle, r, label, size }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + r * 47 * Math.cos(rad);
        const y = 50 + r * 47 * Math.sin(rad);
        return (
          <motion.div
            key={label}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%,-50%)",
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            <div
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-cyan-300 backdrop-blur-sm"
              style={{
                background: "rgba(8,47,73,0.7)",
                border: "1px solid rgba(34,211,238,0.3)",
                boxShadow: "0 0 12px rgba(34,211,238,0.2)",
              }}
            >
              {label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/** Feature card with 3D tilt */
function FeatureCard({ f, i }: { f: (typeof features)[0]; i: number }) {
  const { ref, srx, sry, onMove, onLeave } = use3DTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="group relative rounded-2xl p-6 cursor-default overflow-hidden"
      {...{
        style: {
          background:
            "linear-gradient(135deg, rgba(7,25,48,0.8), rgba(3,15,30,0.9))",
          border: "1px solid rgba(34,211,238,0.12)",
          backdropFilter: "blur(12px)",
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
        },
      }}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08), transparent 70%)",
        }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          boxShadow:
            "0 0 30px rgba(34,211,238,0.12), inset 0 0 30px rgba(34,211,238,0.04)",
        }}
      />

      {/* Icon */}
      <div
        className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow}`}
      >
        <f.icon className="w-5 h-5 text-white" />
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
        {f.title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent)",
        }}
      />
    </motion.div>
  );
}

/** Holographic demo chat */
function HoloDemoChat() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setShown(1), 600);
    const t2 = setTimeout(() => setTyping(true), 1400);
    const full = demoConversation[1].text;
    let idx = 0;
    let t3: ReturnType<typeof setTimeout>;
    const typeInterval = setInterval(() => {
      if (idx <= full.length) {
        setTypedText(full.slice(0, idx));
        idx++;
      } else {
        clearInterval(typeInterval);
        setTyping(false);
        setShown(2);
      }
    }, 18);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(typeInterval);
    };
  }, []);

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((p, j) =>
        p.startsWith("**") ? (
          <strong key={j} className="text-cyan-300 font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          p
        ),
      );
      return (
        <span key={i}>
          {parts}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(7,25,48,0.95), rgba(3,12,28,0.98))",
        border: "1px solid rgba(34,211,238,0.2)",
        boxShadow:
          "0 0 60px rgba(34,211,238,0.1), 0 0 120px rgba(34,211,238,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <div
        className="relative px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(34,211,238,0.1)" }}
      >
        {/* Dots */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div
            className="relative w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(14,165,233,0.2))",
            }}
          >
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{
                background: "rgba(34,211,238,0.5)",
                animationDuration: "2s",
              }}
            />
          </div>
          <span className="text-sm font-medium text-slate-300">
            Assistant e-Anatra
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-5 space-y-4 min-h-[280px]">
        <AnimatePresence>
          {shown >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="flex justify-end"
            >
              <div
                className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-white"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.35), rgba(14,165,233,0.25))",
                  border: "1px solid rgba(34,211,238,0.3)",
                }}
              >
                {demoConversation[0].text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {shown >= 1 && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-start max-w-[90%]">
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(56,189,248,0.15))",
                  border: "1px solid rgba(34,211,238,0.3)",
                }}
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-slate-200 leading-relaxed"
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(34,211,238,0.1)",
                }}
              >
                {renderText(typedText || "")}
                {typing && (
                  <span className="inline-flex gap-0.5 ml-1 align-middle">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1 h-1 rounded-full bg-cyan-400 inline-block"
                        animate={{ scale: [0, 1, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-5 pb-5">
        <Link
          to="/register"
          className="block w-full text-center py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.15))",
            border: "1px solid rgba(34,211,238,0.25)",
            color: "rgba(103,232,249,1)",
          }}
        >
          <span className="flex items-center justify-center gap-2">
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

/** Animated counter */
function Counter({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const nums = value.match(/\d+/);
          if (nums) {
            const target = parseInt(nums[0], 10);
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
              current = Math.min(current + step, target);
              setDisplayed(value.replace(/\d+/, String(current)));
              if (current >= target) clearInterval(interval);
            }, 40);
          } else {
            setDisplayed(value);
          }
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <p
      ref={ref}
      className="text-4xl lg:text-5xl font-black tracking-tight"
      style={{
        background: "linear-gradient(135deg, #67e8f9, #38bdf8, #2dd4bf)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {displayed}
    </p>
  );
}

/* ─────────────────────────────── MAIN PAGE ─────────────────────────────── */

export default function LandingPage() {
  const { springX, springY } = useMouseParallax();
  const heroGlowX = useTransform(springX, [-1, 1], ["-5%", "5%"]);
  const heroGlowY = useTransform(springY, [-1, 1], ["-5%", "5%"]);

  return (
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden font-sans"
      style={{
        background: "#030b18",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Global styles injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { --glow-cyan: rgba(34,211,238,0.15); }
        ::selection { background: rgba(34,211,238,0.3); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .clip-text {
          background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 40%, #2dd4bf 80%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(7,25,48,0.8), rgba(3,15,30,0.9));
          border: 1px solid rgba(34,211,238,0.12);
          backdrop-filter: blur(16px);
        }
        .btn-cyan {
          background: linear-gradient(135deg, rgba(6,182,212,0.25), rgba(14,165,233,0.2));
          border: 1px solid rgba(34,211,238,0.35);
          color: #67e8f9;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        .btn-cyan::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(34,211,238,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-cyan:hover::before { opacity: 1; }
        .btn-cyan:hover { box-shadow: 0 0 30px rgba(34,211,238,0.25); border-color: rgba(34,211,238,0.6); }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(100,116,139,0.4);
          color: #94a3b8;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 500;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .btn-outline:hover { border-color: rgba(34,211,238,0.3); color: #67e8f9; }
        .cyber-border {
          position: relative;
        }
        .cyber-border::before, .cyber-border::after {
          content: '';
          position: absolute;
          border: 1px solid rgba(34,211,238,0.4);
          transition: all 0.3s;
        }
        .cyber-border::before { top: -2px; left: -2px; right: 50%; bottom: 50%; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
        .cyber-border::after { bottom: -2px; right: -2px; left: 50%; top: 50%; border-left: none; border-top: none; border-radius: 0 0 4px 0; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50"
        style={{
          backdropFilter: "blur(20px)",
          background: "rgba(3,11,24,0.7)",
          borderBottom: "1px solid rgba(34,211,238,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div
              className="relative w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.4), rgba(14,165,233,0.3))",
                border: "1px solid rgba(34,211,238,0.4)",
              }}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <div
                className="absolute inset-0 rounded-xl animate-pulse opacity-30"
                style={{
                  background: "rgba(34,211,238,0.4)",
                  animationDuration: "3s",
                }}
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              e<span className="text-cyan-400">-</span>Anatra
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            {["Fonctionnalités", "Démo", "Avis"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline text-sm py-2 px-4">
              Connexion
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">
              Commencer <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 min-h-screen flex items-center">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  L'éducation
                </motion.span>
                <motion.span
                  className="block clip-text text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  intelligente
                </motion.span>
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  pour tous
                </motion.span>
              </h1>

              {/* Desc */}
              <motion.p
                className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                L'intelligence artificielle peut rendre l'éducation plus
                accessible, personnalisée et inclusive — même là où les
                ressources pédagogiques sont limitées.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link to="/register" className="btn-primary">
                  Commencer maintenant <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#demo" className="btn-outline">
                  <MessageSquare className="w-4 h-4" /> Voir la démo
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="flex flex-wrap gap-5 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {[
                  "Gratuit pour toujours",
                  "Aucune carte requise",
                  "Accès instantané",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: 3D Orb */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative"
              style={{ filter: "drop-shadow(0 0 80px rgba(34,211,238,0.15))" }}
            >
              <HolographicOrb />
            </motion.div> */}
            <HeroSphere />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        className="py-16 relative z-10"
        style={{
          borderTop: "1px solid rgba(34,211,238,0.08)",
          borderBottom: "1px solid rgba(34,211,238,0.08)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <Counter value={s.value} />
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="fonctionnalités"
        className="py-24 px-4 sm:px-6 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "#38bdf8",
              }}
            >
              <Layers className="w-3 h-3" /> Fonctionnalités
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Tout ce dont vous avez besoin pour apprendre
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Une plateforme complète qui s'adapte à chaque élève grâce à l'IA
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section id="démo" className="py-24 px-4 sm:px-6 relative z-10">
        <div
          className="absolute inset-x-0 inset-y-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.04), transparent)",
          }}
        />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "#38bdf8",
              }}
            >
              <Network className="w-3 h-3" /> Démo Live
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Voyez l'IA en action
            </h2>
            <p className="text-slate-400">
              Posez n'importe quelle question scolaire et obtenez une réponse
              claire
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HoloDemoChat />
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="avis" className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ce que disent nos utilisateurs
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/25 transition-all duration-500"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.07), transparent 70%)",
                  }}
                />

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(14,165,233,0.15))",
                      border: "1px solid rgba(34,211,238,0.3)",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Large ambient glow */}
          <div
            className="absolute inset-0 -m-20 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl p-10 overflow-hidden cyber-border"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,18,40,0.95), rgba(3,10,25,0.98))",
              border: "1px solid rgba(34,211,238,0.18)",
              boxShadow:
                "0 0 80px rgba(34,211,238,0.1), 0 0 160px rgba(34,211,238,0.05)",
            }}
          >
            {/* Animated corner accents */}
            {[
              "top-0 left-0",
              "top-0 right-0",
              "bottom-0 left-0",
              "bottom-0 right-0",
            ].map((pos, i) => (
              <motion.div
                key={pos}
                className={`absolute ${pos} w-12 h-12`}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              >
                <div
                  className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-px h-8`}
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(34,211,238,0.6), transparent)",
                  }}
                />
                <div
                  className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-8 h-px`}
                  style={{
                    background:
                      "linear-gradient(to right, rgba(34,211,238,0.6), transparent)",
                  }}
                />
              </motion.div>
            ))}

            {/* Scan line */}
            <motion.div
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)",
              }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(14,165,233,0.15))",
                border: "1px solid rgba(34,211,238,0.35)",
              }}
            >
              <Trophy className="w-8 h-8 text-cyan-300" />
              <div
                className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
                style={{
                  boxShadow: "0 0 20px rgba(34,211,238,0.5)",
                  animationDuration: "2s",
                }}
              />
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Prêt à commencer votre apprentissage ?
            </h2>
            <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">
              Rejoignez des milliers d'élèves qui apprennent mieux grâce à
              e-Anatra.
            </p>

            <Link
              to="/register"
              className="btn-primary inline-flex text-base px-10 py-4 rounded-xl font-bold"
            >
              Créer un compte gratuit <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {[
                "Gratuit pour toujours",
                "Aucune carte requise",
                "Accès instantané",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center gap-2 text-sm text-slate-500"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 py-10 px-4 sm:px-6"
        style={{ borderTop: "1px solid rgba(34,211,238,0.08)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="relative w-7 h-7 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(14,165,233,0.2))",
                border: "1px solid rgba(34,211,238,0.35)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="font-bold text-white">
              e<span className="text-cyan-400">-</span>Anatra
            </span>
          </div>
          <p className="text-sm text-slate-600">
            © 2026 e-Anatra — Plateforme éducative intelligente. L'IA au service
            du développement.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-600 font-mono">
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
