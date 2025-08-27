
import React, { useState, useEffect } from 'react';
import { generateItinerary } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { BookingFinalizationModal } from './BookingFinalizationModal';
import { ConfirmationBanner } from './ConfirmationBanner';

type Region = 'Agadir' | 'Region';
type Interest = 'Farniente & Plage' | 'Surf & Sports Nautiques' | 'Gastronomie & Vie Nocturne' | 'Golf & Resorts' | 'Trekking en Montagne' | 'Aventure & Adrénaline' | 'Culture Berbère' | 'Nuits en Bivouac';
type Budget = 'Économique' | 'Confort' | 'Luxe';

const AGADIR_INTERESTS: Interest[] = ['Farniente & Plage', 'Surf & Sports Nautiques', 'Gastronomie & Vie Nocturne', 'Golf & Resorts'];
const REGION_INTERESTS: Interest[] = ['Trekking en Montagne', 'Aventure & Adrénaline', 'Culture Berbère', 'Nuits en Bivouac'];
const BUDGET_OPTIONS: Budget[] = ['Économique', 'Confort', 'Luxe'];

const calculatePrice = (budget: Budget, duration: number): number => {
    const BASE_DURATION = 5; // Costs are based on a 5-day trip baseline
    let baseCostPerDay: number;
    let margin: number;

    switch (budget) {
        case 'Économique':
            baseCostPerDay = 30000 / BASE_DURATION;
            margin = 0.10;
            break;
        case 'Luxe':
            baseCostPerDay = 55000 / BASE_DURATION;
            margin = 0.15;
            break;
        case 'Confort':
        default:
            baseCostPerDay = 40000 / BASE_DURATION;
            margin = 0.12;
            break;
    }

    const totalBaseCost = baseCostPerDay * duration;
    const finalPrice = totalBaseCost * (1 + margin);
    return Math.round(finalPrice);
};

