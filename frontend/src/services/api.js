import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Endpoints de la API
export const API_ENDPOINTS = {
  clientes: {
    registro: '/clientes/registro/',
    detalle: (id) => `/clientes/${id}/`,
    consulta: '/clientes/consulta/',
    buscar: '/clientes/buscar/',
    porQR: '/clientes/qr/buscar/',
    transaccionQR: '/clientes/qr/transaccion/',
    canjeQR: '/clientes/qr/canje/',
  },
  transacciones: {
    crear: '/transacciones/crear/',
    canjear: '/transacciones/canjear/',
    listar: (clienteId) => `/transacciones/cliente/${clienteId}/`,
  },
  puntos: {
    consulta: (clienteId) => `/puntos/consulta/${clienteId}/`,
  },
};

// Funciones helper para la API
export const api = {
  // Clientes
  registrarCliente: (clienteData) => 
    apiClient.post(API_ENDPOINTS.clientes.registro, clienteData),
  
  buscarClientePorTelefono: (telefono) => 
    apiClient.post(API_ENDPOINTS.clientes.consulta, { telefono }),
  
  buscarClientePorQR: (qrData) => 
    apiClient.get(API_ENDPOINTS.clientes.porQR, { params: { qr_data: qrData } }),
  
  buscarClientesPorNombre: (query) => 
    apiClient.get(API_ENDPOINTS.clientes.buscar, { params: { q: query } }),
  
  // Transacciones
  crearTransaccion: (transaccionData) => 
    apiClient.post(API_ENDPOINTS.transacciones.crear, transaccionData),
  
  crearTransaccionPorQR: (qrData, monto, descripcion = '') => 
    apiClient.post(API_ENDPOINTS.clientes.transaccionQR, {
      qr_data: qrData,
      monto: monto,
      descripcion: descripcion
    }),
  
  canjearPuntos: (canjeData) => 
    apiClient.post(API_ENDPOINTS.transacciones.canjear, canjeData),
  
  canjearPuntosPorQR: (qrData, puntos, descripcion = '') => 
    apiClient.post(API_ENDPOINTS.clientes.canjeQR, {
      qr_data: qrData,
      puntos_a_canjear: puntos,
      descripcion: descripcion
    }),
  
  obtenerTransacciones: (clienteId) => 
    apiClient.get(API_ENDPOINTS.transacciones.listar(clienteId)),
  
  // Puntos
  consultarPuntos: (clienteId) => 
    apiClient.get(API_ENDPOINTS.puntos.consulta(clienteId)),
};