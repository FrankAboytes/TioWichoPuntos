import React, { useState } from 'react';
import { api } from '../services/api';
import QRGenerator from '../components/QRGenerator';

const ClientRegistration = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setNuevoCliente(null);

    try {
      const response = await api.registrarCliente(formData);
      setNuevoCliente(response.data);
      setSuccess('🤠 ¡Cliente registrado exitosamente!');
      setFormData({ nombre: '', telefono: '', email: '' });
    } catch (error) {
      setError(error.response?.data?.error || '❌ Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="app-title text-3xl mb-2">🤠 Registrar Nuevo Vaquero</h1>
          <p className="text-gray-600">Agregue un nuevo cliente al saloon</p>
        </div>

        <div className="card-vaquero">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              <div className="text-xl mb-2">⚠️</div>
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
              <div className="text-xl mb-2">✅</div>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group-vaquero">
              <label htmlFor="nombre" className="form-label-vaquero">
                🤠 Nombre Completo del Vaquero *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input-vaquero"
                placeholder="Ej: Juan 'El Rápido' Pérez"
                required
              />
            </div>

            <div className="form-group-vaquero">
              <label htmlFor="telefono" className="form-label-vaquero">
                📞 Teléfono del Rancho *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-input-vaquero"
                placeholder="Ej: +525512345678"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                🔔 Formato: +52 seguido de 10 dígitos
              </p>
            </div>

            <div className="form-group-vaquero">
              <label htmlFor="email" className="form-label-vaquero">
                📧 Correo del Pony Express (Opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input-vaquero"
                placeholder="Ej: vaquero@ranchomail.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-vaquero-large w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registrando Vaquero...
                </>
              ) : (
                '✅ Registrar Nuevo Vaquero'
              )}
            </button>
          </form>
        </div>

        {nuevoCliente && (
          <div className="mt-8">
            <QRGenerator cliente={nuevoCliente} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRegistration;