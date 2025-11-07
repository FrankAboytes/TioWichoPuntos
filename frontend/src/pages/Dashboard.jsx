import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import ClientInfo from '../components/ClientInfo';
import TransactionForm from '../components/TransactionForm';
import { api } from '../services/api';

const Dashboard = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQRScan = async (qrData) => {
    setShowScanner(false);
    setLoading(true);
    setError('');

    try {
      const response = await api.buscarClientePorQR(qrData);
      setCurrentClient(response.data);
      setActiveTab('cliente');
    } catch (error) {
      setError(error.response?.data?.error || '🤠 Cliente no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '📷',
      title: 'Escanear QR',
      description: 'Identificar cliente con código QR',
      action: () => setShowScanner(true),
      color: 'btn-vaquero'
    },
    {
      icon: '🔍',
      title: 'Buscar Cliente',
      description: 'Buscar por nombre o teléfono',
      action: () => window.location.href = '/buscar',
      color: 'btn-vaquero-secondary'
    },
    {
      icon: '🤠',
      title: 'Nuevo Cliente',
      description: 'Registrar nuevo cliente',
      action: () => window.location.href = '/registro',
      color: 'btn-vaquero-success'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Header Principal */}
      <div className="text-center mb-8">
        <h1 className="app-title text-4xl mb-4">🤠 Sistema de Puntos</h1>
        <p className="text-xl text-gray-600">
          Gestión rápida para meseros - Identifique clientes en segundos
        </p>
      </div>

      {error && (
        <div className="card-vaquero bg-red-100 border-red-300 text-red-700 mb-6">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Panel Principal para Meseros */}
      {activeTab === 'inicio' && (
        <div className="mesero-actions">
          <h2 className="section-title text-center text-2xl mb-6">Acciones Rápidas</h2>
          
          <div className="action-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`action-card ${action.color} action-button-large`}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-title">{action.title}</div>
                <div className="action-description">{action.description}</div>
              </button>
            ))}
          </div>

          {/* Cliente Actual (si hay uno) */}
          {currentClient && (
            <div className="card-vaquero mt-6">
              <h3 className="text-xl font-bold mb-4">👤 Cliente Actual</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{currentClient.nombre}</p>
                  <p className="text-gray-600">{currentClient.telefono}</p>
                </div>
                <div className="puntos-display">
                  <div className="puntos-number">{currentClient.puntos_acumulados}</div>
                  <div>puntos</div>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <button 
                  onClick={() => setActiveTab('agregar')}
                  className="btn-vaquero flex-1"
                >
                  ➕ Agregar Puntos
                </button>
                <button 
                  onClick={() => setActiveTab('canjear')}
                  className="btn-vaquero-secondary flex-1"
                >
                  🎁 Canjear Puntos
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sección de Cliente */}
      {activeTab === 'cliente' && currentClient && (
        <ClientInfo 
          client={currentClient} 
          onBack={() => setActiveTab('inicio')}
          onAddPoints={() => setActiveTab('agregar')}
          onRedeemPoints={() => setActiveTab('canjear')}
        />
      )}

      {/* Formularios */}
      {activeTab === 'agregar' && currentClient && (
        <TransactionForm
          type="add"
          client={currentClient}
          onSubmit={async (monto, descripcion) => {
            try {
              const qrData = `TIOWICHO:${currentClient.id}`;
              await api.crearTransaccionPorQR(qrData, monto, descripcion);
              const clienteActualizado = await api.buscarClientePorQR(qrData);
              setCurrentClient(clienteActualizado.data);
              setActiveTab('cliente');
              alert('✅ Puntos agregados exitosamente!');
            } catch (error) {
              alert('❌ Error al agregar puntos');
            }
          }}
          onBack={() => setActiveTab('cliente')}
        />
      )}

      {activeTab === 'canjear' && currentClient && (
        <TransactionForm
          type="redeem"
          client={currentClient}
          onSubmit={async (puntos, descripcion) => {
            try {
              const qrData = `TIOWICHO:${currentClient.id}`;
              await api.canjarPuntosPorQR(qrData, puntos, descripcion);
              const clienteActualizado = await api.buscarClientePorQR(qrData);
              setCurrentClient(clienteActualizado.data);
              setActiveTab('cliente');
              alert('✅ Puntos canjeados exitosamente!');
            } catch (error) {
              alert('❌ Error al canjear puntos');
            }
          }}
          onBack={() => setActiveTab('cliente')}
        />
      )}

      {/* Scanner QR */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="card-vaquero text-center">
            <div className="text-4xl mb-4">🤠</div>
            <p className="text-xl">Buscando cliente...</p>
            <p className="text-gray-600 mt-2">Por favor espere</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;