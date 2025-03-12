import { Request, Response } from "express";
import { GraphSchema } from "../utils/validation";
import {
  validateGraphData,
  verifyEmissionsCalculations,
} from "../utils/graphValidation";
import Graph from "../models/graphModel";

// Save graph configuration
export const saveGraph = async (req: Request, res: Response) => {
  try {
    // First validate schema
    const parseResult = GraphSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid graph data structure",
        details: parseResult.error.errors,
      });
    }

    // Validate graph consistency
    const validationErrors = validateGraphData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Graph validation failed",
        details: validationErrors,
      });
    }

    // Verify calculations
    const calculationErrors = verifyEmissionsCalculations(req.body);
    if (calculationErrors.length > 0) {
      return res.status(400).json({
        error: "Emissions calculations mismatch",
        details: calculationErrors,
      });
    }

    const graph = new Graph(req.body);
    await graph.save();
    res.status(201).json(graph);
  } catch (error) {
    res.status(500).json({ error: "Failed to save graph" });
  }
};

// Load graph configuration
export const loadGraph = async (req: Request, res: Response) => {
  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) {
      return res.status(404).json({ message: "Graph not found" });
    }
    res.json(graph);
  } catch (err) {
    res.status(500).json({ message: "Failed to load graph", error: err });
  }
};

// List all saved graphs
export const listGraphs = async (req: Request, res: Response) => {
  try {
    const graphs = await Graph.find();
    res.json(graphs);
  } catch (err) {
    res.status(500).json({ message: "Failed to list graphs", error: err });
  }
};

// Update graph configuration
export const updateGraph = async (req: Request, res: Response) => {
  try {
    // Schema validation
    const parseResult = GraphSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid graph data structure",
        details: parseResult.error.errors,
      });
    }

    // Graph consistency validation
    const validationErrors = validateGraphData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Graph validation failed",
        details: validationErrors,
      });
    }

    // Calculations verification
    const calculationErrors = verifyEmissionsCalculations(req.body);
    if (calculationErrors.length > 0) {
      return res.status(400).json({
        error: "Emissions calculations mismatch",
        details: calculationErrors,
      });
    }

    const graph = await Graph.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!graph) {
      return res.status(404).json({ error: "Graph not found" });
    }

    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: "Failed to update graph" });
  }
};

// Delete graph configuration
export const deleteGraph = async (req: Request, res: Response) => {
  try {
    const graph = await Graph.findByIdAndDelete(req.params.id);
    if (!graph) {
      return res.status(404).json({ message: "Graph not found" });
    }
    res.json({ message: "Graph deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete graph", error: err });
  }
};
