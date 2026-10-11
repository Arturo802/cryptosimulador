from fastapi import FastAPI
from pydantic import BaseModel
from strategy import calculate_portfolio_allocation

app = FastAPI(title="CryptoSimulador Quant Bot", version="1.0")

class PortfolioRequest(BaseModel):
    budget: float
    symbols: list[str]

@app.get("/")
def read_root():
    return {"status": "Microservicio de Python activo y conectado con CryptoSimulador"}

@app.post("/api/v1/quant/allocate")
def allocate_portfolio(data: PortfolioRequest):
    """
    Endpoint que recibe el presupuesto y los símbolos desde Go o React
    y devuelve la estrategia cuantitativa calculada.
    """
    result = calculate_portfolio_allocation(data.budget, data.symbols)
    return result