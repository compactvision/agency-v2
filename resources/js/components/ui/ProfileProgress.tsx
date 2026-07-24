// components/ProfileProgress.jsx
import { computeProfileCompletion } from '@/utils/profileCompletion';
import { AlertCircle } from 'lucide-react';

export default function ProfileProgress({
    user,
}: {
    user: Record<string, unknown> & { name?: string };
}) {
    const { percent, missingLabels } = computeProfileCompletion(user);

    if (percent >= 100) {
        return null;
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <AlertCircle size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Profil
                        </p>
                        <p className="text-xs text-gray-500">{percent}% complété</p>
                    </div>
                </div>
                <div className="text-lg font-bold text-amber-600">
                    {percent}%
                </div>
            </div>

            {/* Progress bar compacte */}
            <div className="relative mb-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Missing fields - version ultra compacte */}
            {missingLabels.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <AlertCircle size={12} />
                    <span className="truncate">
                        {missingLabels.slice(0, 2).join(', ')}
                        {missingLabels.length > 2 && ` +${missingLabels.length - 2}`}
                    </span>
                </div>
            )}
        </div>
    );
}
