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
      setSuccess('Cliente registrado exitosamente!');
      setFormData({ nombre: '', telefono: '', email: '' });
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 Registrar Nuevo Cliente</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="form-label">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Juan Pérez García"
              required
            />
          </div>

          <div>
            <label htmlFor="telefono" className="form-label">
              Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: +525512345678"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Formato: +52 seguido de 10 dígitos
            </p>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email (Opcional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: juan.perez@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrar Cliente'}
          </button>
        </form>
      </div>

      {nuevoCliente && (
        <div className="mt-8">
          <QRGenerator cliente={nuevoCliente} />
        </div>
      )}
    </div>
  );
};

export default ClientRegistration;