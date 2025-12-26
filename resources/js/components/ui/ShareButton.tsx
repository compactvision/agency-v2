import { useState } from "react";
import { LucideShare2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { appEnv } from "@/utils/env";

export default function ShareButton() {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
    const currentPath = window.location.pathname;
    const shareUrl = `${appEnv.url}${currentPath}`;

    const shareData = {
        title: document.title,
        text: t('share_text', 'Découvrez cette annonce sur DRC Agency'),
        url: shareUrl,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error("Erreur de partage :", err);
        }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error("Erreur lors de la copie :", err);
        }
    } else {
        // Fallback : prompt classique
        prompt(t('copy_fallback', 'Copiez ce lien manuellement :'), shareUrl);
    }
};


    return (
        <button
            onClick={handleShare}
            className="btn d-flex align-items-center gap-2"
            style={{ borderColor: '#D6A643', color: '#D6A643', backgroundColor: '#D6A643' }}
        >
            <LucideShare2 size={16} />
            {copied ? t('copied', 'Lien copié !') : t('share', 'Partager')}
        </button>
    );
}
