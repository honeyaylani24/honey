/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Instagram, 
  Calendar, 
  Clock, 
  ChevronDown,
  Flower2
} from "lucide-react";

// --- CONSTANTS ---
const WEDDING_DATE = new Date("2026-05-01T12:15:00");
const LOGO_URL = "https://lh3.googleusercontent.com/d/1e0BllrcGDvt7EprO3gIqMCkaDMuXJ16c";
const BRIDE_URL = "https://res.cloudinary.com/dopbsr7o1/image/upload/f_auto,q_auto/bride_1_iqp9is";
const GROOM_URL = "https://res.cloudinary.com/dopbsr7o1/image/upload/f_auto,q_auto/groom_1_rbvvwz";

// --- COMPONENTS ---

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Poppins:wght@300;400;600&display=swap');
    
    body {
      background-color: #fff8f5;
      color: #3a3a3a;
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
    }
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-vibes { font-family: 'Great Vibes', cursive; }
    
    .glass {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    }
    
    .timeline-line {
      background: #d4a373;
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 20s linear infinite;
    }
    .animate-spin-slow-reverse {
      animation: spin-slow 25s linear reverse infinite;
    }
  `}</style>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center py-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl mb-2 border border-white/20 shadow-xl">
            <span className="text-2xl md:text-4xl font-cinzel font-bold text-[#8b3103] drop-shadow-lg">{value}</span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-[#8b3103]">{label}</span>
        </div>
      ))}
    </div>
  );
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#f3d1dc] opacity-30"
          initial={{ 
            y: "100vh", 
            x: `${Math.random() * 100}vw`,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: "-10vh",
            rotate: 360
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        >
          <Heart fill="currentColor" size={Math.random() * 20 + 10} />
        </motion.div>
      ))}
    </div>
  );
};

const Envelope: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center bg-[#7B3F32] cursor-default"
      initial={{ opacity: 1 }}
      animate={isOpen ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: isOpen ? 0.3 : 0 }}
      style={{
        background: "radial-gradient(circle at center, #7B3F32 0%, #4A241B 100%)"
      }}
    >
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Animated Envelope Flap */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[50vh] origin-top z-10"
        initial={{ rotateX: 0 }}
        animate={isOpen ? { rotateX: -110, y: -20 } : { rotateX: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ 
          background: "linear-gradient(to bottom, #7B3F32, #653125)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.6))",
          perspective: 1000,
          transformStyle: "preserve-3d"
        }}
      >
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </motion.div>

      {/* Top Text (Above Seal) */}
      <motion.div 
        className="absolute top-[20vh] w-full text-center z-20 pointer-events-none"
        animate={isOpen ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-vibes text-3xl md:text-4xl text-[#FFF8ED] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          Tap to Reveal
        </p>
      </motion.div>
      
      {/* Custom Logo Seal Image Replacement */}
      <motion.div 
        className="absolute top-[50vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer"
        initial={{ scale: 1, rotate: 0 }}
        animate={isOpen ? { 
          scale: [1, 0.95, 1.2, 5], 
          opacity: [1, 1, 0.8, 0], 
          rotate: [0, -3, 3, 0],
          y: isOpen ? -100 : 0
        } : { scale: 1, rotate: 0 }}
        transition={{ duration: isOpen ? 1.5 : 0.4, ease: "easeInOut" }}
        whileHover={!isOpen ? { scale: 1.05, rotate: 1 } : {}}
        whileTap={!isOpen ? { scale: 0.95, rotate: -2 } : {}}
        onClick={(e) => {
          e.stopPropagation();
          if(!isOpen) handleOpen();
        }}
      >
        <img 
          src="https://res.cloudinary.com/dopbsr7o1/image/upload/f_auto,q_auto/Untitled_design-removebg-preview_ta9csz"
          alt="Wedding Logo Seal"
          className="w-[130px] md:w-[160px] object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Bottom Text */}
      <motion.div 
        className="absolute bottom-[10vh] w-full text-center space-y-4 z-20 pointer-events-none"
        animate={isOpen ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-vibes text-3xl md:text-4xl text-[#FFF8ED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          The Khandelwal family
        </p>
        <p className="font-cinzel text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-[#FFF8ED] uppercase opacity-90 drop-shadow-md">
          invites you to celebrate the wedding of
        </p>
        <p className="font-vibes text-4xl md:text-5xl text-[#FFF8ED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Apeksha & Gaurav
        </p>
      </motion.div>
    </motion.div>
  );
};

const TimelineItem = ({ date, events, index }: { date: string, events: { title: string, time: string }[], index: number }) => {
  return (
    <motion.div 
      className="relative pl-8 pb-12"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="absolute left-0 top-0 w-px h-full timeline-line" />
      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#8b3103] border-2 border-white shadow-sm" />
      
      <h3 className="font-cinzel font-bold text-xl text-[#8b3103] mb-4 flex items-center gap-2">
        <Calendar size={18} /> {date}
      </h3>
      
      <div className="space-y-6">
        {events.map((event, i) => (
          <div key={i} className="glass p-4 rounded-2xl border-white/40">
            <h4 className="font-cinzel font-semibold text-lg text-[#3a3a3a]">{event.title}</h4>
            <p className="flex items-center gap-2 text-sm opacity-70 mt-1 text-[#3a3a3a]">
              <Clock size={14} /> {event.time}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Petals = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-tl-full rounded-br-full bg-gradient-to-br from-[#f72585]/40 to-[#e4c1f9]/20 shadow-sm blur-[0.5px]"
          initial={{
            top: "-10%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            top: "110%",
            left: `${Math.random() * 100}%`,
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
};

const WeddingContent: React.FC<{ isPlaying: boolean, toggleMusic: () => void, audioRef: React.RefObject<HTMLAudioElement | null> }> = ({ isPlaying, toggleMusic, audioRef }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  const flowerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <Petals />
      <FloatingHearts />
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3" 
      />

      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 glass w-12 h-12 rounded-full flex items-center justify-center text-[#e8cfc1] hover:scale-110 transition-transform"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#fff8f5]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8e1e7] to-[#f3d5c0] opacity-30" />
        <motion.img 
          src={LOGO_URL} 
          alt="Wedding Logo" 
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-40 h-40 md:w-56 md:h-56 rounded-full mb-8 shadow-2xl border-4 border-white z-10 object-cover"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0]
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 100, damping: 15 },
            rotate: { type: "spring", stiffness: 100, damping: 15 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.p 
          className="font-cinzel text-xs md:text-sm tracking-[0.2em] uppercase mb-4 opacity-100 text-black font-bold z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          With Great Joy We Invite you to 
        </motion.p>
        
        <motion.h1 
          className="font-cinzel text-[30px] font-bold mb-4 tracking-widest text-black z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          WEDDING CEREMONY<br />
          <span className="block text-lg md:text-xl mt-2 font-normal opacity-80">OF</span>
        </motion.h1>
        
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-4 mb-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-vibes text-6xl md:text-8xl text-[#8b3103] font-['Anastasia_Script']">Apeksha</span>
          <Heart className="text-[#d4a373] fill-[#d4a373] animate-pulse" size={32} />
          <span className="font-vibes text-6xl md:text-8xl text-[#8b3103] font-['Anastasia_Script']">Gaurav</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="z-10"
        >
        <p className="font-cinzel text-xl md:text-2xl tracking-widest mb-4 text-[#3a3a3a] font-bold">On</p>
          <p className="font-cinzel text-xl md:text-2xl tracking-widest mb-4 text-[#3a3a3a] font-bold">30th April & 1st MAY 2026</p>
          <motion.p 
            className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#3a3a3a] opacity-40 mt-8"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll Down
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} className="opacity-30 text-[#3a3a3a]" />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 bg-[#fdf6f0] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ffffff] opacity-10" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="font-cinzel text-2xl md:text-3xl mb-8 tracking-[0.3em] text-[#8b3103] uppercase">Counting Down to Forever</h2>
          <Countdown />
        </div>
      </section>

      {/* Bride & Groom Section */}
      <section className="py-24 px-4 bg-[#fdf6f0]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Bride */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block mb-12">
              {/* Animated Border Ring */}
              <motion.div 
                className="absolute -inset-4 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #f3d1dc, #e8cfc1, #f3d1dc, transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -inset-1 rounded-full bg-white shadow-inner" />
              <img 
                src={BRIDE_URL} 
                alt="Bride" 
                referrerPolicy="no-referrer"
                loading="lazy"
                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-[#f3d1dc] shadow-2xl z-10"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-lg z-20">
                <Heart className="text-[#f3d1dc] fill-[#f3d1dc]" size={24} />
              </div>
            </div>
            
            <h2 className="font-vibes text-6xl text-black font-bold mb-6">Apeksha</h2>
            
            <div className="bg-white p-8 rounded-[2rem] space-y-4 border border-[#f3d1dc] shadow-xl">
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Granddaughter of</p>
                <p className="font-cinzel text-sm font-semibold text-[#7B3F32]">Late Urmiladevi & Shyamsundar Khandelwal</p>
              </div>
              
              <div className="w-12 h-px bg-[#f3d1dc] mx-auto" />
              
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Daughter of</p>
                <p className="font-cinzel text-sm font-semibold text-[#7B3F32]">Jyoti & Jitendra Khandelwal</p>
              </div>

              <div className="w-12 h-px bg-[#f3d1dc] mx-auto" />

              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Maternal Side</p>
                <p className="font-cinzel text-xs text-black font-bold">Ramanarayan, Sanjay, Sandeep</p>
                <p className="font-cinzel text-[10px] opacity-70 text-black font-bold">(Sohagpur, MP)</p>
              </div>
            </div>
          </motion.div>

          {/* Groom */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative inline-block mb-12">
              {/* Animated Border Ring */}
              <motion.div 
                className="absolute -inset-4 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #f3d1dc, #e8cfc1, #f3d1dc, transparent)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -inset-1 rounded-full bg-white shadow-inner" />
              <img 
                src={GROOM_URL} 
                alt="Groom" 
                referrerPolicy="no-referrer"
                loading="lazy"
                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-[#f3d1dc] shadow-2xl z-10"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg z-20">
                <Heart className="text-[#f3d1dc] fill-[#f3d1dc]" size={24} />
              </div>
            </div>

            <h2 className="font-vibes text-6xl text-black font-bold mb-6">Gaurav</h2>
            
            <div className="bg-white p-8 rounded-[2rem] space-y-4 border border-[#f3d1dc] shadow-xl">
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Grandson of</p>
                <p className="font-cinzel text-sm font-semibold text-[#7B3F32]">Late Shardadevi & Late Ramchandra Dangayach</p>
              </div>
              
              <div className="w-12 h-px bg-[#f3d1dc] mx-auto" />
              
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Son of</p>
                <p className="font-cinzel text-sm font-semibold text-[#7B3F32]">Anita & Manoj Kumar Dangayach</p>
              </div>

              <div className="w-12 h-px bg-[#f3d1dc] mx-auto" />

              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-100 text-black font-bold">Family From</p>
                <p className="font-cinzel text-sm font-semibold text-[#7B3F32]">Katras, Dhanbad</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#fff8f5]" ref={timelineRef}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-3xl md:text-4xl text-center mb-16 tracking-widest text-black font-bold">WEDDING PROGRAMME</h2>
          
          <div className="relative">
            <motion.div 
              className="absolute left-[-12px] z-10 text-[#f72585]"
              style={{ top: flowerY }}
            >
              <Flower2 size={24} className="fill-current" />
            </motion.div>

            <TimelineItem 
              index={0}
              date="30 April 2026"
              events={[
                { title: "Ganesh Pujan", time: "7:30 AM" },
                { title: "Carnival", time: "9:00 AM" },
                { title: "Chakbhat", time: "12:15 PM" },
                { title: "Godh Tika", time: "4:00 PM" },
                { title: "Sangeet", time: "8:00 PM" }
              ]}
            />
            
            <TimelineItem 
              index={1}
              date="1 May 2026"
              events={[
                { title: "Barat Welcome", time: "11:30 AM" },
                { title: "Wedding Ceremony", time: "12:15 PM" },
                { title: "Reception", time: "8:00 PM" }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 px-4 bg-[#fff8f5]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="font-cinzel text-4xl mb-6 tracking-widest text-[#8b3103]">The Venue</h2>
                  <p className="text-2xl font-semibold mb-2 text-[#8b3103]">Hotel Clarks Inn Suites</p>
                  <p className="text-lg text-[#8b3103]">Bank More, Dhanbad, Jharkhand</p>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-[#8b3103] mb-4 opacity-70">Click below to navigate directly to the venue</p>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Hotel+Clarks+Inn+Suites+Dhanbad" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-[#8b3103] text-white px-10 py-5 rounded-full font-bold hover:bg-[#6b2502] transition-all transform hover:scale-105 shadow-xl uppercase tracking-widest text-sm"
                  >
                    <MapPin size={20} />
                    Get Directions
                  </a>
                </div>
              </div>
              
              <div className="h-80 md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.1132!2d86.4822!3d23.8101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6bd00071efa33%3A0xf827e990d24d9c4c!2sClarks%20Inn%20Suites%2C%20Dhanbad!5e0!3m2!1sen!2sin!4v1713356000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Family Section */}
      <section className="py-24 px-4 bg-[#fffaf7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cinzel text-3xl text-center mb-16 tracking-widest text-black font-bold">With Love & Gratitude</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl border-[#e8cfc1]/20">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-100 text-black font-bold">Soliciting your presence</h4>
              <p className="leading-relaxed text-sm text-[#8b3103] font-bold">
                Shyamsundar, Lakshminarayan, Radheshyam, Pushkarraj, Deepak, Kamalkishore Khandelwal & Family
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl border-[#e8cfc1]/20">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-100 text-black font-bold">Awaiting to Welcome you</h4>
              <div className="space-y-4 text-sm text-[#8b3103] font-bold">
                <p>Mrs. Jyoti & CA Jitendra Khandelwal</p>
                <p>Mrs. Sangeeta & Narendra Khandelwal</p>
                <p>Mrs. CA Anjali & CA Aditya Khandelwal</p>
                <p>Ankita & Arpit</p>
              </div>
            </div>
            
            <div className="glass p-8 rounded-3xl border-[#e8cfc1]/20">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-100 text-black font-bold">Maternal side</h4>
              <p className="mb-4 text-sm text-[#8b3103] font-bold">Ramanarayan Ji, Sanjay Ji, Sandeep Ji</p>
              <p className="text-xs opacity-100 text-[#8b3103] font-bold">(Sohagpur, MP)</p>
              
              <div className="mt-8 pt-8 border-t border-[#e8cfc1]/30">
                <h4 className="font-cinzel text-sm uppercase tracking-widest mb-2 opacity-100 text-black font-bold">Special</h4>
                <p className="font-vibes text-2xl text-[#8b3103] font-bold">Pahal Khandelwal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuestBook />
      {/* Footer */}
      <footer className="py-20 px-4 text-center bg-[#fffaf7]">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex justify-center gap-6">
            <a 
              href="https://instagram.com/brandupwithhoney" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#8b3103] hover:scale-125 transition-transform"
            >
              <Instagram size={40} />
            </a>
          </div>
          
          <div className="space-y-4">
            <p className="font-cinzel text-[13px] tracking-[0.3em] text-[#8b3103] uppercase font-bold">Thank You</p>
            <a 
              href="https://instagram.com/brandupwithhoney" 
              target="_blank" 
              rel="noreferrer"
              className="block font-cinzel text-[14px] tracking-widest text-[#8b3103] font-bold underline decoration-[#8b3103]/30 underline-offset-8"
            >
              @brandupwithhoney
            </a>
            <p className="text-[12px] text-[#8b3103] pt-4">
              Designed with <Heart className="inline text-[#8b3103] fill-[#8b3103] mx-1" size={14} /> by @brandupwithhoney
            </p>
          </div>
        </div>
      </footer>
    </motion.main>
  );
};

const GuestBook = () => {
  const [wishes, setWishes] = useState<{ id: string; name: string; message: string; createdAt: string }[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setWishes(wishesData);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "wishes"), {
        name,
        message,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error adding wish: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#fffaf7]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-cinzel text-3xl text-center mb-12 tracking-widest uppercase text-black font-bold">Guest Book</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div 
            className="glass p-8 rounded-3xl border-[#e8cfc1]/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-cinzel text-lg mb-6 tracking-wider opacity-100 text-black font-bold">Leave a Wish</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-cinzel uppercase tracking-widest mb-2 opacity-50 text-[#4a4a4a]">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-[#e8cfc1]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8cfc1] transition-all text-[#4a4a4a]"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-cinzel uppercase tracking-widest mb-2 opacity-50 text-[#4a4a4a]">Your Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/50 border border-[#e8cfc1]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8cfc1] transition-all h-32 resize-none text-[#4a4a4a]"
                  placeholder="Write your blessings..."
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#e8cfc1] text-[#4a4a4a] font-cinzel tracking-widest py-4 rounded-xl hover:bg-[#dcb8a6] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Wishes"}
              </button>
            </form>
          </motion.div>

          {/* Messages List */}
          <motion.div 
            className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-cinzel text-lg mb-6 tracking-wider opacity-100 text-black font-bold">Recent Wishes</h3>
            {wishes.length === 0 ? (
              <p className="text-center py-12 opacity-40 font-cinzel italic text-[#4a4a4a]">No wishes yet. Be the first!</p>
            ) : (
              wishes.map((wish) => (
                <motion.div 
                  key={wish.id}
                  className="glass p-6 rounded-2xl border-l-4 border-[#e8cfc1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm leading-relaxed mb-3 italic opacity-80 text-[#4a4a4a]">"{wish.message}"</p>
                  <div className="flex justify-between items-center">
                    <p className="font-cinzel text-xs font-bold tracking-widest uppercase text-[#d4a373]">{wish.name}</p>
                    <p className="text-[10px] opacity-40 text-[#4a4a4a]">
                      {new Date(wish.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [hasOpened, setHasOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hasOpened && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
      setIsPlaying(true);
    }
  }, [hasOpened]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen">
      <GlobalStyles />
      <AnimatePresence>
        {!hasOpened ? (
          <Envelope key="envelope" onOpen={() => setHasOpened(true)} />
        ) : (
          <WeddingContent 
            key="main" 
            isPlaying={isPlaying} 
            toggleMusic={toggleMusic} 
            audioRef={audioRef} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

