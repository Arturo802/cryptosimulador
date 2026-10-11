package services

import (
	"context"
	"fmt"
	"log"
	"time"

	pb "backend/proto"

	"github.com/sony/gobreaker"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type QuantClient struct {
	address string
	cb      *gobreaker.CircuitBreaker
}

func NewQuantClient(address string) *QuantClient {
	var st gobreaker.Settings
	st.Name = "PythonQuantService"
	st.MaxRequests = 3
	st.Interval = time.Second * 10
	st.Timeout = time.Second * 5
	st.ReadyToTrip = func(counts gobreaker.Counts) bool {
		failureRatio := float64(counts.TotalFailures) / float64(counts.Requests)
		return counts.Requests >= 3 && failureRatio >= 0.6
	}

	return &QuantClient{
		address: address,
		cb:      gobreaker.NewCircuitBreaker(st),
	}
}

// CallQuantService realiza la llamada gRPC al servidor de Python protegiéndola con Circuit Breaker
func (q *QuantClient) CallQuantService(budget float64, symbols []string) (map[string]interface{}, error) {
	result, err := q.cb.Execute(func() (interface{}, error) {
		conn, err := grpc.Dial(q.address, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			return nil, fmt.Errorf("error al conectar con el servidor gRPC: %v", err)
		}
		defer conn.Close()

		client := pb.NewQuantServiceClient(conn)

		ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
		defer cancel()

		req := &pb.PortfolioRequest{
			Budget:  budget,
			Symbols: symbols,
		}

		log.Printf("[gRPC CLIENT + CIRCUIT BREAKER] Enviando petición a Python para presupuesto: %.2f", budget)

		// Llamada al método real definido en quant.proto
		resp, err := client.CalculatePortfolio(ctx, req)
		if err != nil {
			return nil, fmt.Errorf("error en la ejecución remota de gRPC: %v", err)
		}

		// Log para inspeccionar la respuesta cruda de protobuf
		log.Printf("[gRPC CLIENT] Respuesta bruta recibida de Python: %+v", resp)

		// Inicializamos la lista explícitamente como un slice vacío
		items := make([]map[string]interface{}, 0)

		if resp != nil && resp.GetPortfolio() != nil {
			for _, item := range resp.GetPortfolio() {
				items = append(items, map[string]interface{}{
					"ticker":               item.GetTicker(),
					"price":                item.GetPrice(),
					"shares_to_buy":        item.GetSharesToBuy(),
					"allocated_investment": item.GetAllocatedInvestment(),
				})
			}
		}

		log.Printf("[gRPC CLIENT] Items mapeados listos para enviar al frontend: %+v", items)

		return map[string]interface{}{
			"status":    "success",
			"portfolio": items,
		}, nil
	})

	if err != nil {
		log.Printf("[CIRCUIT BREAKER ALERTA] Circuito abierto o fallo en gRPC: %v", err)
		return nil, err
	}

	return result.(map[string]interface{}), nil
}
