export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  supplier: string;
  expiryDate: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  description: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'Consultation' | 'Diagnosis' | 'Treatment' | 'Lab Result';
  description: string;
  doctorId: string;
  doctorName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalStaff: number;
  todayAppointments: number;
  lowStockItems: number;
  totalRevenue: number;
}