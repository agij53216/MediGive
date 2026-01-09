import { X, Check, Camera, AlertCircle } from 'lucide-react';

export default function Guidelines({ onClose, onStart }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white">Guidelines</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2">
                    {/* Visual Section */}
                    <div className="bg-slate-950 p-8 flex flex-col items-center justify-center text-center border-r border-slate-800">
                        <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-teal-500/30">
                            <Camera className="w-10 h-10 text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Scan</h3>
                        <p className="text-slate-400 text-sm mb-8">
                            Position the medicine packaging clearly within the frame.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={onStart}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-colors"
                            >
                                Start Camera
                            </button>
                            <button onClick={onStart} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700">
                                Upload from Gallery
                            </button>
                        </div>
                    </div>

                    {/* Rules Section */}
                    <div className="p-8 space-y-6">
                        <GuidelineItem
                            icon={Check}
                            iconColor="bg-green-500/20 text-green-400"
                            title="Ensure Lighting"
                            desc="Bright, natural light works best for OCR detection."
                        />
                        <GuidelineItem
                            icon={Check}
                            iconColor="bg-green-500/20 text-green-400"
                            title="Capture Expiry Date"
                            desc="Make sure the date and manufacturer stamp are visible."
                        />
                        <GuidelineItem
                            icon={X}
                            iconColor="bg-red-500/20 text-red-400"
                            title="No Open Blisters"
                            desc="We only accept factory-sealed medicines for safety."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function GuidelineItem({ icon: Icon, iconColor, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
                <h4 className="font-bold text-slate-200 text-sm mb-1">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
