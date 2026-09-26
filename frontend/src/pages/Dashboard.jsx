import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Learners</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map(student => (
          <Link to={`/child/${student._id}`} key={student._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer block">
            <h3 className="text-lg font-bold text-indigo-600">{student.name}</h3>
            <p className="text-sm text-gray-500 mt-2">Age: {student.age}</p>
            <p className="text-sm text-gray-500">Focus: {student.disorderType}</p>
            <p className="text-sm text-gray-500 mt-4 border-t pt-2">
              Sessions logged: {student.sessions?.length || 0}
            </p>
          </Link>
        ))}
        {students.length === 0 && <p className="text-gray-500">No learners added yet.</p>}
      </div>
    </div>
  );
}