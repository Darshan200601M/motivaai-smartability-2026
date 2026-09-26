import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  // NEW: State to hold the editable timer
  const [sessionTimer, setSessionTimer] = useState(60);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/students/${id}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleGetAIRecommendation = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/students/${id}/recommend`);
      setRecommendation(res.data);
      // NEW: Set the editable timer to the AI's recommendation by default
      setSessionTimer(res.data.optimal_interval_seconds); 
    } catch (err) {
      console.error(err);
      alert("Ensure your Python ML server is running.");
    }
  };

  if (!student) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      
      {/* LEFT COLUMN: Profile & History */}
      <div>
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-gray-600">Age: {student.age} | Focus: {student.disorderType}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-bold mb-4">Session History</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {student.sessions.length === 0 ? <p className="text-gray-500">No clinical sessions logged yet.</p> : null}
            
            {[...student.sessions].reverse().map((session, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Performance: {session.performanceScore}/5</p>
                    <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right bg-blue-100 px-3 py-2 rounded">
                    <p className="text-xs text-blue-800 uppercase font-bold mb-1">Reward Utilized</p>
                    <p className="text-sm font-semibold">{session.rewardGiven}</p>
                    <p className="text-xs text-blue-600 mt-1 font-bold">Child Engagement: {session.engagementScore}/5</p>
                  </div>
                </div>
                {session.notes && <p className="text-sm text-gray-700 italic border-l-4 border-gray-300 pl-3 py-1">"{session.notes}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Setup */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow border border-indigo-100 h-fit">
        <h3 className="text-xl font-bold text-indigo-800 mb-2"> Session Planner</h3>
        <p className="text-sm text-indigo-600 mb-6">Calculate the optimal reward and interval to maximize clinical focus today.</p>
        
        <button 
          onClick={handleGetAIRecommendation}
          className="w-full bg-indigo-600 text-white font-bold p-3 rounded shadow hover:bg-indigo-700 transition-colors"
        >
          Generate AI Recommendation
        </button>

        {recommendation && (
          <div className="mt-6 p-5 bg-white border-2 border-indigo-200 rounded-lg shadow-sm">
            
            {/* Recommendation Header */}
            <div className="text-center mb-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Suggested Reward</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{recommendation.recommended_reward}</p>
              <p className="text-sm text-green-600 font-bold mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                Predicted Engagement: {recommendation.expected_engagement_score} / 5.0
              </p>
            </div>

            {/* SHAP Explanation Section (Restored for Clinical Value) */}
            <div className="border-t border-indigo-100 pt-3 mt-3 mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Why was this chosen?</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex justify-between">
                  <span>Average Baseline:</span>
                  <span className="font-mono">{recommendation.explanation.base_score > 0 ? '+' : ''}{recommendation.explanation.base_score}</span>
                </li>
                <li className="flex justify-between">
                  <span>Age Impact:</span>
                  <span className={`font-mono ${recommendation.explanation.age_impact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {recommendation.explanation.age_impact >= 0 ? '+' : ''}{recommendation.explanation.age_impact}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Focus Impact:</span>
                  <span className={`font-mono ${recommendation.explanation.disorder_impact >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {recommendation.explanation.disorder_impact >= 0 ? '+' : ''}{recommendation.explanation.disorder_impact}
                  </span>
                </li>
              </ul>
            </div>

            {/* Editable Timer & Hand-off */}
            <div className="border-t border-indigo-100 pt-5 mt-2 text-center bg-indigo-50 -mx-5 -mb-5 p-5 rounded-b-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-md text-indigo-800 font-bold">⏱️ Session Timer:</p>
                <div className="flex items-center bg-white border border-indigo-200 rounded px-2 shadow-inner">
                  <input 
                    type="number" 
                    value={sessionTimer}
                    onChange={(e) => setSessionTimer(e.target.value)}
                    className="w-16 p-1 text-xl font-bold text-center text-indigo-900 focus:outline-none"
                  />
                  <span className="text-gray-500 font-medium pr-1">sec</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/session/${id}`, { 
                  state: { 
                    rewardName: recommendation.recommended_reward, 
                    intervalSeconds: Number(sessionTimer) 
                  } 
                })}
                className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 shadow-lg text-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>▶️</span> Start Live Session
              </button>
              <p className="text-xs text-gray-500 mt-3 font-medium">(Device will be handed to the child)</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}


