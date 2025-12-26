import React, { useState, useEffect } from 'react';

const LocationInput = ({ data, handleInputChange, errors }) => {
    const [coordinates, setCoordinates] = useState({
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        address: data.mapLocation || ''
    });

    // Fonction pour obtenir la position actuelle
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setCoordinates({
                        latitude: lat,
                        longitude: lng,
                        address: `${lat}, ${lng}`
                    });

                    // Mettre à jour les données du formulaire
                    handleInputChange('latitude', lat);
                    handleInputChange('longitude', lng);
                    handleInputChange('mapLocation', `${lat}, ${lng}`);

                    // Optionnel : géocodage inverse pour obtenir l'adresse
                    reverseGeocode(lat, lng);
                },
                (error) => {
                    console.error('Erreur de géolocalisation:', error);
                    alert('Impossible d\'obtenir votre position. Veuillez vérifier vos paramètres de localisation.');
                }
            );
        } else {
            alert('La géolocalisation n\'est pas supportée par ce navigateur.');
        }
    };

    // Géocodage inverse pour obtenir l'adresse à partir des coordonnées
    const reverseGeocode = async (lat, lng) => {
        try {
            // Vous pouvez utiliser l'API Google Geocoding ou une autre API
            // Ici, je montre un exemple conceptuel
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
                const address = data.results[0].formatted_address;
                setCoordinates(prev => ({
                    ...prev,
                    address: address
                }));
                handleInputChange('mapLocation', address);
            }
        } catch (error) {
            console.error('Erreur lors du géocodage inverse:', error);
        }
    };

    // Fonction pour analyser l'input et extraire les coordonnées
    const parseLocationInput = (value) => {
        // Vérifier si c'est des coordonnées (format: "lat, lng" ou "lat,lng")
        const coordsRegex = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
        const match = value.match(coordsRegex);

        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);

            setCoordinates({
                latitude: lat,
                longitude: lng,
                address: value
            });

            handleInputChange('latitude', lat);
            handleInputChange('longitude', lng);
        } else {
            // Si ce n'est pas des coordonnées, c'est probablement une adresse
            setCoordinates(prev => ({
                ...prev,
                address: value
            }));

            // Vous pouvez implémenter le géocodage ici pour convertir l'adresse en coordonnées
            geocodeAddress(value);
        }
    };

    // Géocodage pour convertir une adresse en coordonnées
    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
                const location = data.results[0].geometry.location;
                setCoordinates(prev => ({
                    ...prev,
                    latitude: location.lat,
                    longitude: location.lng
                }));

                handleInputChange('latitude', location.lat);
                handleInputChange('longitude', location.lng);
            }
        } catch (error) {
            console.error('Erreur lors du géocodage:', error);
        }
    };

    return (
        <div className="property-form__field property-form__field--full">
            <label className="property-form__label property-form__label--required">
                Localisation sur la carte
            </label>

            <div className="property-form__location-input">
                <input
                    type="text"
                    className="property-form__input"
                    placeholder="Coordonnées GPS ou adresse précise"
                    value={coordinates.address}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('mapLocation', value);
                        parseLocationInput(value);
                    }}
                />
                <button
                    type="button"
                    className="property-form__location-btn"
                    onClick={getCurrentLocation}
                    title="Utiliser ma position actuelle"
                >
                    📍
                </button>
            </div>

            {/* Affichage des coordonnées séparées (optionnel) */}
            <div className="property-form__coordinates">
                <div className="property-form__coordinate-group">
                    <label>Latitude:</label>
                    <input
                        type="number"
                        step="any"
                        value={coordinates.latitude}
                        onChange={(e) => {
                            const lat = parseFloat(e.target.value) || '';
                            setCoordinates(prev => ({
                                ...prev,
                                latitude: lat
                            }));
                            handleInputChange('latitude', lat);
                        }}
                        className="property-form__coordinate-input"
                    />
                </div>
                <div className="property-form__coordinate-group">
                    <label>Longitude:</label>
                    <input
                        type="number"
                        step="any"
                        value={coordinates.longitude}
                        onChange={(e) => {
                            const lng = parseFloat(e.target.value) || '';
                            setCoordinates(prev => ({
                                ...prev,
                                longitude: lng
                            }));
                            handleInputChange('longitude', lng);
                        }}
                        className="property-form__coordinate-input"
                    />
                </div>
            </div>

            {errors.mapLocation && <div className="property-form__error">{errors.mapLocation}</div>}
            {errors.latitude && <div className="property-form__error">{errors.latitude}</div>}
            {errors.longitude && <div className="property-form__error">{errors.longitude}</div>}

            <div className="property-form__map-container">
                <iframe
                    className="property-form__map"
                    src={coordinates.latitude && coordinates.longitude
                        ? `https://maps.google.com/maps?width=600&height=400&hl=fr&q=${coordinates.latitude},${coordinates.longitude}&t=&z=15&ie=UTF8&iwloc=B&output=embed`
                        : "https://maps.google.com/maps?width=600&height=400&hl=fr&q=Paris&t=&z=12&ie=UTF8&iwloc=B&output=embed"
                    }
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            <style jsx>{`
                /* Styles pour le composant de localisation */
                .property-form__coordinates {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
                    padding: 0.75rem;
                    background-color: #f8f9fa;
                    border-radius: 0.375rem;
                    border: 1px solid #e5e7eb;
                }

                .property-form__coordinate-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .property-form__coordinate-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                }

                .property-form__coordinate-input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    background-color: white;
                    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }

                .property-form__coordinate-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .property-form__location-btn {
                    padding: 0.5rem;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: background-color 0.2s ease-in-out;
                    min-width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .property-form__location-btn:hover {
                    background-color: #2563eb;
                }

                .property-form__location-btn:active {
                    background-color: #1d4ed8;
                }

                .property-form__location-input {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .property-form__location-input .property-form__input {
                    flex: 1;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .property-form__coordinates {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .property-form__location-input {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .property-form__location-btn {
                        align-self: flex-start;
                        min-width: auto;
                        padding: 0.75rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default LocationInput;
