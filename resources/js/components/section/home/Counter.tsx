/**
 * Counter.tsx — Compteurs animés
 * FIX: useState ne peut PAS être appelé à l'intérieur d'un .map() — violation des Rules of Hooks.
 * Solution : extraire chaque compteur dans son propre composant enfant.
 */
import { Handshake, Home, UserCheck, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CounterItem {
    value: number;
    suffix: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

const COUNTERS: CounterItem[] = [
    {
        value: 15,
        suffix: '+',
        label: 'biens_listes',
        icon: Home,
        color: '#1E3A5F',
    },
    {
        value: 8,
        suffix: '',
        label: 'ventes_conclues',
        icon: Handshake,
        color: '#C9A84C',
    },
    {
        value: 12,
        suffix: '+',
        label: 'clients_satisfaits',
        icon: Users,
        color: '#2A4F7C',
    },
    {
        value: 3,
        suffix: '',
        label: 'agents_expérimentés',
        icon: UserCheck,
        color: '#A8882E',
    },
];

/** Composant individuel : chaque compteur gère son propre état */
function SingleCounter({
    item,
    visible,
}: {
    item: CounterItem;
    visible: boolean;
}) {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const Icon = item.icon;

    useEffect(() => {
        if (!visible) return;
        const steps = 50;
        const duration = 1800;
        const increment = item.value / steps;
        let count = 0;
        const timer = setInterval(() => {
            count += increment;
            if (count >= item.value) {
                count = item.value;
                clearInterval(timer);
            }
            setCurrent(Math.floor(count));
        }, duration / steps);
        return () => clearInterval(timer);
    }, [visible, item.value]);

    return (
        <div className="flex flex-col items-center text-center">
            {/* Icône */}
            <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ background: item.color }}
            >
                <Icon className="h-7 w-7" />
            </div>

            {/* Chiffre */}
            <div className="flex items-baseline gap-0.5">
                <span
                    className="text-5xl leading-none font-extrabold tracking-tight"
                    style={{ color: item.color }}
                >
                    {current}
                </span>
                <span className="text-3xl font-bold text-gray-400">
                    {item.suffix}
                </span>
            </div>

            {/* Label */}
            <p className="mt-2 text-sm font-medium text-gray-500">
                {t(item.label)}
            </p>
        </div>
    );
}

export default function Counter() {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.2 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative bg-white py-20">
            {/* Ligne décorative top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="mx-auto max-w-5xl px-4">
                <div
                    className={`grid grid-cols-2 gap-10 transition-all duration-700 md:grid-cols-4 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    {COUNTERS.map((item, i) => (
                        <div
                            key={item.label}
                            className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                            style={{ transitionDelay: `${i * 120}ms` }}
                        >
                            <SingleCounter item={item} visible={visible} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Ligne décorative bottom */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </section>
    );
}
