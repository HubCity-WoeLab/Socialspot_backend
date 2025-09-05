import { Router } from "express";
import { listAds, getAd, createAd, updateAd, deleteAd } from "./ad.controller";

const router = Router();

router.get("/", listAds);

// IMPORTANT: La route /random DOIT être avant /:id
// sinon Express interprétera "random" comme un ID
router.get("/random", async (req, res) => {
  try {
    console.log("Route /random appelée");
    
    // Créer des objets req/res mock pour appeler listAds
    const mockReq = req;
    const mockRes = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data })
    };
    
    // Récupérer toutes les pubs via votre controller
    const ads = await listAds(mockReq, mockRes as any);
    
    if (Array.isArray(ads) && ads.length > 0) {
      // Choisir une pub aléatoire
      const randomIndex = Math.floor(Math.random() * ads.length);
      const randomAd = ads[randomIndex];
      console.log("Pub aléatoire sélectionnée:", randomAd);
      res.json(randomAd);
    } else {
      // Pub de test si aucune n'existe dans la DB
      console.log("Aucune pub en DB, retour d'une pub test");
      const testAd = {
        id: "test-ad-1",
        ad_type: "video",
        content: {
          link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Pub de test",
          description: "Une publicité de démonstration"
        }
      };
      res.json(testAd);
    }
  } catch (error) {
    console.error("Erreur dans /random:", error);
    
    // En cas d'erreur, retourner une pub par défaut
    const defaultAd = {
      id: "default-ad",
      ad_type: "video",
      content: {
        link: "https://example.com",
        title: "Publicité par défaut",
        description: "Pub affichée en cas d'erreur"
      }
    };
    res.json(defaultAd);
  }
});

router.get("/:id", getAd);
router.post("/", createAd);
router.put("/:id", updateAd);
router.delete("/:id", deleteAd);

export default router;