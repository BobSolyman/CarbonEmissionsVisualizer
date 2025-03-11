export type Node = {
  id: string;
  name: string;
  weight: number;
  emissions: number;
  position: { x: number; y: number };
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  emissions: number;
};

export type GraphStore = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  actions: {
    setGraphName: (name: string) => void;
    addNode: (node: Node) => void;
    updateNode: (id: string, props: Partial<Node>) => void;
    deleteNode: (id: string) => void;
    addEdge: (edge: Edge) => void;
    updateEdge: (id: string, props: Partial<Edge>) => void;
    deleteEdge: (id: string) => void;
    setSelectedNode: (id: string | null) => void;
    setSelectedEdge: (id: string | null) => void;
    setGraphId: (id: string) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
  };
};
