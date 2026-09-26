import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd verify credentials here. For now, just route to dashboard.
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Clinician Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input type="email" required className="w-full border p-2 rounded mt-1" defaultValue="doctor@clinic.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input type="password" required className="w-full border p-2 rounded mt-1" defaultValue="password123" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Sign In
        </button>
      </form>
    </div>
  );
}