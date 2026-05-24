import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Copy, Star, Check, ChevronDown, 
  Trash2, MessageSquare, Clock, Heart, ShieldCheck, 
  HelpCircle, Zap, Users, Play, AlertCircle, Share2, 
  ExternalLink, ArrowRight, ThumbsUp, RefreshCw, Send, CheckCircle2,
  Gift, Award, Flame, StarHalf, Smartphone, ShoppingCart
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  type: 'diamond' | 'membership';
  diamonds: number;
  originalPrice: number;
  price: number;
  discount: string;
  popular?: boolean;
  bonus?: string;
}

interface Review {
  name: string;
  rating: number;
  comment: string;
  time: string;
  item: string;
  isVerified: boolean;
}

interface RecentPurchase {
  id: string;
  name: string;
  uid: string;
  packName: string;
  payment: string;
  time: string;
  price: number;
  status: 'Completed' | 'Pending';
}

const INITIAL_PACKAGES: Package[] = [
  { id: 'p1', name: '115 Diamonds', type: 'diamond', diamonds: 115, originalPrice: 95, price: 85, discount: '10% OFF', popular: false, bonus: '+15 Bonus' },
  { id: 'p2', name: '240 Diamonds', type: 'diamond', diamonds: 240, originalPrice: 185, price: 165, discount: '11% OFF', popular: true, bonus: '+25 Bonus' },
  { id: 'p3', name: '505 Diamonds', type: 'diamond', diamonds: 505, originalPrice: 380, price: 340, discount: '10% OFF', popular: false },
  { id: 'p4', name: '610 Diamonds', type: 'diamond', diamonds: 610, originalPrice: 460, price: 410, discount: '11% OFF', popular: false },
  { id: 'p5', name: '1080 Diamonds', type: 'diamond', diamonds: 1080, originalPrice: 800, price: 720, discount: '10% OFF', popular: true, bonus: '+105 Bonus 🔥' },
  { id: 'p6', name: '2240 Diamonds', type: 'diamond', diamonds: 2240, originalPrice: 1650, price: 1450, discount: '12% OFF', popular: false, bonus: '+240 Bonus 💎' },
  { id: 'p7', name: 'Weekly Membership', type: 'membership', diamonds: 450, originalPrice: 210, price: 190, discount: '10% OFF', popular: false, bonus: 'Claim 450 total' },
  { id: 'p8', name: 'Monthly Membership', type: 'membership', diamonds: 2600, originalPrice: 950, price: 830, discount: '13% OFF', popular: true, bonus: 'Claim 2600 total ✨' },
  { id: 'p9', name: 'Weekly Lite Pass', type: 'membership', diamonds: 150, originalPrice: 110, price: 95, discount: '13% OFF', popular: false }
];

const INITIAL_REVIEWS: Review[] = [
  { name: 'Siam Ahmed', rating: 5, comment: 'মাত্র ২ মিনিটে ডায়মন্ড পেয়ে গেলাম! ABR-SHOP সেরা এবং ট্রাস্টেড।', time: '১০ মিনিট আগে', item: '240 Diamonds', isVerified: true },
  { name: 'Arif Chowdhury', rating: 5, comment: 'Weekly Membership টা অনেক কমে পেয়েছি। পেমেন্ট করার পর একদম সাথে সাথে একটিভ হয়েছে।', time: '১ ঘন্টা আগে', item: 'Weekly Membership', isVerified: true },
  { name: 'Joy Barua', rating: 5, comment: 'bkash payment option was very smooth. Best service in Bangladesh.', time: '৩ ঘন্টা আগে', item: '1080 Diamonds', isVerified: true },
  { name: 'Rakibul Islam', rating: 4, comment: 'খুব ভালো সাইট। ৫ মিনিট লেগেছে বাট ওনারা হোয়াটসঅ্যাপে নক দিয়ে সাথে সাথে বুঝিয়ে দিয়েছে।', time: '৫ ঘন্টা আগে', item: '505 Diamonds', isVerified: true },
  { name: 'Tanvir Mahtab', rating: 5, comment: 'অসাধারণ ডিজাইন ভাইয়া! ডায়মন্ড ও খুব দ্রুত চলে আসে আইডিতে।', time: '১ দিন আগে', item: 'Monthly Membership', isVerified: true }
];

const FAQS = [
  { q: "টপআপ হতে কত সময় লাগে?", a: "পেমেন্ট কমপ্লিট হওয়ার পর সাধারণ সময় ১ থেকে ৫ মিনিটের মধ্যে সয়ংক্রিয়ভাবে আপনার ফ্রি ফায়ার আইডিতে ডায়মন্ড চলে যাবে।" },
  { q: "ভুল UID দিলে কি টপআপ সম্পন্ন হবে?", a: "ভুল ইউআইডি দিলে টপআপ সম্পন্ন হবে না অথবা অন্য কারও অ্যাকাউন্টে চলে যেতে পারে। তাই টপআপ করার সময় অনুগ্রহ করে খুব সতর্কতার সাথে সঠিক UID প্রদান করুন।" },
  { q: "পেমেন্ট করার পর কোন রেফারেন্স কোড পাওয়া যায়?", a: "হ্যাঁ, টাকা পাঠানোর পর বিকাশ/নগদ/রকেটে যে ট্রানজেকশন আইডি (TxnID) পাবেন, সেটি ফর্মে দিয়ে সাবমিট করবেন। এর পর হোয়াটস্যাপে কনফার্ম করবেন।" },
  { q: "আপনারা কি ডাবল ডায়মন্ড বোনাস দেন?", a: "হ্যাঁ, নতুন ইভেন্ট চালু থাকা অবস্থায় প্রতিটি প্যাকের সাথে নির্দেশিত ডাবল বা বোনাস ডায়মন্ড স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে যোগ করা হয়।" }
];

