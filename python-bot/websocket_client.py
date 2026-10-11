import asyncio
import json
import websockets
import pandas as pd

# Endpoint público del WebSocket de Binance para el precio de BTC en tiempo real
BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@trade"

async def listen_crypto_prices():
    async with websockets.connect(BINANCE_WS_URL) as websocket:
        print("¡Conectado al feed en vivo de Binance WebSocket!")
        prices_buffer = []

        while True:
            response = await websocket.recv()
            data = json.loads(response)
            
            price = float(data['p']) # Precio de la transacción
            quantity = float(data['q']) # Cantidad
            
            prices_buffer.append({"price": price, "quantity": quantity})
            
            # Ejemplo de procesamiento con Pandas cuando juntamos 10 registros
            if len(prices_buffer) >= 10:
                df = pd.DataFrame(prices_buffer)
                moving_average = df['price'].mean()
                print(f"[ANÁLISIS PANDAS] Precio actual: {price} USD | Media móvil (últimos 10): {moving_average:.2f} USD")
                prices_buffer.clear() # Limpiamos el buffer para el siguiente lote

if __name__ == "__main__":
    asyncio.run(listen_crypto_prices())