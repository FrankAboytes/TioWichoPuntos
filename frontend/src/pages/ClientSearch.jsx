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
      setError(error.response?.data?.error || 'Error al buscar clientes');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSearch = async () => {
    if (!query.trim() || query.length < 10) {
      setError('Ingrese un teléfono válido (mínimo 10 dígitos)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.buscarClientePorTelefono({ telefono: query });
      setResults([response.data]);
    } catch (error) {
      setError('Cliente no encontrado con ese teléfono');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔍 Buscar Clientes</h1>
          <p className="text-gray-600">Encuentre clientes por nombre o teléfono</p>
        </div>
        <Link to="/registro" className="btn-primary">
          👤 Nuevo Cliente
        </Link>
      </div>

      {/* Formulario de búsqueda */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search" className="form-label">
              Buscar por nombre o teléfono
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-input flex-1"
                placeholder="Ej: Juan Pérez o +525512345678"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Buscando...' : '🔍 Buscar'}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-500">O</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div>
            <button
              type="button"
              onClick={handlePhoneSearch}
              disabled={loading || !query.trim()}
              className="btn-secondary w-full disabled:opacity-50"
            >
              📞 Buscar solo por teléfono
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📋 Resultados de la búsqueda ({results.length})
          </h2>
          
          <div className="space-y-4">
            {results.map((cliente) => (
              <div key={cliente.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{cliente.nombre}</h3>
                    <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <strong>Teléfono:</strong> {cliente.telefono}
                      </div>
                      <div>
                        <strong>Email:</strong> {cliente.email || 'No especificado'}
                      </div>
                      <div>
                        <strong>Puntos:</strong> {cliente.puntos_acumulados}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>ID:</strong> {cliente.id} • 
                      <strong> Registrado:</strong> {new Date(cliente.fecha_registro).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/historial/${cliente.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Historial
                    </Link>
                    <button
                      onClick={() => {
                        // Aquí podrías implementar la funcionalidad para usar este cliente
                        alert(`Cliente ${cliente.nombre} seleccionado`);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                    >
                      Usar
                    </button>
                  </div>
                </div>

                {cliente.codigo_qr_url && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Código QR:</span>
                      <img 
                        src={cliente.codigo_qr_url} 
                        alt="QR" 
                        className="w-16 h-16 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && query && !loading && !error && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-gray-600 mb-4">
            No hay clientes que coincidan con "{query}"
          </p>
          <Link to="/registro" className="btn-primary">
            Registrar Nuevo Cliente
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;