import React from 'react';

interface BookingFinalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  details: {
    name: string;
    email: string;
    phone: string;
    interests: string[];
    duration: number;
    budget: string;
    region: string;
    price: number | null;
  };
}

export const BookingFinalizationModal: React.FC<BookingFinalizationModalProps> = ({ isOpen, onClose, onConfirm, details }) => {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Simulate API call for payment gateway
    setTimeout(() => {
        onConfirm();
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative transform transition-all duration-300 scale-95 animate-slide-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer la fenêtre"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold text-brand-accent mb-2">NERZA</p>
            <h2 id="modal-title" style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-brand-green mb-4">Finalisation de la réservation</h2>
            <p className="text-brand-green-light mb-8 max-w-md mx-auto">Veuillez vérifier les informations de votre future aventure avant de continuer.</p>
        </div>

        <div className="space-y-4">
            <div className="bg-brand-beige p-6 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <h3 className="font-semibold text-brand-green mb-2">Vos Coordonnées</h3>
                        <p className="text-sm text-brand-green-light"><strong>Nom :</strong> {details.name}</p>
                        <p className="text-sm text-brand-green-light"><strong>Email :</strong> {details.email}</p>
                        <p className="text-sm text-brand-green-light"><strong>Téléphone :</strong> {details.phone}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-brand-green mb-2">Préférences de Voyage</h3>
                        <p className="text-sm text-brand-green-light"><strong>Destination :</strong> {details.region === 'Region' ? 'Exploration de la région' : 'Agadir'}</p>
                        <p className="text-sm text-brand-green-light"><strong>Durée :</strong> {details.duration} jours</p>
                        <p className="text-sm text-brand-green-light"><strong>Budget :</strong> {details.budget}</p>
                        {details.interests.length > 0 && 
                          <p className="text-sm text-brand-green-light"><strong>Intérêts :</strong> {details.interests.join(', ')}</p>
                        }
                    </div>
                     <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-brand-green text-lg">Prix Total Estimé</h3>
                            {details.price && (
                                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-brand-green">
                                    {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(details.price)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-brand-green mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Ce qui est inclus
                    </h3>
                    <ul className="list-disc list-inside text-sm text-brand-green-light pl-4 space-y-1">
                        <li>Hébergement sélectionné</li>
                        <li>Transport privé et transferts</li>
                        <li>Activités de l'itinéraire</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-green mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Ce qui n'est pas inclus
                    </h3>
                    <ul className="list-disc list-inside text-sm text-brand-green-light pl-4 space-y-1">
                        <li>Repas et boissons</li>
                        <li>Dépenses personnelles</li>
                        <li>Pourboires</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-8 text-center">
             <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full md:w-auto bg-brand-green text-white py-3 px-12 rounded-md font-semibold transition-all duration-300 ease-in-out hover:bg-brand-green-light disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
                {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                <span>{isSubmitting ? 'Traitement...' : 'Confirmer et Payer (Simulation)'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-3">🔒 Ceci est une simulation. Aucune transaction réelle ne sera effectuée.</p>
        </div>
      </div>
    </div>
  );
};