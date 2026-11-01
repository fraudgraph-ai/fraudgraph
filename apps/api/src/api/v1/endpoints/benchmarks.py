from typing import List, Dict, Any
from fastapi import APIRouter
from src.core.benchmark_runner import benchmark_runner

router = APIRouter(prefix="/benchmarks", tags=["Empirical Benchmarking"])

@router.get("/leaderboard", response_model=List[Dict[str, Any]])
def get_benchmark_leaderboard():
    return benchmark_runner.get_leaderboard()

@router.post("/run", response_model=Dict[str, Any])
def run_benchmark_suite():
    return benchmark_runner.run_benchmark_suite()
