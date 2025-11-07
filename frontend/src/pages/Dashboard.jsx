import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import ClientInfo from '../components/ClientInfo';
import TransactionForm from '../components/TransactionForm';
import { api } from '../services/api';

const Dashboard = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQRScan = async (qrData) => {
    setShowScanner(false);
    setLoading(true);
    setError('');

    try {
      const response = await api.buscarClientePorQR(qrData);
      setCurrentClient(response.data);
      setActiveTab('info');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al buscar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async (monto, descripcion) => {
    try {
      const qrData = `TIOWICHO:${currentClient.id}`;
      const response = await api.crearTransaccionPorQR(qrData, monto, descripcion);
      
      // Actualizar información del cliente
      const clienteActualizado = await api.buscarClientePorQR(qrData);
      setCurrentClient(clienteActualizado.data);
      
      alert(`✅ Puntos agregados exitosamente!\nPuntos ganados: ${response.data.puntos_ganados}`);
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || 'Error al agregar puntos'));
    }
  };

  const handleRedeemPoints = async (puntos, descripcion) => {
    try {
      const qrData = `TIOWICHO:${currentClient.id}`;
      await api.canjarPuntosPorQR(qrData, puntos, descripcion);
      
      // Actualizar información del cliente
      const clienteActualizado = await api.buscarClientePorQR(qrData);
      setCurrentClient(clienteActualizado.data);
      
      alert(`✅ Puntos canjeados exitosamente!\nPuntos usados: ${puntos}`);
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || 'Error al canjear puntos'));
    }
  };

  const resetDashboard = () => {
    setCurrentClient(null);
    setActiveTab('scan');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        🍖 Sistema de Puntos - El TioWicho
      </h1>
      <p className="text-gray-600 mb-8">
        Gestión de puntos para clientes - Escanee QR para comenzar
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs de Navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'scan' 
                ? 'border-b-2 border-primary-500 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('scan')}
          >
            📷 Escanear QR
          </button>
          
          {currentClient && (
            <>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'info' 
                    ? 'border-b-2 border-primary-500 text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                👤 Información
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'add' 
                    ? 'border-b-2 border-primary-500 text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('add')}
              >
                ➕ Agregar Puntos
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'redeem' 
                    ? 'border-b-2 border-primary-500 text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('redeem')}
              >
                🎁 Canjear Puntos
              </button>
            </>
          )}
        </div>

        <div className="p-6">
          {/* Tab: Escanear QR */}
          {activeTab === 'scan' && (
            <div className="text-center">
              {!currentClient ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-6">
                    <div className="text-6xl mb-4">📱</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Escanear Código QR del Cliente
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Use el escáner para identificar al cliente rápidamente
                    </p>
                    <button
                      onClick={() => setShowScanner(true)}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      Abrir Escáner de QR
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="card">
                      <h3 className="font-bold text-lg mb-2">🔍 Buscar por Teléfono</h3>
                      <p className="text-gray-600 mb-4">
                        Si el cliente no tiene QR, búsquelo por número telefónico
                      </p>
                      <a 
                        href="/buscar" 
                        className="btn-secondary"
                      >
                        Buscar Cliente
                      </a>
                    </div>
                    
                    <div className="card">
                      <h3 className="font-bold text-lg mb-2">👤 Registrar Nuevo</h3>
                      <p className="text-gray-600 mb-4">
                        Cliente nuevo? Regístrelo en el sistema primero
                      </p>
                      <a 
                        href="/registro" 
                        className="btn-primary"
                      >
                        Registrar Cliente
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <div className="text-4xl mb-2">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Cliente Identificado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {currentClient.nombre} está listo para operaciones
                    </p>
                  </div>
                  <button
                    onClick={resetDashboard}
                    className="btn-secondary"
                  >
                    Escanear Otro Cliente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab: Información del Cliente */}
          {activeTab === 'info' && currentClient && (
            <ClientInfo 
              client={currentClient} 
              onBack={resetDashboard}
            />
          )}

          {/* Tab: Agregar Puntos */}
          {activeTab === 'add' && currentClient && (
            <TransactionForm
              type="add"
              client={currentClient}
              onSubmit={handleAddPoints}
              onBack={() => setActiveTab('info')}
            />
          )}

          {/* Tab: Canjear Puntos */}
          {activeTab === 'redeem' && currentClient && (
            <TransactionForm
              type="redeem"
              client={currentClient}
              onSubmit={handleRedeemPoints}
              onBack={() => setActiveTab('info')}
            />
          )}
        </div>
      </div>

      {/* Modal del Escáner QR */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando cliente...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;