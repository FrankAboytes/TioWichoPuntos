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
        
        const clienteResponse = await api.buscarClientePorQR(`TIOWICHO:${clienteId}`);
        setCliente(clienteResponse.data);
        
        const transaccionesResponse = await api.obtenerTransacciones(clienteId);
        setTransacciones(transaccionesResponse.data);
        
      } catch (error) {
        setError('❌ Error al cargar el historial del vaquero');
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
      compra: { color: 'bg-green-100 text-green-800 border-green-300', label: '🛒 COMPRA', icon: '🛒' },
      canje: { color: 'bg-blue-100 text-blue-800 border-blue-300', label: '🎁 CANJE', icon: '🎁' },
      ajuste: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: '⚙️ AJUSTE', icon: '⚙️' }
    };
    
    const config = tipos[tipo] || { color: 'bg-gray-100 text-gray-800 border-gray-300', label: tipo, icon: '📄' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-vaquero text-center py-16">
            <div className="text-6xl mb-4">🤠</div>
            <p className="text-xl text-gray-600">Buscando historial del vaquero...</p>
            <p className="text-gray-500 mt-2">Consultando el libro de cuentas del saloon</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-vaquero text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Alto ahí, vaquero!</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/" className="btn-vaquero-large">
              🏠 Volver al Saloon Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="btn-vaquero-secondary mb-4 inline-block">
            ← Volver al Saloon
          </Link>
          <h1 className="app-title text-3xl mb-2">📊 Historial del Vaquero</h1>
          <p className="text-xl text-gray-600">Todas las transacciones en El TioWicho</p>
        </div>

        {/* Información del cliente */}
        {cliente && (
          <div className="card-vaquero mb-8 text-center">
            <div className="client-avatar mx-auto mb-4 bg-yellow-500">
              🤠
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{cliente.nombre}</h2>
            <p className="text-gray-600 mb-4">📞 {cliente.telefono}</p>
            
            <div className="puntos-display mx-auto max-w-xs">
              <div className="puntos-number">{cliente.puntos_acumulados}</div>
              <div className="text-lg font-semibold">PUNTOS ACUMULADOS</div>
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-vaquero text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{transacciones.length}</div>
            <div className="text-sm text-gray-600 font-semibold">Total de Transacciones</div>
          </div>
          
          <div className="card-vaquero text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {transacciones.filter(t => t.tipo === 'compra').length}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Compras en el Saloon</div>
          </div>
          
          <div className="card-vaquero text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {transacciones.filter(t => t.tipo === 'canje').length}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Recompensas Canjeadas</div>
          </div>
        </div>

        {/* Lista de transacciones */}
        <div className="card-vaquero">
          <h2 className="section-title text-center text-xl mb-6">📋 Libro de Transacciones</h2>
          
          {transacciones.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                El vaquero aún no tiene historial
              </h3>
              <p className="text-gray-600">
                Este vaquero no ha realizado transacciones en el saloon todavía.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transacciones.map((transaccion) => (
                <div key={transaccion.id} className="card-vaquero hover:shadow-lg transition-all duration-300 border-l-4 border-yellow-400">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTipoBadge(transaccion.tipo)}
                        <span className="text-sm text-gray-500 font-semibold">
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
                        <p className="text-gray-800 font-medium mb-2">{transaccion.descripcion}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {transaccion.tipo === 'compra' && (
                          <>
                            <span className="font-semibold">💵 Monto: <span className="text-green-600">${parseFloat(transaccion.monto).toFixed(2)} MXN</span></span>
                            <span className="font-semibold">⭐ Puntos ganados: <span className="text-green-600">+{transaccion.puntos_ganados}</span></span>
                          </>
                        )}
                        {transaccion.tipo === 'canje' && (
                          <span className="font-semibold">🎁 Puntos usados: <span className="text-red-600">-{transaccion.puntos_usados}</span></span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {transaccion.puntos_totales} pts
                      </div>
                      <div className="text-xs text-gray-500 font-semibold">saldo después</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;