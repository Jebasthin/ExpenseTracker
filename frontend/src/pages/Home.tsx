import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Receipt, Coffee } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coffeeBg from '../assets/coffee_background.png';

interface Expense {
  id: number;
  title: string;
  amount: string;
  category: string;
  category_display: string;
  date: string;
  description: string;
}

// Reusable ScrollReveal component using Intersection Observer
interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' } // Trigger slightly before it fully hits viewport
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getDirectionClasses = () => {
    switch (direction) {
      case 'left':
        return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-28 opacity-0';
      case 'right':
        return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-28 opacity-0';
      case 'down':
        return isVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0';
      case 'up':
      default:
        return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${getDirectionClasses()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  // State for scroll-based background parallax
  const [scrollY, setScrollY] = useState(0);

  // States for real-time dashboard data
  const [loading, setLoading] = useState(true);
  const [realSpent, setRealSpent] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [categoryShares, setCategoryShares] = useState<{ name: string; amount: number; pct: number }[]>([]);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch real-time dashboard stats
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await api.get('/expenses/', { params: { page_size: 100 } });
        const allExpenses: Expense[] = response.data.results || [];
        
        // Save recent 3 expenses
        setRecentExpenses(allExpenses.slice(0, 3));
        
        // Sum total spent
        let sum = 0;
        const categoryMap: { [key: string]: number } = {};
        
        allExpenses.forEach((exp) => {
          const amt = parseFloat(exp.amount);
          sum += amt;
          categoryMap[exp.category_display] = (categoryMap[exp.category_display] || 0) + amt;
        });
        
        setRealSpent(sum);

        // Calculate category percentages
        const calculatedShares = Object.keys(categoryMap).map((key) => {
          const amount = categoryMap[key];
          const pct = sum > 0 ? (amount / sum) * 100 : 0;
          return { name: key, amount, pct };
        });

        // Sort descending by amount and take top 3
        calculatedShares.sort((a, b) => b.amount - a.amount);
        setCategoryShares(calculatedShares.slice(0, 3));

      } catch (err) {
        console.error('Could not fetch real-time stats for Home page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-light/35 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10 w-full">
        
        {/* Parallax Background Graphic */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none transition-transform duration-75 ease-out rounded-3xl"
          style={{ 
            backgroundImage: `url(${coffeeBg})`,
            transform: `translateY(${scrollY * 0.15}px)` 
          }}
        />

        {/* Text Area (Slides in from Left) */}
        <div className="flex-1">
          <ScrollReveal direction="left">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-caramel/10 border border-caramel/20 px-4 py-1.5 rounded-full text-caramel text-xs font-semibold animate-fade-in">
                <Coffee size={14} />
                <span>Welcome, {username}! Ready to organize?</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-estetika leading-tight text-brownie">
                Finance tracking <br />
                feels like a <span className="text-caramel italic font-light">warm brew</span>.
              </h1>
              
              <p className="text-coffee/85 text-base md:text-lg leading-relaxed max-w-xl font-light font-sans">
                Welcome to Jose, where recording expenses is simple and stress-free. Take control of your daily spending habits with our clean, high-contrast aesthetics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/expenses')}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-caramel hover:bg-coffee text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-serif-aesthetic tracking-wide hover:scale-[1.02]"
                >
                  <span>Manage Expenses</span>
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#learn-more"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-cream hover:bg-cream-dark text-brownie font-medium rounded-2xl border border-cream-dark/50 transition-all duration-300 font-serif-aesthetic"
                >
                  Learn More
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero Visual Card (Slides in from Right) */}
        <div className="flex-1 w-full max-w-md">
          <ScrollReveal direction="right" delay={150}>
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-cream-dark/30 relative overflow-hidden">
              {/* Subtle gradient glowing accent */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-caramel/10 rounded-full blur-2xl"></div>

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] text-coffee/60 uppercase tracking-widest font-semibold block">Real-time Spends</span>
                  {loading ? (
                    <div className="h-8 w-24 bg-cream animate-pulse rounded-md mt-1"></div>
                  ) : (
                    <h3 className="text-3xl font-bold text-brownie font-estetika">${realSpent.toFixed(2)}</h3>
                  )}
                </div>
                <span className="text-[11px] px-2.5 py-1 bg-green-50 text-green-700 font-medium rounded-lg border border-green-200">
                  Active Sync
                </span>
              </div>

              {/* Simulated Graphic using Real Data */}
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-coffee/50 uppercase tracking-wider block">Top Spends By Category</span>
                
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-8 bg-cream/40 animate-pulse rounded-xl"></div>
                    <div className="h-8 bg-cream/40 animate-pulse rounded-xl"></div>
                  </div>
                ) : categoryShares.length === 0 ? (
                  <div className="p-4 bg-cream-light/30 rounded-2xl border border-cream-dark/20 text-center text-xs text-coffee/60">
                    No expense entries logged.
                  </div>
                ) : (
                  categoryShares.map((share, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-coffee font-medium">{share.name}</span>
                        <span className="text-brownie font-bold">${share.amount.toFixed(2)} ({share.pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            idx === 0 ? 'bg-caramel' : idx === 1 ? 'bg-brownie' : 'bg-coffee'
                          }`}
                          style={{ width: `${share.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Real Transaction Items */}
              <div className="mt-6 pt-6 border-t border-cream-dark/20 space-y-3">
                <span className="text-[10px] font-semibold text-coffee/50 uppercase tracking-wider block">Recent Logs</span>
                
                {loading ? (
                  <div className="h-12 bg-cream/40 animate-pulse rounded-xl"></div>
                ) : recentExpenses.length === 0 ? (
                  <p className="text-[11px] text-coffee/50 text-center font-light">Your ledger is empty. Add transactions to see them here.</p>
                ) : (
                  recentExpenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between items-center bg-cream-light/30 p-2.5 rounded-xl border border-cream-dark/15 hover:bg-cream-light/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="p-1.5 bg-caramel/10 text-caramel rounded-lg text-xs font-bold">☕</span>
                        <div>
                          <h4 className="text-xs font-semibold text-brownie truncate max-w-[130px]">{exp.title}</h4>
                          <p className="text-[9px] text-coffee/60">{exp.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brownie">-${parseFloat(exp.amount).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature section */}
      <section id="learn-more" className="relative bg-white border-t border-cream-dark/20 py-20 px-6 md:px-12 z-20">
        
        {/* Secondary subtle parallax element */}
        <div 
          className="absolute right-10 bottom-10 w-96 h-96 bg-cream/15 rounded-full blur-3xl pointer-events-none transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />

        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <ScrollReveal direction="up">
              <h2 className="text-3xl md:text-4xl font-bold font-estetika text-brownie">Designed with simplicity at core.</h2>
              <p className="text-coffee/80 font-light leading-relaxed">
                We focus on giving you a clear view of your financial reports without any clutter. Explore our tracking modules.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Slides in from Left */}
            <ScrollReveal direction="left" delay={100}>
              <div className="bg-cream-light/10 border border-cream-dark/25 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group h-full">
                <div className="w-12 h-12 bg-caramel/10 text-caramel rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Receipt size={24} />
                </div>
                <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Complete CRUD Engine</h3>
                <p className="text-coffee/70 font-light text-sm leading-relaxed">
                  Log expenses easily. Create, view, update details, or delete mistakes in an interactive, responsive list view.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2: Slides Up */}
            <ScrollReveal direction="up" delay={200}>
              <div className="bg-cream-light/10 border border-cream-dark/25 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group h-full">
                <div className="w-12 h-12 bg-coffee/10 text-coffee rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Live Search & Filters</h3>
                <p className="text-coffee/70 font-light text-sm leading-relaxed">
                  Search logs instantly by keywords, filter by standard categories, or sort by amount and date to view specific transactions.
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3: Slides in from Right */}
            <ScrollReveal direction="right" delay={300}>
              <div className="bg-cream-light/10 border border-cream-dark/25 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group h-full">
                <div className="w-12 h-12 bg-brownie/10 text-brownie rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Safe Authentication</h3>
                <p className="text-coffee/70 font-light text-sm leading-relaxed">
                  Your credentials and expense histories are fully secured with industry-standard JWT tokens and strict Django user bounds.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-cream/20 py-16 text-center border-t border-b border-cream-dark/20 px-4 z-20">
        <ScrollReveal direction="up">
          <blockquote className="max-w-2xl mx-auto space-y-4">
            <p className="text-2xl md:text-3xl font-estetika italic text-brownie leading-relaxed">
              "Budgeting is telling your money where to go instead of wondering where it went."
            </p>
            <cite className="block text-xs font-semibold text-coffee/60 uppercase tracking-widest">— John C. Maxwell</cite>
          </blockquote>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
