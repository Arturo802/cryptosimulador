package controllers

import (
	"net/http"

	"backend/config"
	"backend/models"

	"github.com/gin-gonic/gin"
)

// GetClientsList permite al administrador listar a todos los clientes registrados
func GetClientsList(c *gin.Context) {
	var users []models.User
	// Buscamos solo los usuarios que tienen rol de cliente
	if result := config.DB.Where("role = ?", "cliente").Find(&users); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la lista de clientes"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// ToggleBlacklist permite congelar o descongelar a un usuario (Lista Negra)
func ToggleBlacklist(c *gin.Context) {
	var input struct {
		UserID    uint `json:"user_id" binding:"required"`
		Blacklist bool `json:"blacklist"` // true para bloquear, false para desbloquear
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := config.DB.First(&user, input.UserID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	// Actualizamos el estado de la lista negra en la base de datos
	user.IsBlacklisted = input.Blacklist
	config.DB.Save(&user)

	statusMsg := "desbloqueado de la lista negra"
	if input.Blacklist {
		statusMsg = "añadido a la lista negra (congelado)"
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Usuario " + statusMsg,
		"user":    user,
	})
}
