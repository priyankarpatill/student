
import * as XLSX from 'xlsx';
import { Student } from '../types/student';

export const exportToExcel = (data: Student[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
};