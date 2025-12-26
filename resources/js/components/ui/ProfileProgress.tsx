// components/ProfileProgress.jsx
import React from 'react';
import { computeProfileCompletion } from '@/utils/profileCompletion';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfileProgress({ user }) {
    const { percent, missingLabels } = computeProfileCompletion(user);
    const isComplete = percent === 100;
    const firstName = (user?.name || '').trim().split(' ')[0] || 'utilisateur';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {/* Header compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isComplete 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-amber-100 text-amber-600'
                    }`}>
                        {isComplete ? (
                            <CheckCircle size={16} />
                        ) : (
                            <AlertCircle size={16} />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {isComplete ? `Bonjour ${firstName}` : 'Profil'}
                        </p>
                        <p className="text-xs text-gray-500">{percent}% complété</p>
                    </div>
                </div>
                <div className={`text-lg font-bold ${
                    isComplete ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                    {percent}%
                </div>
            </div>

            {/* Progress bar compacte */}
            <div className="relative mb-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                            isComplete 
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                                : 'bg-gradient-to-r from-amber-400 to-amber-600'
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Missing fields - version ultra compacte */}
            {!isComplete && missingLabels.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <AlertCircle size={12} />
                    <span className="truncate">
                        {missingLabels.slice(0, 2).join(', ')}
                        {missingLabels.length > 2 && ` +${missingLabels.length - 2}`}
                    </span>
                </div>
            )}

            {/* Success message compact */}
            {isComplete && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle size={12} />
                    <span>Profil complet</span>
                </div>
            )}
        </div>
    );
}