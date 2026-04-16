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
const BRIDE_URL = "https://lh3.googleusercontent.com/d/1raN8U5MuNrSYQRvL-QnAkOb0km0frqWS";
const GROOM_URL = "https://lh3.googleusercontent.com/d/1AIDdr7cAYzLeO4swBepyt_5rqb4OgmjU";

// --- COMPONENTS ---

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Poppins:wght@300;400;600&display=swap');
    
    body {
      background-color: #fdf6f0;
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
      background: linear-gradient(to bottom, #e8cfc1, #f3d1dc, #e8cfc1);
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
          <div className="glass w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full mb-2">
            <span className="text-xl md:text-2xl font-cinzel font-bold">{value}</span>
          </div>
          <span className="text-xs uppercase tracking-widest opacity-60">{label}</span>
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
    setTimeout(onOpen, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdf6f0] p-4">
      <motion.div 
        className="relative w-full max-w-lg aspect-[4/3] cursor-pointer"
        onClick={handleOpen}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Envelope Back */}
        <div className="absolute inset-0 bg-[#e8cfc1] rounded-lg shadow-2xl" />
        
        {/* Letter */}
        <motion.div 
          className="absolute inset-4 bg-white rounded shadow-inner flex flex-col items-center justify-center p-8 text-center"
          animate={isOpen ? { y: -150, opacity: 0 } : { y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <h2 className="font-vibes text-4xl md:text-6xl text-[#3a3a3a] mb-4">Apeksha & Gaurav</h2>
          <p className="font-cinzel tracking-widest text-sm uppercase opacity-60">Wedding Invitation</p>
        </motion.div>

        {/* Envelope Flap */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1/2 bg-[#dcb8a6] origin-top z-10"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Wax Seal */}
        {!isOpen && (
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-[#b91c1c] rounded-full flex items-center justify-center shadow-lg border-4 border-[#991b1b]"
            whileHover={{ scale: 1.1 }}
          >
            <span className="font-vibes text-white text-2xl">AG</span>
          </motion.div>
        )}
        
        <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-cinzel text-xs tracking-[0.3em] uppercase opacity-40 animate-pulse">
          Click to Open
        </p>
      </motion.div>
    </div>
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
      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#e8cfc1] border-2 border-white shadow-sm" />
      
      <h3 className="font-cinzel font-bold text-xl text-[#e8cfc1] mb-4 flex items-center gap-2">
        <Calendar size={18} /> {date}
      </h3>
      
      <div className="space-y-6">
        {events.map((event, i) => (
          <div key={i} className="glass p-4 rounded-2xl">
            <h4 className="font-cinzel font-semibold text-lg">{event.title}</h4>
            <p className="flex items-center gap-2 text-sm opacity-70 mt-1">
              <Clock size={14} /> {event.time}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
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
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.img 
          src={LOGO_URL} 
          alt="Wedding Logo" 
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-32 h-32 md:w-48 md:h-48 rounded-full mb-8 shadow-xl border-4 border-white z-10"
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
          className="font-cinzel text-xs md:text-sm tracking-[0.4em] uppercase mb-4 opacity-60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Together with their families invite you
        </motion.p>
        
        <motion.h1 
          className="font-cinzel text-3xl md:text-5xl font-bold mb-4 tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Parinay Bandhan
        </motion.h1>
        
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-vibes text-6xl md:text-8xl text-[#e8cfc1]">Apeksha</span>
          <Heart className="text-[#f3d1dc] fill-[#f3d1dc] animate-pulse" size={32} />
          <span className="font-vibes text-6xl md:text-8xl text-[#e8cfc1]">Gaurav</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="font-cinzel text-xl md:text-2xl tracking-widest mb-4">1 MAY 2026</p>
          <Countdown />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} className="opacity-30" />
        </motion.div>
      </section>

      {/* Bride & Groom Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
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
                  background: 'conic-gradient(from 0deg, transparent, #e8cfc1, #f3d1dc, #e8cfc1, transparent)',
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
                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-white shadow-2xl z-10"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-lg z-20">
                <Heart className="text-[#f3d1dc] fill-[#f3d1dc]" size={24} />
              </div>
            </div>
            
            <h2 className="font-vibes text-6xl text-[#e8cfc1] mb-6">Apeksha</h2>
            
            <div className="glass p-8 rounded-[2rem] space-y-4 border border-white/40">
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Granddaughter of</p>
                <p className="font-cinzel text-sm font-semibold">Late Urmiladevi & Shyamsundar Khandelwal</p>
              </div>
              
              <div className="w-12 h-px bg-[#e8cfc1]/30 mx-auto" />
              
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Daughter of</p>
                <p className="font-cinzel text-sm font-semibold">Jyoti & Jitendra Khandelwal</p>
              </div>

              <div className="w-12 h-px bg-[#e8cfc1]/30 mx-auto" />

              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Maternal Side</p>
                <p className="font-cinzel text-xs opacity-70">Ramanarayan, Sanjay, Sandeep</p>
                <p className="font-cinzel text-[10px] opacity-40">(Sohagpur, MP)</p>
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
                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-white shadow-2xl z-10"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg z-20">
                <Heart className="text-[#e8cfc1] fill-[#e8cfc1]" size={24} />
              </div>
            </div>

            <h2 className="font-vibes text-6xl text-[#e8cfc1] mb-6">Gaurav</h2>
            
            <div className="glass p-8 rounded-[2rem] space-y-4 border border-white/40">
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Grandson of</p>
                <p className="font-cinzel text-sm font-semibold">Late Sharadadevi & Late Ramchandra Dangayach</p>
              </div>
              
              <div className="w-12 h-px bg-[#e8cfc1]/30 mx-auto" />
              
              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Son of</p>
                <p className="font-cinzel text-sm font-semibold">Anita & Manoj Kumar Dangayach</p>
              </div>

              <div className="w-12 h-px bg-[#e8cfc1]/30 mx-auto" />

              <div className="space-y-1">
                <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase opacity-40">Family From</p>
                <p className="font-cinzel text-sm font-semibold">Katras, Dhanbad</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white/30" ref={timelineRef}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-3xl md:text-4xl text-center mb-16 tracking-widest">Event Timeline</h2>
          
          <div className="relative">
            <motion.div 
              className="absolute left-[-12px] z-10 text-[#e8cfc1]"
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
                { title: "Wedding Ceremony", time: "12:15 PM" }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-8 md:p-12 rounded-[3rem] overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-cinzel text-3xl mb-6 tracking-widest">The Venue</h2>
                <p className="text-xl font-semibold mb-2 text-[#e8cfc1]">Hotel Clarks Inn Suites</p>
                <p className="opacity-70 mb-8">Dhanbad, Jharkhand</p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#e8cfc1] shrink-0" />
                    <p className="text-sm leading-relaxed">
                      Experience the luxury and grandeur of our celebration at the prestigious Clarks Inn Suites.
                    </p>
                  </div>
                </div>

                <a 
                  href="https://maps.google.com/?q=Hotel+Clarks+Inn+Suites+Dhanbad" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#e8cfc1] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#dcb8a6] transition-colors shadow-lg"
                >
                  <MapPin size={18} /> Open in Google Maps
                </a>
              </div>
              
              <div className="h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0438139534685!2d86.4357731!3d23.8170425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6a32a688b7aa3%3A0x6b8bc23db0de5855!2sClarks%20Inn%20Suites%20Dhanbad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
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

      {/* Special Note & Barat Info */}
      <section className="py-24 px-4 bg-[#f3d1dc]/10">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <motion.div 
            className="glass p-12 rounded-[3rem]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Heart className="mx-auto text-[#e8cfc1] mb-6" size={48} />
            <h3 className="font-cinzel text-2xl mb-4 tracking-widest uppercase">Special Note</h3>
            <p className="font-vibes text-4xl text-[#e8cfc1] mb-2">Aashirwad Ceremony followed by Dinner</p>
            <p className="opacity-60">From 8:00 PM onwards till your arrival</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl">
              <h3 className="font-cinzel text-lg mb-4 tracking-widest uppercase opacity-60">Barat From</h3>
              <p className="font-semibold text-lg">Shri Manoj Kumar Dangayach</p>
              <p className="text-sm opacity-70">Katras, Dhanbad</p>
            </div>
            <div className="glass p-8 rounded-3xl">
              <h3 className="font-cinzel text-lg mb-4 tracking-widest uppercase opacity-60">Barat To</h3>
              <p className="font-semibold text-lg">Hotel Clarks Inn Suites</p>
              <p className="text-sm opacity-70">Dhanbad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cinzel text-3xl text-center mb-16 tracking-widest">With Love & Blessings</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-60">Inviting</h4>
              <p className="leading-relaxed text-sm">
                Shyamsundar, Lakshminarayan, Radheshyam, Pushkarraj, Deepak, Kamalkishore & Family
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-60">Welcoming</h4>
              <div className="space-y-4 text-sm">
                <p>Jyoti, Sangeeta, Anjali</p>
                <p>Jitendra, Narendra, Aditya</p>
                <p>Ankita, Arpit</p>
              </div>
            </div>
            
            <div className="glass p-8 rounded-3xl">
              <h4 className="font-cinzel text-sm uppercase tracking-widest mb-6 opacity-60">Maternal</h4>
              <p className="mb-4 text-sm">Ramanarayan, Sanjay, Sandeep</p>
              <p className="text-xs opacity-60">(Sohagpur, MP)</p>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <h4 className="font-cinzel text-sm uppercase tracking-widest mb-2 opacity-60">Special</h4>
                <p className="font-vibes text-2xl text-[#e8cfc1]">Pahal Khandelwal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuestBook />
      {/* Footer */}
      <footer className="py-16 px-4 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex justify-center gap-6">
            <a 
              href="https://instagram.com/brandupwithhoney" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#e8cfc1] hover:scale-125 transition-transform"
            >
              <Instagram size={32} />
            </a>
          </div>
          
          <div className="space-y-2">
            <p className="font-cinzel text-sm tracking-widest opacity-60">@brandupwithhoney</p>
            <p className="text-sm">
              Designed with <Heart className="inline text-red-500 fill-red-500 mx-1" size={14} /> by @brandupwithhoney
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
    <section className="py-24 px-4 bg-white/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-cinzel text-3xl text-center mb-12 tracking-widest uppercase">Guest Book</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div 
            className="glass p-8 rounded-3xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-cinzel text-lg mb-6 tracking-wider opacity-80">Leave a Wish</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-cinzel uppercase tracking-widest mb-2 opacity-50">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8cfc1] transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-cinzel uppercase tracking-widest mb-2 opacity-50">Your Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8cfc1] transition-all h-32 resize-none"
                  placeholder="Write your blessings..."
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#e8cfc1] text-white font-cinzel tracking-widest py-4 rounded-xl hover:bg-[#dcb8a6] transition-colors disabled:opacity-50"
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
            <h3 className="font-cinzel text-lg mb-6 tracking-wider opacity-80">Recent Wishes</h3>
            {wishes.length === 0 ? (
              <p className="text-center py-12 opacity-40 font-cinzel italic">No wishes yet. Be the first!</p>
            ) : (
              wishes.map((wish) => (
                <motion.div 
                  key={wish.id}
                  className="glass p-6 rounded-2xl border-l-4 border-[#e8cfc1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm leading-relaxed mb-3 italic opacity-80">"{wish.message}"</p>
                  <div className="flex justify-between items-center">
                    <p className="font-cinzel text-xs font-bold tracking-widest uppercase text-[#e8cfc1]">{wish.name}</p>
                    <p className="text-[10px] opacity-40">
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

