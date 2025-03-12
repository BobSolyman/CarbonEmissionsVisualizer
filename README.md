# Graph Emissions Calculator

A real-time interactive graph visualization tool for modeling and calculating emissions flow through interconnected nodes. Built with React, TypeScript, and XY Flow.

## Features

- Interactive node-edge graph creation and manipulation
- Real-time emissions calculations and propagation
- Cyberpunk-inspired UI design
- Save and load graph configurations
- Prevent cycles and invalid weight distributions
- Responsive layout with side panel controls

## Tech Stack

- Frontend:

  - React 19
  - TypeScript
  - Material-UI
  - XY Flow (React Flow)
  - Zustand (State Management)
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- MongoDB instance

## Getting Started

1. Clone the repository:

```bash
   git clone git@github.com:BobSolyman/CarbonEmissionsVisualizer.git
   cd CarbonEmissionsVisualizer
```

2. Install dependencies:

```bash
   cd client
   yarn install
   cd ../server
   yarn install
   cd ..
```

3. Configure environment variables:
   Create a `.env` file in the server directory:

```bash
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the development servers:

```bash
    # Start the backend server
   cd server
   yarn dev
   # In a new terminal, start the frontend
   cd client
   yarn dev
```

4. OR start the production servers:

```bash
    # Start the backend server
   cd server
   yarn build
   yarn start
   # In a new terminal, start the frontend
   cd client
   yarn build
   yarn preview
```

## Application Structure

### Graph Components

- **Nodes**: Represent emission sources/destinations with properties:

  - Name: Identifier for the node
  - Weight: Total capacity/throughput
  - Emissions: Current emission value
  - Position: X/Y coordinates on canvas

- **Edges**: Connect nodes and represent emission flow:
  - Weight: Connection capacity
  - Emissions: Calculated based on source node properties

### Core Features

1. **Node Management**

   - Add nodes with custom properties
   - Edit node properties in real-time
   - Delete nodes and automatically update connected edges

2. **Edge Management**

   - Create connections between nodes
   - Automatic emission calculations
   - Prevent invalid connections (cycles, weight limits)

3. **Emission Propagation**
   - Real-time updates throughout the network
   - Automatic recalculation on property changes
   - Validation of emission constraints

### Key Concepts

#### Emission Calculation

Emissions flow through edges is calculated using the formula:

```
Edge Emissions = (Source Node Weight / Edge Weight) Source Node Emissions
```

### Validation Rules

1. Total outbound edge weights cannot exceed node weight
2. Node emissions cannot be set below total incoming emissions
3. Cycles are not allowed in the graph
4. All nodes require a name and weight

## Project Structure

```
/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── stores/ # Zustand state management
│ │ └── services/ # API services
│ └── public/ # Static assets
└── server/ # Backend Node.js application
├── src/
│ ├── routes/ # API routes
│ ├── models/ # MongoDB models
│ ├── utils/ # validatioin and error handling
│ └── controllers/ # Route controllers
└── configs # Server configuration
```
