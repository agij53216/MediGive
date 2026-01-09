import { useEffect, useState } from 'react';
import { getAvailableDonations, requestPickup, getNgoRequests, addWishlistItem, updatePickupStatus, getNgoWishlistItems, updateWishlistItem, deleteWishlistItem } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, Package, LogOut, MapPin, Bell, CheckCircle, Plus, X, AlertCircle, Home, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NGODashboard() {
    const { currentUser, logout } = useAuth();
    const [donations, setDonations] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    // Real Wishlist State
    const [wishlist, setWishlist] = useState([]);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("Fetching data for NGO:", currentUser.uid);
            const [donationData, requestData, wishlistData] = await Promise.all([
                getAvailableDonations(),
                getNgoRequests(currentUser.uid),
                getNgoWishlistItems(currentUser.uid)
            ]);
            console.log("Wishlist Data Fetched:", wishlistData);
            setDonations(donationData);
            setMyRequests(requestData);
            setWishlist(wishlistData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchData();
        } else {
            console.warn("No current user found in NGODashboard");
        }
    }, [currentUser]);

    const [selectedDonation, setSelectedDonation] = useState(null); // For Claim Modal
    const [selectedRequest, setSelectedRequest] = useState(null);   // For Tracking Modal

    const handleClaimClick = (donation) => {
        setSelectedDonation(donation);
    };

    const handleConfirmClaim = async (address, account) => {
        try {
            if (!selectedDonation) return;
            const requestId = await requestPickup(selectedDonation.id, currentUser.uid);

            // Optimistic update
            setDonations(prev => prev.filter(d => d.id !== selectedDonation.id));
            setMyRequests(prev => [...prev, {
                id: requestId,
                status: 'Accepted',
                medicineName: selectedDonation.medicineName,
                timestamp: new Date()
            }]);

            setSelectedDonation(null);
        } catch (error) {
            alert("Failed to request pickup: " + error.message);
        }
    };

    const handleWishlistSubmit = async (item) => {
        try {
            if (editingItem) {
                // Update existing
                const updatedItem = {
                    ...editingItem,
                    ...item,
                    color: item.urgency === 'CRITICAL' ? 'red' : item.urgency === 'HIGH' ? 'amber' : 'blue'
                };
                await updateWishlistItem(editingItem.id, updatedItem);
                setWishlist(prev => prev.map(w => w.id === editingItem.id ? updatedItem : w));
            } else {
                // Create new
                const newItem = {
                    ...item,
                    fulfilled: 0,
                    color: item.urgency === 'CRITICAL' ? 'red' : item.urgency === 'HIGH' ? 'amber' : 'blue',
                    ngoId: currentUser.uid,
                    ngoName: currentUser.displayName || 'Community Clinic'
                };
                const id = await addWishlistItem(newItem);
                setWishlist(prev => [...prev, { ...newItem, id }]);
            }
            setShowWishlistModal(false);
            setEditingItem(null);
        } catch (error) {
            console.error("Failed to save wishlist item", error);
            alert("Failed to save request. Please try again.");
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setShowWishlistModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (confirm("Delete this requirement?")) {
            try {
                await deleteWishlistItem(id);
                setWishlist(prev => prev.filter(w => w.id !== id));
            } catch (error) {
                alert("Failed to delete item.");
            }
        }
    };

    const filteredDonations = donations.filter(d =>
        d.location.toLowerCase().includes(filter.toLowerCase()) ||
        d.medicineName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg shadow-lg shadow-teal-500/20">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Medi-Give <span className="text-slate-500 text-sm font-medium">NGO Hub</span></h1>
                        <p className="text-xs text-slate-400">Clinic: <span className="text-teal-400">{currentUser?.displayName || currentUser?.email}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/" className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-800">
                        <Home className="w-5 h-5" />
                    </a>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                    </button>
                    <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Available Community Donations
                        <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{filteredDonations.length}</span>
                    </h2>

                    <button
                        onClick={() => { setEditingItem(null); setShowWishlistModal(true); }}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" /> Request Medicine
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Donation Feed & Tracking */}
                    <div className="flex-1 space-y-8">

                        {/* Feed */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                </div>
                            ) : filteredDonations.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                                    <p className="text-slate-500">No matching donations found.</p>
                                </div>
                            ) : (
                                filteredDonations.map(donation => (
                                    <div key={donation.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-6 hover:border-teal-500/30 transition-all group shadow-lg shadow-black/20">
                                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-110 transition-transform">
                                            <Package className="w-7 h-7 text-slate-500 group-hover:text-teal-400 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-white text-xl truncate">{donation.medicineName}</h4>
                                                {donation.urgency === 'High' && (
                                                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">URGENT</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400">
                                                {donation.quantity} Unit(s) • <span className="text-slate-500">Donor: {donation.donorName || 'Verified User'}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleClaimClick(donation)}
                                            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                                        >
                                            Claim Shipment
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Track Claimed Shipments Section */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Track Claimed Shipments</h3>
                            <div className="space-y-3">
                                {myRequests.map((req, idx) => (
                                    <div key={req.id || idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-blue-400 text-lg">{req.medicineName}</h4>
                                            <p className="text-xs text-slate-500">Ref: #{req.id ? req.id.slice(-8) : 'Pending'}</p>
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="mt-2 text-xs flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors"
                                            >
                                                <MapPin className="w-3 h-3" /> Live GPS Tracking
                                            </button>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                                req.status === 'Picked Up' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-slate-700 text-slate-300'
                                                }`}>
                                                {req.status || 'Accepted'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {myRequests.length === 0 && <p className="text-slate-500 italic text-sm">No active shipments.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Wishlist */}
                    <div className="w-full lg:w-96">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white text-lg">Manage Wishlist</h3>
                                <button
                                    onClick={() => { setEditingItem(null); setShowWishlistModal(true); }}
                                    className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                                >
                                    <Plus className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {wishlist.map(item => (
                                    <div key={item.id} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <div>
                                                <h4 className="font-bold text-slate-100">{item.name}</h4>
                                                <p className="text-xs text-slate-500">{item.fulfilled} of {item.total} units fulfilled</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border
                                                    ${item.color === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        item.color === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                    {item.urgency}
                                                </span>
                                                <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditClick(item)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                                                    <button onClick={() => handleDeleteClick(item.id)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2 relative z-10">
                                            <div
                                                className={`h-full transition-all duration-500 ${item.color === 'red' ? 'bg-red-500' :
                                                    item.color === 'amber' ? 'bg-amber-500' :
                                                        'bg-blue-500'
                                                    }`}
                                                style={{ width: `${(item.fulfilled / item.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        {/* Background Glow */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-${item.color}-500/10 transition-colors`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {selectedDonation && (
                    <ClaimModal
                        donation={selectedDonation}
                        currentUser={currentUser}
                        onClose={() => setSelectedDonation(null)}
                        onConfirm={handleConfirmClaim}
                    />
                )}
                {selectedRequest && (
                    <TrackingModal
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                    />
                )}
                {showWishlistModal && (
                    <AddWishlistModal
                        editingItem={editingItem}
                        onClose={() => setShowWishlistModal(false)}
                        onSubmit={handleWishlistSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Sub-Components ---

function ClaimModal({ donation, currentUser, onClose, onConfirm }) {
    const [address, setAddress] = useState('');
    const [account, setAccount] = useState('main');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-cyan-400">Claim {donation.medicineName}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clinic Name</label>
                        <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 font-medium">
                            {currentUser?.displayName || 'St. Mary Community Clinic'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter full address..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 h-24 resize-none transition-colors"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NGO Internal Account</label>
                        <select
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none transition-colors"
                        >
                            <option value="main">Main Budget (Logistics)</option>
                            <option value="emergency">Emergency Fund</option>
                        </select>
                    </div>

                    <button
                        onClick={() => onConfirm(address, account)}
                        className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl mt-2 shadow-lg shadow-cyan-900/20 transition-all"
                    >
                        Confirm Claim
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function AddWishlistModal({ onClose, onSubmit, editingItem }) {
    const [name, setName] = useState(editingItem ? editingItem.name : '');
    const [qty, setQty] = useState(editingItem ? editingItem.total : '');
    const [urgency, setUrgency] = useState(editingItem ? editingItem.urgency : 'HIGH');

    const handleSubmit = () => {
        if (!name || !qty) {
            alert("Please enter both medicine name and quantity.");
            return;
        }
        onSubmit({ name, total: parseInt(qty), urgency });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-cyan-400">{editingItem ? 'Edit Request' : 'Request Medicine'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medicine Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                            placeholder="e.g. Insulin"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qty</label>
                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Urgency</label>
                            <select
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                            >
                                <option value="CRITICAL">Critical</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg mt-2"
                    >
                        {editingItem ? 'Save Changes' : 'Add to Wishlist'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

function TrackingModal({ request, onClose }) {
    // Hackathon Logic: Auto-advance the progress bar for demo purposes
    const [simulatedStep, setSimulatedStep] = useState(1);

    useEffect(() => {
        // Start from the actual status
        const initialStep = request.status === 'Delivered' ? 3 : request.status === 'Picked Up' ? 2 : 1;
        setSimulatedStep(initialStep);

        // Advance steps every 2.5 seconds until complete
        const timer = setInterval(() => {
            setSimulatedStep(prev => {
                const next = prev + 1;
                if (next > 3) {
                    clearInterval(timer);
                    return 3;
                }

                // Hackathon: Trigger DB update
                if (next === 2) updatePickupStatus(request.id, 'Picked Up');
                if (next === 3) updatePickupStatus(request.id, 'Delivered');

                return next;
            });
        }, 2500);

        return () => clearInterval(timer);
    }, [request.status]);

    const step = simulatedStep;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-500 hover:text-white bg-black/20 p-1 rounded-full"><X className="w-5 h-5" /></button>

                {/* Tracking Visualization Area */}
                <div className="bg-slate-950 pt-12 pb-8 px-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

                    {/* 3D Box Animation Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center mb-6 z-10 animate-bounce-slow">
                        <Package className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 z-10">Live Fulfillment Tracking</h2>
                    <p className="text-slate-400 text-sm mb-8 z-10">Monitoring <span className="text-cyan-400 font-bold">{request.medicineName}</span> delivery to <span className="text-cyan-400 font-bold">St. Mary Clinic</span></p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-sm h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            initial={{ width: "0%" }}
                            animate={{ width: step === 3 ? "100%" : step === 2 ? "60%" : "29%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        ></motion.div>
                    </div>
                    <div className="w-full max-w-sm flex justify-between mt-2 text-xs font-bold text-cyan-500 z-10">
                        <span>{step === 1 ? 'Assigning Courier...' : step === 2 ? 'On the way' : 'Delivered'}</span>
                        <span>{step === 3 ? '100%' : step === 2 ? '60%' : '24%'}</span>
                    </div>
                </div>

                {/* Steps List */}
                <div className="p-8 bg-slate-900">
                    <div className="space-y-6">
                        <TrackingStep
                            label="Accepted"
                            desc="Order confirmed by system"
                            active={step >= 1}
                            completed={step > 1}
                        />
                        <TrackingStep
                            label="Picked Up"
                            desc="Courier has collected the package"
                            active={step >= 2}
                            completed={step > 2}
                        />
                        <TrackingStep
                            label="Delivered"
                            desc="Package received at destination"
                            active={step >= 3}
                            completed={step >= 3}
                            isLast
                        />
                    </div>

                    <button onClick={onClose} className="w-full mt-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-slate-700">
                        Close Details
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function TrackingStep({ label, desc, active, completed, isLast }) {
    return (
        <div className="flex gap-4 relative">
            {!isLast && (
                <div className={`absolute left-[15px] top-8 bottom-[-24px] w-0.5 ${completed ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 z-10 ${completed ? 'bg-cyan-500 border-cyan-500' :
                active ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/20' :
                    'bg-slate-900 border-slate-700'
                }`}>
                {completed && <CheckCircle className="w-5 h-5 text-white" />}
                {!completed && active && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse"></div>}
            </div>
            <div className={`${active ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
                <h4 className={`font-bold text-base ${active ? 'text-white' : 'text-slate-400'}`}>{label}</h4>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">{desc}</p>
            </div>
        </div>
    )
}

