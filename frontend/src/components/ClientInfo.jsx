import React from 'react';
import { Link } from 'react-router-dom';

const ClientInfo = ({ client, onBack }) => {
  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        ← Volver al escáner
      </button>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          👤 Información del Cliente
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Nombre:</label>
              <p className="text-lg">{client.nombre}</p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">Teléfono:</label>
              <p className="text-lg">{client.telefono}</p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-lg">{client.email || 'No especificado'}</p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">ID Cliente:</label>
              <p className="text-lg font-mono">{client.id}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{client.puntos_acumulados}</div>
              <div className="text-sm">PUNTOS ACUMULADOS</div>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">Cliente desde:</label>
              <p className="text-lg">
                {new Date(client.fecha_registro).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {client.codigo_qr_url && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Código QR del Cliente:</h3>
            <div className="flex justify-center">
              <img 
                src={client.codigo_qr_url} 
                alt="Código QR del cliente"
                className="w-32 h-32 border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to={`/historial/${client.id}`}
          className="card text-center hover:shadow-lg transition-shadow duration-200"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold">Historial</h3>
          <p className="text-sm text-gray-600">Ver transacciones</p>
        </Link>
        
        <button
          onClick={() => window.location.hash = 'add'}
          className="card text-center hover:shadow-lg transition-shadow duration-200 bg-green-50 border-green-200"
        >
          <div className="text-3xl mb-2">➕</div>
          <h3 className="font-semibold">Agregar Puntos</h3>
          <p className="text-sm text-gray-600">Registrar compra</p>
        </button>
        
        <button
          onClick={() => window.location.hash = 'redeem'}
          disabled={client.puntos_acumulados <= 0}
          className={`card text-center hover:shadow-lg transition-shadow duration-200 ${
            client.puntos_acumulados <= 0 
              ? 'bg-gray-100 border-gray-200 text-gray-400' 
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="text-3xl mb-2">🎁</div>
          <h3 className="font-semibold">Canjear Puntos</h3>
          <p className="text-sm text-gray-600">
            {client.puntos_acumulados > 0 ? 'Usar puntos' : 'Sin puntos'}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ClientInfo;