package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/config"
	"backend/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.StandardClaims
}

// RegisterInput estructura para recibir datos de registro
type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role"` // 'cliente' o 'administrador'
}

// LoginInput estructura para recibir datos de login
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register registra un nuevo usuario en la base de datos con alta seguridad (Bcrypt Cost 12)
func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Usamos un costo de 12 en bcrypt para mayor robustez ante ataques de fuerza bruta
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al encriptar la contraseña"})
		return
	}

	role := "cliente"
	if input.Role == "administrador" {
		role = "administrador"
	}

	user := models.User{
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		Role:         role,
	}

	if result := config.DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El correo ya está registrado"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuario registrado exitosamente", "role": user.Role})
}

// Login maneja el acceso, control de 3 intentos fallidos y generación de JWT de 15 min con HS512
func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := config.DB.Where("email = ?", input.Email).First(&user); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	// Verificar si el usuario está bloqueado temporalmente por exceder los 3 intentos
	if user.LockUntil != nil && time.Now().Before(*user.LockUntil) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente más tarde."})
		return
	}

	// Validar contraseña
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err != nil {
		// Incrementar contador de intentos fallidos
		user.LoginAttempts++
		
		if user.LoginAttempts >= 3 {
			lockTime := time.Now().Add(15 * time.Minute) // Bloqueo por 15 minutos
			user.LockUntil = &lockTime
			config.DB.Save(&user)
			c.JSON(http.StatusForbidden, gin.H{"error": "Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos."})
			return
		}

		config.DB.Save(&user)
		c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("Credenciales inválidas. Intento %d de 3", user.LoginAttempts)})
		return
	}

	// Si el login es exitoso, reiniciamos los intentos y limpiamos el bloqueo
	user.LoginAttempts = 0
	user.LockUntil = nil
	config.DB.Save(&user)

	// Generar JWT con duración exacta de 15 minutos usando HS512 (SHA-512 robusto)
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey == "" {
		secretKey = "cryptosimulador_super_secure_secret_key_sha512"
	}

	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &Claims{
		Email: user.Email,
		Role:  user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Firma mediante HMAC utilizando SHA-512 (HS512)
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, claims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token de autenticación"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login exitoso",
		"token":   tokenString,
		"expires": "15 minutos",
	})
}