export const ServicesSection: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [region, setRegion] = useState<Region | null>(null);
    const [interests, setInterests] = useState<Set<Interest>>(new Set());
    const [duration, setDuration] = useState<number>(3);
    const [budget, setBudget] = useState<Budget>('Confort');
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const isFormValid = name.trim() !== '' && email.trim() !== '' && phone.trim() !== '' && region !== null;

    useEffect(() => {
        // Reset interests when the user changes region to ensure relevance
        setInterests(new Set());
    }, [region]);

    const handleInterestChange = (interest: Interest) => {
        setInterests(prev => {
            const newInterests = new Set(prev);
            if (newInterests.has(interest)) {
                newInterests.delete(interest);
            } else {
                newInterests.add(interest);
            }
            return newInterests;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Veuillez choisir une destination et remplir vos coordonnées.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setItinerary(null);
        setFinalPrice(null);
        try {
            const result = await generateItinerary({
                region: region!,
                interests: Array.from(interests),
                duration,
                budget,
            });
            setItinerary(result);
            const price = calculatePrice(budget, duration);
            setFinalPrice(price);
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de la génération de l'itinéraire. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setItinerary(null);
        setError(null);
        setIsLoading(false);
        setFinalPrice(null);
        // We keep contact info and region choice
    };

    const handleFullReset = () => {
        handleReset();
        setRegion(null);
        setName('');
        setEmail('');
        setPhone('');
        setInterests(new Set());
    }

    const handleConfirmBooking = () => {
        setIsFinalizeModalOpen(false);
        setIsConfirmed(true);
        setTimeout(() => {
            setIsConfirmed(false);
            handleFullReset();
        }, 5000); // Hide banner and reset after 5s
    };
    
    const interestOptions = region === 'Agadir' ? AGADIR_INTERESTS : REGION_INTERESTS;

    return (
      <section id="services" className="py-16 md:py-24 bg-white rounded-lg shadow-sm">
        <div className="text-center mb-12 px-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl font-bold text-brand-green">
                Votre Aventure IA sur Mesure
            </h2>
            <p className="text-lg text-brand-green-light mt-4 max-w-2xl mx-auto">
                Décrivez vos envies, notre intelligence artificielle partenaire vous concocte un itinéraire unique pour une expérience inoubliable.
            </p>
        </div>
        
        {!itinerary ? (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4">
                {!region ? (
                    <div className="text-center animate-fade-in">
                        <label className="block text-xl font-semibold text-brand-green mb-6">Quelle est votre destination de prédilection ?</label>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                             <button type="button" onClick={() => setRegion('Agadir')} className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 bg-white text-brand-green border-brand-green-light hover:bg-brand-green hover:text-white hover:shadow-xl hover:scale-105">
                                Rester sur Agadir
                            </button>
                            <button type="button" onClick={() => setRegion('Region')} className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 bg-white text-brand-green border-brand-green-light hover:bg-brand-green hover:text-white hover:shadow-xl hover:scale-105">
                                Explorer la région
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h3 className="text-lg font-semibold text-brand-green mb-4">Vos coordonnées</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-light" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-light" />
                                </div>
                                 <div className="md:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-light" />
                                </div>
                            </div>
                        </div>
                        
                        <hr/>

                        <div>
                            <label className="block text-lg font-semibold text-brand-green mb-4">Quels sont vos centres d'intérêt ? (Optionnel)</label>
                            <div className="flex flex-wrap gap-4">
                                {interestOptions.map(interest => (
                                    <button key={interest} type="button" onClick={() => handleInterestChange(interest)} aria-pressed={interests.has(interest)}
                                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2 ${interests.has(interest) ? 'bg-brand-green text-white border-brand-green' : 'bg-transparent text-brand-green-light border-gray-300 hover:border-brand-green-light'}`}>
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div>
                                <label htmlFor="duration" className="block text-lg font-semibold text-brand-green mb-4">Durée du séjour (jours)</label>
                                <input type="number" id="duration" value={duration} onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-lg font-semibold text-brand-green mb-4">Votre budget</label>
                                <div role="radiogroup" className="flex bg-gray-200 rounded-md p-1">
                                    {BUDGET_OPTIONS.map(option => (
                                        <button key={option} type="button" role="radio" aria-checked={budget === option} onClick={() => setBudget(option)}
                                            className={`w-full text-center px-4 py-2 rounded-md transition-colors duration-200 font-medium ${budget === option ? 'bg-white text-brand-green shadow' : 'text-gray-500 hover:bg-gray-300'}`}>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                         <div className="mt-12 text-center">
                            <button type="submit" disabled={!isFormValid || isLoading}
                                className="w-full md:w-auto bg-brand-green text-white py-4 px-12 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-brand-green-light disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                {isLoading ? 'Génération en cours...' : 'Générer mon itinéraire'}
                            </button>
                            <button type="button" onClick={() => setRegion(null)} className="block mx-auto mt-4 font-semibold text-brand-green-light hover:text-brand-green transition-colors text-sm">
                                Changer de destination
                            </button>
                        </div>
                    </div>
                )}
              
              {error && <p className="text-center text-red-500 mt-4" role="alert">{error}</p>}
          </form>
        ) : (
             <div className="max-w-4xl mx-auto px-4 animate-fade-in">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg" aria-live="polite">
                        <LoadingSpinner />
                        <p className="mt-4 text-brand-green-light font-semibold">Notre IA prépare votre aventure...</p>
                        <p className="mt-2 text-sm text-gray-500">Cela peut prendre quelques instants.</p>
                    </div>
                ) : (
                    <>
                        {finalPrice && (
                            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-xl text-center mb-8 animate-fade-in-down">
                                <p className="text-lg font-medium">Prix total estimé pour votre voyage de {duration} jours :</p>
                                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold tracking-wider">
                                    {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(finalPrice)}
                                </p>
                                <p className="text-xs opacity-80 mt-2">Ce tarif inclut l'hébergement, le transport et les activités planifiées. Les repas et dépenses personnelles ne sont pas inclus.</p>
                            </div>
                        )}
                        <div className="bg-brand-beige p-6 md:p-8 rounded-lg shadow-inner border border-gray-200">
                            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl md:text-3xl font-bold text-brand-green mb-6 text-center">Votre Itinéraire Personnalisé</h3>
                            <div className="text-brand-green-light whitespace-pre-wrap font-sans leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: itinerary.replace(/### (.*)/g, '<h4 class="text-xl font-bold text-brand-green mt-4 mb-2">$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-brand-green">$1</strong>') }}>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button onClick={() => setIsFinalizeModalOpen(true)}
                                className="w-full md:w-auto bg-brand-green text-white py-3 px-10 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Finaliser la réservation
                            </button>
                             <button onClick={handleReset} className="font-semibold text-brand-green-light hover:text-brand-green transition-colors">
                                Modifier mes préférences
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}

        <BookingFinalizationModal 
            isOpen={isFinalizeModalOpen}
            onClose={() => setIsFinalizeModalOpen(false)}
            onConfirm={handleConfirmBooking}
            details={{ name, email, phone, interests: Array.from(interests), duration, budget, region: region || '', price: finalPrice }}
        />

        {isConfirmed && <ConfirmationBanner onClose={() => setIsConfirmed(false)} />}
      </section>
    );
};