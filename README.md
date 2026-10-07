# 🌉 SkillBridge — Frontend Web Application

Hey there! Welcome to the frontend of **SkillBridge**. 👋

If you've ever tried switching tech roles or learning something new like Machine Learning, you probably know the feeling: **"What do I actually need to learn next, and how big is the gap between my current skills and what companies want?"**

SkillBridge was built to answer exactly that. It's a free, interactive web app where you can diagnose your skills, see a custom learning roadmap, practice coding right in your browser, and build daily habits with XP and streaks.

---

## 🎯 What Does It Do? (Feature Walkthrough)

Here is a quick tour of what you can do on the platform:

### 1. 🧠 AI Skill Gap Analyzer
- Upload your resume (`.pdf` or `.docx`) or manually select your skills.
- Pick a target job role (like *Machine Learning Engineer*, *Full Stack Developer*, *Data Scientist*, etc.).
- The app generates an instant **visual radar chart** comparing your skills against industry expectations, highlighting critical gaps in red and strengths in green.

### 2. 🗺️ Custom Learning Roadmaps
- Based on your target role, SkillBridge builds a personalized week-by-week action plan.
- Check off weekly milestones, toggle your learning pace (accelerated vs. balanced), and track your progress over time.

### 3. 💻 Interactive Code Labs
- **Python Lab:** Write and run real Python code directly in your browser. From simple `print("hello world")` to algorithms like Binary Search, Sigmoid math functions, and Pandas-style operations.
- **SQL Playground:** Query real dummy datasets (employees, job postings) using `SELECT`, `WHERE`, `GROUP BY`, and `ORDER BY` with instant tabular results.
- **LaTeX Resume Builder:** Choose clean resume templates, edit them live, and download the `.tex` file to compile on Overleaf.

### 4. ⚡ Daily Coding Challenge & XP
- A fresh problem every day to keep your mind sharp.
- Earn **XP points**, level up, and maintain a **daily streak** counter so you stay consistent.

### 5. 🤖 AI Career Mentor
- An embedded AI assistant you can chat with anytime.
- Ask questions like *"How do I transition from Python basics to MLOps?"* or *"What projects will make my resume stand out for junior ML roles?"*

### 6. 📰 Live Tech Pulse & News
- Real-time curated updates on hiring trends, top rising frameworks, and salary benchmarks.

---

## 🛠️ Tech Stack (Under the Hood)

We kept the frontend modern, fast, and lightweight:
- **React 19** with **Vite** — blazing fast hot-reload and instant build times.
- **Tailwind CSS v4** — clean, dark-mode-first aesthetic with sleek glassmorphism and animations.
- **Recharts** — interactive radar charts, skill gap heatmaps, and progress curves.
- **Zustand** — simple, lightweight state management that keeps your XP, streaks, and user profile in sync.
- **Lucide React** — sharp, modern icons across every screen.

---

## 🚀 How to Run It on Your Computer

Running the app locally takes less than a minute.

### 1. Navigate to the frontend folder
Open your terminal or Command Prompt and run:
```bash
cd "c:\local disk\Skill bridge\skillbridge\frontend"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the local development server
```bash
npm run dev
```

That's it! Your terminal will show a link like `http://localhost:5173`. Open that in your browser to start using SkillBridge.

---

## 🔗 Connecting to Supabase & Vercel
 
The frontend is built for full cloud resilience:
- **Direct Supabase Cloud Integration:** Connects directly to **Supabase PostgreSQL & Auth** (`https://xabzaaychzdpgtbgcrcx.supabase.co`), requiring no local port 5000 server.
- **Vercel Production Deployment:** Runs seamlessly on Vercel with built-in serverless functions under `/api` and direct browser-to-Supabase client support.
- **Demo & Offline Resilient:** Click **"1-Click Demo Login"** on the login page to immediately explore the app with pre-loaded demo engineer data (Alex Mercer).

---

## 📁 Folder Structure Explained

```text
frontend/
├── public/              # Static assets (logos, icons)
├── src/
│   ├── components/      # Reusable UI pieces (Navbar, Sidebar, Modals, Buttons)
│   ├── lib/             # Helper utilities (Python runner, data calculations)
│   ├── pages/           # All the main pages of the app:
│   │   ├── LoginPage.jsx          # Login & Signup screen
│   │   ├── DashboardPage.jsx      # Main dashboard with KPIs and skill pulse
│   │   ├── SkillAnalyzerPage.jsx  # Resume parsing and skill diagnostics
│   │   ├── CodeLabsPage.jsx       # Interactive Python, SQL & LaTeX sandboxes
│   │   ├── TrajectoryPage.jsx     # Learning roadmap & weekly milestones
│   │   ├── DailyProblemPage.jsx   # Hands-on daily coding challenge
│   │   ├── JobsPage.jsx           # Tech job listings and requirements
│   │   ├── SettingsPage.jsx       # Account, theme, and API key preferences
│   │   └── HelpPage.jsx           # AI career mentor chat & FAQs
│   ├── store/
│   │   └── useStore.js            # Zustand store (syncs user session & XP)
│   ├── App.jsx          # Main router and layout wrapper
│   ├── main.jsx         # React application entry point
│   └── index.css        # Design system styles and custom animations
├── index.html           # HTML template
├── vite.config.js       # Vite configuration with auto-proxy to backend
└── package.json         # Dependencies and start scripts
```

---

## 🚢 Building for Production

If you want to package the app for production (e.g. to host on Vercel, Netlify, or GitHub Pages):

```bash
npm run build
```

This creates an optimized, minified bundle inside the `dist/` folder ready for zero-config deployment.

---

## 🤝 Contributing & Feedback

Have ideas for new daily challenges, Python presets, or improvements? Feel free to open an issue or submit a pull request!
