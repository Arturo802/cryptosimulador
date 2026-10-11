package main

import (
	"log"
	"os"

	"backend/blockchain"
	"backend/config"
	"backend/models"
	"backend/routes"

	"github.com/joho/godotenv"
	"backend/utils"
)

func main() {
	// Cargar variables de entorno desde el archivo .env
	_ = godotenv.Load()

	// 1. Inicializar conexión a PostgreSQL (Puerto 5433)
	config.ConnectDB()

	// 2. Ejecutar Migraciones Automáticas de GORM (Crea tablas User y Transaction automáticamente)
	err := config.DB.AutoMigrate(&models.User{}, &models.Transaction{})
	if err != nil {
		log.Fatalf("Error crítico al ejecutar migraciones en la base de datos: %v", err)
	}
	log.Println("¡Tablas migradas y sincronizadas con éxito en PostgreSQL!")

	// 3. Ejecutar el Seeder de usuarios iniciales (Solo si la BD está vacía)
	utils.SeedUsers()

	// 4. Verificar conexión con el nodo de Hardhat (Opcional al arranque)
	rpcURL := os.Getenv("ETHEREUM_RPC_URL")
	if rpcURL == "" {
		rpcURL = "http://127.0.0.1:8545"
	}
	_, err = blockchain.NewClient(rpcURL)
	if err != nil {
		log.Printf("Aviso: El nodo local de Hardhat no está activo en este momento: %v", err)
	} else {
		log.Println("¡Cliente Web3 vinculado correctamente con Hardhat!")
	}

	// 5. Configurar enrutador global
	r := routes.SetupRouter()

	// 6. Levantar servidor HTTP
	serverPort := os.Getenv("PORT")
	if serverPort == "" {
		serverPort = "8080"
	}

	log.Printf("Servidor corriendo y escuchando en el puerto %s...\n", serverPort)
	r.Run(":" + serverPort)
}