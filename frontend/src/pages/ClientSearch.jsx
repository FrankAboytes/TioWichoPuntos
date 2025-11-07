import React, { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const ClientSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.buscarClientesPorNombre(query);
      setResults(response.data.clientes || []);
    } catch (error) {
      setError('❌ ' + (error.response?.data?.error || 'Error al buscar vaqueros'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSearch = async () => {
    if (!query.trim() || query.length < 10) {
      setError('📞 Ingrese un teléfono válido del rancho (mínimo 10 dígitos)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.buscarClientePorTelefono({ telefono: query });
      setResults([response.data]);
    } catch (error) {
      setError('🤠 Vaquero no encontrado con ese teléfono');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="app-title text-3xl mb-2">🔍 Buscar Vaqueros</h1>
          <p className="text-xl text-gray-600">Encuentre vaqueros por nombre o teléfono del rancho</p>
        </div>

        {/* Acciones rápidas */}
        <div className="flex justify-center mb-8">
          <Link to="/registro" className="btn-vaquero-large">
            🤠 Nuevo Vaquero
          </Link>
        </div>

        {/* Formulario de búsqueda */}
        <div className="card-vaquero mb-8">
          <h2 className="section-title text-center text-xl mb-6">🔍 Buscar en el Saloon</h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="form-group-vaquero">
              <label htmlFor="search" className="form-label-vaquero">
                Buscar por nombre o teléfono
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="form-input-vaquero flex-1"
                  placeholder="Ej: Juan Pérez o +525512345678"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="btn-vaquero disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? '🔍 Buscando...' : '🔍 Buscar Vaqueros'}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500 font-semibold">O</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePhoneSearch}
                disabled={loading || !query.trim()}
                className="btn-vaquero-secondary w-full disabled:opacity-50"
              >
                📞 Buscar solo por teléfono
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="font-semibold">{error}</p>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="card-vaquero">
            <h2 className="section-title text-center text-xl mb-6">
              📋 Vaqueros Encontrados ({results.length})
            </h2>
            
            <div className="space-y-6">
              {results.map((cliente) => (
                <div key={cliente.id} className="card-vaquero hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-yellow-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="client-avatar bg-yellow-500">
                        🤠
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{cliente.nombre}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📞 {cliente.telefono}</p>
                          <p>📧 {cliente.email || 'Sin correo'}</p>
                          <p>🆔 ID: {cliente.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="puntos-display inline-block">
                        <div className="puntos-number">{cliente.puntos_acumulados}</div>
                        <div className="text-sm">puntos</div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Link
                          to={`/historial/${cliente.id}`}
                          className="btn-vaquero text-sm"
                        >
                          📊 Historial
                        </Link>
                        <button
                          onClick={() => {
                            // Aquí podrías implementar la funcionalidad para usar este cliente
                            alert(`🤠 Vaquero ${cliente.nombre} seleccionado para acción`);
                          }}
                          className="btn-vaquero-secondary text-sm"
                        >
                          🎯 Usar
                        </button>
                      </div>
                    </div>
                  </div>

                  {cliente.codigo_qr_url && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-2">Código QR del Vaquero:</p>
                      <img 
                        src={cliente.codigo_qr_url} 
                        alt="QR Code" 
                        className="w-20 h-20 border-2 border-gray-300 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && query && !loading && !error && (
          <div className="card-vaquero text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron vaqueros
            </h3>
            <p className="text-gray-600 mb-6">
              No hay vaqueros que coincidan con "{query}"
            </p>
            <Link to="/registro" className="btn-vaquero-large">
              🤠 Registrar Nuevo Vaquero
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSearch;