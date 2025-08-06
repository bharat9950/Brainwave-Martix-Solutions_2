const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Patients
  patients: {
    getAll: () => fetch(`${API_BASE_URL}/patients`).then(res => res.json()),
    create: (patient: any) => 
      fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      }).then(res => res.json()),
    update: (id: string, patient: any) =>
      fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      }).then(res => res.json()),
    delete: (id: string) =>
      fetch(`${API_BASE_URL}/patients/${id}`, { method: 'DELETE' }).then(res => res.json())
  },

  // Appointments
  appointments: {
    getAll: () => fetch(`${API_BASE_URL}/appointments`).then(res => res.json()),
    create: (appointment: any) =>
      fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      }).then(res => res.json())
  },

  // Staff
  staff: {
    getAll: () => fetch(`${API_BASE_URL}/staff`).then(res => res.json()),
    create: (staff: any) =>
      fetch(`${API_BASE_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
      }).then(res => res.json())
  },

  // Inventory
  inventory: {
    getAll: () => fetch(`${API_BASE_URL}/inventory`).then(res => res.json()),
    create: (item: any) =>
      fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).then(res => res.json()),
    update: (id: string, item: any) =>
      fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).then(res => res.json())
  },

  // Bills
  bills: {
    getAll: () => fetch(`${API_BASE_URL}/bills`).then(res => res.json()),
    create: (bill: any) =>
      fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill)
      }).then(res => res.json())
  },

  // Health Records
  healthRecords: {
    getByPatient: (patientId: string) => 
      fetch(`${API_BASE_URL}/health-records/${patientId}`).then(res => res.json()),
    create: (record: any) =>
      fetch(`${API_BASE_URL}/health-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).then(res => res.json())
  },

  // Dashboard
  dashboard: {
    getStats: () => fetch(`${API_BASE_URL}/dashboard/stats`).then(res => res.json())
  }
};