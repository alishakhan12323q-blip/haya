import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 150]);

    // High Fashion Asymmetrical Grid Layout Data
    const collections = [
        {
            id: 'faiza',
            title: 'ফাইজা বোরকা',
            subtitle: 'LIMITED EDITION',
            description: 'প্রিমিয়াম দুবাই চেরি কাপড়ের গর্জিয়াস স্টোনের ডিজাইন করা এক্সক্লুসিভ বোরকা।',
            image: '/faiza_black.jpg',
            price: '৮৯০ ৳',
            path: '/faiza',
            span: 'col-span-1 md:col-span-2 row-span-2 h-[600px] md:h-[800px]',
            theme: 'dark'
        },
        {
            id: 'haya',
            title: 'হায়া সিরিজ',
            subtitle: 'ESSENTIALS',
            description: 'এলিগ্যান্ট ডিজাইন ও প্রিমিয়াম ফেব্রিক। শুধুমাত্র বোরকা অথবা হিজাবসহ সেট।',
            image: '/hero_black.jpg',
            price: '১৩৫০ ৳',
            path: '/haya',
            span: 'col-span-1 md:col-span-1 row-span-1 h-[400px]',
            theme: 'light'
        },
        {
            id: 'classic',
            title: 'মা-মেয়ে কম্বো',
            subtitle: 'MATCHING SET',
            description: 'মা ও মেয়ের ম্যাচিং স্পেশাল কম্বো সেট। আমাদের সবচেয়ে জনপ্রিয় কালেকশন।',
            image: '/classic_combo_main.jpg',
            price: '১৬৮০ ৳',
            path: '/classic',
            span: 'col-span-1 md:col-span-1 row-span-1 h-[400px]',
            theme: 'dark'
        },
        {
            id: 'ma',
            title: 'মা কালেকশন',
            subtitle: 'PREMIUM COMFORT',
            description: 'মায়েদের জন্য প্রিমিয়াম আরামদায়ক বোরকা।',
            image: '/ma_cherry_black.png',
            price: '১১৯০ ৳',
            path: '/ma',
            span: 'col-span-1 md:col-span-1 row-span-1 h-[500px]',
            theme: 'light'
        },
        {
            id: 'kids',
            title: 'কিডস কালেকশন',
            subtitle: 'FOR THE LITTLE ONES',
            description: 'ছোটদের স্পেশাল বোরকা ও স্টাইলিশ হিজাব সেট। প্রিমিয়াম চেরি ফ্যাব্রিক।',
            image: '/kids_hero.jpg', 
            price: '৬৯০ ৳',
            path: '/kids',
            span: 'col-span-1 md:col-span-1 row-span-1 h-[500px]',
            theme: 'dark'
        },
        {
            id: 'hijab',
            title: 'হিজাব কালেকশন',
            subtitle: 'EXCLUSIVE HIJAB',
            description: '৪৬/৭২/৮০ ইঞ্চি সাইজের প্রিমিয়াম হিজাব কালেকশন।',
            image: '/hero_maroon.jpg', 
            price: '২৫০ ৳',
            path: '/hijab',
            span: 'col-span-1 md:col-span-1 row-span-1 h-[500px]',
            theme: 'light'
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden selection:bg-black selection:text-white">
            
            {/* Minimalist Top Navigation / Header */}
            <header className="w-full py-8 md:py-12 px-6 md:px-12 flex flex-col items-center justify-center border-b border-black/10 relative bg-white z-50">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    {/* LOGO: Requires logo-dark.png in public folder */}
                    <img 
                        src="/logo-dark.png" 
                        alt="NRzone Women's Clothing" 
                        className="h-20 md:h-32 object-contain mb-4"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                            document.getElementById('fallback-logo').style.display = 'block';
                        }}
                    />
                    <h1 id="fallback-logo" className="hidden text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-black">
                        NRZOONE
                    </h1>
                    <div className="flex items-center gap-6 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                        <span>Modest</span>
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        <span>Elegant</span>
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        <span>Premium</span>
                    </div>
                </motion.div>
            </header>

            {/* Aesthetic Grid Showcase */}
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 auto-rows-min">
                    
                    {collections.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            onClick={() => navigate(item.path)}
                            className={`group relative overflow-hidden cursor-pointer bg-slate-100 ${item.span}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out transform group-hover:scale-105"
                            />
                            
                            {/* Overlay dynamically changing based on light/dark theme preference for the image cell */}
                            <div className={`absolute inset-0 flex flex-col justify-end p-8 md:p-12 transition-all duration-700
                                ${item.theme === 'dark' 
                                    ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white' 
                                    : 'bg-gradient-to-t from-white/95 via-white/50 to-transparent text-black opacity-0 group-hover:opacity-100'
                                }
                            `}>
                                <motion.div 
                                    className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500"
                                >
                                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${item.theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                                        {item.subtitle}
                                    </p>
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 leading-none">
                                        {item.title}
                                    </h2>
                                    <p className={`text-sm md:text-base font-semibold max-w-md hidden md:block mb-8 ${item.theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
                                        {item.description}
                                    </p>
                                    
                                    <div className={`inline-flex items-center gap-6 border-b-2 pb-2 ${item.theme === 'dark' ? 'border-white' : 'border-black'}`}>
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] uppercase tracking-widest font-black ${item.theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>Starting At</span>
                                            <span className="text-2xl font-black">{item.price}</span>
                                        </div>
                                        <ArrowRight className="w-8 h-8 transform group-hover:translate-x-4 transition-transform duration-500" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>

            {/* Newsletter / Minimal CTA Section */}
            <section className="bg-black text-white py-24 px-6 md:px-12 mt-12 md:mt-24 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Footer Logo: Requires logo-light.png in public folder */}
                    <img 
                        src="/logo-light.png" 
                        alt="NRzone Logo" 
                        className="h-16 md:h-20 mx-auto object-contain mb-8 filter brightness-0 invert"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <Compass className="mx-auto w-12 h-12 text-white/20 mb-6 group-hover:rotate-180 transition-all duration-1000" />
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Elegance in Every Thread</h2>
                    <p className="text-white/60 text-lg md:text-xl font-medium tracking-wide">
                        Explore our latest collections carefully crafted for the modern, modest woman. 
                    </p>
                    <button onClick={() => navigate('/haya')} className="mt-10 px-12 py-5 bg-white text-black text-sm uppercase tracking-[0.2em] font-black hover:bg-slate-200 transition-colors">
                        Shop All Collections
                    </button>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="bg-white text-black py-12 px-12 flex flex-col md:flex-row justify-between items-center text-xs font-black uppercase tracking-[0.2em]">
                <p>© 2026 NRZOONE</p>
                <div className="flex gap-8 mt-6 md:mt-0">
                    <a href="#" className="hover:text-slate-500 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-slate-500 transition-colors">Instagram</a>
                    <a href="/admin" className="hover:text-slate-500 transition-colors">Admin</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
