import express, { Application } from "express";

import cors from 'cors';
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { medicineRouter } from "./modules/medicines/medicine.router";
import { categoryRouter } from "./modules/medicines/categories/category.router";


const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000", // client side url
  credentials: true
}))

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("medistore server is running from and this comment is on app.ts file");
});

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use("/api", medicineRouter)
app.use("/api", categoryRouter)

app.use(notFound)
app.use(errorHandler)



export default app;