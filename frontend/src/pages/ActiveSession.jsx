import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function ActiveSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract AI recommendations and custom timer passed from the clinician dashboard
  const { rewardName, intervalSeconds } = location.state || { rewardName: 'Cartoon Clip', intervalSeconds: 60 };
  
  const [timeLeft, setTimeLeft] = useState(intervalSeconds);
  const [isRewardTime, setIsRewardTime] = useState(false);

  // Map your database reward names to specific YouTube Embed URLs
  // The ?autoplay=1 ensures it starts playing as soon as the timer ends
  const rewardVideos = {
    "Cartoon Clip": "https://www.youtube.com/embed/7wtfhZwyrcc?autoplay=1", 
    "Traditional Story": "https://www.youtube.com/embed/9B2G2o3r1y0?autoplay=1", 
    "Indian Folk Dance": "https://www.youtube.com/embed/2_8Z-Y1HjYg?autoplay=1",
  };

  // Fallback video just in case a new reward name isn't in the dictionary yet
  const videoUrl = rewardVideos[rewardName] || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  // NEW: Hardcoded reading text
  const readingText = "The happy little frog jumped across the blue pond.";

  // NEW: Text-to-Speech function
  const handlePlayAudio = () => {
    // Cancel any ongoing speech just in case they click it twice
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(readingText);
    utterance.rate = 0.8; // Slightly slower for kids
    utterance.pitch = 1.2; // Slightly higher/friendlier pitch
    
    window.speechSynthesis.speak(utterance);
  };

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsRewardTime(true);
    }
  }, [timeLeft]);
  
  const handleFeedback = (score) => {
    // Navigate to the NEW evaluation page, passing the data along
    navigate(`/evaluate/${id}`, { 
      state: { 
        rewardGiven: rewardName, 
        engagementScore: score 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      {!isRewardTime ? (
        <div className="text-center w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">Reading Time!</h1>
          
          {/* NEW: Reading Text and Audio Button Box */}
          <div className="bg-white p-8 rounded-xl shadow-md border-2 border-blue-100 mb-8">
            <p className="text-3xl text-gray-800 font-medium mb-6 leading-relaxed">
              "{readingText}"
            </p>
            <button 
              onClick={handlePlayAudio}
              className="bg-indigo-100 text-indigo-700 font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-indigo-200 transition-colors shadow-sm text-lg"
            >
              <span>🔊</span> Hear how it sounds
            </button>
          </div>

          {/* Existing Timer */}
          <div className="text-6xl font-mono text-blue-600 bg-white p-8 rounded-full shadow-lg border-4 border-blue-200 inline-block">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <p className="mt-8 text-xl text-gray-600">Keep up the great work!</p>
        </div>
      ) : (
        <div className="text-center w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
          <h1 className="text-4xl font-bold text-green-600 mb-6">Great Job! Time for your reward!</h1>
          
          {/* YouTube Embed Player */}
          <div className="w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-xl mb-8 border-4 border-green-400 bg-black">
            <iframe 
              width="100%" 
              height="315" 
              src={videoUrl} 
              title={`${rewardName} Video`}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          <h2 className="text-2xl font-bold text-gray-700 mb-4">How much did you like this?</h2>
          
          {/* Engagement Feedback Buttons */}
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleFeedback(score)}
                className="text-5xl hover:scale-125 transition-transform duration-200 focus:outline-none"
                title={`Rate ${score} out of 5`}
              >
                {score === 1 && '😢'}
                {score === 2 && '🙁'}
                {score === 3 && '😐'}
                {score === 4 && '🙂'}
                {score === 5 && '🤩'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';

// export default function ActiveSession() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Extract AI recommendations and custom timer passed from the clinician dashboard
//   const { rewardName, intervalSeconds } = location.state || { rewardName: 'Cartoon Clip', intervalSeconds: 60 };
  
//   const [timeLeft, setTimeLeft] = useState(intervalSeconds);
//   const [isRewardTime, setIsRewardTime] = useState(false);

//   // Map your database reward names to specific YouTube Embed URLs
//   // The ?autoplay=1 ensures it starts playing as soon as the timer ends
//   const rewardVideos = {
//     "Cartoon Clip": "https://www.youtube.com/embed/7wtfhZwyrcc?autoplay=1", 
//     "Traditional Story": "https://www.youtube.com/embed/9B2G2o3r1y0?autoplay=1", 
//     "Indian Folk Dance": "https://www.youtube.com/embed/2_8Z-Y1HjYg?autoplay=1",
//   };

//   // Fallback video just in case a new reward name isn't in the dictionary yet
//   const videoUrl = rewardVideos[rewardName] || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

//   // Timer Logic
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timerId);
//     } else {
//       setIsRewardTime(true);
//     }
//   }, [timeLeft]);
  
//   const handleFeedback = (score) => {
//     // Navigate to the NEW evaluation page, passing the data along
//     navigate(`/evaluate/${id}`, { 
//       state: { 
//         rewardGiven: rewardName, 
//         engagementScore: score 
//       } 
//     });
//   };
//   // ... existing state (timeLeft, isRewardTime) ...

//   // NEW: Hardcoded reading text
//   const readingText = "The happy little frog jumped across the blue pond.";

//   // NEW: Text-to-Speech function
//   const handlePlayAudio = () => {
//     // Cancel any ongoing speech just in case they click it twice
//     window.speechSynthesis.cancel(); 
    
//     const utterance = new SpeechSynthesisUtterance(readingText);
//     utterance.rate = 0.8; // Slightly slower for kids
//     utterance.pitch = 1.2; // Slightly higher/friendlier pitch
    
//     window.speechSynthesis.speak(utterance);
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
//       {!isRewardTime ? (
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-blue-800 mb-6">Reading Time!</h1>
//           <div className="text-6xl font-mono text-blue-600 bg-white p-8 rounded-full shadow-lg border-4 border-blue-200">
//             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
//           </div>
//           <p className="mt-8 text-xl text-gray-600">Keep up the great work!</p>
//         </div>
//       ) : (
//         <div className="text-center w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
//           <h1 className="text-4xl font-bold text-green-600 mb-6">Great Job! Time for your reward!</h1>
          
//           {/* YouTube Embed Player */}
//           <div className="w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-xl mb-8 border-4 border-green-400 bg-black">
//             <iframe 
//               width="100%" 
//               height="315" 
//               src={videoUrl} 
//               title={`${rewardName} Video`}
//               frameBorder="0" 
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
//               allowFullScreen
//             ></iframe>
//           </div>

//           <h2 className="text-2xl font-bold text-gray-700 mb-4">How much did you like this?</h2>
          
//           {/* Engagement Feedback Buttons */}
//           <div className="flex justify-center gap-6">
//             {[1, 2, 3, 4, 5].map((score) => (
//               <button
//                 key={score}
//                 onClick={() => handleFeedback(score)}
//                 className="text-5xl hover:scale-125 transition-transform duration-200 focus:outline-none"
//                 title={`Rate ${score} out of 5`}
//               >
//                 {score === 1 && '😢'}
//                 {score === 2 && '🙁'}
//                 {score === 3 && '😐'}
//                 {score === 4 && '🙂'}
//                 {score === 5 && '🤩'}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

