import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight, ShieldCheck, Truck, Clock, Cross, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';

import { getAllUrgentRequests } from '../services/db';

export default function LandingPage() {
    const [urgentItems, setUrgentItems] = useState([]);

    useEffect(() => {
        async function fetchUrgent() {
            const items = await getAllUrgentRequests();
            // If empty, fallback to some sample data so the page isn't blank during demo
            if (items.length > 0) {
                setUrgentItems(items);
            } else {
                setUrgentItems([
                    { name: "Metformin", total: "500mg", urgency: "High Demand", color: "blue", ngoName: "St. Mary's" },
                    { name: "Amoxicillin", total: "250mg", urgency: "Critical", color: "red", ngoName: "City Hospital" },
                    { name: "Insulin", total: "10ml", urgency: "Critical", color: "red", ngoName: "Hope Clinic" },
                    { name: "Paracetamol", total: "650mg", urgency: "Medium", color: "green", ngoName: "Community Health" },
                ]);
            }
        }
        fetchUrgent();
    }, []);
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="absolute top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-800">Medi-Give</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                        <a href="#donations" className="hover:text-teal-600 transition-colors">Donations</a>
                        <a href="#logistics" className="hover:text-teal-600 transition-colors">Logistics</a>
                        <a href="#mission" className="hover:text-teal-600 transition-colors">Our Mission</a>
                        <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/login" className="px-6 py-3 text-sm font-bold bg-slate-100 text-slate-900 rounded-full hover:bg-slate-200 transition-all flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                            Login / Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="logistics" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Reliable Logistics Network</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                            Reliable on-time <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">medicine aid.</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                            Our in-house logistics ensure your surplus medicines reach verified clinics when they need them most. Zero waste, maximum impact.
                        </p>

                        <div className="flex gap-4 mb-12">
                            <Link to="/login" state={{ role: 'donor', mode: 'strict' }} className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold shadow-xl shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-105">
                                <Heart className="w-5 h-5 fill-white" />
                                Donate Medicine Now
                            </Link>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" className="w-full h-full bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">12k+ Donors</p>
                                    <p className="text-xs text-slate-500">Joined this month</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2">
                                <div className="bg-yellow-100 p-1.5 rounded-lg">
                                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">4.9/5</p>
                                    <p className="text-xs text-slate-500">NGO Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-0 hidden lg:block">
                        {/* Circle Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-blue-100 to-teal-50 rounded-full"></div>

                        {/* Main Image (Placeholder for 'Delivery Guy' - using generic happy person or illustration) */}
                        <div className="relative z-10 mx-auto w-96">
                            {/* Floating Card 1: Delivery Time */}
                            <div className="absolute top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-bounce-slow z-20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Pickup Within</p>
                                        <p className="text-lg font-bold text-slate-900">30 Minutes</p>
                                    </div>
                                </div>
                            </div>

                            {/* Character Image Placeholder - CSS Representation of the 'Delivery Man' */}
                            <div className="w-full aspect-[3/4] bg-slate-200 rounded-[3rem] overflow-hidden relative shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1620302061226-444465593858?q=80&w=2622&auto=format&fit=crop"
                                    alt="Volunteer with Box"
                                    className="w-full h-full object-cover"
                                />

                                {/* Box Overlay */}
                                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent pt-32">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-1.5 bg-teal-500 rounded-lg">
                                                <Heart className="w-4 h-4 text-white fill-white" />
                                            </div>
                                            <span className="font-bold text-lg">Medi-Give</span>
                                        </div>
                                        <p className="text-sm text-slate-200">Delivering hope, one package at a time.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 2: Success */}
                            <div className="absolute bottom-20 -left-12 bg-blue-600 p-5 rounded-2xl shadow-xl shadow-blue-600/30 text-white z-20 animate-pulse">
                                <p className="text-3xl font-bold mb-1">100%</p>
                                <p className="text-sm font-medium text-blue-100">Delivery Success</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Urdugent Needs / Popular Products Section */}
            <section id="donations" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Urgent Requirements</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Verified NGOs are currently requesting these specific medicines. Donate now to make an immediate impact.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {urgentItems.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className={`h-48 ${item.urgency === 'CRITICAL' || item.color === 'red' ? 'bg-red-100' : 'bg-blue-100'} rounded-[1.5rem] mb-6 relative overflow-hidden flex items-center justify-center`}>
                                {/* Abstract Pill Shape */}
                                <div className="w-24 h-24 bg-white/50 rounded-full blur-xl absolute"></div>
                                <div className="relative z-10 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl font-bold text-slate-700 shadow-sm">
                                    {item.name}
                                </div>
                                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.total} units needed</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.urgency === 'CRITICAL' || item.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.urgency}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-bold text-slate-900 truncate max-w-[120px]">{item.ngoName}</span>
                                    <span className="text-xs font-bold text-slate-400">NGO Request</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-12 gap-4">
                    <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-teal-500 hover:text-teal-500 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </section>

            {/* Testimonial / App Download Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-50">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div id="mission">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Volunteers & Clinics Love Us</h2>

                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative">
                            <div className="absolute -top-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl">
                                <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                            </div>
                            <p className="text-lg text-slate-600 italic mb-6 leading-relaxed">
                                "Beautiful application with elegant UI Design. I found this website very useful. The donation process is seamless and the tracking is real-time. Recommend this to every clinic."
                            </p>
                            <div className="flex items-center gap-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-12 h-12 rounded-full bg-slate-100" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Dr. Sarah Jenkins</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Community Clinic Head</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden text-white text-center lg:text-left">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Innovating for Impact</h2>
                            <p className="text-slate-400 mb-8 max-w-sm">
                                Built for the 2026 Hackathon. Medi-Give leverages AI and local logistics to solve the medicine waste crisis.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <div className="px-6 py-3 bg-white/10 text-white border border-white/10 rounded-xl font-bold flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live Demo
                                </div>
                                <div className="px-6 py-3 bg-white/5 text-slate-300 border border-white/5 rounded-xl font-bold flex items-center gap-3">
                                    <span className="text-xs font-mono">v1.0.0</span>
                                    Web Platform
                                </div>
                            </div>
                        </div>

                        {/* Abstract Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 opacity-20"></div>
                    </div>
                </div>
            </section>

            {/* Footer / Contact */}
            <footer id="contact" className="bg-white border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white fill-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">Medi-Give</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; 2026 Medi-Give Foundation. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-400">
                        <a href="#" className="hover:text-teal-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-teal-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-teal-600 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
