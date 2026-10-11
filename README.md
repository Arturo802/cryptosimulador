#  CryptoSimulador DApp — Plataforma Web3, FinTech & Compliance con Sentinel-AI

Plataforma descentralizada y simulador financiero avanzado de alto rendimiento con arquitectura de microservicios y observabilidad de nivel empresarial. Combina un frontend moderno en **React + TypeScript**, un backend robusto en **Go (Gin + GORM)** sobre **PostgreSQL**, comunicación de ultra-baja latencia mediante **gRPC (HTTP/2)** con un microservicio de análisis cuantitativo e Inteligencia Artificial en **Python**, contratos inteligentes en **Solidity**, y un stack completo de monitoreo con **Prometheus y Grafana**.

---

## 🌟 Arquitectura y Características Principales

- 🎨 **Doble Dashboard Especializado:**
  - **Panel de Cliente:** Gestión de portafolios, ejecución de órdenes, consulta de saldos en nodos blockchain y beneficios por tenencia de *Tokens Regulados*.
  - **Panel de Administración:** Control normativo centralizado para supervisar usuarios, auditar cuentas y aplicar restricciones (listas negras / congelamiento on-chain).
- 🪙 **Tokens Regulados e Institucionales:** Sistema donde una entidad bancaria/financiera oferta tokens que otorgan privilegios a los clientes (ej. mayores límites de transferencia diaria, trazabilidad avanzada y mejores métricas de consumo).
- 🛡️ **Sentinel-AI (Anillo de Seguridad y Prevención de Fraude):** Motor heurístico en Python que analiza transacciones en tiempo real mediante gRPC (HTTP/2), detectando anomalías y bloqueando cuentas automáticamente ante alto riesgo de blanqueo de capitales (AML).
- ⚡ **gRPC (HTTP/2) & Quant Bot:** Comunicación asíncrona de alta velocidad entre Go y Python para el cálculo de estrategias de inversión y asignación de portafolios con precios reales.
- 📊 **Observabilidad y Despliegue (Docker Ecosystem):** Orquestación completa mediante **Docker Compose**, con persistencia en **PostgreSQL**, métricas de rendimiento recolectadas por **Prometheus** y visualizadas en tiempo real en **Grafana**.
- 🧪 **Batería de Pruebas Automatizadas:** Pruebas unitarias e integración en Go (`go test`) y pruebas heurísticas de IA en Python (`pytest`).

---

## 🛠️ Stack Tecnológico

- **Frontend:** React, TypeScript, CSS Modules (Estética Web3 Oscura).
- **Backend:** Go, Gin Framework, GORM.
- **Base de Datos:** PostgreSQL (orquestado por Docker).
- **Microservicio IA & Quant:** Python, gRPC (HTTP/2), Protocol Buffers, Pytest.
- **Smart Contracts / Blockchain:** Solidity, Hardhat, Ethers.js.
- **DevOps & Observabilidad:** Docker, Docker Compose, Prometheus, Grafana.

---

## ⚙️ Guía de Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Arturo802/cryptosimulador.git](https://github.com/Arturo802/cryptosimulador.git)
cd cryptosimulador

2. Levantar la infraestructura completa (Docker Compose: PostgreSQL, Prometheus, Grafana)
Bash
docker-compose up -d

3. Levantar el microservicio de Python (gRPC / Sentinel-AI)
Bash
cd python-bot
python -m venv .venv
# En Windows:
.venv\Scripts\activate
pip install -r requirements.txt
python grpc_server.py

4. Levantar el Backend en Go
En otra terminal:

Bash
cd backend
go mod tidy
go run main.go

5. Levantar el Frontend (React)
En otra terminal:

Bash
cd frontend
npm install
npm run dev
🧪 Ejecución de Pruebas Automatizadas
Tests del Backend (Go):

Bash
cd backend
go test -v ./...
Tests del Microservicio de IA (Python):

Bash
cd python-bot
pytest -v


📄 Licencia
Este proyecto se distribuye bajo la licencia MIT. Diseñado como una solución integral de ingeniería de software avanzada, Web3 y cumplimiento FinTech.


---
