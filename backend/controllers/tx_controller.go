package controllers

import (
	"net/http"

	"backend/config"
	"backend/models"

	"github.com/gin-gonic/gin"
)

type TransactionInput struct {
	Type         string  `json:"type" binding:"required"`          // 'COMPRA' o 'VENTA'
	CryptoSymbol string  `json:"crypto_symbol" binding:"required"` // Ej: 'ETH', 'BTC'
	Amount       float64 `json:"amount" binding:"required"`        // Cantidad
	PriceUSD     float64 `json:"price_usd" binding:"required"`     // Precio unitario en USD
}

// CreateTransaction registra una compra o venta de cripto para el usuario autenticado bajo supervisión de Sentinel-AI
func CreateTransaction(c *gin.Context) {
	var input TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Obtener el email del usuario desde el contexto inyectado por el middleware JWT
	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudo identificar al usuario en la sesión"})
		return
	}

	var user models.User
	if result := config.DB.Where("email = ?", email).First(&user); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado en la base de datos"})
		return
	}

	// 1. Verificar si el usuario ya se encuentra congelado (Blacklist / Centinela previo)
	if user.IsBlacklisted {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: Su cuenta se encuentra congelada preventivamente por políticas de cumplimiento (Sentinel-AI / AML)."})
		return
	}

	totalUSD := input.Amount * input.PriceUSD

	// Umbral de seguridad base de la IA
	threshold := 50000.0

	// Lógica de Tokens Regulados (Activo Institucional): 
	// Si el usuario posee tokens regulados institucionales (> 100 tokens), se le otorga un Tier superior 
	// permitiéndole operar con montos de hasta $250,000 diarios sin disparar el bloqueo de la IA.
	if user.RegulatedTokensBal > 100.0 {
		threshold = 250000.0
	}

	// 2. Motor de Inteligencia Artificial: Sentinel-AI Heuristics (Prevención de Fraude y AML)
	if totalUSD > threshold || (input.CryptoSymbol == "PEPE" && totalUSD > 10000) {
		// ¡Alerta Sentinel-AI! Bloqueo automático y congelamiento preventivo de la cuenta
		user.IsBlacklisted = true
		config.DB.Save(&user)

		c.JSON(http.StatusForbidden, gin.H{
			"error": "🚨 [Sentinel-AI Triggered]: Transacción bloqueada por superar el límite autorizado para su nivel de cumplimiento. Cuenta congelada preventivamente.",
		})
		return
	}

	tx := models.Transaction{
		UserID:       user.ID,
		Type:         input.Type,
		CryptoSymbol: input.CryptoSymbol,
		Amount:       input.Amount,
		PriceUSD:     input.PriceUSD,
		TotalUSD:     totalUSD,
		TxHash:       "0x_mock_hardhat_tx_hash", // Enlace al hash real de Hardhat/go-ethereum
		Status:       "COMPLETADA",
	}

	if result := config.DB.Create(&tx); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar la transacción en la base de datos"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Transacción validada y aprobada por Sentinel-AI con éxito",
		"transaction": tx,
	})
}

// GetUserTransactions lista todas las transacciones del usuario autenticado
func GetUserTransactions(c *gin.Context) {
	email, _ := c.Get("email")
	var user models.User
	if result := config.DB.Where("email = ?", email).First(&user); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	var transactions []models.Transaction
	// Si no hay transacciones, GORM inicializa el slice vacío sin dar error
	config.DB.Where("user_id = ?", user.ID).Find(&transactions)

	// Nos aseguramos de devolver siempre un slice (aunque esté vacío, nunca nil) para evitar fallos en el frontend
	if transactions == nil {
		transactions = []models.Transaction{}
	}

	c.JSON(http.StatusOK, transactions)
}