import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function PostSessionEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab the data the child just generated
  const sessionData = location.state || { rewardGiven: 'Unknown', engagementScore: 3 };

  const [evaluation, setEvaluation] = useState({ performanceScore: 3, notes: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFullSession = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await axios.post(`http://localhost:3001/api/students/${id}/rate`, {
        rewardGiven: sessionData.rewardGiven,
        engagementScore: sessionData.engagementScore,
        performanceScore: Number(evaluation.performanceScore),
        notes: evaluation.notes
      });
      
      // Success! Send the clinician back to the child's main profile
      navigate(`/child/${id}`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save session.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border-t-8 border-green-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Session Complete</h2>
        <p className="text-gray-600 mb-6">
          The child rated their engagement with <strong>{sessionData.rewardGiven}</strong> as <strong>{sessionData.engagementScore}/5</strong>.
        </p>

        <form onSubmit={handleSaveFullSession} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg border">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Speech Accuracy / Task Performance (1-5)
            </label>
            <input 
              type="range" min="1" max="5" step="1"
              value={evaluation.performanceScore} 
              onChange={e => setEvaluation({...evaluation, performanceScore: e.target.value})} 
              className="w-full cursor-pointer accent-green-600" 
            />
            <div className="flex justify-between text-xs text-gray-500 font-medium px-1 mt-2">
              <span>1 (Needs Max Help)</span>
              <span className="font-bold text-xl text-green-600 bg-green-100 px-3 py-1 rounded">{evaluation.performanceScore}</span>
              <span>5 (Independent)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Clinical Notes (Optional)</label>
            <textarea 
              rows="4"
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Note specific challenges, prompt levels, or breakthroughs..."
              value={evaluation.notes}
              onChange={e => setEvaluation({...evaluation, notes: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-green-600 text-white font-bold p-4 rounded-lg hover:bg-green-700 transition-colors shadow-md text-lg disabled:opacity-50"
          >
            {isSaving ? 'Saving Record...' : 'Save Clinical Record'}
          </button>
        </form>
      </div>
    </div>
  );
}