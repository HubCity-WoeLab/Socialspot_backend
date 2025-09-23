// // //import express from "express";
// // import express, { Request, Response } from "express";

// // import cors from "cors";
// // import dotenv from "dotenv";
// // import authRoutes from "./app/modules/auth/auth.routes";
// // import adRoutes from "./app/modules/ad/ad.routes";
// // dotenv.config();

// // const app = express();
// // app.use(cors({ origin: process.env.CLIENT_URL || true }));
// // app.use(express.json());

// // app.use("/api/auth", authRoutes);
// // app.use("/api/ads", adRoutes);

// // //app.get("/", (req, res) => res.send("API is running"));
// // app.get("/", (req: Request, res: Response) => {
// //   res.send("API is running");
// // });

// // export default app;

// // app.ts
// import express, { Request, Response } from "express";
// import cors from "cors";
// import authRoutes from "./app/modules/auth/auth.routes";
// import adRoutes from "./app/modules/ad/ad.routes";

// const app = express();

// // app.use(cors({ origin: process.env.CLIENT_URL || true }));

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], // ports Flutter Web possibles
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/ads", adRoutes);

// app.get("/", (req: Request, res: Response) => {
//   res.send("API is running");
// });

// export default app;
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./app/modules/auth/auth.routes";
import adRoutes from "./app/modules/ad/ad.routes";

const app = express();

// Configuration CORS pour Flutter Web et autres clients
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://localhost:8080',  // Flutter Web port par défaut
    'http://localhost:8081',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    // Ports Flutter Web aléatoires vus dans les logs
    'http://127.0.0.1:55875',
    'http://localhost:55875',
    'http://127.0.0.1:56752', 
    'http://localhost:56752',
    // Pattern pour accepter tous les ports localhost en développement
    /^http:\/\/127\.0\.0\.1:\d+$/,
    /^http:\/\/localhost:\d+$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// Middleware pour les requêtes preflight
app.options('*', cors());

// Middleware de parsing JSON
app.use(express.json());

// Middleware de logging pour débuguer les requêtes
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  console.log(`Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
  
  if (req.method === 'POST' && req.body) {
    console.log(`Body:`, req.body);
  }
  
  next();
});

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);

// Route racine
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "SocialSpot API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Route de test pour vérifier la connectivité
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ 
    message: "Backend connected successfully!", 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']
  });
});

// Route de test pour l'inscription (temporaire - à supprimer en production)
app.post("/api/auth/signup-test", (req: Request, res: Response) => {
  console.log("Test signup reçu:", req.body);
  res.json({ 
    success: true, 
    message: "Test inscription réussi depuis Flutter Web!",
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    timestamp: new Date().toISOString()
  });
});

// Route 404 pour les endpoints non trouvés
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} non trouvée`,
    timestamp: new Date().toISOString()
  });
});

export default app;