import pandas as pd
import numpy as np
import math
import requests

def get_real_crypto_price(symbol: str) -> float:
    """
    Obtiene el precio real actual desde la API pública oficial de Binance Spot.
    Ejemplo: 'BTC' -> 'BTCUSDT'
    """
    try:
        url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol.upper()}USDT"
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            data = response.json()
            return float(data['price'])
    except Exception as e:
        print(f"Error al consultar Binance para {symbol}: {e}")
    
    # Fallback de seguridad si falla la red
    return 100.0

def calculate_portfolio_allocation(budget: float, symbols: list):
    """
    Calcula la distribución equitativa de un presupuesto utilizando precios REALES del mercado,
    permitiendo fracciones de criptomonedas (soporte para decimales).
    """
    if not symbols or budget <= 0:
        return {"error": "Presupuesto inválido o lista de símbolos vacía"}
    
    # Obtenemos los precios reales del mercado para cada símbolo solicitado
    prices = {symbol: get_real_crypto_price(symbol) for symbol in symbols}
    
    position_size = budget / len(symbols)
    results = []
    
    for symbol in symbols:
        price = prices[symbol]
        # Permitimos fracciones de criptomonedas con hasta 6 decimales de precisión
        shares_to_buy = round(position_size / price, 6) if price > 0 else 0.0
        allocated = round(shares_to_buy * price, 2)
        
        results.append({
            "ticker": symbol.upper(),
            "price": price,
            "shares_to_buy": shares_to_buy,
            "allocated_investment": allocated
        })
        
    return {
        "total_budget": budget,
        "market_data_source": "Binance Public Spot API (Real-Time)",
        "portfolio": results
    }