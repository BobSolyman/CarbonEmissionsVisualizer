import { Request, Response } from "express";
import Graph from "../models/graphModel";

// Save graph configuration
export const saveGraph = async (req: Request, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;
    const graph = new Graph({ name, nodes, edges });
    await graph.save();
    res.status(201).json(graph);
  } catch (err) {
    res.status(500).json({ message: "Failed to save graph", error: err });
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
    const { name, nodes, edges } = req.body;
    const graph = await Graph.findByIdAndUpdate(
      req.params.id,
      { name, nodes, edges, updatedAt: Date.now() },
      { new: true }
    );
    if (!graph) {
      return res.status(404).json({ message: "Graph not found" });
    }
    res.json(graph);
  } catch (err) {
    res.status(500).json({ message: "Failed to update graph", error: err });
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
