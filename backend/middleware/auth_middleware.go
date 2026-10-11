package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.StandardClaims
}

// AuthRequired verifica que el token JWT sea válido y no haya expirado (15 min)
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token de autorización requerido"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de token inválido. Use Bearer <token>"})
			c.Abort()
			return
		}

		tokenStr := parts[1]
		claims := &Claims{}

		secretKey := os.Getenv("JWT_SECRET")
		if secretKey == "" {
			secretKey = "cryptosimulador_super_secure_secret_key_sha512"
		}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		// Inyectar datos del usuario en el contexto de la petición
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Next()
	}
}

// AdminOnly restringe el acceso únicamente a usuarios con rol 'administrador'
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "administrador" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado. Se requieren privilegios de administrador"})
			c.Abort()
			return
		}
		c.Next()
	}
}
