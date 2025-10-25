import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { User, Heart, Upload, CheckCircle, AlertCircle, Eye, ChevronLeft, ChevronRight, Settings, LogOut, Users, Database, FileText } from 'lucide-react';

const ECGAnnotationPlatform = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [users, setUsers] = useState({});
  const [datasets, setDatasets] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [currentDataset, setCurrentDataset] = useState(null);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [annotationText, setAnnotationText] = useState('');
  const [visibleLeads, setVisibleLeads] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', role: 'annotator', verificationCode: '', hospitalName: '' });
  const [uploadForm, setUploadForm] = useState({ datasetName: '', description: '', file: null });
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const generateECGData = (numSamples = 500, type = 'normal') => {
      const data = [];
      for (let i = 0; i < numSamples; i++) {
        const baseValue = type === 'afib' ? Math.random() * 0.3 : 0;
        const noise = type === 'noisy' ? Math.random() * 0.2 : Math.random() * 0.05;
        data.push(Math.sin(i * 0.1) * (0.5 + baseValue) + noise);
      }
      return data;
    };

    const sampleDatasets = {
      'dataset1': {
        id: 'dataset1',
        name: 'Beijing Tsinghua Hospital - Resting ECG',
        description: '12-lead resting ECG records from cardiology department',
        uploadedBy: 'admin',
        uploadDate: '2024-10-01',
        records: [
          {
            id: 'rec1',
            patientId: 'P001',
            timestamp: '2024-10-01T10:30:00',
            heartRate: 72,
            prInterval: 160,
            qrsDuration: 90,
            qtInterval: 380,
            leads: Array(12).fill(null).map(() => generateECGData(500, 'normal')),
            autoAnalysis: 'Normal sinus rhythm',
            leadNames: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
          },
          {
            id: 'rec2',
            patientId: 'P002',
            timestamp: '2024-10-01T11:00:00',
            heartRate: 95,
            prInterval: 180,
            qrsDuration: 95,
            qtInterval: 420,
            leads: Array(12).fill(null).map(() => generateECGData(500, 'afib')),
            autoAnalysis: 'Possible atrial fibrillation',
            leadNames: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
          }
        ]
      }
    };

    const sampleUsers = {
      'admin': { username: 'admin', password: 'admin123', role: 'admin', hospitalName: 'System Administrator' },
      'doctor1': { username: 'doctor1', password: 'doc123', role: 'expert', hospitalName: 'Beijing Tsinghua Hospital' }
    };

    setUsers(sampleUsers);
    setDatasets(sampleDatasets);
  };

  const handleLogin = () => {
    const user = users[loginForm.username];
    if (user && user.password === loginForm.password) {
      setCurrentUser(user);
      setView('dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleDatasetSelect = (datasetId) => {
    setCurrentDataset(datasetId);
    setCurrentRecordIndex(0);
    setView('annotate');
  };

  const handleAnnotate = (status) => {
    const record = datasets[currentDataset].records[currentRecordIndex];
    const newAnnotations = {
      ...annotations,
      [currentUser.username]: {
        ...(annotations[currentUser.username] || {}),
        [currentDataset]: {
          ...((annotations[currentUser.username] || {})[currentDataset] || {}),
          [record.id]: {
            text: annotationText,
            status: status,
            timestamp: new Date().toISOString()
          }
        }
      }
    };
    setAnnotations(newAnnotations);
    setAnnotationText('');
    
    if (currentRecordIndex < datasets[currentDataset].records.length - 1) {
      setCurrentRecordIndex(currentRecordIndex + 1);
    }
  };

  const toggleLead = (leadIndex) => {
    if (visibleLeads.includes(leadIndex)) {
      setVisibleLeads(visibleLeads.filter(l => l !== leadIndex));
    } else {
      setVisibleLeads([...visibleLeads, leadIndex].sort());
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Heart className="text-red-500 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">LabelECG</h1>
          </div>
          <p className="text-center text-gray-600 mb-6">Distributed ECG Annotation Platform</p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Login
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>Demo: admin/admin123 or doctor1/doc123</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Heart className="text-red-500 mr-2" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">LabelECG Platform</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{currentUser.username}</span>
              <button onClick={() => { setCurrentUser(null); setView('login'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(datasets).map(dataset => (
              <div key={dataset.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer"
                   onClick={() => handleDatasetSelect(dataset.id)}>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{dataset.name}</h3>
                <p className="text-gray-600 mb-4">{dataset.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{dataset.records.length} records</span>
                  <span className="text-blue-600 font-semibold">Start Annotating →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'annotate') {
    const record = datasets[currentDataset].records[currentRecordIndex];
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={() => setView('dashboard')} className="text-blue-600 hover:text-blue-700">
              ← Back
            </button>
            <span className="text-gray-600">Record {currentRecordIndex + 1} / {datasets[currentDataset].records.length}</span>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">ECG Parameters</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Patient ID:</span> {record.patientId}</p>
                <p><span className="font-medium">Heart Rate:</span> {record.heartRate} bpm</p>
                <p><span className="font-medium">PR Interval:</span> {record.prInterval} ms</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Automatic Analysis</h3>
              <p className="text-sm text-gray-600">{record.autoAnalysis}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Lead Selection</h3>
            <div className="flex flex-wrap gap-2">
              {record.leadNames.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleLead(idx)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    visibleLeads.includes(idx)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">ECG Waveforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleLeads.map(leadIdx => (
                <div key={leadIdx} className="border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{record.leadNames[leadIdx]}</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={record.leads[leadIdx].map((value, idx) => ({ x: idx, y: value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="x" hide />
                      <YAxis domain={[-1.5, 1.5]} hide />
                      <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Make Annotation</h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              placeholder="Enter your diagnosis..."
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
            />
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => handleAnnotate('confirmed')}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Confirm
              </button>
              <button
                onClick={() => handleAnnotate('unsure')}
                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <AlertCircle size={20} />
                Unsure
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentRecordIndex(Math.max(0, currentRecordIndex - 1))}
                disabled={currentRecordIndex === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <button
                onClick={() => setCurrentRecordIndex(Math.min(datasets[currentDataset].records.length - 1, currentRecordIndex + 1))}
                disabled={currentRecordIndex === datasets[currentDataset].records.length - 1}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ECGAnnotationPlatform;
