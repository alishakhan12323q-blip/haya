import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import {
    LayoutDashboard,
    ShoppingBag,
    PlusCircle,
    Search,
    Phone,
    MapPin,
    XCircle,
    Menu,
    X,
    Printer,
    ChevronLeft,
    Settings,
    LogOut,
    FileText,
    ExternalLink
} from 'lucide-react';
import { GOOGLE_SHEET_URL, GOOGLE_SHEET_VIEW_URL } from './config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('adminLoggedIn') === 'true');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username === 'admin' && password === 'nrzone2024') {
            setIsLoggedIn(true);
            localStorage.setItem('adminLoggedIn', 'true');
            setLoginError('');
        } else {
            setLoginError('ভুল ইউজারনেম বা পাসওয়ার্ড!');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('adminLoggedIn');
    };

    // Firebase Real-time Listener
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersArray = [];
            querySnapshot.forEach((doc) => {
                ordersArray.push({ ...doc.data(), firebaseId: doc.id });
            });
            setOrders(ordersArray);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (firebaseId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", firebaseId);
            await updateDoc(orderRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const deleteOrder = async (firebaseId) => {
        if (confirm('আপনি কি এই অর্ডারটি ডিলিট করতে চান?')) {
            try {
                await deleteDoc(doc(db, "orders", firebaseId));
            } catch (error) {
                console.error("Error deleting order: ", error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBangla = (status) => {
        switch (status) {
            case 'pending': return 'নতুন অর্ডার';
            case 'confirmed': return 'কনফার্মড';
            case 'shipped': return 'কুরিয়ারে আছে';
            case 'delivered': return 'ডেলিভারড';
            case 'cancelled': return 'বাতিল';
            default: return status;
        }
    };

    const DashboardView = () => {
        const totalSales = orders.filter(o => o.status === 'delivered').reduce((acc, curr) => acc + curr.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const totalOrders = orders.length;

        return (
            <div className="space-y-6 animate-fade-in font-bengali">
                <h2 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড ওভারভিউ</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium tracking-wide">মোট বিক্রি (Delivered)</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">৳ {totalSales}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-2xl text-green-600">
                                <ShoppingBag size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium tracking-wide">নতুন অর্ডার (Pending)</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingOrders}</p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
                                <LayoutDashboard size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium tracking-wide">সর্বমোট অর্ডার</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{totalOrders}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                                <Settings size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">সাম্প্রতিক অর্ডার</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-blue-600 hover:text-blue-700">সব দেখুন</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-bold">
                                <tr>
                                    <th className="p-4">অর্ডার ID</th>
                                    <th className="p-4">কাস্টমার</th>
                                    <th className="p-4">টোটাল</th>
                                    <th className="p-4 text-center">স্ট্যাটাস</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 font-bold text-blue-600">#{order.id}</td>
                                        <td className="p-4 font-medium">{order.name}</td>
                                        <td className="p-4 font-bold">৳ {order.total}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase`}>
                                                {getStatusBangla(order.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-gray-400 font-medium">কোন অর্ডার নেই</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const OrderListView = () => {
        const filteredOrders = orders.filter(order =>
            order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone?.includes(searchTerm) ||
            order.id?.toString().includes(searchTerm)
        );

        return (
            <div className="space-y-6 font-bengali">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">সকল অর্ডার তালিকা</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                            className="pl-12 pr-6 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-80 shadow-sm transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="p-5">ID & Date</th>
                                    <th className="p-5">কাস্টমার তথ্য</th>
                                    <th className="p-5">অর্ডার ডিটেইলস</th>
                                    <th className="p-5">পেমেন্ট</th>
                                    <th className="p-5">স্ট্যাটাস</th>
                                    <th className="p-5 text-center">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 tracking-normal">
                                {filteredOrders.map((order) => (
                                    <tr key={order.firebaseId} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-5 align-top">
                                            <div className="font-bold text-blue-600">#{order.firebaseId?.slice(-5).toUpperCase() || 'NEW'}</div>
                                            <div className="text-[11px] text-gray-400 mt-1">{order.date}</div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="font-bold text-gray-900">{order.name}</div>
                                            <div className="flex items-center text-gray-500 mt-2 text-xs">
                                                <Phone size={12} className="mr-2 text-gray-300" /> {order.phone}
                                            </div>
                                            <div className="flex items-center text-gray-500 mt-1 text-xs">
                                                <MapPin size={12} className="mr-2 text-gray-300" /> {order.address}
                                            </div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="text-gray-800 font-medium">
                                                {order.productType === 'combo' && 'মা-মেয়ে কম্বো সেট'}
                                                {order.productType === 'ma_single' && 'সিঙ্গেল বোরকা (মা)'}
                                                {order.productType === 'baby_single' && 'সিঙ্গেল বোরকা (বাচ্চা)'}
                                                {order.productType === 'hijab' && 'শুধু হিজাব'}
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-2 flex gap-2">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md">রঙ: {order.color}</span>
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">সাইজ: {order.size}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="font-bold text-gray-900">৳ {order.total}</div>
                                            <div className="text-[11px] text-gray-400 mt-1">চার্জ: ৳ {order.deliveryCharge}</div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.firebaseId, e.target.value)}
                                                className={`text-[10px] font-bold p-2 pr-8 rounded-xl border appearance-none cursor-pointer transition-all ${getStatusColor(order.status)} focus:ring-2 focus:ring-offset-1 focus:outline-none`}
                                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                                            >
                                                <option value="pending">নতুন অর্ডার</option>
                                                <option value="confirmed">কনফার্মড</option>
                                                <option value="shipped">কুরিয়ারে আছে</option>
                                                <option value="delivered">ডেলিভারড</option>
                                                <option value="cancelled">বাতিল</option>
                                            </select>
                                        </td>
                                        <td className="p-5 align-top text-center">
                                            <div className="flex justify-center gap-3">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="ইনভয়েস">
                                                    <Printer size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order.firebaseId)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="মুছুন"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="p-16 text-center text-gray-400 font-medium">কোন অর্ডার পাওয়া যায়নি</div>
                    )}
                </div>
            </div>
        );
    };

    const AddOrderView = () => {
        const [formData, setFormData] = useState({
            name: '',
            phone: '',
            address: '',
            productType: 'combo',
            color: 'কালো',
            price: 1680,
            deliveryArea: 'inside'
        });

        const products = {
            combo: { label: 'মা-মেয়ে কম্বো সেট (১৬৮০ ৳)', price: 1680 },
            ma_single: { label: 'সিঙ্গেল বোরকা - মা', price: 1150 },
            baby_single: { label: 'সিঙ্গেল বোরকা - বাচ্চা', price: 850 },
            hijab: { label: 'শুধু হিজাব', price: 250 }
        };

        const handleProductChange = (type) => {
            setFormData({ ...formData, productType: type, price: products[type].price });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const deliveryCharge = formData.deliveryArea === 'inside' ? 80 : 150;
            const newOrder = {
                ...formData,
                deliveryCharge,
                total: parseInt(formData.price) + deliveryCharge,
                status: 'pending',
                date: new Date().toLocaleDateString('en-GB'),
                createdAt: serverTimestamp()
            };

            try {
                // 1. Submit to Google Sheets (Non-blocking)
                if (GOOGLE_SHEET_URL) {
                    fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newOrder)
                    }).catch(err => console.error("Sheets Sync Error:", err));
                }

                // 2. Submit to Firebase with a 4-second timeout
                const firestorePromise = addDoc(collection(db, "orders"), newOrder);
                const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 4000, 'timeout'));

                const result = await Promise.race([firestorePromise, timeoutPromise]);

                if (result === 'timeout') {
                    console.warn("Firestore sync slow, proceeding.");
                }

                alert('অর্ডারটি সফলভাবে ডাটাবেসে যোগ করা হয়েছে! NR ZONE-এ স্বাগতম।');
                setFormData({
                    name: '',
                    phone: '',
                    address: '',
                    productType: 'combo',
                    color: 'কালো',
                    price: products.combo.price,
                    deliveryArea: 'inside'
                });
                setActiveTab('orders');
            } catch (error) {
                console.error("Error adding order: ", error);
                alert('অর্ডার যোগ করতে সমস্যা হয়েছে।');
            }
        };
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <PlusCircle className="text-blue-600" /> নতুন অর্ডার যুক্ত করুন
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">কাস্টমারের নাম</label>
                            <input
                                required
                                type="text"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">মোবাইল নম্বর</label>
                            <input
                                required
                                type="text"
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">সম্পূর্ণ ঠিকানা</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">প্রোডাক্ট টাইপ</label>
                            <select
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all appearance-none"
                                value={formData.productType}
                                onChange={(e) => handleProductChange(e.target.value)}
                            >
                                {Object.keys(products).map(key => (
                                    <option key={key} value={key}>{products[key].label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">প্রোডাক্টের রঙ</label>
                            <select
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all appearance-none"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            >
                                <option value="কালো">কালো</option>
                                <option value="নীল">নীল</option>
                                <option value="অলিভ">অলিভ</option>
                                <option value="কফি">কফি</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">প্রোডাক্টের দাম (৳)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 focus:outline-none"
                                value={formData.price}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">ডেলিভারি এরিয়া</label>
                            <select
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all appearance-none"
                                value={formData.deliveryArea}
                                onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                            >
                                <option value="inside">ঢাকার ভিতরে (৮০ ৳)</option>
                                <option value="outside">ঢাকার বাইরে (১৫০ ৳)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-3xl flex justify-between items-center border border-blue-100">
                        <span className="font-bold text-blue-800">মোট বিল (ডেলিভারি চার্জ সহ):</span>
                        <span className="text-3xl font-extrabold text-blue-600">
                            ৳ {parseInt(formData.price) + (formData.deliveryArea === 'inside' ? 80 : 150)}
                        </span>
                    </div>

                    <button type="submit" className="w-full bg-premium-dark text-white font-extrabold py-5 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
                        অর্ডার সেভ করুন
                    </button>
                </form>
            </div >
        );
    };

    const LoginView = () => (
        <div className="min-h-screen bg-premium-dark flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-black tracking-tighter">NR ZONE</h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Admin Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                            placeholder="admin"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    {loginError && <p className="text-red-500 text-xs font-bold text-center italic">{loginError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                    >
                        লগইন করুন
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400">© 2019-2024 NR Zone Dashboard</p>
            </div>
        </div>
    );

    if (!isLoggedIn) return <LoginView />;

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-bengali text-[#1A1A1A] flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white p-5 shadow-sm flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-black rounded-lg text-white">
                        <ShoppingBag size={20} />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-black">NRZONE</h1>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed md:sticky top-0 left-0 h-screen w-72 bg-[#1A1A1A] text-white shadow-2xl z-30 transform transition-transform duration-500 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-xl text-black shadow-lg">
                            <ShoppingBag size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">NRZONE</h1>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mt-2 tracking-[0.2em]">Management System v2.0</p>
                </div>

                <nav className="p-6 space-y-2">
                    <button
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${activeTab === 'dashboard' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>ড্যাশবোর্ড</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${activeTab === 'orders' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ShoppingBag size={20} />
                        <span>অর্ডার তালিকা</span>
                        {orders.filter(o => o.status === 'pending').length > 0 && (
                            <span className="ml-auto bg-[#FF4D6D] text-white text-[10px] px-2 py-1 rounded-lg animate-pulse">
                                {orders.filter(o => o.status === 'pending').length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => { setActiveTab('add-order'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${activeTab === 'add-order' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <PlusCircle size={20} />
                        <span>নতুন অর্ডার</span>
                    </button>

                    <div className="pt-10 mt-10 border-t border-white/10 space-y-2">
                        <a
                            href={GOOGLE_SHEET_VIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-green-400 font-bold hover:bg-green-400/5 transition-all"
                        >
                            <FileText size={20} />
                            <span>গুগল শিট</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 font-bold hover:bg-red-400/5 transition-all"
                        >
                            <LogOut size={20} />
                            <span>লগআউট</span>
                        </button>
                    </div>
                </nav>

                <div className="absolute bottom-8 left-8 right-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Logged in as</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-yellow-200"></div>
                        <p className="text-sm font-bold">Adminstrator</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#F8F9FA] animate-premium-fade">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'orders' && <OrderListView />}
                {activeTab === 'add-order' && <AddOrderView />}
            </main>
        </div>
    );

};

export default AdminDashboard;
