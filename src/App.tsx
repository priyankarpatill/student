import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import ConfirmationDialog from './components/ConfirmationDialog';
import { Student, StudentFormData } from './types/student';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; studentId: string | null }>({
    isOpen: false,
    studentId: null,
  });
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const initialStudents: Student[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 20,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          age: 22,
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          age: 21,
        },
      ];
      setStudents(initialStudents);
      setLoading(false);
    }, 1500); // Simulate loading delay
  };

  const handleAddStudent = (studentData: StudentFormData) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString(),
      };
      setStudents((prev) => [...prev, newStudent]);
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const handleEditStudent = (studentData: StudentFormData) => {
    if (!editingStudent) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingStudent.id
            ? { ...studentData, id: student.id }
            : student
        )
      );
      setEditingStudent(null);
      setShowForm(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, studentId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.studentId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStudents((prev) =>
          prev.filter((student) => student.id !== deleteDialog.studentId)
        );
        setDeleteDialog({ isOpen: false, studentId: null });
        setLoading(false);
      }, 500);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, studentId: null });
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add New Student
              </button>
            )}
          </div>

          {showForm ? (
            <div className="mb-6">
              <StudentForm
                onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
                onCancel={handleCancelForm}
                initialData={editingStudent}
              />
            </div>
          ) : null}

          <StudentList
            students={students}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;