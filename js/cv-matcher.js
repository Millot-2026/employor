// Base de données des 4 profils de CV
const cvDatabase = {
    profiles: {
        cv1_dev: {
            title: "Intégrateur Web & Dev Front-End",
            keywords: ["html", "css", "javascript", "php", "wcag", "accessibilité", "firebase", "o2switch", "front-end", "intégration", "code"],
            summary: "Focus sur le code rigoureux, l'accessibilité WCAG et les déploiements multi-plateformes."
        },
        cv2_uiux: {
            title: "Designer UI/UX & Ergonome Web",
            keywords: ["ui", "ux", "ergonomie", "wireframes", "parcours", "utilisateurs", "illustrator", "adobe", "design", "interfaces"],
            summary: "Focus sur l'ergonomie, les parcours utilisateurs et le wireframing."
        },
        cv3_pao: {
            title: "Graphiste PAO & Multimédia",
            keywords: ["pao", "print", "graphisme", "vectoriel", "illustrator", "indesign", "after effects", "motion", "studio", "adobe"],
            summary: "Valorisation de la chaîne graphique, de la suite Adobe et des vecteurs."
        },
        cv4_master: {
            title: "Master CV / Full Profil",
            keywords: ["stratégie", "commercial", "gestion", "polyvalence", "direction", "studio", "entreprise", "adaptabilité"],
            summary: "L'intégralité du parcours et des projets sur une base exhaustive."
        }
    }
};

// Fonction de calcul de correspondance
function calculateMatching(jobTextContent) {
    if (!jobTextContent) return [];
    
    const textLower = jobTextContent.toLowerCase();
    let results = [];

    for (const [key, profile] of Object.entries(cvDatabase.profiles)) {
        let matchCount = 0;
        profile.keywords.forEach(keyword => {
            if (textLower.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        });

        let score = Math.min(Math.round((matchCount / profile.keywords.length) * 100), 100);
        if (matchCount > 0 && score < 30) score = 30;

        results.push({
            profileKey: key,
            title: profile.title,
            summary: profile.summary,
            score: score
        });
    }

    return results.sort((a, b) => b.score - a.score);
}