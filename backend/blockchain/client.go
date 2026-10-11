package blockchain

import (
	"context"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/ethclient"
)

// Client envuelve al cliente de Ethereum
type Client struct {
	Conn *ethclient.Client
}

// NewClient se conecta al nodo Ethereum mediante RPC (HTTP o WebSockets)
func NewClient(rpcURL string) (*Client, error) {
	conn, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("no se pudo conectar al nodo Ethereum: %v", err)
	}

	log.Println("¡Conexión exitosa al nodo Ethereum!")
	return &Client{Conn: conn}, nil
}

// GetLatestBlock consulta el número del bloque actual en la red
func (bc *Client) GetLatestBlock(ctx context.Context) (uint64, error) {
	header, err := bc.Conn.HeaderByNumber(ctx, nil)
	if err != nil {
		return 0, fmt.Errorf("error al obtener el bloque actual: %v", err)
	}
	return header.Number.Uint64(), nil
}
