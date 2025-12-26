import React, { useEffect, useState } from 'react'

export default function Theme() {
    const [theme, setTheme] = useState('light');

    // Charger le thème à partir du stockage local lors de l'initialisation
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme; // Ajouter la classe au body
    }, []);

    // Gestion du changement de thème
    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme); // Sauvegarder dans le stockage local
        document.documentElement.className = selectedTheme; // Ajouter la classe au body
    };
    return (
        <div className="appearance__section mb-20">
            <label htmlFor="theme">Theme</label>
            <select id="theme" className="theme__selector" value={theme} onChange={handleThemeChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    )
}
