
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Conditionally initialize 'ai' only if the API key exists.
// This prevents a crash on startup in browser environments where process.env is not available.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY environment variable not set. Using mocked data for AI content.");
}

/**
 * A wrapper around the Gemini API's generateContent method that includes
 * automatic retries with exponential backoff for rate limit errors (429).
 */
const generateContentWithRetry = async (
    // The type is derived from the class itself to avoid depending on the 'ai' instance which can be null.
    params: Parameters<InstanceType<typeof GoogleGenAI>['models']['generateContent']>[0],
    retries = 3, 
    delay = 1000
): Promise<GenerateContentResponse> => {
    // Although call sites check for API_KEY, this guard makes the function safer
    // and satisfies TypeScript's null-check.
    if (!ai) {
        throw new Error("Gemini AI client is not initialized. API_KEY is likely missing.");
    }

    try {
        return await ai.models.generateContent(params);
    } catch (error: any) {
        const errorMessage = error.toString();
        // Check for rate limit error signatures.
        const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

        if (retries > 0 && isRateLimitError) {
            const jitter = Math.random() * 500; // Add jitter to avoid thundering herd
            const waitTime = delay + jitter;
            console.warn(`Gemini API call failed due to rate limiting. Retrying in ${(waitTime / 1000).toFixed(2)}s... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, waitTime));
            // Recursive call with decremented retries and increased delay.
            return generateContentWithRetry(params, retries - 1, delay * 2);
        } else {
            if (isRateLimitError) {
                 console.error("Gemini API call failed after multiple retries due to rate limiting.", error);
            } else {
                 console.error("Gemini API call failed with a non-retriable error:", error);
            }
            throw error; // Re-throw the error to be handled by the caller.
        }
    }
};

const generateWithFallback = async (prompt: string, fallback: string): Promise<string> => {
    // The API_KEY check also implicitly checks if 'ai' is initialized.
    if (!API_KEY) {
        return fallback;
    }
    try {
        const response = await generateContentWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        // Error is already logged by generateContentWithRetry, just return the fallback.
        return fallback;
    }
};

export const generateAgencyContent = async (): Promise<{ tagline: string; }> => {
  const taglinePrompt = `Génère une phrase d'accroche courte, immersive et percutante (moins de 15 mots) pour "Nerza Agency", une agence de voyage lifestyle et premium au Maroc pour jeunes adultes. Le ton doit être inspirant et donner envie de découvrir le Maroc autrement. Pense à des mots comme "expérience", "vibration", "authentique". Ne retourne que la phrase d'accroche, sans guillemets ni préfixe.`;
  
  const fallbackTagline = "Vibrez au rythme d'un Maroc secret et exaltant.";

  const tagline = await generateWithFallback(taglinePrompt, fallbackTagline);

  return { tagline };
};


interface ItineraryParams {
  region: 'Agadir' | 'Region';
  interests: string[];
  duration: number;
  budget: string;
}

export const generateItinerary = async ({ region, interests, duration, budget }: ItineraryParams): Promise<string> => {
  const locationFocus = region === 'Agadir'
    ? "Concentre-toi exclusivement sur Agadir et ses environs immédiats (y compris Taghazout pour le surf et les sports nautiques). Le voyageur souhaite rester dans la zone côtière principale."
    : "Concentre-toi sur la création d'un itinéraire d'aventure et de découverte dans l'arrière-pays, en explorant des destinations comme Tafraout, Tiznit et les montagnes de l'Anti-Atlas. Si le voyageur exprime un intérêt pour 'Nuits en Bivouac' ou 'Culture Berbère' ou si cela semble pertinent pour un séjour 'Aventure', suggère spécifiquement 'Camping Tazka' à Tafraout comme une excellente option. Le voyageur veut explicitement sortir d'Agadir.";

  const interestPrompt = interests.length > 0
    ? `Les centres d'intérêt optionnels du voyageur sont : ${interests.join(', ')}. Utilise-les comme inspiration principale pour tes suggestions.`
    : `Le voyageur n'a pas spécifié de centres d'intérêt. Propose un itinéraire équilibré et emblématique basé sur la région choisie (par exemple, luxe balnéaire, sports nautiques et gastronomie pour Agadir ; ou trekking, aventure et immersion culturelle berbère pour la région).`;

  const prompt = `Tu es "Nerza", un expert en voyages d'exception pour l'agence Nerza Agency, spécialisé dans la région d'Agadir, au Maroc. Ta mission est de créer un itinéraire personnalisé et détaillé, jour par jour, pour un séjour de ${duration} jours.

Les préférences du voyageur sont :
- Budget : "${budget}"

**Instructions importantes :**
1.  **Instruction de Région Clé :** ${locationFocus}
2.  **Centres d'Intérêt :** ${interestPrompt}
3.  **Détail du programme :** Pour chaque jour, propose un programme pour le matin, l'après-midi, et la soirée. Donne des conseils qui sortent des sentiers battus.
4.  **Authenticité Vérifiée :** Inclus des noms de lieux spécifiques et VÉRIFIABLES (restaurants, sites, hôtels, riads). Par exemple, si tu suggères un riad à Tiznit, utilise des noms connus comme "Riad Le Lieu" ou "Riad Janoub", et non des noms inventés. La crédibilité est essentielle.
5.  **Ton :** Le ton doit être engageant, inspirant et premium, en accord avec l'image de Nerza Agency.
6.  **Format :** Structure la réponse avec des titres clairs en Markdown (ex: \`### Jour 1: Immersion Atlantique\`, \`**Matin :**\`, etc.). Utilise les doubles astérisques (**) pour mettre en valeur les noms de lieux importants.
7.  **Prix :** Ne mentionne AUCUN prix ou budget dans ta réponse. Le prix final sera calculé et affiché par notre système. Concentre-toi uniquement sur la création d'un itinéraire inspirant.
8.  **Transport Aéroport :** Mentionne explicitement au début de l'itinéraire (Jour 1) que le transport privé depuis l'aéroport d'Agadir Al Massira (AGA) jusqu'à leur lieu de séjour est inclus et organisé par Nerza Agency.
9.  **Clarification des Inclusions :** Précise que les repas (déjeuner, dîner) et les boissons dans les lieux suggérés sont à la charge du client. Le forfait Nerza inclut l'hébergement, le transport et les activités planifiées.

Commence directement par l'itinéraire du Jour 1. N'ajoute aucune introduction ni conclusion.`;

    if (!API_KEY) {
        // Fallback for when API key is not available
        return new Promise(resolve => setTimeout(() => resolve(`### Jour 1: Arrivée et Ambiance Océane à Agadir

**Matin:** Accueil personnalisé à l'aéroport d'Agadir Al Massira (AGA) par votre chauffeur Nerza Agency et transfert privé jusqu'à votre hôtel. Après votre installation, profitez d'une promenade sur la corniche d'Agadir pour respirer l'air marin et vous imprégner de l'atmosphère détendue de la ville.
**Après-midi:** Visite de la Kasbah d'Agadir Oufella. Profitez d'une vue panoramique imprenable sur la baie d'Agadir. C'est le spot parfait pour des photos mémorables.
**Soir:** Dîner (à votre charge) au restaurant **Le Flore** sur le port de plaisance, réputé pour ses fruits de mer frais, dans une ambiance chic et décontractée.

### Jour 2: Aventure vers Tafraout

**Matin:** Départ pour Tafraout à travers les paysages spectaculaires de l'Anti-Atlas. Arrêt pour admirer les formations rocheuses uniques, notamment le "Chapeau de Napoléon".
**Après-midi:** Randonnée dans la vallée des Ammeln et découverte des célèbres rochers peints par l'artiste belge Jean Vérame. Une expérience artistique en pleine nature.
**Soir:** Dîner (à votre charge) et nuit dans une auberge de charme à Tafraout, pour goûter à l'hospitalité berbère authentique sous un ciel étoilé exceptionnel.

### Jour 3: Culture à Tiznit et retour

**Matin:** Route vers Tiznit, la "cité d'argent". Visite des remparts historiques et exploration du souk des bijoutiers, réputé pour ses créations en argent filigrané.
**Après-midi:** Déjeuner (à votre charge) à Tiznit au **Riad Le Lieu** avant de prendre la route côtière pour retourner à Agadir. Arrêt possible sur la plage sauvage de Mirleft pour une dernière bouffée d'air marin.
**Soir:** Coucher de soleil et dernier verre au **So Lounge Agadir**, un bar rooftop avec une vue spectaculaire sur l'océan pour clôturer votre séjour.
`), 1500));
    }
    
    try {
        const response = await generateContentWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
            }
        });
        return response.text;
    } catch (error) {
        // The error is already logged by generateContentWithRetry.
        // Re-throwing a more specific error for the UI component to catch.
        throw new Error("Failed to generate itinerary from AI after multiple attempts.");
    }
};
