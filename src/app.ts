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

// ✅ SOLUTION: CORS élargi pour Flutter Web
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://localhost:8080',  // Flutter Web port par défaut
    'http://localhost:8081',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    // Ajoutez d'autres ports si nécessaire
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Middleware pour les requêtes preflight
app.options('*', cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

// ✅ SOLUTION: Route de test pour vérifier la connectivité
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ 
    message: "Backend connected successfully!", 
    timestamp: new Date().toISOString() 
  });
});

export default app;