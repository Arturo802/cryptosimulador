package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetTokenBalanceController consulta el saldo real de tokens regulados para una dirección dada
func GetTokenBalanceController(c *gin.Context) {
	walletAddress := c.Param("address")

	if walletAddress == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La dirección de la wallet es obligatoria"})
		return
	}

	// Simulamos un saldo dinámico basado en el texto ingresado (ej. longitud del texto * 350.50)
	dynamicAmount := float64(len(walletAddress)) * 350.50
	mockBalance := fmt.Sprintf("%.2f", dynamicAmount)

	c.JSON(http.StatusOK, gin.H{
		"address": walletAddress,
		"balance": mockBalance,
		"token":   "REGULATED_TOKEN",
	})
}