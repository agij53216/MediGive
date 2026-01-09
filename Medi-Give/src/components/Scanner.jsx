import { useState } from 'react';
import { scanMedicine } from '../services/scanMedicine';
import { Camera, Loader2, AlertCircle, UploadCloud } from 'lucide-react';

export default function Scanner({ onScanComplete, inputId = 'file-upload' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const result = await scanMedicine(file);
      onScanComplete(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to scan medicine. Please try again.");
    } finally {
      setLoading(false);
      // Reset input value to allow re-scanning same file if needed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor={inputId}
        className={`block w-full cursor-pointer group relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <div className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-3xl transition-all duration-300 ${error
            ? 'border-red-400 bg-red-500/10'
            : 'border-cyan-500/30 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-400'
          }`}>

          {loading ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-400 font-bold text-lg">Analyzing Medicine...</p>
              <p className="text-slate-500 text-sm mt-2">Connecting to AI...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-10 h-10 text-white" />
              </div>

              <p className="text-xl font-bold text-white mb-2">Tap to Scan Medicine</p>
              <p className="text-sm text-slate-400 text-center max-w-[200px]">
                Point camera at medicine box or upload a photo
              </p>

              <div className="absolute bottom-6 flex items-center gap-2 text-xs font-bold text-cyan-500 bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <UploadCloud className="w-3 h-3" />
                <span>Supports JPG, PNG</span>
              </div>
            </>
          )}

          <input
            id={inputId}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCapture}
            disabled={loading}
          />
        </div>
      </label>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
