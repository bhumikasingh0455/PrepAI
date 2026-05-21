# PrepAI - AI Interview Preparation Platform

PrepAI is a full-stack, AI-powered interview preparation platform designed to help software engineering candidates prepare for technical interviews. The platform allows users to generate tailored mock interview questions, practice speaking or typing answers, receive instantaneous AI evaluation on technical depth and communication, parse and analyze resumes for ATS optimization, track topic-wise DSA checklist progress, and compete on a global leaderboard.

---

## 🌟 Key Features

1. **AI Mock Interview Room**:
   - Web Speech API integration for live speech-to-text recording.
   - Real-time timer and progressive question stepper.
   - Manual editing fallback for microphone/browser incompatibility.
2. **AI Answer Evaluation**:
   - Multi-metric evaluation (Score, Technical correctness, Communication clarity, and Recommendations).
   - Mock AI fallback mode for offline testing or when the OpenAI API key is not present.
3. **Resume Analyzer & ATS Parser**:
   - Extract raw PDF text to parse matching skill keywords.
   - Calculate ATS match percentage and suggest optimizations.
   - Automatically sync parsed skills into the user's settings profile.
4. **Interactive Dashboard**:
   - Recharts visual metrics showing historical average interview scores.
   - Dynamic tracker showing total solved DSA questions.
   - Actionable statistics for recent interview activity.
5. **DSA Practice Sheet**:
   - Topic-wise sheets covering Arrays, Strings, Linked Lists, Trees, and Graphs.
   - Interactive checklist with completion rate trackers.
6. **Global Leaderboard**:
   - Points system calculated via completed DSA checklist count (10pts per item) and average mock interview scores (5pts per percent).
7. **Premium Design**:
   - Responsive Glassmorphic SaaS aesthetic.
   - Smooth animations powered by Framer Motion.
   - LocalStorage-persisted Dark and Light themes.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, Tailwind CSS, Axios, Framer Motion, Recharts, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer, JWT, bcryptjs, OpenAI Node SDK, pdf-parse
- **Database**: MongoDB

---

## 📂 Folder Structure

```text
ai-interview-prep/
├── backend/
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Business logic controllers (Auth, DSA, Resume, Questions, Interviews)
│   ├── middleware/         # Auth verification and file upload configurations
│   ├── models/             # Mongoose schemas (User, Resume, InterviewSession, Question, Score, DsaProgress)
│   ├── routes/             # REST API routers
│   ├── services/           # OpenAI integration (with smart local mock fallback)
│   ├── uploads/            # Temporary directory for Multer file uploads
│   ├── .env.example        # Reference environment configuration
│   ├── package.json        # Node.js backend dependencies and scripts
│   └── server.js           # Server entrance script
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App-specific images/logos
│   │   ├── components/     # Reusable layout and ui elements (Navbar, Footer, GlassCard, ThemeToggle, ProtectedRoute)
│   │   ├── context/        # Context APIs (AuthContext, ThemeContext)
│   │   ├── pages/          # Full page SPA views (LandingPage, Dashboard, Login, Signup, ResumeUpload, QuestionGenerator, MockInterview, DsaPractice, Profile)
│   │   ├── utils/          # API Axios configurations
│   │   ├── index.css       # Core Tailwind directives & glassmorphic custom variables
│   │   ├── App.jsx         # App router and layouts
│   │   └── main.jsx        # App entry point
│   ├── postcss.config.js   # PostCSS configuration
│   ├── tailwind.config.js  # Tailwind config details
│   ├── package.json        # Frontend packages list
│   └── vite.config.js      # Vite build setup
└── README.md               # Onboarding guide documentation
```

---

## ⚙️ Environment Variables

Copy the sample configurations to load parameters for local development:

### Backend Configuration (`backend/.env`)
Create a file named `.env` in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-interview-prep
JWT_SECRET=supersecretjwtkey_12345
OPENAI_API_KEY=your_openai_api_key_here # Keep blank to run in Mock AI mode
NODE_ENV=development
```

---

## 🚀 Installation & Running

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas cloud URI.

### 2. Run MongoDB
Make sure your MongoDB server is active. On Windows, you can start the service or verify via Mongo Shell:
```cmd
mongod --dbpath <your-db-path>
```

### 3. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment variables:
   - Create a `.env` file based on `.env.example` (or copy the variables above).
4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   The backend should start on port `5000` with the message:
   `MongoDB Connected: 127.0.0.1`

### 4. Frontend Setup
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the assets to ensure all compilations are clean:
   ```bash
   npm run build
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The app will run locally, typically at `http://localhost:5173`. Open this URL in your web browser.

---

## 📡 API Reference Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user profile.
- `POST /api/auth/login` - Authenticate and return JWT.
- `GET /api/auth/profile` - Retrieve current logged-in user context.
- `PUT /api/auth/profile` - Update profile name or manual skill inventory.

### Resumes & ATS
- `POST /api/resume/upload` - Upload PDF resume, parse text, run ATS feedback, and save to database.
- `GET /api/resume/history` - Retrieve previously uploaded resume reports.

### Question Generator
- `POST /api/questions/generate` - Produce questions using OpenAI or fallback database.
- `POST /api/questions/save` - Bookmark specific interview questions.
- `GET /api/questions/saved` - View saved user questions.

### Mock Interview Evaluation
- `POST /api/interviews/evaluate` - Grade individual answers using NLP logic or OpenAI.
- `POST /api/interviews/session` - Save full session containing questions, answers, and scores.
- `GET /api/interviews/history` - Retrieve user's mock interview session history.
- `GET /api/interviews/session/:id` - Fetch single interview session detail metrics.

### DSA Progress & Leaderboard
- `GET /api/dsa/progress` - Fetch solved checklist problems for user.
- `POST /api/dsa/toggle` - Mark problem as complete/incomplete.
- `GET /api/dsa/leaderboard` - Calculate points and return global ranking records.
