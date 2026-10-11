package controllers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
)

type QuantRequest struct {
	Budget  float64  `json:"budget" binding:"required"`
	Symbols []string `json:"symbols" binding:"required"`
}

// Instanciamos el cliente gRPC apuntando al servidor de Python en el puerto 50051
var quantClient = services.NewQuantClient("localhost:50051")

// RunQuantStrategy invoca al microservicio de Python mediante gRPC protegido con Circuit Breaker
func RunQuantStrategy(c *gin.Context) {
	var req QuantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Invocamos el servicio gRPC a través del cliente configurado
	result, err := quantClient.CallQuantService(req.Budget, req.Symbols)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "El microservicio de Python (gRPC) no está disponible o el Circuit Breaker está abierto: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}
