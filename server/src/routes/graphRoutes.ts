// src/routes/graphRoutes.ts
import express, { RequestHandler } from "express";
import {
  saveGraph,
  loadGraph,
  listGraphs,
  updateGraph,
  deleteGraph,
} from "@controllers/graphController";

const router = express.Router();

// Save graph configuration
router.post("/save", saveGraph as RequestHandler);

// Load graph configuration
router.get("/load/:id", loadGraph as RequestHandler);

// List all saved graphs
router.get("/list", listGraphs as RequestHandler);

// Update graph configuration
router.put("/update/:id", updateGraph as RequestHandler);

// Delete graph configuration
router.delete("/delete/:id", deleteGraph as RequestHandler);

export default router;
