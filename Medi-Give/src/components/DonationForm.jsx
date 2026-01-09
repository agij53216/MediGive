import { useState } from 'react';
import { createDonation } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';

export default function DonationForm({ data, imageFile, onCancel, onSuccess }) {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        medicineName: data?.medicineName || 'Unknown Medicine',
        expiryDate: data?.expiryDate || 'Not found',
        manufacturer: data?.manufacturer || 'Unknown Manufacturer',
        usage: data?.usage || 'General Use',
        quantity: 1,
        location: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Preview URL for the uploaded/scanned image
    const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (!formData.location) throw new Error("Please enter a pickup location");

            await createDonation({
                ...formData,
                donorId: currentUser.uid,
                donorName: currentUser.displayName || 'Anonymous'
            }, imageFile);

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-slate-800 flex flex-col md:flex-row min-h-[500px]">

            {/* Left Side: Image & Confidence */}
            <div className="md:w-5/12 bg-slate-950 p-6 flex flex-col relative border-r border-slate-800">
                <button onClick={onCancel} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>

                <div className="mt-12 flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-800 mb-6 shadow-2xl">
                        {imagePreview && <img src={imagePreview} alt="Medicine" className="w-full h-full object-cover" />}
                        {/* Scan Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                        {/* Medicine Name Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-2xl font-bold text-white shadow-black drop-shadow-md">{formData.medicineName}</h3>
                            <p className="text-slate-300 text-sm bg-black/40 backdrop-blur-md inline-block px-2 py-1 rounded mt-1">{data?.confidence}% Confidence</p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Security Check</span>
                        <div className="flex items-center gap-2 text-green-400 font-bold text-sm bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                            <ShieldCheck className="w-4 h-4" /> SEALED
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Details Form */}
            <div className="md:w-7/12 p-8 bg-slate-900 flex flex-col justify-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{formData.medicineName}</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Composition</p>
                            <p className="text-lg text-slate-200 font-medium border-b border-slate-800 pb-2">{formData.medicineType}, {formData.usage}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Expires On</p>
                                <p className={`text-lg font-bold ${data?.isExpired ? 'text-red-400' : 'text-teal-400'}`}>
                                    {formData.expiryDate}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Manufacturer</p>
                                <p className="text-lg text-slate-200 font-medium truncate">{formData.manufacturer}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400 font-medium">Pickup Details</p>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Enter pickup address..."
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-teal-500 outline-none text-center font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 text-lg"
                    >
                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm Donation"}
                    </button>

                    <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold opacity-60">
                        AI Verification Successful. Donation logistics will be assigned immediately.
                    </p>
                </form>
            </div>
        </div>
    );
}
