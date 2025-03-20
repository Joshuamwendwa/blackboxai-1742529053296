import React from 'react';

function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  icon,
  min,
  max,
  pattern,
  autoComplete,
  helpText
}) {
  const inputClasses = `input ${
    error ? 'input-error' : ''
  } ${
    icon ? 'pl-10' : ''
  } ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400`}></i>
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            rows="4"
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            min={min}
            max={max}
            pattern={pattern}
            autoComplete={autoComplete}
          />
        )}
      </div>

      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}

      {error && (
        <p className="error-message">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;

// Usage examples:
/*
  <FormInput
    label="Email"
    name="email"
    type="email"
    value={email}
    onChange={handleChange}
    required
    icon="fas fa-envelope"
    placeholder="Enter your email"
    error={errors.email}
  />

  <FormInput
    label="Password"
    name="password"
    type="password"
    value={password}
    onChange={handleChange}
    required
    icon="fas fa-lock"
    placeholder="Enter your password"
    error={errors.password}
    helpText="Password must be at least 8 characters long"
  />

  <FormInput
    label="Message"
    name="message"
    type="textarea"
    value={message}
    onChange={handleChange}
    placeholder="Enter your message"
    error={errors.message}
  />

  <FormInput
    label="Quantity"
    name="quantity"
    type="number"
    value={quantity}
    onChange={handleChange}
    min="1"
    max="10"
    error={errors.quantity}
  />
*/