package utils

import (
	"log"

	"backend/config"
	"backend/models"

	"golang.org/x/crypto/bcrypt"
)

// SeedUsers inserta usuarios predeterminados (Admin y Cliente) solo si no existen
func SeedUsers() {
	// 1. Verificar si ya existe un Administrador
	var adminCount int64
	config.DB.Model(&models.User{}).Where("role = ?", "administrador").Count(&adminCount)

	if adminCount == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Admin123*"), 12)
		if err != nil {
			log.Printf("Error al encriptar contraseña del administrador seed: %v", err)
			return
		}

		admin := models.User{
			Email:        "admin@cryptosimulador.com",
			PasswordHash: string(hashedPassword),
			Role:         "administrador",
		}
		
		if err := config.DB.Create(&admin).Error; err == nil {
			log.Println("🌱 [Seed]: Usuario Administrador creado exitosamente (admin@cryptosimulador.com / Admin123*)")
		}
	}

	// 2. Verificar si ya existe un Cliente de prueba
	var clientCount int64
	config.DB.Model(&models.User{}).Where("role = ?", "cliente").Count(&clientCount)

	if clientCount == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Cliente123*"), 12)
		if err != nil {
			log.Printf("Error al encriptar contraseña del cliente seed: %v", err)
			return
		}

		client := models.User{
			Email:        "cliente@cryptosimulador.com",
			PasswordHash: string(hashedPassword),
			Role:         "cliente",
		}

		if err := config.DB.Create(&client).Error; err == nil {
			log.Println("🌱 [Seed]: Usuario Cliente creado exitosamente (cliente@cryptosimulador.com / Cliente123*)")
		}
	}
}