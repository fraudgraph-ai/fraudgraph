from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter(prefix="/datasets", tags=["Dataset Registry"])

@router.get("/", response_model=List[Dict[str, Any]])
def list_datasets():
    return [
        {
            "id": "ibm_amlsim_500k",
            "name": "IBM AMLSim 500K",
            "type": "Synthetic Agent Simulation",
            "currency": "TRY",
            "nodes_count": 8,
            "edges_count": 9,
            "typologies": ["Layering", "Smurfing", "Circular Routing"]
        },
        {
            "id": "elliptic_plus_plus",
            "name": "Elliptic++ Bitcoin Forensics",
            "type": "On-Chain Cryptocurrency Graph",
            "currency": "BTC",
            "nodes_count": 4,
            "edges_count": 3,
            "typologies": ["Mixer Hops", "Peeling Chains", "Exchange Desposits"]
        },
        {
            "id": "transxion_aml",
            "name": "TransXion Dynamic AML",
            "type": "Dynamic Multi-Bank Ecosystem",
            "currency": "USD",
            "nodes_count": 8,
            "edges_count": 9,
            "typologies": ["Cross-Border Wires", "Shell Companies"]
        }
    ]
