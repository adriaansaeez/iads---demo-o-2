import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CrudForm = ({
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  title,
  validationRules = {},
  className = ''
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Actualizar datos del formulario cuando cambien los datos iniciales
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Validar un campo específico
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Requerido
    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido';
    }

    // Longitud mínima
    if (rules.minLength && value && value.toString().length < rules.minLength) {
      return `Mínimo ${rules.minLength} caracteres`;
    }

    // Longitud máxima
    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      return `Máximo ${rules.maxLength} caracteres`;
    }

    // Email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email inválido';
      }
    }

    // Validación personalizada
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, formData);
    }

    return null;
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo al salir
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    // Validar formulario
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      label: field.label,
      value: formData[field.name] || '',
      error: touched[field.name] ? errors[field.name] : null,
      disabled: loading || field.disabled,
      required: validationRules[field.name]?.required,
      onBlur: () => handleBlur(field.name)
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.name, e.target.value)}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {validationRules[field.name]?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              disabled={loading || field.disabled}
              rows={field.rows || 3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            {touched[field.name] && errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {validationRules[field.name]?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              disabled={loading || field.disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="">Seleccionar...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched[field.name] && errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={loading || field.disabled}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      
      <div className="space-y-4">
        {fields.map(field => renderField(field))}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default CrudForm; 