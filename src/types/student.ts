export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
}

export type StudentFormData = {
  name: string;
  email: string;
  age: number;
};