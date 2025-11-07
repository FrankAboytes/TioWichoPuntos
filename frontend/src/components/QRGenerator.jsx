import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator = ({ cliente }) => {
  const qrData = `TIOWICHO:${cliente.id}`;

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_TioWicho_${cliente.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="card text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">✅ Cliente Registrado Exitosamente</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>ID Cliente:</strong> {cliente.id}</p>
        <p><strong>Puntos Iniciales:</strong> {cliente.puntos_acumulados}</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="border-4 border-primary-500 p-4 rounded-lg bg-white">
          <QRCodeSVG
            id="qr-code"
            value={qrData}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          Este código QR identifica al cliente en el sistema
        </p>
        
        <button
          onClick={downloadQR}
          className="btn-secondary"
        >
          📥 Descargar QR
        </button>
        
        <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
          <strong>Nota:</strong> Guarde este QR para identificaciones futuras
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;