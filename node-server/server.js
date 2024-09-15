const express = require("express");
const bodyParser = require("body-parser");
const graphlib = require("graphlib");
const { Graph } = require("graphlib");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.json({ Ping: "Pong" });
});

// POST /pipelines/parse route
app.post("/pipelines/parse", (req, res) => {
  const { nodes, edges } = req.body;

  // Create a directed graph
  const graph = new Graph({ directed: true });

  // Add nodes to the graph
  nodes.forEach((node) => {
    graph.setNode(node.id);
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  // Calculate the number of nodes and edges
  const numNodes = graph.nodeCount();
  const numEdges = graph.edgeCount();

  // Check if the graph is a Directed Acyclic Graph (DAG)
  const isDAG = graphlib.alg.isAcyclic(graph);

  // Return the results
  return res.json({
    num_nodes: numNodes,
    num_edges: numEdges,
    is_dag: isDAG,
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
