import axios from "axios";
import { Node, Edge } from "../stores/useGraphStore";

type GraphData = {
  _id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
};

const BASE_URL = "http://localhost:5000/api/graph";

export const graphService = {
  async loadGraphs(): Promise<GraphData[]> {
    const response = await axios.get(`${BASE_URL}/list`);
    return response.data;
  },

  async loadGraph(id: string): Promise<GraphData> {
    const response = await axios.get(`${BASE_URL}/load/${id}`);
    return response.data;
  },

  async saveGraph(data: {
    name: string;
    nodes: Node[];
    edges: Edge[];
  }): Promise<GraphData> {
    const response = await axios.post(`${BASE_URL}/save`, data);
    return response.data;
  },

  async updateGraph(
    id: string,
    data: { name: string; nodes: Node[]; edges: Edge[] }
  ): Promise<GraphData> {
    const response = await axios.put(`${BASE_URL}/update/${id}`, data);
    return response.data;
  },

  async deleteGraph(id: string): Promise<void> {
    await axios.delete(`${BASE_URL}/delete/${id}`);
  },
};
