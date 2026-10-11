package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email              string     `gorm:"unique;not null"`
	PasswordHash       string     `gorm:"not null"`
	Role               string     `gorm:"default:'cliente'"` // 'cliente' o 'administrador'
	LoginAttempts      int        `gorm:"default:0"`         // Control de intentos fallidos
	LockUntil          *time.Time                           // Tiempo de bloqueo tras 3 fallos
	IsBlacklisted      bool       `gorm:"default:false"`     // Campo para la lista negra de tokens regulados
	RegulatedTokensBal float64    `gorm:"default:0.0"`       // Balance de tokens regulados institucionales para ampliar límites operativos
}