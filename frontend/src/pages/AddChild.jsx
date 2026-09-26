import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddChild() {
  const [newStudent, setNewStudent] = useState({ name: '', age: '', disorderType: 'Speech Delay' });
  const navigate = useNavigate();

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/students', newStudent);
      navigate('/dashboard'); // Go back to dashboard after saving
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Register New Learner</h2>
      <form onSubmit={handleAddStudent} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Name</label>
          <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Age</label>
          <input type="number" required value={newStudent.age} onChange={e => setNewStudent({...newStudent, age: e.target.value})} className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Primary Focus</label>
          <select value={newStudent.disorderType} onChange={e => setNewStudent({...newStudent, disorderType: e.target.value})} className="w-full border p-2 rounded mt-1">
            <option>Speech Delay</option>
            <option>ASD</option>
            <option>ADHD</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Learner</button>
      </form>
    </div>
  );
}