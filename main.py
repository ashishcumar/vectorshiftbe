from fastapi import FastAPI, Form, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import networkx as nx

app = FastAPI()

# Model for the request body (nodes and edges)
class PipelineData(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline_data: PipelineData):
    nodes = pipeline_data.nodes
    edges = pipeline_data.edges
    
    # Create a directed graph using NetworkX
    graph = nx.DiGraph()

    # Add nodes
    for node in nodes:
        graph.add_node(node['id'])
    
    # Add edges
    for edge in edges:
        graph.add_edge(edge['source'], edge['target'])

    num_nodes = len(graph.nodes)
    num_edges = len(graph.edges)
    
    # Check if the graph is a Directed Acyclic Graph (DAG)
    is_dag = nx.is_directed_acyclic_graph(graph)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }