import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_QR_CODE,
          Html5QrcodeScanType.SCAN_TYPE_CAMERA
        ]
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Escaneo exitoso
        setScanning(false);
        scanner.clear();
        onScan(decodedText);
      },
      (errorMessage) => {
        // Solo mostrar errores que no sean de "no se encontró código"
        if (!errorMessage.includes('No MultiFormat Readers')) {
          setError(errorMessage);
        }
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error('Failed to clear html5QrcodeScanner.', error);
        });
      }
    };
  }, [scanning, onScan]);

  const restartScanner = () => {
    setScanning(true);
    setError('');
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
            <p className="font-semibold">Error de cámara:</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={restartScanner}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 mb-4">
          {scanning ? (
            <div id="qr-reader" className="w-full"></div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-600">Escaneo completado</p>
                <button
                  onClick={restartScanner}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Escanear otro código
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Apunte la cámara al código QR del cliente
          </p>
          
          <button
            onClick={onClose}
            className="btn-danger"
          >
            Cerrar Escáner
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Consejo:</strong> Asegúrese de permitir el acceso a la cámara cuando el navegador lo solicite.
        </div>
      </div>
    </div>
  );
};

// Necesitamos definir Html5QrcodeScanType ya que no está exportado por defecto
const Html5QrcodeScanType = {
  SCAN_TYPE_CAMERA: 1,
  SCAN_TYPE_QR_CODE: 2
};

export default QRScanner;