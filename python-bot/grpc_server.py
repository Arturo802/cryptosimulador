import grpc
from concurrent import futures
import traceback

# Importamos los archivos generados por el compilador protoc
import quant_pb2
import quant_pb2_grpc
from strategy import calculate_portfolio_allocation

# Módulo Sentinel-AI: Motor heurístico de evaluación de riesgo y AML
def evaluate_transaction_risk(user_id: int, amount: float, price_usd: float, crypto_symbol: str) -> dict:
    total_value = amount * price_usd
    risk_score = 15.0 # Riesgo base bajo
    flags = []

    # Regla 1: Transacciones de alto valor (Alerta regulatoria / Whales)
    if total_value > 50000:
        risk_score += 75.0
        flags.append("MONTO_ELEVADO_SUPERIOR_A_50K")

    # Regla 2: Activos especulativos combinados con montos significativos
    if crypto_symbol in ["PEPE", "SHIB"] and total_value > 10000:
        risk_score += 30.0
        flags.append("ALTA_VOLATILIDAD_ACTIVO_ESPECULATIVO")

    # Regla 3: Patrones repetitivos o anomalías comportamentales
    if total_value == 1000 or total_value == 500:
        risk_score += 10.0

    risk_score = min(risk_score, 100.0)

    status = "APROBADO"
    if risk_score >= 70.0:
        status = "BLOQUEAR_AUTOMATICO"
    elif risk_score >= 40.0:
        status = "AUDITORIA_REQUERIDA"

    return {
        "user_id": user_id,
        "risk_score": risk_score,
        "status": status,
        "flags": flags,
        "ai_recommendation": "Sentinel-AI detectó anomalía comportamental." if flags else "Operación segura."
    }

class QuantServicer(quant_pb2_grpc.QuantServiceServicer):
    def CalculatePortfolio(self, request, context):
        print(f"[gRPC SERVER] Petición recibida de Go. Presupuesto: {request.budget}, Símbolos: {request.symbols}")
        
        try:
            # Ejecutamos la lógica cuantitativa con precios reales
            result = calculate_portfolio_allocation(request.budget, list(request.symbols))
            
            if "error" in result:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details(result["error"])
                return quant_pb2.PortfolioResponse()
            
            # Mapeamos la respuesta al formato del contrato Protocol Buffers usando .add()
            response = quant_pb2.PortfolioResponse()
            for item in result["portfolio"]:
                p_item = response.portfolio.add()
                p_item.ticker = item["ticker"]
                p_item.price = item["price"]
                p_item.shares_to_buy = item["shares_to_buy"]
                p_item.allocated_investment = item["allocated_investment"]
                
            print(f"[gRPC SERVER] Cálculo finalizado con éxito. Devolviendo {len(response.portfolio)} elementos.")
            return response
            
        except Exception as e:
            print(f"[gRPC SERVER ERROR] Ocurrió una excepción interna: {e}")
            traceback.print_exc()
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return quant_pb2.PortfolioResponse()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    quant_pb2_grpc.add_QuantServiceServicer_to_server(QuantServicer(), server)
    
    # El servidor gRPC corre en el puerto 50051
    server.add_insecure_port('[::]:50051')
    server.start()
    print("¡Servidor gRPC de Python (con Sentinel-AI integrado) corriendo y escuchando en el puerto 50051!")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()