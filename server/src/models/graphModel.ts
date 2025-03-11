import mongoose, { Schema, Document } from "mongoose";

interface INode {
  id: string;
  name: string;
  weight: number;
  emissions: number;
  position: { x: number; y: number };
}

interface IEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  emissions: number;
}

interface IGraph extends Document {
  name: string;
  nodes: INode[];
  edges: IEdge[];
  createdAt: Date;
  updatedAt: Date;
}

const GraphSchema: Schema = new Schema({
  name: { type: String, required: true },
  nodes: [
    {
      id: String,
      name: String,
      weight: Number,
      emissions: Number,
      position: { type: Object, required: true },
    },
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      weight: Number,
      emissions: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGraph>("Graph", GraphSchema);
