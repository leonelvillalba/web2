import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API Routes
  app.get("/api/dashboard", (req, res) => {
    res.json({
      userName: "Julián",
      balance: 142500.00,
      monthlySpending: 3142.00,
      budget: 4200.00,
      savingsGoals: [
        { id: 1, name: "European Summer", target: 8000, current: 6000, color: "#006c47" },
        { id: 2, name: "Emergency Fund", target: 20000, current: 8400, color: "#001736" },
        { id: 3, name: "Tesla Model Y", target: 55000, current: 6600, color: "#00b4d8" }
      ],
      recentActivity: [
        { id: 1, merchant: "Apple Store", date: "24 de mayo", amount: -14.99, category: "Suscripciones", type: "expense" },
        { id: 2, merchant: "Salario Mensual", date: "22 de mayo", amount: 6400.00, category: "Ingresos", type: "income" },
        { id: 3, merchant: "The Green Table", date: "21 de mayo", amount: -82.40, category: "Restaurantes", type: "expense" }
      ],
      spendingDistribution: [
        { name: "Vivienda", value: 60, color: "#001736" },
        { name: "Comida y Restaurantes", value: 25, color: "#006c47" },
        { name: "Transporte", value: 15, color: "#6ffbbe" }
      ]
    });
  });

  app.get("/api/insights", (req, res) => {
    res.json({
      potentialSavings: 1420.00,
      financialHealth: 94.2,
      spendingVelocity: [
        { month: "Ene", actual: 2100, forecast: 2200 },
        { month: "Feb", actual: 2400, forecast: 2300 },
        { month: "Mar", actual: 1900, forecast: 2100 },
        { month: "Abr", actual: 2800, forecast: 2500 },
        { month: "May", actual: 3142, forecast: 2900 },
        { month: "Jun", actual: null, forecast: 3000 }
      ],
      aiMessage: "Su fondo de emergencia actual cubre 4,2 meses. Si reasigna $200 de cenas fuera a sus ahorros de alto rendimiento, alcanzará su meta de 6 meses para septiembre."
    });
  });

  app.get("/api/advisor/clients", (req, res) => {
    res.json([
      { id: 1, name: "Elena Rodriguez", focus: "Crecimiento", assets: 1200000, change: 12.4, budgetAdherence: 85, status: "Excelente" },
      { id: 2, name: "Marcus Chen", focus: "Preservación", assets: 842000, change: -2.1, budgetAdherence: 110, status: "Fuera de presupuesto" },
      { id: 3, name: "Sarah Jenkins", focus: "Ingresos", assets: 2400000, change: 4.2, budgetAdherence: 92, status: "Excelente" },
      { id: 4, name: "David Miller", focus: "Crecimiento Agresivo", assets: 410000, change: 18.9, budgetAdherence: 88, status: "Excelente" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
