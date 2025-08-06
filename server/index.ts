import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a real database)
let patients: any[] = [];
let appointments: any[] = [];
let staff: any[] = [];
let inventory: any[] = [];
let bills: any[] = [];
let healthRecords: any[] = [];

// Initialize with sample data
const initializeData = () => {
  // Sample patients
  patients = [
    {
      id: uuidv4(),
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State 12345',
      emergencyContact: 'Jane Doe - +1-555-0124',
      bloodType: 'O+',
      allergies: 'Penicillin',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1985-08-22',
      gender: 'Female',
      phone: '+1-555-0125',
      email: 'sarah.johnson@email.com',
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: 'Mike Johnson - +1-555-0126',
      bloodType: 'A-',
      allergies: 'None',
      createdAt: new Date().toISOString()
    }
  ];

  // Sample staff
  staff = [
    {
      id: uuidv4(),
      firstName: 'Dr. Michael',
      lastName: 'Smith',
      role: 'Doctor',
      department: 'Cardiology',
      phone: '+1-555-0200',
      email: 'dr.smith@hospital.com',
      licenseNumber: 'MD12345',
      specialization: 'Cardiologist',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      firstName: 'Lisa',
      lastName: 'Brown',
      role: 'Nurse',
      department: 'Emergency',
      phone: '+1-555-0201',
      email: 'lisa.brown@hospital.com',
      licenseNumber: 'RN67890',
      specialization: 'Emergency Care',
      createdAt: new Date().toISOString()
    }
  ];

  // Sample inventory
  inventory = [
    {
      id: uuidv4(),
      name: 'Surgical Masks',
      category: 'PPE',
      quantity: 500,
      minimumStock: 100,
      unitPrice: 0.50,
      supplier: 'MedSupply Co.',
      expiryDate: '2025-12-31',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      name: 'Paracetamol 500mg',
      category: 'Medication',
      quantity: 1000,
      minimumStock: 200,
      unitPrice: 0.25,
      supplier: 'PharmaCorp',
      expiryDate: '2025-06-30',
      createdAt: new Date().toISOString()
    }
  ];
};

initializeData();

// Patient routes
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.post('/api/patients', (req, res) => {
  const patient = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  patients.push(patient);
  res.json(patient);
});

app.put('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...req.body };
    res.json(patients[index]);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

app.delete('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    patients.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// Appointment routes
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  appointments.push(appointment);
  res.json(appointment);
});

// Staff routes
app.get('/api/staff', (req, res) => {
  res.json(staff);
});

app.post('/api/staff', (req, res) => {
  const staffMember = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  staff.push(staffMember);
  res.json(staffMember);
});

// Inventory routes
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/api/inventory', (req, res) => {
  const item = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  inventory.push(item);
  res.json(item);
});

app.put('/api/inventory/:id', (req, res) => {
  const index = inventory.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...req.body };
    res.json(inventory[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Bills routes
app.get('/api/bills', (req, res) => {
  res.json(bills);
});

app.post('/api/bills', (req, res) => {
  const bill = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  bills.push(bill);
  res.json(bill);
});

// Health Records routes
app.get('/api/health-records/:patientId', (req, res) => {
  const patientRecords = healthRecords.filter(r => r.patientId === req.params.patientId);
  res.json(patientRecords);
});

app.post('/api/health-records', (req, res) => {
  const record = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  healthRecords.push(record);
  res.json(record);
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalPatients: patients.length,
    totalStaff: staff.length,
    todayAppointments: appointments.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString()
    ).length,
    lowStockItems: inventory.filter(i => i.quantity <= i.minimumStock).length,
    totalRevenue: bills.reduce((sum, bill) => sum + (bill.amount || 0), 0)
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Hospital Management System API running on port ${PORT}`);
});