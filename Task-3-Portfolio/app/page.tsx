"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import * as Icons from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress, scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 600], [0, 50]);

  const roles = [
    "Shipping production code.",
    "Running campaigns that convert.",
    "Building Vasundhara Media.",
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);

  useEffect(() => {
    const sectionIds = ["about", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.11 } },
  };

  const pillStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const pillItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  const projects = [
    {
      title: "Vasundhara Media",
      desc: "My own digital marketing & web development agency, founded 2024 (Delhi NCR). Built the full brand site end-to-end — animated React/TypeScript components, custom motion design, and the systems behind client delivery.",
      tags: ["Agency", "Next.js", "Framer Motion", "Brand Identity"],
      link: "https://vasundhara-media.vercel.app/",
      status: "live" as const,
      icon: "Rocket",
    },
    {
      title: "RITVA",
      desc: "Full-stack women's health tracking PWA — period & ovulation tracking, AI-powered mood journal (Gemini 2.0 Flash), medication reminders, and Hindi/English toggle. Built with React, Supabase, and push notifications.",
      tags: ["React", "Supabase", "AI Integration", "PWA"],
      link: "https://ritva-pink.vercel.app/",
      status: "live" as const,
      icon: "HeartPulse",
    },
    {
      title: "CoreLane Interiors",
      desc: "Full website for a premium interior design firm. Managing their Meta & Google ad campaigns and social media presence to drive leads and brand awareness.",
      tags: ["Web Development", "Meta Ads", "Google Ads", "Social Media"],
      link: "https://corelaneinteriors.com",
      status: "live" as const,
      icon: "Building2",
    },
    {
      title: "HackMatch App",
      desc: "A platform to connect developers for hackathons — find teammates by skill, match with collaborators, and build together. Full stack with real-time features.",
      tags: ["React", "Node.js", "Express.js", "Supabase", "Vercel"],
      link: "https://hackmatch-omega.vercel.app/",
      status: "ongoing" as const,
      icon: "Code2",
    },
  ];

  const skills = ["React", "Next.js", "TypeScript", "Node.js", "Express.js", "Supabase", "MongoDB", "Meta Ads", "Google Ads", "Git"];

  const stats = [
    { value: projects.length, suffix: "", label: "Projects Shipped" },
    { value: skills.length, suffix: "+", label: "Tools in Stack" },
    { value: 2024, suffix: "", label: "Agency Founded" },
  ];

  const twinkleDots = [
    { top: "10%", left: "12%", delay: 0 },
    { top: "68%", left: "6%", delay: 0.6 },
    { top: "22%", left: "92%", delay: 1.2 },
    { top: "82%", left: "88%", delay: 1.8 },
  ];

  return (
    <main className="min-h-screen bg-[#f5f4f0] dark:bg-[#080c0f] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">

      <CustomCursor />

      {/* SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 origin-left z-[60]"
      />

      {/* Ambient floating blobs */}
      <div className="fixed -z-20 top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[100px] animate-float" />
      <div
        className="fixed -z-20 bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-[100px] animate-float"
        style={{ animationDuration: "16s", animationDelay: "2s" }}
      />

      {/* Grid background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#f5f4f0]/80 dark:bg-[#080c0f]/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <span className="font-black text-lg tracking-tighter font-display">
            AC<span className="text-blue-500">.</span>
          </span>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {["About", "Projects", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`transition-colors ${
                    activeSection === item.toLowerCase()
                      ? "text-blue-500 dark:text-blue-400"
                      : "hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:ring-2 ring-blue-400 transition-all z-50 relative cursor-pointer"
              suppressHydrationWarning
            >
              {mounted && (theme === "dark"
                ? <Icons.Sun size={16} className="text-yellow-400" />
                : <Icons.Moon size={16} className="text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative max-w-6xl mx-auto px-8 pt-12 pb-0 overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHeroMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* Cursor-follow glow */}
        <div
          className="hidden md:block pointer-events-none absolute -z-10 w-[420px] h-[420px] rounded-full bg-blue-500/15 dark:bg-blue-400/10 blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${heroMouse.x - 210}px, ${heroMouse.y - 210}px)` }}
        />

        {/* Twinkling dots */}
        {twinkleDots.map((d, i) => (
          <span
            key={i}
            className="hidden md:block absolute z-0 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-300 animate-twinkle pointer-events-none"
            style={{ top: d.top, left: d.left, animationDelay: `${d.delay}s` }}
          />
        ))}

        <motion.div
          className="relative z-10 grid md:grid-cols-2 gap-8 items-end"
          initial="initial" animate="animate" variants={stagger}
        >
          {/* Left */}
          <div className="pb-8 md:pb-16">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for Work
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-[60px] font-black tracking-[-2px] leading-[0.9] mb-6 uppercase font-display"
            >
              Aditya<br />
              <span className="text-black/20 dark:text-white/15">Chauhan</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                Full Stack Dev
              </span>
              <span className="text-slate-300 dark:text-slate-700 text-lg">+</span>
              <span className="px-3 py-1 border border-black/20 dark:border-white/20 text-[10px] font-black uppercase tracking-widest rounded-full">
                Digital Marketing
              </span>
              <span className="text-slate-300 dark:text-slate-700 text-lg">+</span>
              <span className="px-3 py-1 border border-black/20 dark:border-white/20 text-[10px] font-black uppercase tracking-widest rounded-full">
                Founder, Vasundhara Media
              </span>
            </motion.div>

            {/* Rotating role line */}
            <motion.div variants={fadeUp} className="h-5 mb-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-xs font-bold text-blue-500 dark:text-blue-400"
                  style={{ fontFamily: "monospace" }}
                >
                  → {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-sm text-slate-500 dark:text-slate-400 leading-[1.9] mb-8 max-w-sm"
            >
              I build scalable web apps and run Meta & Google ad campaigns that actually convert. Based in India, working globally.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="mailto:chauhanaditya942@gmail.com"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Hire Me <Icons.ArrowRight size={13} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="#contact"
                className="flex items-center gap-2 px-5 py-2.5 border border-black/15 dark:border-white/15 rounded-xl text-xs font-black uppercase tracking-wider hover:border-black dark:hover:border-white"
              >
                Contact
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeUp} className="flex gap-3 mt-8">
              <a
                href="https://github.com/chauhanaditya942-wq"
                target="_blank"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold"
              >
                <Icons.GitBranch size={15} /> GitHub
              </a>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <a
                href="tel:+917827872625"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold"
              >
                <Icons.Phone size={15} /> +91 78278 72625
              </a>
            </motion.div>
          </div>

          {/* Right — Photo */}
          <motion.div variants={fadeUp} className="flex justify-center md:justify-end items-end">
            <motion.div
              style={{ y: photoY }}
              className="relative w-[260px] md:w-full md:max-w-[420px] aspect-[3/4] rounded-[120px_120px_0_0] md:rounded-[160px_160px_0_0] overflow-hidden self-end"
            >
              <Image
                src="/photo.jpg"
                alt="Aditya Chauhan"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Scan line effect */}
              <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan opacity-80 pointer-events-none" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-slate-900 dark:bg-black border-y border-slate-800 py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[scroll_20s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {["React.js", "Node.js", "Express.js", "Supabase", "Next.js", "TypeScript", "Meta Ads", "Google Ads", "MongoDB", "Vercel"].map((t) => (
                <span key={t} className="inline-flex items-center gap-4 px-8 text-[11px] font-black uppercase tracking-[3px] text-white/60">
                  {t} <span className="text-white/20">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS STRIP */}
      <section className="border-b border-black/[0.06] dark:border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-8">
          <SectionReveal>
            <div className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-5xl font-black tracking-tighter font-display text-slate-900 dark:text-white">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-8 py-24">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400 mb-3">// 01 — About</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.05] mb-6 font-display">
                Code is my<br />
                <span className="text-black/20 dark:text-white/15">superpower.</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-[2] mb-6">
                Namaste! I'm Aditya Chauhan, a Full Stack Developer & Digital Marketing specialist from India, and founder of Vasundhara Media — a digital marketing & web development agency based in Delhi NCR.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-[2] mb-8">
                I build end-to-end web applications and manage Meta & Google ad campaigns for businesses — helping brands grow both technically and digitally.
              </p>
              <motion.div
                className="flex flex-wrap gap-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={pillStagger}
              >
                {skills.map((s) => (
                  <motion.span
                    key={s}
                    variants={pillItem}
                    className="px-3 py-1 text-[11px] font-black uppercase tracking-wider border border-black/15 dark:border-white/15 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default"
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { num: "01", title: "Full Stack Development", desc: "React frontends + Node.js/Express backends, wired to Supabase or MongoDB." },
                { num: "02", title: "Meta & Google Ads", desc: "Performance campaigns with targeting, A/B testing, and ROI-focused optimization." },
                { num: "03", title: "Digital Agency Ops", desc: "Run Vasundhara Media end-to-end — client delivery, brand systems, and campaign strategy." },
              ].map((s) => (
                <div
                  key={s.num}
                  className="p-5 bg-white dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl hover:shadow-lg dark:hover:border-white/20 hover:-translate-y-0.5 transition-all"
                >
                  <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 tracking-[3px] mb-2">{s.num}</p>
                  <p className="font-black text-[15px] mb-1 font-display">{s.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="bg-white dark:bg-white/[0.01] border-y border-black/[0.06] dark:border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-8">
          <SectionReveal>
            <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400 mb-3">// 02 — Projects</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 font-display">
              Featured Work
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p) => {
                const Icon = Icons[p.icon as keyof typeof Icons] as React.ElementType;
                return (
                  <TiltCard key={p.title}>
                    <div
                      className={`p-7 bg-[#f5f4f0] dark:bg-white/[0.03] rounded-2xl border transition-shadow hover:shadow-xl group h-full ${
                        p.status === "live"
                          ? "border-emerald-200 dark:border-emerald-900/50"
                          : "border-black/[0.06] dark:border-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                          {Icon && <Icon size={20} className="text-white dark:text-slate-900" />}
                        </div>
                        {p.status === "live" ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            Ongoing
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-xl mb-2 font-display">{p.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-[1.85] mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.tags.map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        href={p.link}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider border-b border-black/30 dark:border-white/30 pb-0.5 hover:border-black dark:hover:border-white transition-colors"
                      >
                        {p.status === "live" ? "Visit Site" : "View Project"}
                        <Icons.ExternalLink size={11} />
                      </a>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-8 py-24">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400 mb-3">// 03 — Contact</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.05] mb-6 font-display">
                Let's{" "}
                <span className="text-black/20 dark:text-white/15">work</span>
                <br />together.
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-[2] mb-8">
                Open to freelance projects, full-time roles, or just a good conversation. Drop a message!
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "Mail", label: "Email", val: "chauhanaditya942@gmail.com", href: "mailto:chauhanaditya942@gmail.com" },
                  { icon: "Phone", label: "Phone", val: "+91 78278 72625", href: "tel:+917827872625" },
                  { icon: "GitBranch", label: "GitHub", val: "chauhanaditya942-wq", href: "https://github.com/chauhanaditya942-wq" },
                ].map((c) => {
                  const Icon = Icons[c.icon as keyof typeof Icons] as React.ElementType;
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-xl hover:border-black dark:hover:border-white/30 transition-all group"
                    >
                      <div className="w-9 h-9 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        {Icon && <Icon size={15} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{c.label}</p>
                        <p className="text-sm font-bold">{c.val}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-1.5">Your Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                type="submit"
                disabled={formState === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50"
              >
                {formState === "loading" ? (
                  <><Icons.Loader2 size={14} className="animate-spin" /> Sending...</>
                ) : formState === "success" ? (
                  <><Icons.CheckCircle size={14} /> Message Sent!</>
                ) : (
                  <><Icons.Send size={14} /> Send Message</>
                )}
              </motion.button>
              {formState === "error" && (
                <p className="text-xs text-red-500 font-bold">Something went wrong. Try emailing directly.</p>
              )}
            </form>
          </div>
        </SectionReveal>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-slate-900 dark:bg-black text-white overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-8 py-16 relative z-10">
          <SectionReveal>
            <div className="grid md:grid-cols-3 gap-10">
              {/* Brand + CTA */}
              <div>
                <p className="text-2xl font-black tracking-tighter leading-[1.05] font-display mb-4">
                  Let&apos;s build<br />something <span className="text-blue-400">great.</span>
                </p>
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  href="mailto:chauhanaditya942@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Get In Touch <Icons.ArrowRight size={13} />
                </motion.a>
              </div>

              {/* Quick links */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[3px] text-white/40 mb-4">Quick Links</p>
                <div className="flex flex-col gap-2.5">
                  {["About", "Projects", "Contact"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-sm font-bold text-white/70 hover:text-white transition-colors w-fit"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Live status */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[3px] text-white/40 mb-4">Right Now</p>
                <LiveClock />
                <p className="text-sm font-bold text-white/70 mt-1">Delhi, India</p>
                <div className="flex gap-3 mt-5">
                  <a
                    href="https://github.com/chauhanaditya942-wq"
                    target="_blank"
                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icons.GitBranch size={15} />
                  </a>
                  <a
                    href="https://wa.me/917827872625"
                    target="_blank"
                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icons.MessageCircle size={15} />
                  </a>
                  <a
                    href="mailto:chauhanaditya942@gmail.com"
                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icons.Mail size={15} />
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Bottom ticker */}
        <div className="border-t border-white/10 py-3 overflow-hidden relative z-10">
          <div className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0">
                {["AVAILABLE FOR WORK", "FULL STACK DEVELOPER", "VASUNDHARA MEDIA", "DELHI, INDIA"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-4 px-8 text-[10px] font-black uppercase tracking-[3px] text-white/30">
                    {t} <span className="text-white/15">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center gap-4 sm:justify-between relative z-10">
          <span className="font-black text-sm tracking-tighter font-display">AC<span className="text-blue-400">.</span></span>
          <p className="text-xs text-white/40 font-bold">Designed & Built by Aditya Chauhan · {new Date().getFullYear()}</p>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Back to top"
          >
            <Icons.ArrowUp size={15} />
          </motion.button>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/917827872625"
        target="_blank"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/40 transition-all hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </main>
  );
}

function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const startTime = performance.now();
    let frame: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
      const target = e.target as HTMLElement;
      setIsPointer(!!target.closest("a, button"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 z-[100] pointer-events-none w-4 h-4 rounded-full border-2 border-blue-500 dark:border-blue-400"
      style={{ x: springX, y: springY, scale: isPointer ? 2.2 : 1 }}
    />
  );
}

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <p className="text-lg font-black font-mono tabular-nums text-blue-400">{time || "--:--:--"}</p>;
}