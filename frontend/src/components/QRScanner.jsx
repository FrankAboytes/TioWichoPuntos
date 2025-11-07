import React, { useState, useRef } from 'react';

const QRScanner = ({ onScan, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const qrCode = prompt(
        'Procesamiento de QR por imagen no disponible aún.\n\nPor favor, ingrese manualmente el código QR (formato: TIOWICHO:123):',
        'TIOWICHO:'
      );
      
      if (qrCode && qrCode.trim()) {
        onScan(qrCode.trim());
      }
    } catch (error) {
      setError('Error al procesar el código QR');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualEntry = () => {
    const qrCode = prompt(
      'Ingrese el código QR del cliente (formato: TIOWICHO:123):',
      'TIOWICHO:'
    );
    
    if (qrCode && qrCode.trim()) {
      onScan(qrCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📷 Escanear Código QR</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📸</div>
            <h3 className="font-semibold mb-2">Subir imagen del QR</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tome una foto del código QR y súbala aquí
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-file"
            />
            <label
              htmlFor="qr-file"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-block cursor-pointer"
            >
              {loading ? 'Procesando...' : 'Seleccionar Imagen'}
            </label>
          </div>

          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
            <div className="text-4xl mb-2">⌨️</div>
            <h3 className="font-semibold mb-2">Ingresar código manualmente</h3>
            <p className="text-sm text-gray-600 mb-3">
              Si tiene el código QR en texto, ingréselo aquí
            </p>
            <button
              onClick={handleManualEntry}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Ingresar Código Manualmente
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Formato esperado:</strong> TIOWICHO:123
              <br />
              <strong>Ejemplo:</strong> TIOWICHO:456
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;