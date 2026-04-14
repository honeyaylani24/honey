/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, VolumeX, MapPin, Instagram, Calendar, Clock } from "lucide-react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap');
    
    body {
      background-color: #fdf6f0;
      color: #3a3a3a;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
    }
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-vibes { font-family: 'Great Vibes', cursive; }
    .font-poppins { font-family: 'Poppins', sans-serif; }
    
    .glass-panel {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px 0 rgba(140, 110, 120, 0.1);
    }
    
    * {
      box-sizing: border-box;
    }
  `}</style>
);

const EnvelopeReveal = ({ onOpen }: { onOpen: () => void, key?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fdf6f0] z-[100] p-4 overflow-hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[320px] h-[220px] cursor-pointer"
        onClick={handleOpen}
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 bg-[#e8cfc1] rounded-lg shadow-2xl" />

        <motion.div
          className="absolute left-2 right-2 top-2 bottom-2 bg-[#fdf6f0] rounded-md shadow-inner flex flex-col items-center justify-center text-center p-4 border border-[#e8cfc1]"
          animate={isOpen ? { y: -120, opacity: 0, scale: 0.9 } : { y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
        >
          <div className="font-cinzel text-xl text-[#3a3a3a] border-b border-[#cdb4db] pb-2 w-full">Parinay Bandhan</div>
          <div className="font-vibes text-4xl text-[#c78b9e] mt-4">Apeksha</div>
          <div className="font-vibes text-2xl text-[#c78b9e]">&</div>
          <div className="font-vibes text-4xl text-[#c78b9e]">Gaurav</div>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-r-[160px] border-b-[130px] border-l-[#d6e5d8] border-r-[#d6e5d8] border-b-[#e8cfc1] border-t-transparent drop-shadow-md opacity-95" />
        </div>

        <motion.div
          className="absolute top-0 left-0 w-full h-[130px] origin-top z-20"
          animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg viewBox="0 0 320 130" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
            <polygon points="0,0 320,0 160,130" fill="#e8cfc1" />
          </svg>
          
          {!isOpen && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-[-22px] left-[138px] w-[44px] h-[44px] bg-red-900 rounded-full flex items-center justify-center shadow-lg border-2 border-red-950 z-30"
            >
              <span className="font-vibes text-[#fdf6f0] text-xl">A&G</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {!isOpen && (
        <motion.p
          className="absolute bottom-20 text-[#3a3a3a] font-poppins tracking-widest text-sm uppercase opacity-70"
          animate={{ opacity:[0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to open
        </motion.p>
      )}
    </div>
  );
};

const ScratchCountdown = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetDate = new Date("May 1, 2026 12:15:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) return;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  },[]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f3d1dc");
    gradient.addColorStop(1, "#cdb4db");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 20px 'Cinzel', serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to Reveal", canvas.width / 2, canvas.height / 2 - 15);
    ctx.font = "14px 'Poppins', sans-serif";
    ctx.fillText("The Countdown", canvas.width / 2, canvas.height / 2 + 15);

    let isDrawing = false;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const { x, y } = getMousePos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      scratch(e);
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", (e) => { e.preventDefault(); scratch(e); }, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", scratch as any);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  },[]);

  return (
    <div className="relative w-full max-w-[360px] mx-auto h-[180px] rounded-2xl overflow-hidden glass-panel">
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4">
        <h3 className="font-cinzel text-lg mb-4 text-[#3a3a3a] font-bold tracking-widest">Time Remaining</h3>
        <div className="flex gap-4">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center shadow-sm text-[#3a3a3a] font-poppins font-semibold text-xl">
                {value}
              </div>
              <span className="text-[10px] font-poppins uppercase tracking-wider mt-2 text-[#5a5a5a]">{unit}</span>
            </div>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 touch-none cursor-crosshair rounded-2xl" />
    </div>
  );
};

const FloatingHearts = () => {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#f3d1dc] opacity-30"
          initial={{
            y: "110vh",
            x: Math.random() * 100 + "vw",
            scale: Math.random() * 0.6 + 0.4,
            rotate: Math.random() * 360
          }}
          animate={{
            y: "-10vh",
            x: Math.random() * 100 + "vw",
            rotate: Math.random() * 360 + 180
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const timelineEvents =[
  { date: "30 April 2026", time: "7:30 AM", title: "Ganesh Pujan", side: "left" },
  { date: "30 April 2026", time: "9:00 AM", title: "Carnival", side: "right" },
  { date: "30 April 2026", time: "12:15 PM", title: "Chakbhat", side: "left" },
  { date: "30 April 2026", time: "4:00 PM", title: "Godh Tika", side: "right" },
  { date: "30 April 2026", time: "8:00 PM", title: "Sangeet", side: "left" },
  { date: "1 May 2026", time: "11:30 AM", title: "Barat Swagat", side: "right" },
  { date: "1 May 2026", time: "12:15 PM", title: "Wedding Ceremony", side: "left" },
];

const galleryImages =[
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80"
];

const MainWebsite = ({ key }: { key?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  },[]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative z-10"
    >
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3" />
      
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#c78b9e] hover:scale-110 transition-transform"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <FloatingHearts />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
        <FadeIn className="text-center w-full max-w-2xl glass-panel p-10 rounded-3xl">
          <p className="font-poppins text-sm md:text-base tracking-[0.2em] uppercase text-[#5a5a5a] mb-6">Together with their families invite you</p>
          <h1 className="font-cinzel text-4xl md:text-6xl text-[#3a3a3a] mb-8 font-semibold tracking-wide">Parinay Bandhan</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <span className="font-vibes text-6xl text-[#c78b9e]">Apeksha</span>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[#f3d1dc]">
              <Heart size={32} fill="currentColor" />
            </motion.div>
            <span className="font-vibes text-6xl text-[#c78b9e]">Gaurav</span>
          </div>
          <p className="font-poppins text-lg text-[#5a5a5a] tracking-widest mt-6">1 MAY 2026</p>
        </FadeIn>
      </section>

      {/* Couple Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <FadeIn delay={0.2}>
            <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden group">
              <div className="w-32 h-32 mx-auto bg-[#e8cfc1] rounded-full mb-6 flex items-center justify-center text-4xl font-vibes text-white shadow-inner">A</div>
              <h3 className="font-cinzel text-2xl font-bold text-[#3a3a3a] mb-2">The Bride</h3>
              <p className="font-poppins text-[#5a5a5a] text-sm leading-relaxed">Daughter of Mr. & Mrs. Khandelwal, embodying grace and warmth, stepping into a beautiful new chapter.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden group">
              <div className="w-32 h-32 mx-auto bg-[#d6e5d8] rounded-full mb-6 flex items-center justify-center text-4xl font-vibes text-white shadow-inner">G</div>
              <h3 className="font-cinzel text-2xl font-bold text-[#3a3a3a] mb-2">The Groom</h3>
              <p className="font-poppins text-[#5a5a5a] text-sm leading-relaxed">Son of Mr. & Mrs. Khandelwal, walking towards a lifelong promise of love and togetherness.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4 relative z-10 flex flex-col items-center">
        <FadeIn className="w-full text-center mb-10">
          <h2 className="font-cinzel text-3xl text-[#3a3a3a] mb-4">The Big Day Approaches</h2>
          <div className="w-24 h-px bg-[#c78b9e] mx-auto" />
        </FadeIn>
        <FadeIn delay={0.2} className="w-full">
          <ScratchCountdown />
        </FadeIn>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 relative z-10">
        <FadeIn className="text-center mb-16">
          <h2 className="font-cinzel text-3xl text-[#3a3a3a] mb-4">Event Itinerary</h2>
          <div className="w-24 h-px bg-[#c78b9e] mx-auto" />
        </FadeIn>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#e8cfc1] via-[#cdb4db] to-[#d6e5d8] -translate-x-1/2" />
          
          {timelineEvents.map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: event.side === 'left' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex items-center mb-12 ${event.side === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}
            >
              <div className="hidden md:block w-1/2" />
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[#fdf6f0] border-4 border-[#c78b9e] -translate-x-1/2 z-10 shadow-md" />
              <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${event.side === 'left' ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'}`}>
                <div className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-transform">
                  <h4 className="font-cinzel font-bold text-xl text-[#3a3a3a]">{event.title}</h4>
                  <div className={`flex items-center gap-2 mt-3 text-sm text-[#5a5a5a] ${event.side === 'left' ? 'md:justify-end' : ''}`}>
                    <Calendar size={14} className="text-[#c78b9e]" />
                    <span className="font-poppins">{event.date}</span>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-sm text-[#5a5a5a] ${event.side === 'left' ? 'md:justify-end' : ''}`}>
                    <Clock size={14} className="text-[#c78b9e]" />
                    <span className="font-poppins">{event.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-20 px-4 relative z-10">
        <FadeIn className="max-w-4xl mx-auto glass-panel p-4 md:p-8 rounded-3xl text-center">
          <h2 className="font-cinzel text-3xl text-[#3a3a3a] mb-4">The Venue</h2>
          <p className="font-poppins text-[#5a5a5a] mb-8">Hotel Clarks Inn Suites, Dhanbad</p>
          <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-inner border border-[#e8cfc1]/50 mb-8">
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
          <a 
            href="https://maps.google.com/?q=Hotel+Clarks+Inn+Suites+Dhanbad" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e8cfc1] to-[#cdb4db] text-white px-8 py-3 rounded-full font-poppins text-sm tracking-wide shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <MapPin size={18} /> Open in Maps
          </a>
        </FadeIn>
      </section>

      {/* Family Section */}
      <section className="py-20 px-4 relative z-10 text-center">
        <FadeIn>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-vibes text-5xl text-[#c78b9e] mb-4">With Love from</h2>
            <p className="font-cinzel text-2xl text-[#3a3a3a] tracking-widest">Khandelwal Family</p>
          </div>
        </FadeIn>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 relative z-10">
        <FadeIn className="text-center mb-12">
          <h2 className="font-cinzel text-3xl text-[#3a3a3a] mb-4">Moments</h2>
          <div className="w-24 h-px bg-[#c78b9e] mx-auto" />
        </FadeIn>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.03 }}
              className="overflow-hidden rounded-2xl glass-panel p-2 shadow-sm"
            >
              <img src={img} alt="Gallery moment" className="w-full h-64 object-cover rounded-xl" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 flex flex-col items-center justify-center gap-4 relative z-10 mt-10">
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#e8cfc1] to-transparent mb-6" />
        <a 
          href="https://instagram.com/brandupwithhoney" 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-2 text-[#5a5a5a] hover:text-[#c78b9e] transition-colors"
        >
          <Instagram size={20} />
          <span className="font-poppins font-medium tracking-wide">@brandupwithhoney</span>
        </a>
        <p className="font-poppins text-xs text-[#8a8a8a] tracking-widest uppercase mt-2">
          Designed with <Heart size={12} className="inline text-red-400 fill-red-400 mx-1" /> by @brandupwithhoney
        </p>
      </footer>
    </motion.div>
  );
};

export default function WeddingInvitation() {
  const[hasEntered, setHasEntered] = useState(false);

  return (
    <div className="relative min-h-screen font-poppins selection:bg-[#e8cfc1] selection:text-white">
      <GlobalStyles />
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <EnvelopeReveal key="envelope" onOpen={() => setHasEntered(true)} />
        ) : (
          <MainWebsite key="main" />
        )}
      </AnimatePresence>
    </div>
  );
}

