import React, { useState, useEffect } from 'react';
import { Student, StudentFormData } from '../types/student';

interface StudentFormProps {
  onSubmit: (student: StudentFormData) => void;
  onCancel: () => void;
  initialData?: Student | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  age?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    age: 0,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        age: initialData.age,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Age validation - Fixed version
    if (formData.age === undefined || formData.age === null) {
      newErrors.age = 'Age is required';
    } else if (formData.age === 0) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    } else if (isNaN(formData.age)) {
      newErrors.age = 'Age must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({ name: '', email: '', age: 0 });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      // Handle age field - allow empty string, convert to number
      const ageValue = value === '' ? 0 : Number(value);
      setFormData((prev) => ({
        ...prev,
        age: isNaN(ageValue) ? 0 : ageValue,
      }));
    } else {
      // Handle name and email fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Student' : 'Add New Student'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter student name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter student email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age *
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age === 0 ? '' : formData.age}
          onChange={handleChange}
          min="1"
          max="120"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter student age"
        />
        {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        {!errors.age && <p className="mt-1 text-xs text-gray-500">Age must be between 1 and 120</p>}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;