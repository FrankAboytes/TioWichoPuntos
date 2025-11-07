import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const TransactionHistory = () => {
  const { clienteId } = useParams();
  const [transacciones, setTransacciones] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar información del cliente
        const clienteResponse = await api.buscarClientePorQR(`TIOWICHO:${clienteId}`);
        setCliente(clienteResponse.data);
        
        // Cargar historial de transacciones
        const transaccionesResponse = await api.obtenerTransacciones(clienteId);
        setTransacciones(transaccionesResponse.data);
        
      } catch (error) {
        setError('Error al cargar el historial');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      cargarDatos();
    }
  }, [clienteId]);

  const getTipoBadge = (tipo) => {
    const tipos = {
      compra: { color: 'bg-green-100 text-green-800', label: 'COMPRA' },
      canje: { color: 'bg-blue-100 text-blue-800', label: 'CANJE' },
      ajuste: { color: 'bg-yellow-100 text-yellow-800', label: 'AJUSTE' }
    };
    
    const config = tipos[tipo] || { color: 'bg-gray-100 text-gray-800', label: tipo };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getIcono = (tipo) => {
    const iconos = {
      compra: '🛒',
      canje: '🎁',
      ajuste: '⚙️'
    };
    return iconos[tipo] || '📄';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="btn-primary">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/" className="text-gray-600 hover:text-gray-800 mb-2 inline-block">
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📊 Historial de Transacciones</h1>
        </div>
        
        {cliente && (
          <div className="text-right">
            <p className="font-semibold">{cliente.nombre}</p>
            <p className="text-sm text-gray-600">Puntos: {cliente.puntos_acumulados}</p>
          </div>
        )}
      </div>

      {/* Información del cliente */}
      {cliente && (
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-xl">👤</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">{cliente.nombre}</h2>
                <p className="text-gray-600">{cliente.telefono}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {cliente.puntos_acumulados}
              </div>
              <div className="text-sm text-gray-500">PUNTOS TOTALES</div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {transacciones.length}
          </div>
          <div className="text-sm text-gray-600">Total Transacciones</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {transacciones.filter(t => t.tipo === 'compra').length}
          </div>
          <div className="text-sm text-gray-600">Compras Realizadas</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {transacciones.filter(t => t.tipo === 'canje').length}
          </div>
          <div className="text-sm text-gray-600">Canjes Realizados</div>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Todas las Transacciones</h2>
        
        {transacciones.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No hay transacciones registradas
            </h3>
            <p className="text-gray-600">
              Este cliente aún no tiene transacciones en el sistema.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transacciones.map((transaccion) => (
              <div key={transaccion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getIcono(transaccion.tipo)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {getTipoBadge(transaccion.tipo)}
                        <span className="text-sm text-gray-500">
                          {new Date(transaccion.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {transaccion.descripcion && (
                        <p className="text-gray-800 mb-1">{transaccion.descripcion}</p>
                      )}
                      
                      <div className="flex space-x-4 text-sm text-gray-600">
                        {transaccion.tipo === 'compra' && (
                          <>
                            <span>Monto: <strong>${parseFloat(transaccion.monto).toFixed(2)}</strong></span>
                            <span>Puntos ganados: <strong className="text-green-600">+{transaccion.puntos_ganados}</strong></span>
                          </>
                        )}
                        {transaccion.tipo === 'canje' && (
                          <span>Puntos usados: <strong className="text-red-600">-{transaccion.puntos_usados}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {transaccion.puntos_totales} pts
                    </div>
                    <div className="text-xs text-gray-500">saldo después</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;