package models

import (
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	UserID       uint    `gorm:"not null"`
	User         User    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Type         string  `gorm:"not null"`            // 'COMPRA' o 'VENTA'
	CryptoSymbol string  `gorm:"not null"`            // Ej: 'ETH', 'BTC'
	Amount       float64 `gorm:"not null"`            // Cantidad de cripto
	PriceUSD     float64 `gorm:"not null"`            // Precio al momento de la operación
	TotalUSD     float64 `gorm:"not null"`            // Total en dólares
	TxHash       string                              // Hash devuelto por Hardhat / blockchain
	Status       string  `gorm:"default:'PENDIENTE'"` // 'PENDIENTE', 'COMPLETADA', 'RECHAZADA'
}