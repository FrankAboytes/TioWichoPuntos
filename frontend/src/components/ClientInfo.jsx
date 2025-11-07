import React from 'react';
import { Link } from 'react-router-dom';

const ClientInfo = ({ client, onBack, onAddPoints, onRedeemPoints }) => {
  return (
    <div className="fade-in">
      <button 
        onClick={onBack}
        className="btn-vaquero-secondary mb-6"
      >
        ← Volver al Inicio
      </button>

      <div className="client-card-vaquero">
        <div className="text-center mb-6">
          <div className="client-avatar">
            🤠
          </div>
          <h2 className="app-title text-2xl mb-2">{client.nombre}</h2>
          <p className="text-gray-600">Cliente de El TioWicho</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <label className="font-semibold">📞 Teléfono:</label>
              <p className="text-lg">{client.telefono}</p>
            </div>
            <div>
              <label className="font-semibold">📧 Email:</label>
              <p className="text-lg">{client.email || 'No especificado'}</p>
            </div>
            <div>
              <label className="font-semibold">🆔 ID Cliente:</label>
              <p className="text-lg font-mono">{client.id}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="puntos-display">
              <div className="puntos-number">{client.puntos_acumulados}</div>
              <div className="text-lg">PUNTOS ACUMULADOS</div>
            </div>
            <div>
              <label className="font-semibold">🤠 Cliente desde:</label>
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

        {/* Acciones Rápidas */}
        <div className="action-grid">
          <button
            onClick={onAddPoints}
            className="action-card btn-vaquero"
          >
            <div className="action-icon">➕</div>
            <div className="action-title">Agregar Puntos</div>
            <div className="action-description">Registrar compra del cliente</div>
          </button>
          
          <button
            onClick={onRedeemPoints}
            disabled={client.puntos_acumulados <= 0}
            className={`action-card ${
              client.puntos_acumulados <= 0 ? 'bg-gray-300' : 'btn-vaquero-secondary'
            }`}
          >
            <div className="action-icon">🎁</div>
            <div className="action-title">Canjear Puntos</div>
            <div className="action-description">
              {client.puntos_acumulados > 0 ? 
                `${client.puntos_acumulados} puntos disponibles` : 
                'Sin puntos disponibles'}
            </div>
          </button>
          
          <Link
            to={`/historial/${client.id}`}
            className="action-card btn-vaquero"
          >
            <div className="action-icon">📊</div>
            <div className="action-title">Ver Historial</div>
            <div className="action-description">Todas las transacciones</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;