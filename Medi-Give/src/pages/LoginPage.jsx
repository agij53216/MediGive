import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';

export default function LoginPage() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we came from "Donate Now" button with strict donor mode
    const initialRole = location.state?.role || 'donor';
    const isStrictMode = location.state?.mode === 'strict';

    const [role, setRole] = useState(initialRole);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await loginWithGoogle(role);
            if (role === 'admin') navigate('/admin');
            else if (role === 'ngo') navigate('/ngo');
            else navigate('/donor');
        } catch (err) {
            // Fix: Ignore popup-blocked errors if they don't stop the flow, or just log them console only
            if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
                console.warn("Popup blocked or closed:", err);
                // Don't show this to user if they just accidentally double clicked
                return;
            }
            setError('Failed to log in: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
            <a href="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors">
                <Home className="w-5 h-5" /> Back to Home
            </a>
            <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-teal-600 fill-teal-600" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                    {isStrictMode ? 'Donor Login' : 'Welcome to Medi-Give'}
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    {isStrictMode ? 'Sign in to start donating medicine.' : 'Choose how you want to help today.'}
                </p>

                {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

                {!isStrictMode && (
                    <div className="grid grid-cols-3 gap-2 mb-8">
                        <button
                            onClick={() => setRole('donor')}
                            className={`p-3 rounded-xl border-2 transition-all font-medium text-sm flex flex-col items-center justify-center ${role === 'donor'
                                ? 'border-teal-600 bg-teal-50 text-teal-700'
                                : 'border-slate-200 hover:border-teal-200 text-slate-600'
                                }`}
                        >
                            <span>I am a</span>
                            <span className="text-base font-bold">Donor</span>
                        </button>
                        <button
                            onClick={() => setRole('ngo')}
                            className={`p-3 rounded-xl border-2 transition-all font-medium text-sm flex flex-col items-center justify-center ${role === 'ngo'
                                ? 'border-teal-600 bg-teal-50 text-teal-700'
                                : 'border-slate-200 hover:border-teal-200 text-slate-600'
                                }`}
                        >
                            <span>I am an</span>
                            <span className="text-base font-bold">NGO</span>
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`p-3 rounded-xl border-2 transition-all font-medium text-sm flex flex-col items-center justify-center ${role === 'admin'
                                ? 'border-teal-600 bg-teal-50 text-teal-700'
                                : 'border-slate-200 hover:border-teal-200 text-slate-600'
                                }`}
                        >
                            <span>I am an</span>
                            <span className="text-base font-bold">Admin</span>
                        </button>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
