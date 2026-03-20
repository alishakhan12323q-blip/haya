import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const collections = [
        {
            id: 'haya',
            title: 'হায়া সিরিজ',
            description: 'এলিগ্যান্ট ডিজাইন ও প্রিমিয়াম ফেব্রিক। শুধুমাত্র বোরকা অথবা হিজাবসহ সেট।',
            image: '/hero_black.jpg',
            price: '১৩৫০ ৳ থেকে শুরু',
            path: '/haya',
            color: 'bg-black'
        },
        {
            id: 'ma',
            title: 'মা কালেকশন',
            description: 'মায়েদের জন্য প্রিমিয়াম আরামদায়ক বোরকা ও বড় হিজাব সেট। (৮০ ইঞ্চি হিজাব)',
            image: '/ma_black.jpg',
            price: '১১৯০ ৳ থেকে শুরু',
            path: '/ma',
            color: 'bg-black'
        },
        {
            id: 'classic',
            title: 'মা-মেয়ে কম্বো',
            description: 'মা ও মেয়ের ম্যাচিং স্পেশাল কম্বো সেট। আমাদের সবচাইতে জনপ্রিয় কালেকশন।',
            image: '/hero_olive.jpg', // Temporarily using olive for combo if missing
            price: '১৬৮০ ৳ থেকে শুরু',
            path: '/classic',
            color: 'bg-[#556B2F]'
        },
        {
            id: 'kids',
            title: 'ছোটদের কালেকশন',
            description: 'ছোটদের স্পেশাল বোরকা ও স্টাইলিশ হিজাব সেট। প্রিমিয়াম চেরি ফ্যাব্রিক।',
            image: '/kids_hero.jpg', 
            price: '৬৯০ ৳ থেকে শুরু',
            path: '/kids',
            color: 'bg-blue-900'
        },
        {
            id: 'faiza',
            title: 'ফাইজা বোরকা',
            description: 'প্রিমিয়াম দুবাই চেরি কাপড়ের গর্জিয়াস স্টোনের ডিজাইন করা বোরকা ও হিজাব।',
            image: '/faiza_black.jpg',
            price: '৮৯০ ৳ থেকে শুরু',
            path: '/faiza',
            color: 'bg-[#1a1a1a]'
        },
        {
            id: 'borobon',
            title: 'বড়বোন বোরকা',
            description: 'বড়বোনদের জন্য প্রিমিয়াম ডিজাইনের বোরকা ও হিজাব সেট।',
            image: '/borobon_black.jpg',
            price: '৯৯০ ৳ থেকে শুরু',
            path: '/borobon',
            color: 'bg-black'
        },
        {
            id: 'maboromeye',
            title: 'মা ও বড়মেয়ে',
            description: 'মা ও বড় মেয়ের ম্যাচিং স্পেশাল কম্বো সেট।',
            image: '/ma_boro_meye_black.jpg',
            price: '৮৯০ ৳ থেকে শুরু',
            path: '/maboromeye',
            color: 'bg-black'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFC] font-bengali text-[#1A1A1A] flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 md:mb-24"
            >
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <div className="p-3 bg-black rounded-2xl text-white shadow-2xl">
                        <ShoppingBag size={36} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black">NRZONE</h1>
                </motion.div>
                <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 rounded-full"></div>
                <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto italic leading-relaxed">
                    "মডেস্টি মানেই আভিজাত্য। আপনার পছন্দের কালেকশনটি বেছে নিন।"
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl w-full px-4">
                {collections.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.7 }}
                        whileHover={{ y: -8, scale: 1.01 }}
                        onClick={() => navigate(item.path)}
                        className="group relative h-[500px] md:h-[600px] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden cursor-pointer border-[8px] border-white"
                    >
                        <div className="h-full w-full relative">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-14">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">New Arrival</span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">{item.title}</h2>
                                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/20 mt-6">
                                        <div>
                                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Starting from</p>
                                            <p className="text-[#D4AF37] font-black text-3xl">{item.price}</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black group-hover:bg-[#D4AF37] group-hover:rotate-45 transition-all duration-500 shadow-xl">
                                            <ArrowRight size={28} className="group-hover:-rotate-45 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>


            <footer className="mt-12 md:mt-24 text-gray-400 text-sm font-medium">
                © 2026 NRZONE | All Rights Reserved
            </footer>
        </div>
    );
};

export default Home;
