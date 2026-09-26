# MotivaAI 🌟
### *The Right Reward at the Right Time*

**AI-Based Personalised Reinforcement System for Speech & Language Therapy**
Built for **Smart Ability 2026** — a hackathon by Rajalakshmi Engineering College (REC) × NIEPMD
**Problem Statement ID:** 7 — AI-Based Personalised Reinforcement Application for Speech and Language Therapy

---

## 👥 Team

- Keerthivasan S
- Faqrudeen Faizan Z
- Darshan M
- Praveen R

---

## 🧩 Problem

Speech therapy outcomes depend heavily on the right reward, delivered at the right time. Existing systems rely on generic rewards and fixed timers, without considering a child's unique profile, interests, motivation level, session history, or cultural context — leading to:

- Generic, non-personalised rewards
- Fixed timing for every child
- No use of session history or motivation level
- Limited cultural/language adaptation
- No explainability behind reward choices

## 💡 Solution

**MotivaAI** analyzes a child's profile, spoken response, language, motivation level, and session history to recommend:

- The **most effective reward** for that specific child
- The **best time window** to deliver it
- A **clear, explainable reason** for every recommendation

## ✨ Key Innovations

| Feature | Description |
|---|---|
| **Context-Aware Profiling** | Builds a dynamic profile from age, interests, language, motivation, and performance |
| **Personalized Timing Recommendation** | Predicts the best time window based on engagement and fatigue patterns |
| **Session History Learning** | Learns from each session and therapist feedback to refine future recommendations |
| **Explainable AI Decisions** | Gives therapists a clear reason behind every reward suggestion |
| **Cultural & Language Adaptive Rewards** | Recommends culturally relevant (Indian) content matched to the child's background |
| **Therapist Control & Safety** | Therapists can review, override, or approve any AI suggestion — human-in-the-loop, always |

## 🧠 AI Recommendation Formula

Rewards are scored out of 100 using a weighted combination of factors:

| Factor | Weight |
|---|---|
| Learner Interest Match | 30 |
| Today's Preference | 20 |
| Previous Effectiveness | 20 |
| Motivation Suitability | 15 |
| Language / Cultural Match | 10 |
| Variety Bonus | 5 |

Penalty adjustments (e.g., repeated rewards, low engagement, inactivity) are then applied, and the final score is a hybrid of the rule-based score and a historical ML-driven success score:

```
Final Score = (ML Score × 0.60) + (Rule Score × 0.40)
```

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, React Router, Redux Toolkit, Tailwind CSS, Recharts, Axios |
| **Backend** | Node.js, Express.js, REST APIs, JWT Auth, Multer, CORS |
| **Database** | MongoDB |
| **AI/ML Service** | Python, Flask, scikit-learn, Decision Tree, Random Forest Regressor, Pandas, NumPy |

## 🔄 Session Flow

1. Therapist selects reading content
2. Therapist sets session timer
3. Child completes the reading/task
4. AI model predicts a suitable reward (Decision Tree + Random Forest Regressor)
5. Best reward is selected from the reward library
6. Reward video/content plays automatically
7. Child gives emoji-based feedback
8. Therapist rates session performance
9. Session data feeds back into the model for future recommendations

## 📊 Impact

**For Children:** Higher motivation, better engagement, improved therapy continuity
**For Therapists:** Data-driven decisions, time saved, clearer session workflow
**For Therapy Centres:** Centralised data, scalability, structured progress tracking

## 🔭 Future Scope

- AI companion avatar & gamified reading missions
- Micro-rewards during tasks + interactive reward experiences
- Reward passport & story-based progress across sessions
- Parent home challenges for continued engagement
- Deeper "Discover India" cultural reward library expansion

## 🔒 Principles

- **Privacy First** — encrypted, role-based data storage
- **Therapist in Control** — AI as decision support, never a replacement
- **Explainable AI** — every recommendation is transparent and justifiable

---

*Built with ❤️ for Smart Ability 2026 — Innovate. Inspire. Impact.*
