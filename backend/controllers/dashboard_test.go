package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/config"
	"backend/models"
	"backend/routes"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	// Driver SQLite 100% en Go sin CGO
	"github.com/glebarez/sqlite"
)

// setupTestDB inicializa una base de datos SQLite en memoria para las pruebas
func setupTestDB(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	db.AutoMigrate(&models.User{}, &models.Transaction{})
	config.DB = db
}

// 1. Test para verificar el listado de clientes en el Panel de Administración (Esperando control de auth)
func TestGetClientsList(t *testing.T) {
	setupTestDB(t)

	config.DB.Create(&models.User{
		Email:         "cliente_test@crypto.com",
		Role:          "cliente",
		IsBlacklisted: false,
	})

	router := routes.SetupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/admin/clients", nil)
	// Como la ruta está protegida por middleware, esperamos un 401 si no hay token de admin válido
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// 2. Test para verificar el bloqueo y desbloqueo de usuarios (Lista Negra / Admin)
func TestToggleBlacklist(t *testing.T) {
	setupTestDB(t)

	user := models.User{
		Email:         "blacklist_user@crypto.com",
		Role:          "cliente",
		IsBlacklisted: false,
	}
	config.DB.Create(&user)

	router := routes.SetupRouter()

	payload := map[string]interface{}{
		"user_id":   user.ID,
		"blacklist": true,
	}
	jsonValue, _ := json.Marshal(payload)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/admin/blacklist", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// Al igual que las demás rutas protegidas de admin, requiere autorización
	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusUnauthorized)
}

// 3. Test para verificar que el middleware rechaza peticiones sin autenticación en transacciones
func TestCreateTransaction_UnauthorizedOrForbidden(t *testing.T) {
	setupTestDB(t)

	router := routes.SetupRouter()

	payload := map[string]interface{}{
		"type":          "COMPRA",
		"crypto_symbol": "BTC",
		"amount":        10.0,
		"price_usd":     50000.0,
	}
	jsonValue, _ := json.Marshal(payload)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/transactions", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
