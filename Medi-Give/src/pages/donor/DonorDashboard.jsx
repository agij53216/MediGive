import { useState } from 'react';
import Scanner from '../../components/Scanner';
import DonationForm from '../../components/DonationForm';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Plus, Home, Check } from 'lucide-react';
import Guidelines from '../../components/Guidelines';

export default function DonorDashboard() {
    const { currentUser, logout } = useAuth();
    const [view, setView] = useState('scan');
    const [scanData, setScanData] = useState(null);
    const [scanFile, setScanFile] = useState(null);
    const [showGuidelines, setShowGuidelines] = useState(false);

    const handleScanComplete = (data, file) => {
        setScanData(data);
        setScanFile(file);
        setView('form');
    };

    const handleSuccess = () => {
        setView('success');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {showGuidelines && (
                <Guidelines
                    onClose={() => setShowGuidelines(false)}
                    onStart={() => {
                        setShowGuidelines(false);
                        setTimeout(() => {
                            const fileInput = document.getElementById('donor-scan-input');
                            if (fileInput) {
                                fileInput.click();
                            } else {
                                console.error("Scanner input not found");
                                alert("Camera initialization failed. Please try clicking 'Scan Medicine Now' again.");
                            }
                        }, 100);
                    }}
                />
            )}

            {/* Header */}
            <header className="bg-slate-900/50 border-b border-white/5 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <Plus className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Medi-Give</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <a href="/" className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                        <Home className="w-4 h-4" /> Home
                    </a>
                    <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-medium border border-white/5 hover:border-white/10 transition-colors">
                        Donor Portal
                    </button>
                    <button onClick={logout} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-5xl mx-auto">
                {view === 'scan' && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Discover Verified NGOs</h2>
                            <p className="text-slate-400">Browse clinics in need and donate directly to fulfill their wishlist.</p>
                        </div>

                        {/* Banner / CTA */}
                        <div className="relative bg-gradient-to-r from-teal-900/40 to-slate-900 border border-teal-500/20 rounded-3xl p-8 overflow-hidden">
                            <div className="relative z-10 max-w-xl">
                                <h3 className="text-2xl font-bold text-white mb-4">Start a New Donation</h3>
                                <p className="text-teal-100/70 mb-8 leading-relaxed">
                                    Use our AI-powered scanner to instantly list your medicine.
                                    We verify the composition and expiry date for you.
                                </p>
                                <button
                                    onClick={() => setShowGuidelines(true)}
                                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-lg shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02]"
                                >
                                    Scan Medicine Now
                                </button>
                            </div>

                            {/* Scanner Hidden Input (Triggered by Guidelines or Button) */}
                            <div className="hidden">
                                <Scanner onScanComplete={handleScanComplete} inputId="donor-scan-input" />
                            </div>

                            {/* Abstract Decorative Elements */}
                            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute right-20 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>
                        </div>

                        {/* Recent History / Active Wishlists Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-teal-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-lg text-white">
                                                St. Mary Community Clinic
                                                <span className="text-blue-500">✓</span>
                                            </h4>
                                            <p className="text-sm text-slate-400">Downtown District</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact Score</p>
                                        <p className="text-2xl font-bold text-teal-400">98</p>
                                    </div>
                                </div>
                                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white">Metformin</span>
                                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20">CRITICAL</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 w-[30%] h-full rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">3 of 10 units fulfilled</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-teal-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-lg text-white">
                                                Hope Wellness Foundation
                                                <span className="text-blue-500">✓</span>
                                            </h4>
                                            <p className="text-sm text-slate-400">East Side</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact Score</p>
                                        <p className="text-2xl font-bold text-green-400">85</p>
                                    </div>
                                </div>
                                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white">Paracetamol</span>
                                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">STANDARD</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 w-[60%] h-full rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">12 of 20 units fulfilled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <DonationForm
                        data={scanData}
                        imageFile={scanFile}
                        onCancel={() => setView('scan')}
                        onSuccess={handleSuccess}
                    />
                )}

                {view === 'success' && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">Your donation has been listed. An NGO will review it shortly.</p>
                        <button
                            onClick={() => setView('scan')}
                            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all"
                        >
                            Donate Another
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
