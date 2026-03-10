import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Student } from '../types/student';
import LoadingSpinner from './LoadingSpinner';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onEdit,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<'name' | 'email' | 'age'>('name');

  const filteredStudents = students.filter((student) => {
    const value = student[filterField].toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const downloadExcel = () => {
    const dataToExport = searchTerm ? filteredStudents : students;
    
    const worksheet = XLSX.utils.json_to_sheet(
      dataToExport.map(({ id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="age">Age</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${filterField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download {searchTerm ? 'Filtered' : 'All'} Data
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {students.length === 0 ? 'No students added yet.' : 'No students match your search.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
};

export default StudentList;