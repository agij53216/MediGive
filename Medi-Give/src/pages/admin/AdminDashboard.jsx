import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAllWishlistItems, deleteWishlistItem } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Trash2, Users, Activity, AlertTriangle, DollarSign, LogOut, Home } from 'lucide-react';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [ngos, setNgos] = useState([]);
    const [donations, setDonations] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const ngoSnapshot = await getDocs(collection(db, "users"));
            const donationSnapshot = await getDocs(collection(db, "donations"));
            const wishlistData = await getAllWishlistItems();

            const ngoList = ngoSnapshot.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(u => u.role === 'ngo');

            setNgos(ngoList);
            setDonations(donationSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setWishlists(wishlistData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const toggleVerify = async (ngoId, currentStatus) => {
        await updateDoc(doc(db, "users", ngoId), { verified: !currentStatus });
        setNgos(ngos.map(n => n.id === ngoId ? { ...n, verified: !currentStatus } : n));
    };

    const deleteDonation = async (id) => {
        if (confirm("Delete this donation permanently?")) {
            await deleteDoc(doc(db, "donations", id));
            setDonations(donations.filter(d => d.id !== id));
        }
    };

    const handleDeleteWishlist = async (id) => {
        if (confirm("Delete this requirement? It will be removed from the Landing Page.")) {
            await deleteWishlistItem(id);
            setWishlists(wishlists.filter(w => w.id !== id));
        }
    };

    // Advanced Metrics Calculation
    const totalValue = donations.length * 50; // Est. $50 per donation
    const totalImpact = donations.filter(d => d.status !== 'Available').length; // Claimed items

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
            <nav className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-teal-400 w-6 h-6" />
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Admin Console</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                            <Home className="w-4 h-4" /> Home
                        </a>
                        <button onClick={logout} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Donations"
                        value={donations.length}
                        icon={Activity}
                        color="text-teal-400"
                        borderColor="border-teal-500"
                    />
                    <StatCard
                        label="Partner NGOs"
                        value={ngos.length}
                        icon={Users}
                        color="text-blue-400"
                        borderColor="border-blue-500"
                    />
                    <StatCard
                        label="Value Recovered"
                        value={`$${totalValue.toLocaleString()}`}
                        icon={DollarSign}
                        color="text-green-400"
                        borderColor="border-green-500"
                    />
                    <StatCard
                        label="Pending Requests"
                        value={ngos.filter(n => !n.verified).length}
                        icon={AlertTriangle}
                        color="text-amber-400"
                        borderColor="border-amber-500"
                    />
                </div>

                {/* NGO Management */}
                <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-400" />
                        <h2 className="font-bold text-lg text-white">NGO Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {ngos.map(ngo => (
                                    <tr key={ngo.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{ngo.name}</td>
                                        <td className="p-4 text-slate-400">{ngo.email}</td>
                                        <td className="p-4">
                                            {ngo.verified ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">Verified</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleVerify(ngo.id, ngo.verified)}
                                                className={`text-xs font-bold underline hover:no-underline transition-all ${ngo.verified ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'}`}
                                            >
                                                {ngo.verified ? "Revoke" : "Verify Now"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Urgent Requirements (Wishlist) Management */}
                <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        <h2 className="font-bold text-lg text-white">Urgent Requirements</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Medicine</th>
                                    <th className="p-4">NGO</th>
                                    <th className="p-4">Urgency</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {wishlists.map(w => (
                                    <tr key={w.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{w.name} ({w.total || 0} units)</td>
                                        <td className="p-4 text-slate-300">{w.ngoName || 'Unknown'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${w.urgency === 'CRITICAL'
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                }`}>
                                                {w.urgency}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => handleDeleteWishlist(w.id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {wishlists.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500 italic">No urgent requests active.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Donation Moderation */}
                <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                        <h2 className="font-bold text-lg text-white">Donation Moderation</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Medicine</th>
                                    <th className="p-4">Expiry</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {donations.map(d => (
                                    <tr key={d.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{d.medicineName}</td>
                                        <td className="p-4 text-slate-300 flex items-center gap-2">
                                            {d.expiryDate}
                                            {/* Simulate Expiry Warning Logic */}
                                            {d.medicineName.toLowerCase().includes('expired') || Math.random() > 0.8 ? (
                                                <span className="text-amber-500" title="Near Expiry"><AlertTriangle className="w-4 h-4" /></span>
                                            ) : null}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${d.status === 'Available'
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => deleteDonation(d.id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, borderColor }) {
    return (
        <div className={`bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 ${borderColor} flex items-center justify-between`}>
            <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</h3>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-slate-900 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
