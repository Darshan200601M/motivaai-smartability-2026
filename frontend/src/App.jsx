import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import ChildDetails from './pages/ChildDetails';
import ActiveSession from './pages/ActiveSession';
import PostSessionEvaluation from './pages/PostSessionEvaluation';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        {/* Simple Navigation Bar */}
        <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SmartTherapy Rewards</h1>
          <div className="space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
            <Link to="/add-child" className="text-gray-600 hover:text-indigo-600">Add Child</Link>
            <Link to="/" className="text-gray-600 hover:text-red-500">Logout</Link>
          </div>
        </nav>

        {/* Page Routing */}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-child" element={<AddChild />} />
            <Route path="/child/:id" element={<ChildDetails />} />
            <Route path="/session/:id" element={<ActiveSession />} />
            <Route path="/evaluate/:id" element={<PostSessionEvaluation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


// import { useState, useEffect } from 'react';

// export default function App() {
//   const [students, setStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({ name: '', age: '', disorderType: 'Speech Delay' });
//   const [rating, setRating] = useState({ studentId: '', rewardGiven: 'Indian Folk Dance', engagementScore: 3 });

//   // Fetch students on load
//   const fetchStudents = async () => {
//     const res = await fetch('http://localhost:3001/api/students');
//     const data = await res.json();
//     setStudents(data);
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     await fetch('http://localhost:3001/api/students', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newStudent)
//     });
//     setNewStudent({ name: '', age: '', disorderType: 'Speech Delay' });
//     fetchStudents(); // Refresh list
//   };

//   const handleRateSession = async (e) => {
//     e.preventDefault();
//     if (!rating.studentId) return alert("Please select a student");
    
//     await fetch(`http://localhost:3001/api/students/${rating.studentId}/rate`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         rewardGiven: rating.rewardGiven,
//         engagementScore: Number(rating.engagementScore)
//       })
//     });
//     alert("Rating saved successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 font-sans">
//       <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* ADD STUDENT SECTION */}
//         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">1. Add a Learner</h2>
//           <form onSubmit={handleAddStudent} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-600">Name</label>
//               <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Age</label>
//               <input type="number" required value={newStudent.age} onChange={e => setNewStudent({...newStudent, age: e.target.value})} className="w-full border p-2 rounded" />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Primary Focus</label>
//               <select value={newStudent.disorderType} onChange={e => setNewStudent({...newStudent, disorderType: e.target.value})} className="w-full border p-2 rounded">
//                 <option>Speech Delay</option>
//                 <option>ASD</option>
//                 <option>ADHD</option>
//               </select>
//             </div>
//             <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Learner</button>
//           </form>
//         </div>

//         {/* LOG RATING SECTION */}
//         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">2. Log Session Rating</h2>
//           <form onSubmit={handleRateSession} className="space-y-4">
//             <div>
//               <label className="block text-sm text-gray-600">Select Learner</label>
//               <select value={rating.studentId} onChange={e => setRating({...rating, studentId: e.target.value})} className="w-full border p-2 rounded">
//                 <option value="">-- Choose Learner --</option>
//                 {students.map(s => <option key={s._id} value={s._id}>{s.name} (Age {s.age})</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Reward Given</label>
//               <select value={rating.rewardGiven} onChange={e => setRating({...rating, rewardGiven: e.target.value})} className="w-full border p-2 rounded">
//                 <option>Cartoon Clip</option>
//                 <option>Indian Folk Dance</option>
//                 <option>Traditional Story</option>
//                 <option>Sticker</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-600">Engagement Score (1 = Low, 5 = High)</label>
//               <input type="range" min="1" max="5" value={rating.engagementScore} onChange={e => setRating({...rating, engagementScore: e.target.value})} className="w-full mt-2" />
//               <div className="text-center font-bold text-lg text-indigo-600">{rating.engagementScore}</div>
//             </div>
//             <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Save Rating</button>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }


// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from './assets/vite.svg'
// // import heroImg from './assets/hero.png'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <section id="center">
// //         <div className="hero">
// //           <img src={heroImg} className="base" width="170" height="179" alt="" />
// //           <img src={reactLogo} className="framework" alt="React logo" />
// //           <img src={viteLogo} className="vite" alt="Vite logo" />
// //         </div>
// //         <div>
// //           <h1>Get started</h1>
// //           <p>
// //             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
// //           </p>
// //         </div>
// //         <button
// //           type="button"
// //           className="counter"
// //           onClick={() => setCount((count) => count + 1)}
// //         >
// //           Count is {count}
// //         </button>
// //       </section>

// //       <div className="ticks"></div>

// //       <section id="next-steps">
// //         <div id="docs">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#documentation-icon"></use>
// //           </svg>
// //           <h2>Documentation</h2>
// //           <p>Your questions, answered</p>
// //           <ul>
// //             <li>
// //               <a href="https://vite.dev/" target="_blank">
// //                 <img className="logo" src={viteLogo} alt="" />
// //                 Explore Vite
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://react.dev/" target="_blank">
// //                 <img className="button-icon" src={reactLogo} alt="" />
// //                 Learn more
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //         <div id="social">
// //           <svg className="icon" role="presentation" aria-hidden="true">
// //             <use href="/icons.svg#social-icon"></use>
// //           </svg>
// //           <h2>Connect with us</h2>
// //           <p>Join the Vite community</p>
// //           <ul>
// //             <li>
// //               <a href="https://github.com/vitejs/vite" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#github-icon"></use>
// //                 </svg>
// //                 GitHub
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://chat.vite.dev/" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#discord-icon"></use>
// //                 </svg>
// //                 Discord
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://x.com/vite_js" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#x-icon"></use>
// //                 </svg>
// //                 X.com
// //               </a>
// //             </li>
// //             <li>
// //               <a href="https://bsky.app/profile/vite.dev" target="_blank">
// //                 <svg
// //                   className="button-icon"
// //                   role="presentation"
// //                   aria-hidden="true"
// //                 >
// //                   <use href="/icons.svg#bluesky-icon"></use>
// //                 </svg>
// //                 Bluesky
// //               </a>
// //             </li>
// //           </ul>
// //         </div>
// //       </section>

// //       <div className="ticks"></div>
// //       <section id="spacer"></section>
// //     </>
// //   )
// // }

// // export default App
