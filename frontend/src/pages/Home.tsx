import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Receipt, Coffee } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';

  return (
    <div className="min-h-screen flex flex-col bg-cream-light/30">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-caramel/10 border border-caramel/20 px-4 py-1.5 rounded-full text-caramel text-xs font-semibold">
            <Coffee size={14} />
            <span>Welcome, {username}! Ready to organize?</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-estetika leading-tight text-brownie">
            Finance tracking <br />
            feels like a <span className="text-caramel italic font-light">warm brew</span>.
          </h1>
          
          <p className="text-coffee/80 text-lg leading-relaxed max-w-xl font-light">
            Welcome to cozyLedger, where recording expenses is simple and stress-free. Take control of your daily spending habits with our clean, high-contrast aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <button
              onClick={() => navigate('/expenses')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-caramel hover:bg-coffee text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-serif-aesthetic tracking-wide"
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

        {/* Hero Visual: Aesthetic Demo Card */}
        <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-cream-dark/30 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-caramel/5 rounded-full blur-2xl"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs text-coffee/60">Estimated Spends</span>
              <h3 className="text-2xl font-bold text-brownie font-estetika">$1,240.50</h3>
            </div>
            <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 font-medium rounded-lg border border-green-200">
              On Track
            </span>
          </div>

          {/* Simple simulated graphic */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-coffee">Coffee & Dining</span>
                <span className="text-brownie">$320.00 (25%)</span>
              </div>
              <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                <div className="bg-caramel h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-coffee">Housing & Rent</span>
                <span className="text-brownie">$750.00 (60%)</span>
              </div>
              <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                <div className="bg-brownie h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-coffee">Entertainment</span>
                <span className="text-brownie font-semibold">$170.50 (15%)</span>
              </div>
              <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                <div className="bg-coffee h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          {/* Simulated Transaction item */}
          <div className="mt-6 pt-6 border-t border-cream-dark/20 space-y-3">
            <span className="text-[11px] font-semibold text-coffee/50 uppercase tracking-wider block">Recent Mock Logs</span>
            <div className="flex justify-between items-center bg-cream-light/40 p-2.5 rounded-xl border border-cream-dark/10">
              <div className="flex items-center space-x-3">
                <span className="p-1.5 bg-caramel/10 text-caramel rounded-lg text-xs font-bold">☕</span>
                <div>
                  <h4 className="text-xs font-semibold text-brownie">Morning Espresso</h4>
                  <p className="text-[10px] text-coffee/60">Today, 8:30 AM</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brownie">-$4.50</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section id="learn-more" className="bg-white border-t border-cream-dark/25 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-estetika text-brownie">Designed with simplicity at core.</h2>
            <p className="text-coffee/80 font-light leading-relaxed">
              We focus on giving you a clear view of your financial reports without any clutter. Explore our tracking modules.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cream-light/20 border border-cream-dark/30 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-caramel/10 text-caramel rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt size={24} />
              </div>
              <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Complete CRUD Engine</h3>
              <p className="text-coffee/70 font-light text-sm leading-relaxed">
                Log expenses easily. Create, view, update details, or delete mistakes in an interactive, responsive list view.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream-light/20 border border-cream-dark/30 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-coffee/10 text-coffee rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Live Search & Filters</h3>
              <p className="text-coffee/70 font-light text-sm leading-relaxed">
                Search logs instantly by keywords, filter by standard categories, or sort by amount and date to view specific transactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream-light/20 border border-cream-dark/30 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-brownie/10 text-brownie rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold font-estetika text-brownie mb-3">Safe Authentication</h3>
              <p className="text-coffee/70 font-light text-sm leading-relaxed">
                Your credentials and expense histories are fully secured with industry-standard JWT tokens and strict Django user bounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-cream/40 py-16 text-center border-t border-b border-cream-dark/30 px-4">
        <blockquote className="max-w-2xl mx-auto space-y-4">
          <p className="text-2xl md:text-3xl font-estetika italic text-brownie leading-relaxed">
            "Budgeting is telling your money where to go instead of wondering where it went."
          </p>
          <cite className="block text-xs font-semibold text-coffee/60 uppercase tracking-widest">— John C. Maxwell</cite>
        </blockquote>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
