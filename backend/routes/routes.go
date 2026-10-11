package routes

import (
	"net/http"

	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Middleware de CORS para permitir la comunicación segura con el Frontend (Vite)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Endpoint para Prometheus / métricas (Evita los errores 404 continuos en consola)
	r.GET("/metrics", func(c *gin.Context) {
		c.String(http.StatusOK, "# HELP crypto_simulador_uptime Estado operativo del backend\n# TYPE crypto_simulador_uptime gauge\ncrypto_simulador_uptime 1\n")
	})

	// Grupo principal de la API versión 1
	api := r.Group("/api/v1")
	{
		// Ruta de comprobación de salud
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "success",
				"message": "¡El backend modular de CryptoSimulador opera al 100%!",
			})
		})

		// Rutas públicas de Autenticación (IAM)
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Rutas protegidas (Requieren token JWT válido)
		protected := api.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			// Endpoints de Transacciones (Compra/Venta)
			protected.POST("/transactions", controllers.CreateTransaction)
			protected.GET("/transactions", controllers.GetUserTransactions)

			// Endpoint para el Bot Cuantitativo en Python
			protected.POST("/quant/allocate", controllers.RunQuantStrategy)

			// Endpoint para consultar el balance del Token Regulado en la DApp
			protected.GET("/blockchain/balance/:address", controllers.GetTokenBalanceController)

			// Grupo exclusivo para Administradores
			admin := protected.Group("/admin")
			admin.Use(middleware.AdminOnly())
			{
				admin.GET("/dashboard", func(c *gin.Context) {
					c.JSON(http.StatusOK, gin.H{
						"message": "Panel de administración exclusivo accedido con éxito",
					})
				})
				
				// Endpoints de gestión de clientes y listas negras
				admin.GET("/clients", controllers.GetClientsList)
				admin.POST("/blacklist", controllers.ToggleBlacklist)
			}
		}
	}

	return r
}