export default function App() {
  // Splash / Loading Screen State
  const [loading, setLoading] = useState<boolean>(true);
  
  // Theme State: 'charcoal' (dark) vs 'deep-blue' (dark blue)
  const [theme, setTheme] = useState<'charcoal' | 'deep-blue'>('charcoal');

  // Page Scroll Progress
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Search, Filter, and Selections
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'diamond' | 'membership'>('all');
  const [selectedPack, setSelectedPack] = useState<Package>(INITIAL_PACKAGES[1]); // DEFAULT 240 Premium Pack
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Order Form Inputs
  const [uid, setUid] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [errorFields, setErrorFields] = useState<{ uid?: string; name?: string }>({});

  // Payment configuration (numbers are representation for BD context)
  const paymentNumbers = {
    bkash: { type: 'Personal', number: '01777205950', limit: '৮৫-২০০০৳' },
    nagad: { type: 'Personal', number: '01777205950', limit: '৮৫-৩০০০৳' },
    rocket: { type: 'Personal', number: '01777205950', limit: '৯৫-২০০০৳' }
  };

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recent Purchases (Local state initialized from LocalStorage)
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);

  // Visitor Counter
  const [visitors, setVisitors] = useState<number>(1429);

  // Active Live Activity Ticker state
  const [liveTickerMsg, setLiveTickerMsg] = useState<string>("Siam *742 just purchased Weekly Membership 🔥");

  // Custom User Reviews Added
  const [allReviews, setAllReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reviewInputName, setReviewInputName] = useState<string>('');
  const [reviewInputComment, setReviewInputComment] = useState<string>('');
  const [reviewInputRating, setReviewInputRating] = useState<number>(5);

  // Mobile Bottom Tab Navigation state for mobile view
  const [mobileTab, setMobileTab] = useState<'home' | 'packages' | 'order' | 'support'>('home');

  // Success Popup Animation state
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  // FAQ accordion open index state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Skeleton loading simulation
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(false);

  // Refs for smooth scroll layout
  const packagesRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Splash timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Update visitors, dynamic simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Generate fake transaction ticker FOMO alerts
  useEffect(() => {
    const fomoNames = ['Siam', 'Arif', 'Joy', 'Rakib', 'Sakib', 'Pranto', 'Nayeem', 'Rifat', 'Adnan', 'Tanvir', 'Hasan', 'Mustafiz', 'Mahmudul'];
    const fomoServices = [
      '115 Diamonds 💎', 
      '240 Diamonds 💎', 
      '505 Diamonds 💎', 
      '1080 Diamonds 🔥', 
      '2240 Diamonds 💎', 
      'Weekly Membership 🥇', 
      'Monthly Membership ✨'
    ];
    const generateTicker = () => {
      const name = fomoNames[Math.floor(Math.random() * fomoNames.length)] + ' *' + Math.floor(Math.random() * 900 + 100);
      const service = fomoServices[Math.floor(Math.random() * fomoServices.length)];
      const times = ['just now', '1 min ago', '2 mins ago', '3 mins ago'];
      const text = `${name} purchased ${service} - ${times[Math.floor(Math.random() * times.length)]}`;
      setLiveTickerMsg(text);
    };

    const interval = setInterval(generateTicker, 7500);
    return () => clearInterval(interval);
  }, []);

  // Sync recent purchases with local storage
  useEffect(() => {
    const savedPurchases = localStorage.getItem('redi_ff_recent_purchases');
    if (savedPurchases) {
      setRecentPurchases(JSON.parse(savedPurchases));
    } else {
      const demoPurchases: RecentPurchase[] = [
        { id: '10214', name: 'Sayed Sheikh', uid: '382103323', packName: '240 Diamonds', payment: 'bKash', time: '5 mins ago', price: 165, status: 'Completed' },
        { id: '10213', name: 'Mahir Chowdhury', uid: '298710221', packName: 'Monthly Membership', payment: 'Nagad', time: '12 mins ago', price: 830, status: 'Completed' },
        { id: '10212', name: 'Joy Dev', uid: '921102943', packName: 'Weekly Membership', payment: 'Rocket', time: '20 mins ago', price: 190, status: 'Completed' }
      ];
      setRecentPurchases(demoPurchases);
      localStorage.setItem('redi_ff_recent_purchases', JSON.stringify(demoPurchases));
    }

    const savedFavs = localStorage.getItem('redi_ff_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    const lastPayment = localStorage.getItem('redi_ff_payment_method');
    if (lastPayment && (lastPayment === 'bkash' || lastPayment === 'nagad' || lastPayment === 'rocket')) {
      setPaymentMethod(lastPayment as 'bkash' | 'nagad' | 'rocket');
    }
  }, []);

  // Update scroll bar progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(fId => fId !== id);
      triggerToast('💎 Removed package from favorites');
    } else {
      updated = [...favorites, id];
      triggerToast('💖 Added package to favorites!');
    }
    setFavorites(updated);
    localStorage.setItem('redi_ff_favorites', JSON.stringify(updated));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('Copied to clipboard! 📋');
  };

  const handleSearchAndFilter = (type: 'all' | 'diamond' | 'membership', searchTerm: string) => {
    setIsSkeletonLoading(true);
    setActiveFilter(type);
    setSearchQuery(searchTerm);
    setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 350);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { uid?: string; name?: string } = {};

    if (!uid || uid.trim().length < 8) {
      errors.uid = 'সঠিক প্লেয়ার UID (কমপক্ষে ৮ সংখ্যা) দিন!';
    }
    if (!playerName || playerName.trim().length < 2) {
      errors.name = 'অনুগ্রহ করে প্লেয়ার এর নাম দিন!';
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      triggerToast('🚫 ফরমে ভুলত্রুটি আছে! ঠিক করুন।');
      return;
    }

    setErrorFields({});
    
    // Process successful mock order
    const orderId = Math.floor(Math.random() * 90000 + 10000).toString();
    setLastSubmittedId(orderId);
    
    const newPurchase: RecentPurchase = {
      id: orderId,
      name: playerName,
      uid: uid,
      packName: selectedPack.name,
      payment: paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket',
      time: 'Just now',
      price: selectedPack.price,
      status: 'Pending'
    };

    const finalPurchases = [newPurchase, ...recentPurchases.slice(0, 4)];
    setRecentPurchases(finalPurchases);
    localStorage.setItem('redi_ff_recent_purchases', JSON.stringify(finalPurchases));
    localStorage.setItem('redi_ff_payment_method', paymentMethod);

    // Dynamic success modal popup
    setShowSuccessPopup(true);

    // Auto-scroll on checkout successful or trigger state
  };

  // Generate WhatsApp Message Link and redirect
  const initiateWhatsAppDeliveryMessage = () => {
    const encodedMsg = encodeURIComponent(
      `আসসালামু আলাইকুম, আমি ABR-SHOP থেকে ফ্রি ফায়ার টপআপ অর্ডার করেছি।\n\n` +
      `📌 রেফারেন্স আইডি: #${lastSubmittedId}\n` +
      `🎮 প্লেয়ার UID: ${uid}\n` +
      `👤 প্লেয়ার নাম: ${playerName}\n` +
      `💎 ডায়মন্ড প্যাক: ${selectedPack.name}\n` +
      `💳 পেমেন্ট পদ্ধতি: ${paymentMethod.toUpperCase()}\n` +
      `💰 টাকার পরিমান: ৳ ${selectedPack.price}\n\n` +
      `অনুগ্রহ করে আমার অর্ডারটি জলদি কমপ্লিট করে দিন!`
    );
    window.open(`https://wa.me/8801777205950?text=${encodedMsg}`, '_blank');
  };

  // Handle Client Review submitting
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewInputName.trim() || !reviewInputComment.trim()) {
      triggerToast('🚫 অনুগ্রহ করে নাম এবং মন্তব্য লিখুন!');
      return;
    }

    const newRev: Review = {
      name: reviewInputName,
      rating: reviewInputRating,
      comment: reviewInputComment,
      time: 'এইমাত্র',
      item: selectedPack.name,
      isVerified: true
    };

    setAllReviews([newRev, ...allReviews]);
    setReviewInputName('');
    setReviewInputComment('');
    triggerToast('⭐ ধন্যবাদ! আপনার রিভিউ যোগ হয়েছে।');
  };

  // Pack filters logic
  const filteredPackages = INITIAL_PACKAGES.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.type === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.price.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Calculate live countdown timer
  const [timeLeft, setTimeLeft] = useState({ hrs: 12, mins: 45, secs: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        } else if (prev.hrs > 0) {
          return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        } else {
          return { hrs: 12, mins: 0, secs: 0 }; // Loop banner reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen text-[#eaebec] ${theme === 'charcoal' ? 'bg-[#0a0b10]' : 'bg-[#0a1128]'} relative selection:bg-[#ff9d00] selection:text-black overflow-hidden transiton-all duration-500 pb-20 md:pb-0`}>
      
      {/* Page scroll dynamic indicator */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Decorative ambient glowing circles */}
      <div className="absolute top-[-150px] left-[-150px] w-96 h-96 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[40%] right-[-100px] w-96 h-96 bg-gradient-to-r from-teal-500/10 to-orange-500/10 rounded-full filter blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] left-[20%] w-[450px] h-[450px] bg-gradient-to-tr from-orange-600/10 to-transparent rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* 1. Splash Screen / Loading Overlay */}
      {loading && (
        <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-700 ${theme === 'charcoal' ? 'bg-[#0a0b10]' : 'bg-[#0a1128]'}`}>
          <div className="relative flex flex-col items-center animate-pulse">
            {/* Elegant Loading Graphic */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff9d00] to-[#ff5e00] rounded-2xl transform rotate-45 opacity-20 animate-spin-slow"></div>
              <div className="absolute inset-2 border-2 border-dashed border-[#ff9d00]/30 rounded-2xl transform rotate-12"></div>
              <div className="w-16 h-16 ff-gradient rounded-xl flex items-center justify-center font-black text-white italic text-3xl shadow-xl shadow-orange-500/20">FF</div>
            </div>
            
            <div className="mt-8 text-center">
              <span className="text-2xl font-black tracking-widest text-white block">ABR-<span className="text-[#ff9d00]">SHOP</span></span>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mt-1">Free Fire Premium Top-Up Network</p>
            </div>
          </div>
          
          <div className="absolute bottom-12 w-48 bg-white/5 h-[3px] rounded-full overflow-hidden">
            <div className="h-full ff-gradient animate-shimmer" style={{ width: '80%', animation: 'loading-shimmer 1.5s infinite' }}></div>
          </div>
          <p className="absolute bottom-6 text-[10px] text-white/30 tracking-wide">Secure SSL & Realtime Delivery Client</p>
        </div>
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[100] glass px-5 py-3 rounded-xl border border-orange-500/40 text-sm font-semibold flex items-center gap-2.5 shadow-2xl shadow-black/60 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-[#ff9d00] animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Top Header Navigation (Sticky) */}
      <nav className="sticky top-0 z-50 glass-darker px-4 md:px-8 py-3 flex items-center justify-between border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          {/* Logo with interactive click to scroll to top */}
          <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 ff-gradient rounded-lg flex items-center justify-center font-black text-white italic text-lg shadow-md shadow-orange-500/10 transform group-hover:scale-105 transition-all">FF</div>
            <span className="text-lg md:text-xl font-extrabold tracking-tighter text-white">ABR-<span className="text-[#ff9d00]">SHOP</span></span>
          </div>

          {/* Inline Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-semibold text-white/70">
            <button onClick={() => scrollToSection(packagesRef)} className="hover:text-[#ff9d00] transition-colors">প্যাকেজসমূহ</button>
            <button onClick={() => scrollToSection(orderRef)} className="hover:text-[#ff9d00] transition-colors">অর্ডার ফর্ম</button>
            <button onClick={() => scrollToSection(reviewsRef)} className="hover:text-[#ff9d00] transition-colors">রিভিউ ও রেটিং</button>
            <a href="https://wa.me/8801799223344" target="_blank" rel="noreferrer" className="hover:text-[#ff9d00] transition-colors flex items-center gap-1.5 text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Support
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme customizer layout switches toggle */}
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
            <button 
              onClick={() => { setTheme('charcoal'); triggerToast('🔲 Theme set to Space Obsidian Charcoal'); }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${theme === 'charcoal' ? 'bg-[#ff9d00] text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
            >
              Classic Dark
            </button>
            <button 
              onClick={() => { setTheme('deep-blue'); triggerToast('🔷 Theme set to Cyber Dark Blue'); }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${theme === 'deep-blue' ? 'bg-[#ff9d00] text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
            >
              Dark Blue
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="glass rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Delivery Status: Auto ⚡</span>
            </div>
            {/* Live active visitors count */}
            <div className="bg-black/30 border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-white/70 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>{visitors} Online BD Players</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Fake live activity ticker - sliding layout */}
      <div className="w-full bg-[#ff9d00]/10 border-b border-[#ff9d00]/20 py-2.5 px-4 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#ff9d00] text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse shrink-0">
            <Zap className="w-3 h-3 fill-black" /> LIVE
          </div>
          <p className="text-xs font-semibold text-[#ff9d00] animate-pulse truncate transition-all duration-500">
            {liveTickerMsg}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Hero banner and top up options (Col-span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* 3. Hero Event / Interactive Promotions Section with Loop Countdown */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-10 ff-gradient shadow-2xl shadow-orange-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            
            {/* Floating visual elements */}
            <div className="absolute right-0 bottom-0 top-0 opacity-15 overflow-hidden pointer-events-none">
              <svg width="450" height="400" viewBox="0 0 24 24" fill="white" className="transform translate-x-[100px] translate-y-[50px]">
                <path d="M12 2L2 12l10 10 10-10L12 2z"></path>
              </svg>
            </div>
            
            <div className="z-10 max-w-lg">
              <span className="bg-black/30 text-white text-[10px] uppercase font-extrabold tracking-[0.2em] px-3 py-1 rounded-full inline-block backdrop-blur-md mb-3">
                🔥 Bangladesh Most Trusted Shop
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                Instantly Load <br className="hidden md:block"/>
                <span className="text-black bg-white px-2 py-0.5 rounded inline-block mt-1 font-extrabold">Free Fire BD</span> Diamonds
              </h1>
              <p className="text-white/95 text-xs md:text-sm mt-3 font-medium leading-relaxed max-w-md">
                খুব সহজেই বিকাশ, রকেট বা নগদ দিয়ে অ্যাকাউন্ট পাসওয়ার্ড ছাড়াই ইউজার আইডি (UID) দিয়ে ডায়মন্ড টপআপ করুন। সুপার ফাস্ট সেফ ডেলিভারি!
              </p>
              
              {/* Delivery Speed Highlight badge */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                <div className="flex items-center gap-1.5 bg-black/20 text-white font-bold text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-[#ff9d00] fill-white/10" /> Safe Delivery (100% Anti-Ban)
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 text-white font-bold text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-[#ff9d00]" /> 1 - 5 Mins Delivery Guaranteed
                </div>
              </div>
            </div>

            {/* Countdown timer module promo */}
            <div className="glass p-5 rounded-xl border border-white/20 self-stretch md:self-auto flex flex-col justify-center items-center backdrop-blur-md text-center z-10 shrink-0 md:min-w-[190px]">
              <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">Flash Discount Ends In</span>
              <div className="flex items-center gap-2.5 mt-3">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{timeLeft.hrs.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase font-bold text-white/60">Hrs</span>
                </div>
                <span className="text-xl font-bold text-white/50 -mt-3">:</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{timeLeft.mins.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase font-bold text-white/60">Mins</span>
                </div>
                <span className="text-xl font-bold text-white/50 -mt-3">:</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#ff9d00] animate-pulse">{timeLeft.secs.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase font-bold text-white/60">Secs</span>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="ff-gradient h-full w-[65%] animate-pulse"></div>
              </div>
              <span className="text-[10px] text-white/80 font-semibold mt-2">Discount Up To 15% OFF today</span>
            </div>
          </div>

          {/* 4. Packages Interactive Area */}
          <div ref={packagesRef} className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-[#ff9d00]" />
                  <span>টপআপ প্রোডাক্ট সিলেক্ট করুন</span>
                </h2>
                <p className="text-white/60 text-xs mt-0.5">সবচেয়ে কম মূল্যের এবং জনপ্রিয় ফাস্ট টপ-আপ তালিকা</p>
              </div>

              {/* Filtering + Search Subsystem */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="প্যাক খুঁজুন (যেমন: 115)..."
                    value={searchQuery}
                    onChange={(e) => handleSearchAndFilter(activeFilter, e.target.value)}
                    className="bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff9d00] focus:ring-1 focus:ring-[#ff9d00] transition-all w-full sm:w-48"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => handleSearchAndFilter(activeFilter, '')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex bg-black/40 p-1 rounded-full border border-white/5 text-[11px] font-bold">
                  <button 
                    onClick={() => handleSearchAndFilter('all', searchQuery)}
                    className={`px-3 py-1 rounded-full transition-all ${activeFilter === 'all' ? 'bg-[#ff9d00] text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => handleSearchAndFilter('diamond', searchQuery)}
                    className={`px-3 py-1 rounded-full transition-all ${activeFilter === 'diamond' ? 'bg-[#ff9d00] text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Diamonds
                  </button>
                  <button 
                    onClick={() => handleSearchAndFilter('membership', searchQuery)}
                    className={`px-3 py-1 rounded-full transition-all ${activeFilter === 'membership' ? 'bg-[#ff9d00] text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Membership
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Skeleton loading effect indicator */}
            {isSkeletonLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="glass p-5 rounded-2xl flex flex-col items-center gap-3 relative border-white/5">
                    <div className="w-12 h-12 skeleton rounded-full mb-1"></div>
                    <div className="w-20 h-4 skeleton rounded"></div>
                    <div className="w-12 h-5 skeleton rounded"></div>
                    <div className="w-full h-8 skeleton rounded mt-2"></div>
                  </div>
                ))}
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="glass p-12 rounded-2xl text-center flex flex-col items-center justify-center border-white/5">
                <AlertCircle className="w-12 h-12 text-[#ff9d00]/50 mb-3" />
                <h3 className="text-base font-bold text-white">দুঃখিত, কোনো প্যাকেজ পাওয়া যায়নি!</h3>
                <p className="text-xs text-white/50 mt-1 max-w-sm">অন্য কোনো প্যাকেজ এর নাম অথবা ডায়মন্ডের সংখ্যা সার্চ করে ট্রাই করুন।</p>
                <button 
                  onClick={() => handleSearchAndFilter('all', '')}
                  className="mt-4 px-4 py-2 text-xs bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all"
                >
                  সার্চ রিসেট করুন
                </button>
              </div>
            ) : (
              /* Custom Topup Product Grid */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPackages.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  const isFavorite = favorites.includes(pack.id);
                  return (
                    <div 
                      key={pack.id}
                      id={`pack-${pack.id}`}
                      onClick={() => {
                        setSelectedPack(pack);
                        triggerToast(`📍 Selected ${pack.name}`);
                      }}
                      className={`glass p-4 md:p-5 rounded-2xl flex flex-col items-center justify-between text-center relative pointer-events-auto cursor-pointer select-none transform transition-all duration-300 active:scale-95 group border-2 ${
                        isSelected 
                          ? 'border-[#ff9d00] bg-[#ff9d00]/5 shadow-xl shadow-orange-500/5' 
                          : 'border-white/5 hover:border-[#ff9d00]/40 hover:-translate-y-1'
                      }`}
                    >
                      {/* Favorite Button */}
                      <button 
                        onClick={(e) => toggleFavorite(pack.id, e)}
                        className="absolute top-2.5 left-2.5 p-1 rounded-full bg-white/5 hover:bg-[#ff9d00]/20 text-white/50 hover:text-rose-500 transition-colors z-20"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Top labels (popular tag / discount tag) */}
                      {pack.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff9d00] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Flame className="w-3 h-3 text-black fill-black animate-bounce" /> MOST BOUGHT
                        </span>
                      )}

                      {pack.discount && !pack.popular && (
                        <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded">
                          {pack.discount}
                        </span>
                      )}

                      {/* Pack SVG diamonds illustration icon */}
                      <div className="h-16 flex items-center justify-center mt-3 mb-2">
                        {pack.type === 'diamond' ? (
                          <div className="relative">
                            {/* Multicrystal glowing vector representations */}
                            <svg className={`w-12 h-12 text-[#ff9d00] transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,157,0,0.6)]' : 'group-hover:scale-105'}`} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L3.5 10H20.5L12 2ZM3 12L12 22L21 12H3Z"/>
                            </svg>
                            {/* Overlay gems indicators */}
                            {pack.diamonds > 500 && (
                              <svg className="w-5 h-5 absolute -bottom-1 -right-2 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L3.5 10H20.5L12 2ZM3 12L12 22L21 12H3Z"/>
                              </svg>
                            )}
                          </div>
                        ) : (
                          // Membership Gold Card Icon
                          <div className={`relative transition-transform duration-500 ${isSelected ? 'scale-110' : ''}`}>
                            <div className="w-14 h-10 bg-gradient-to-tr from-amber-400 to-[#ff9d00] rounded-lg shadow-lg flex items-center justify-end px-2 border border-white/20 transform -rotate-6">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                            <div className="w-14 h-10 bg-gradient-to-tr from-orange-600 to-[#ff9d00] rounded-lg shadow-lg absolute inset-0 opacity-80 transform translate-x-1.5 translate-y-1.5 -z-10 rounded-lg"></div>
                          </div>
                        )}
                      </div>

                      {/* Package details text */}
                      <div className="mt-2 text-center w-full">
                        <span className="font-extrabold text-sm md:text-base text-white block truncate">{pack.name}</span>
                        {pack.bonus && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                            {pack.bonus}
                          </span>
                        )}
                        
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-white/40 text-xs line-through">৳{pack.originalPrice}</span>
                          <span className="text-[#ff9d00] font-black text-lg">৳{pack.price}</span>
                        </div>
                      </div>

                      {/* Visual buy state check button */}
                      <div className="w-full mt-3.5">
                        <span className={`w-full py-1.5 rounded-lg text-xs font-bold block transition-all ${
                          isSelected 
                            ? 'ff-gradient text-white shadow-md shadow-orange-500/10' 
                            : 'bg-white/5 text-white/80 group-hover:bg-white/10'
                        }`}>
                          {isSelected ? '✓ সিলেক্ট করা হয়েছে' : 'সিলেক্ট করুন'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Trust Section: Customers Reviews, Auto Accordion FAQ, Live Statistics Status bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Guarantee Grid Details */}
            <div className="glass p-5 rounded-2xl flex flex-col gap-4 border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
                <ShieldCheck className="w-5 h-5 text-[#ff9d00]" />
                <span>আমাদের বিশেষত্ব কী? (Why Us?)</span>
              </h3>
              <div className="flex flex-col gap-3.5 mt-0.5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff9d00] font-extrabold shrink-0">১</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-white">সুপার ফাস্ট অটো ডেলিভারি</h5>
                    <p className="text-[11px] text-white/50 mt-0.5">সবচেয়ে আধুনিক গেটওয়ে মাধ্যমে অর্ডারের সাথে সাথেই ডেলিভারি সম্পন্ন হয়।</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff9d00] font-extrabold shrink-0">২</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-white">১০০% শতভাগ আইডি সিকিউর</h5>
                    <p className="text-[11px] text-white/50 mt-0.5">অফিসিয়াল পেমেন্ট মেথড প্রোমোট করি তাই কোনো আইডি ব্যান হওয়ার রিস্ক নেই।</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff9d00] font-extrabold shrink-0">৩</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-white">২৪/৭ কাস্টমার সাপোর্ট কেয়ার</h5>
                    <p className="text-[11px] text-white/50 mt-0.5">কোনো রকম পেমেন্টজনিত ঝামেলায় তাৎক্ষণিক সরাসরি হোয়াটসঅ্যাপ সাহায্য পাবেন।</p>
                  </div>
                </div>
              </div>

              {/* Delivery Speed Indicator gauge */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between mt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/40 block">Live Delivery Speed</span>
                  <span className="text-xs font-black text-emerald-400">⚡ instant Auto dispatch active</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#ff9d00] bg-orange-500/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~1.8 min avg</span>
                </div>
              </div>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="glass p-5 rounded-2xl flex flex-col gap-4 border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
                <HelpCircle className="w-5 h-5 text-[#ff9d00]" />
                <span>সাধারণ জিজ্ঞাসা (FAQ)</span>
              </h3>
              <div className="flex flex-col gap-2.5 mt-0.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = faqOpenIndex === idx;
                  return (
                    <div key={idx} className="bg-black/20 rounded-xl border border-white/5 overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 flex justify-between items-center text-left text-xs font-bold text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-orange-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-0.5 text-[11px] text-white/60 leading-relaxed border-t border-white/5 bg-black/10">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. Review Slider with Add New verified Testmonial Form */}
          <div ref={reviewsRef} className="glass p-6 rounded-2xl border-white/5 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#ff9d00] fill-[#ff9d00]" />
                  <span>কাস্টমার রিভিউ এবং ফিডব্যাক</span>
                </h3>
                <p className="text-white/60 text-xs mt-0.5">বাংলাদেশি গেমারদের রিয়েল-টাইম টপ-আপ অভিজ্ঞতা</p>
              </div>

              {/* Verified Count badge */}
              <div className="flex items-center gap-1 text-xs text-white/80 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span className="font-extrabold text-white">4.9/5.0</span>
                <span className="text-white/40">({allReviews.length}+ reviews)</span>
              </div>
            </div>

            {/* Simulated swipeable/slide element for verified ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allReviews.slice(0, 4).map((r, idx) => (
                <div key={idx} className="bg-black/25 p-4 rounded-xl border border-white/5 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{r.name}</span>
                        {r.isVerified && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40">{r.time}</span>
                    </div>

                    {/* Verified Stars */}
                    <div className="flex mt-1.5 gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-[#ff9d00] fill-[#ff9d00]" />
                      ))}
                    </div>

                    <p className="text-[11px] text-white/70 italic mt-2.5 line-clamp-2">
                      “{r.comment}”
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 mt-3 pt-2">
                    <span className="text-[9px] text-[#ff9d00] font-bold">Purchased: {r.item}</span>
                    <button className="text-white/20 hover:text-[#ff9d00] transition-colors flex items-center gap-1 text-[10px]">
                      <ThumbsUp className="w-3 h-3" /> Help?
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick interactive Form wrapper to Add user Review */}
            <form onSubmit={handleAddReview} className="bg-white/5 p-4 rounded-xl border border-white/5 mt-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">আপনিও একটি সৎ মূল্যায়ন যোগ করুন (Join Reviews)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input 
                    type="text" 
                    placeholder="আপনার নাম..."
                    value={reviewInputName}
                    onChange={(e) => setReviewInputName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 mt-1 focus:outline-none focus:border-[#ff9d00] text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-4">
                  <div className="flex items-center gap-2 mt-2 font-semibold text-xs">
                    <span className="text-white/60">রেটিং:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button 
                          key={st}
                          type="button" 
                          onClick={() => setReviewInputRating(st)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${st <= reviewInputRating ? 'text-[#ff9d00] fill-[#ff9d00]' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-12 flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="আপনার টপ-আপ এক্সপেরিয়েন্স সম্পর্কে লিখুন..."
                    value={reviewInputComment}
                    onChange={(e) => setReviewInputComment(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 focus:outline-none focus:border-[#ff9d00] text-xs text-white"
                  />
                  <button type="submit" className="ff-gradient text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Submit
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky checkout configuration space (Col-span 4) */}
        <div ref={orderRef} id="order-form-container" className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main Topup Order form card setup */}
          <div className="glass p-5 md:p-6 rounded-2xl flex flex-col gap-5 border border-white/10 sticky top-24 shadow-2xl relative">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-black text-sm md:text-base uppercase tracking-wider text-white flex items-center justify-between">
                <span>অর্ডার ফর্ম (Order Panel)</span>
                <span className="text-emerald-400 text-xs py-0.5 px-2 bg-emerald-500/15 rounded-full font-bold">Secure SSL 🔒</span>
              </h3>
              <p className="text-white/50 text-xs mt-1">প্লেয়ার আইডি এবং পেমেন্ট ডিটেইলস সঠিক পূরণ করুন।</p>
            </div>

            <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
              
              {/* Output current selection helper banner */}
              <div className="bg-black/30 border border-orange-500/20 p-3 rounded-xl flex items-center justify-between gap-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center font-bold text-lg text-orange-400 shrink-0">
                    💎
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-black text-[#ff9d00] block tracking-wider">সিলেক্টেড প্যাক</span>
                    <h5 className="text-xs font-extrabold text-white truncate">{selectedPack.name}</h5>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/40 block line-through">৳{selectedPack.originalPrice}</span>
                  <span className="text-sm font-black text-[#ff9d00]">৳{selectedPack.price}</span>
                </div>
              </div>

              {/* Player UID Input */}
              <div>
                <label className="text-[11px] uppercase font-bold text-white/60 ml-0.5 flex justify-between">
                  <span>Player UID (প্লেয়ার আইডি)*</span>
                  {selectedPack.type === 'diamond' && (
                    <span className="text-[#ff9d00] text-[10px]">ID Code: 8 - 12 Characters</span>
                  )}
                </label>
                <div className="relative mt-1">
                  <input 
                    type="number" 
                    placeholder="Ex: 27810294" 
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className={`w-full bg-black/40 border ${errorFields.uid ? 'border-rose-500 bg-rose-500/5 animate-shake' : 'border-white/10'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff9d00] text-sm text-white placeholder-white/35 font-mono`}
                  />
                  {uid ? (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Valid Structure
                    </span>
                  ) : null}
                </div>
                {errorFields.uid && (
                  <span className="text-rose-400 text-[10px] font-bold mt-1 block">✕ {errorFields.uid}</span>
                )}
              </div>

              {/* Player Name Input */}
              <div>
                <label className="text-[11px] uppercase font-bold text-white/60 ml-0.5">
                  Player Nickname (ইন-গেম নাম)*
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: OP Siam" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className={`w-full bg-black/40 border ${errorFields.name ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'} rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff9d00] text-sm text-white placeholder-white/35 mt-1`}
                />
                {errorFields.name && (
                  <span className="text-rose-400 text-[10px] font-bold mt-1 block">✕ {errorFields.name}</span>
                )}
              </div>

              {/* Payment Select Interface tabs */}
              <div>
                <label className="text-[11px] uppercase font-bold text-white/60 ml-0.5 block">
                  পেমেন্ট পদ্ধতি সিলেক্ট করুন (Payment Methods)
                </label>
                <div className="grid grid-cols-3 gap-2.5 mt-1.5 h-16">
                  {/* bKash card logic */}
                  <div 
                    onClick={() => setPaymentMethod('bkash')}
                    className={`glass rounded-xl flex flex-col items-center justify-center p-2.5 border transition-all cursor-pointer relative ${
                      paymentMethod === 'bkash' 
                        ? 'border-[#ff9d00] bg-[#ff9d00]/10 text-white' 
                        : 'border-white/5 opacity-55 hover:opacity-100 hover:border-white/30 text-white/80'
                    }`}
                  >
                    <div className="w-5 h-5 bg-pink-600 rounded flex items-center justify-center font-bold text-[8px] text-white">bK</div>
                    <span className="text-[10px] font-black mt-1">bKash</span>
                    {paymentMethod === 'bkash' && (
                      <span className="absolute -top-1 -right-1 bg-[#ff9d00] text-black text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black">✓</span>
                    )}
                  </div>

                  {/* Nagad card logic */}
                  <div 
                    onClick={() => setPaymentMethod('nagad')}
                    className={`glass rounded-xl flex flex-col items-center justify-center p-2.5 border transition-all cursor-pointer relative ${
                      paymentMethod === 'nagad' 
                        ? 'border-[#ff9d00] bg-[#ff9d00]/10 text-white' 
                        : 'border-white/5 opacity-55 hover:opacity-100 hover:border-white/30 text-white/80'
                    }`}
                  >
                    <div className="w-5 h-5 bg-orange-600 rounded flex items-center justify-center font-bold text-[8px] text-white">Na</div>
                    <span className="text-[10px] font-black mt-1">Nagad</span>
                    {paymentMethod === 'nagad' && (
                      <span className="absolute -top-1 -right-1 bg-[#ff9d00] text-black text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black">✓</span>
                    )}
                  </div>

                  {/* Rocket card logic */}
                  <div 
                    onClick={() => setPaymentMethod('rocket')}
                    className={`glass rounded-xl flex flex-col items-center justify-center p-2.5 border transition-all cursor-pointer relative ${
                      paymentMethod === 'rocket' 
                        ? 'border-[#ff9d00] bg-[#ff9d00]/10 text-white' 
                        : 'border-white/5 opacity-55 hover:opacity-100 hover:border-white/30 text-white/80'
                    }`}
                  >
                    <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center font-bold text-[8px] text-white">Ro</div>
                    <span className="text-[10px] font-black mt-1">Rocket</span>
                    {paymentMethod === 'rocket' && (
                      <span className="absolute -top-1 -right-1 bg-[#ff9d00] text-black text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black">✓</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive checkout details based on selection */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] uppercase font-black text-white/50 tracking-wider block">পেমেন্ট করার নিয়মাবলি:</span>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${
                      paymentMethod === 'bkash' ? 'bg-pink-500' : paymentMethod === 'nagad' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></span>
                    <span className="text-white capitalize">{paymentMethod} {paymentNumbers[paymentMethod].type} Number</span>
                  </div>
                  <span className="text-[#ff9d00] font-black text-sm">{paymentNumbers[paymentMethod].number}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>সীমা:</span>
                  <span className="font-medium text-white">{paymentNumbers[paymentMethod].limit}</span>
                </div>

                {/* Simulated QR Code visualization */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] text-white/50">নিচের কপি বাটনে ক্লিক করে টাকা সেন্ডমানি বা ক্যাশইন করুন।</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopy(paymentNumbers[paymentMethod].number)}
                    className="bg-[#ff9d00] text-black hover:opacity-90 active:scale-95 px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 shrink-0 shadow transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> কপি করুন
                  </button>
                </div>
              </div>

              {/* Interactive Price Calculation rows */}
              <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-white/50">
                  <span>Product Amount:</span>
                  <span>1x {selectedPack.name}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Transaction charge:</span>
                  <span className="text-emerald-400 font-bold">৳0.00 (Free)</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold border-t border-dashed border-white/10 pt-2.5">
                  <span className="text-white">সর্বমোট মূল্য (Total Payable)</span>
                  <span className="text-xl font-black text-[#ff9d00]">৳{selectedPack.price}</span>
                </div>
              </div>

              {/* Buy Now submitting pulse buttons */}
              <button 
                type="submit" 
                className="w-full ff-gradient py-3.5 rounded-xl font-extrabold text-white text-sm uppercase tracking-wider pulse-orange hover:opacity-95 transform active:scale-95 transition-all mt-1"
              >
                টপআপ অর্ডার করুন ⚡
              </button>
            </form>

            {/* Fake Recent purchases listed below */}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff9d00] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> সাম্প্রতিক টপ-আপ তালিকা
              </span>
              <div className="flex flex-col gap-1.8">
                {recentPurchases.slice(0, 3).map((pur) => (
                  <div key={pur.id} className="flex items-center justify-between text-[11px] bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                      <span className="font-bold text-white max-w-[85px] truncate">{pur.name}</span>
                      <span className="text-white/40">({pur.payment})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#ff9d00]">৳{pur.price}</span>
                      <span className="text-white/40 text-[9px] block">delivered</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* 7. Bottom Navigation Bar for Mobile view (Sticky bottom touch interface) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-darker border-t border-white/10 px-4 py-2.5 flex items-center justify-around text-center shadow-inner">
        <button 
          onClick={() => { setMobileTab('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
          className={`flex flex-col items-center justify-center transition-all ${mobileTab === 'home' ? 'text-[#ff9d00]' : 'text-white/55'}`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Home/Shop</span>
        </button>

        <button 
          onClick={() => { setMobileTab('packages'); scrollToSection(packagesRef); }}
          className={`flex flex-col items-center justify-center transition-all ${mobileTab === 'packages' ? 'text-[#ff9d00]' : 'text-white/55'}`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Products</span>
        </button>

        <button 
          onClick={() => { setMobileTab('order'); scrollToSection(orderRef); }}
          className={`flex flex-col items-center justify-center transition-all ${mobileTab === 'order' ? 'text-[#ff9d00]' : 'text-white/55'}`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Order</span>
        </button>

        <button 
          onClick={() => { setMobileTab('support'); scrollToSection(reviewsRef); }}
          className={`flex flex-col items-center justify-center transition-all ${mobileTab === 'support' ? 'text-[#ff9d00]' : 'text-white/55'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Reviews</span>
        </button>
      </div>

      {/* 8. Success modal popup screen / bottom-sheet */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="glass max-w-md w-full p-6 rounded-2xl border-2 border-[#ff9d00] bg-[#0c0d12] relative overflow-hidden flex flex-col gap-4 text-center">
            
            {/* Visual glow indicator */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff9d00]/10 rounded-full filter blur-[40px] pointer-events-none"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h3 className="text-xl font-extrabold text-white">অর্ডার সফলভাবে সাবমিট হয়েছে!</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              আইডি <span className="font-bold text-white font-mono">#{lastSubmittedId}</span> এর অধীনে আপনার ডায়মন্ড টপআপ রিকোয়েস্ট সফলভাবে সিস্টেমে যুক্ত করা হয়েছে।
            </p>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-left flex flex-col gap-2.5 text-xs text-white/85">
              <div className="flex justify-between">
                <span className="text-white/40">플레이어 Nickname:</span>
                <span className="font-bold text-white">{playerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">플레이어 UID:</span>
                <span className="font-bold text-white font-mono">{uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">প্যাকেজ:</span>
                <span className="font-semibold text-[#ff9d00]">{selectedPack.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">পেমেন্ট মেথড:</span>
                <span className="font-bold capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-white font-bold">পরিশোধিত টাকা:</span>
                <span className="font-black text-[#ff9d00] text-sm">৳{selectedPack.price}</span>
              </div>
            </div>

            {/* Crucial Instructions Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-left">
              <span className="text-amber-400 font-extrabold block text-[11px]">⚠️ গুরুত্বপূর্ণ করণীয়:</span>
              <p className="text-[10px] text-white/75 mt-1 leading-relaxed">
                অর্ডারটি দ্রুততম সময়ে ১-৩ মিনিটে একটিভ করতে আমাদের অফিসিয়াল কাস্টমার কেয়ারে হোয়াটসঅ্যাপে মেসেজ করুন।
              </p>
            </div>

            {/* Trigger buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
              <button 
                onClick={initiateWhatsAppDeliveryMessage}
                className="flex-1 ff-gradient py-3 rounded-xl font-black text-white text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10"
              >
                <MessageSquare className="w-4 h-4 fill-white" /> হোয়াটসঅ্যাপ করুন 💬
              </button>
              <button 
                onClick={() => {
                  setShowSuccessPopup(false); 
                  setUid('');
                  setPlayerName('');
                  triggerToast('⭐ Ready for new order!');
                }}
                className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all"
              >
                নতুন অর্ডার
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 9. Footer layout */}
      <footer className="glass border-t border-white/5 px-4 md:px-8 py-8 mt-12 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 ff-gradient rounded-md flex items-center justify-center font-black text-white italic text-base">FF</div>
              <span className="text-base font-extrabold text-white">ABR-<span className="text-[#ff9d00]">SHOP</span></span>
            </div>
            <p className="text-[11px] text-white/40 mt-1 max-w-sm">
              © 2026 ABR-SHOP Bangladesh. All Rights Reserved. This site is not affiliated with Garena or Free Fire trademarks.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-bold uppercase tracking-wider text-white/50">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#ff9d00] transition-colors">Home</button>
            <button onClick={() => scrollToSection(packagesRef)} className="hover:text-[#ff9d00] transition-colors">Packages</button>
            <button onClick={() => scrollToSection(reviewsRef)} className="hover:text-[#ff9d00] transition-colors">Verified Feedbacks</button>
            <a href="https://wa.me/8801799223344" target="_blank" rel="noreferrer" className="hover:text-[#ff9d00] transition-colors">Developer info</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0a0b10] bg-gray-700 font-bold text-[8px] flex items-center justify-center">S</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0a0b10] bg-gray-600 font-bold text-[8px] flex items-center justify-center">R</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0a0b10] bg-gray-500 text-[10px] flex items-center justify-center font-bold">10k</div>
            </div>
            <p className="text-[11px] font-bold text-white/60">Trusted by 10,000+ BD Players</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
