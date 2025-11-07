import React, { useState } from 'react';

const TransactionForm = ({ type, client, onSubmit, onBack }) => {
  const [monto, setMonto] = useState('');
  const [puntos, setPuntos] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'add') {
        await onSubmit(parseFloat(monto), descripcion);
      } else {
        await onSubmit(parseInt(puntos), descripcion);
      }
      
      // Limpiar formulario después de éxito
      setMonto('');
      setPuntos('');
      setDescripcion('');
    } catch (error) {
      console.error('Error en transacción:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPuntosGanados = (monto) => {
    return Math.max(1, Math.ceil(parseFloat(monto || 0) * 0.05));
  };

  return (
    <div className="max-w-md mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        ← Volver
      </button>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          {type === 'add' ? '➕ Agregar Puntos' : '🎁 Canjear Puntos'}
        </h2>
        
        {/* Información del cliente */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600">👤</span>
            </div>
            <div>
              <p className="font-semibold">{client.nombre}</p>
              <p className="text-sm text-gray-600">ID: {client.id}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Puntos disponibles:</span>
            <span className="text-lg font-bold text-primary-600">
              {client.puntos_acumulados} pts
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'add' ? (
            <div>
              <label htmlFor="monto" className="form-label">
                Monto de la compra ($ MXN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  id="monto"
                  step="0.01"
                  min="0"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="form-input pl-8"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                El cliente ganará el 5% del monto como puntos
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="puntos" className="form-label">
                Puntos a canjear
              </label>
              <input
                type="number"
                id="puntos"
                value={puntos}
                onChange={(e) => setPuntos(e.target.value)}
                className="form-input"
                placeholder="0"
                min="1"
                max={client.puntos_acumulados}
                required
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Puntos disponibles: {client.puntos_acumulados}</span>
                {client.puntos_acumulados > 0 && (
                  <button
                    type="button"
                    onClick={() => setPuntos(client.puntos_acumulados.toString())}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Usar todos
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="descripcion" className="form-label">
              Descripción (opcional)
            </label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="form-input"
              placeholder={
                type === 'add' 
                  ? "Ej: Comida para 2 personas" 
                  : "Ej: Canje por postre gratis"
              }
              disabled={loading}
            />
          </div>

          {/* Vista previa */}
          {type === 'add' && monto && parseFloat(monto) > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📊 Vista previa</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Monto de compra:</span>
                  <span className="font-semibold">${parseFloat(monto).toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Puntos a ganar (5%):</span>
                  <span className="font-semibold text-green-600">
                    +{calcularPuntosGanados(monto)} puntos
                  </span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-1 mt-1">
                  <span>Nuevo total:</span>
                  <span className="font-bold">
                    {client.puntos_acumulados + calcularPuntosGanados(monto)} puntos
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'redeem' && puntos && parseInt(puntos) > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Vista previa</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Puntos a canjear:</span>
                  <span className="font-semibold text-red-600">-{puntos} puntos</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                  <span>Nuevo total:</span>
                  <span className="font-bold">
                    {client.puntos_acumulados - parseInt(puntos || 0)} puntos
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || 
              (type === 'add' && (!monto || parseFloat(monto) <= 0)) ||
              (type === 'redeem' && (!puntos || parseInt(puntos) <= 0 || parseInt(puntos) > client.puntos_acumulados))
            }
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              type === 'add' ? '✅ Agregar Puntos' : '🎁 Canjear Puntos'
            )}
          </button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">💡</span>
            <div className="text-sm text-yellow-700">
              <strong>Recordatorio:</strong>{" "}
              {type === 'add' 
                ? 'Los puntos se calculan como el 5% del monto (mínimo 1 punto)'
                : 'Asegúrese de que el cliente esté de acuerdo con el canje'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;