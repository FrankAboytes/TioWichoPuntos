# 🤠 Tío Wicho Puntos

Sistema de fidelización y puntos para el negocio **"Tío Wicho"**. Escanea QR, acumula puntos, canjea recompensas.

---

## 📋 ¿Qué hace?

| Funcionalidad | Descripción |
|---------------|-------------|
| 📷 **Escaneo QR** | Identifica clientes al instante con código QR desde la cámara |
| 🧾 **Registro de clientes** | Alta de nuevos clientes con generación automática de QR |
| 💰 **Acumulación de puntos** | Cada compra suma puntos automáticamente al cliente |
| 🎁 **Canje de puntos** | Los clientes canjean puntos por productos/recompensas |
| 📊 **Historial** | Registro completo de transacciones por cliente |
| 🔍 **Búsqueda** | Buscar clientes por nombre o teléfono |

---

## 🏗️ Arquitectura

```
┌──────────────────────┐       ┌─────────────────────┐
│   Frontend (React)    │──────▶│  Backend (Django)    │
│   Vite + Tailwind     │  REST │  DRF + PostgreSQL   │
│   Puerto 5173         │       │  Puerto 8000         │
└──────────────────────┘       └─────────────────────┘
          │                            │
    📷 html5-qrcode              🗄️ Modelos:
    📱 qrcode.react               - Clientes
    🎨 Tailwind CSS               - Transacciones
                                  - Puntos
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + Vite |
| Estilos | Tailwind CSS |
| Router | React Router DOM |
| HTTP | Axios |
| QR Reader | html5-qrcode |
| QR Generator | qrcode.react |
| Backend | Django REST Framework (DRF) |

---

## 🚀 Quick Start

```bash
# 1. Clonar
git clone https://github.com/FrankAboytes/TioWichoPuntos.git
cd TioWichoPuntos/frontend

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env
# Edita VITE_API_URL=http://localhost:8000/api

# 4. Iniciar frontend
npm run dev
```

> ⚠️ Necesitas el backend corriendo en `localhost:8000` para funcionalidad completa.

---

## 📁 Estructura del proyecto

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ClientInfo.jsx       # Tarjeta de información del cliente
│   │   ├── Navbar.jsx           # Barra de navegación
│   │   ├── QRGenerator.jsx      # Generador de código QR
│   │   ├── QRScanner.jsx        # Escáner QR con cámara
│   │   └── TransactionForm.jsx  # Formulario de compra/canje
│   ├── pages/
│   │   ├── Dashboard.jsx        # Panel principal con acciones rápidas
│   │   ├── ClientRegistration.jsx  # Registro de nuevo cliente
│   │   ├── ClientSearch.jsx     # Búsqueda de clientes
│   │   └── TransactionHistory.jsx  # Historial de transacciones
│   ├── services/
│   │   └── api.js               # Cliente HTTP + endpoints
│   ├── App.jsx                  # Router principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales
├── package.json
└── vite.config.js
```

---

## 📡 Endpoints del backend (esperados)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/clientes/registro/` | Registrar nuevo cliente |
| `POST` | `/api/clientes/consulta/` | Buscar por teléfono |
| `GET` | `/api/clientes/qr/buscar/` | Buscar por QR |
| `GET` | `/api/clientes/buscar/` | Búsqueda por nombre |
| `POST` | `/api/transacciones/crear/` | Registrar compra |
| `POST` | `/api/transacciones/canjear/` | Canjear puntos |
| `GET` | `/api/transacciones/cliente/:id/` | Historial del cliente |
| `GET` | `/api/puntos/consulta/:id/` | Consultar puntos |

---

## 🎨 Flujo de uso

```
1. Cliente llega al negocio
        │
2. Mostrar QR del cliente  ←──  📷 Escanear con la app
        │
3. App reconoce al cliente automáticamente
        │
4. Registrar compra → puntos sumados
        │         │
        │    ┌────▼────┐
        │    │ CANJEAR  │ ←── El cliente quiere usar sus puntos
        │    └─────────┘
        │
5. Ver historial de transacciones
```

---

## 🧑‍💻 Autor

**Frank Aboytes (Darko)**
- GitHub: [@FrankAboytes](https://github.com/FrankAboytes)
- Proyecto universitario — Sistema de fidelización para negocio local

---

🟡 **Nota:** Este repositorio contiene el frontend. El backend Django REST Framework se encuentra en un repositorio separado.
