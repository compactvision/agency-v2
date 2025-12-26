import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import ErrorText from './ErrorText';
import { AlertTriangle, Lock, X, Shield, Eye, EyeOff } from 'lucide-react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm<{ password: string }>({ password: '' });
    const [popupVisible, setPopupVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
    
        destroy(route('dashboard.users.profile.destroy'), {
            data: { password: data.password },              
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                passwordInput.current?.focus();
            },
            onFinish: () => {
                closeModal();
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setPopupVisible(false);
        setShowPassword(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200/30 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Zone de danger</h3>
                        <p className="text-gray-600 mb-4">
                            Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain.
                        </p>
                        <button 
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            onClick={() => setPopupVisible(true)}
                        >
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation */}
            {popupVisible && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* Overlay avec effet de flou */}
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={closeModal}
                        ></div>
                        
                        {/* Modal content */}
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                            {/* Header avec icône */}
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                                <Shield size={32} className="text-red-600" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                                Confirmation de Suppression
                            </h3>
                            
                            <p className="text-center text-gray-600 mb-6">
                                Pour supprimer votre compte, veuillez entrer votre mot de passe ci-dessous.
                            </p>
                            
                            <form onSubmit={deleteUser} className="space-y-4">
                                {/* Champ de mot de passe */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Entrez votre mot de passe"
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                                    </button>
                                </div>
                                
                                {/* Message d'erreur */}
                                {errors.password && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                        <AlertTriangle size={16} />
                                        {errors.password}
                                    </div>
                                )}
                                
                                {/* Boutons d'action */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                        onClick={() => setPopupVisible(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Chargement...
                                            </>
                                        ) : (
                                            'Supprimer mon compte'
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            {/* Bouton de fermeture */}
                            <button
                                type="button"
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={closeModal}
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}