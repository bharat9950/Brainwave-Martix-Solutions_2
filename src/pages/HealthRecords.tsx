import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, User, Calendar } from 'lucide-react';
import { HealthRecord, Patient, Staff } from '../types';
import { api } from '../services/api';

const HealthRecords: React.FC = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    type: 'Consultation',
    description: '',
    doctorId: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchHealthRecords(selectedPatient);
    } else {
      setHealthRecords([]);
    }
  }, [selectedPatient]);

  const fetchInitialData = async () => {
    try {
      const [patientsData, staffData] = await Promise.all([
        api.patients.getAll(),
        api.staff.getAll()
      ]);
      setPatients(patientsData);
      setStaff(staffData.filter(s => s.role === 'Doctor'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthRecords = async (patientId: string) => {
    try {
      const records = await api.healthRecords.getByPatient(patientId);
      setHealthRecords(records);
    } catch (error) {
      console.error('Error fetching health records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedPatientData = patients.find(p => p.id === formData.patientId);
      const selectedDoctor = staff.find(s => s.id === formData.doctorId);
      
      const recordData = {
        ...formData,
        date: new Date().toISOString(),
        doctorName: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : ''
      };

      await api.healthRecords.create(recordData);
      if (selectedPatient === formData.patientId) {
        fetchHealthRecords(formData.patientId);
      }
      resetForm();
    } catch (error) {
      console.error('Error creating health record:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      type: 'Consultation',
      description: '',
      doctorId: ''
    });
    setShowModal(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Consultation':
        return '🩺';
      case 'Diagnosis':
        return '🔍';
      case 'Treatment':
        return '💊';
      case 'Lab Result':
        return '🧪';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation':
        return 'bg-blue-100 text-blue-800';
      case 'Diagnosis':
        return 'bg-orange-100 text-orange-800';
      case 'Treatment':
        return 'bg-green-100 text-green-800';
      case 'Lab Result':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Electronic Health Records</h1>
          <p className="text-gray-600 mt-2">Manage patient medical records and history</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedPatient === patient.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{patient.gender} • {patient.bloodType}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Info & Records */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatientData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedPatientData.firstName} {selectedPatientData.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {selectedPatientData.gender} • Born {new Date(selectedPatientData.dateOfBirth).toLocaleDateString()} • Blood Type: {selectedPatientData.bloodType}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-600">{selectedPatientData.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{selectedPatientData.email}</span>
                </div>
                {selectedPatientData.allergies && (
                  <div>
                    <span className="font-medium text-gray-700">Allergies:</span>
                    <span className="ml-2 text-red-600">{selectedPatientData.allergies}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Emergency Contact:</span>
                  <span className="ml-2 text-gray-600">{selectedPatientData.emergencyContact}</span>
                </div>
              </div>
            </div>
          )}

          {/* Health Records */}
          {selectedPatient && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
              </div>
              
              <div className="p-6">
                {healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getTypeIcon(record.type)}</span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                                  {record.type}
                                </span>
                                <span className="text-sm text-gray-600">by {record.doctorName}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">
                                  {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed">{record.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No health records found for this patient.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedPatient && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a patient to view their health records</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Health Record</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Lab Result">Lab Result</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a doctor</option>
                  {staff.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter detailed medical information..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;