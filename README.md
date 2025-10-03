# Sentinel - Advanced Parental Control System

A modern, enterprise-grade parental control system built with React, TypeScript, and cutting-edge UI components. Monitor, control, and protect your family's digital experience with professional grade features.

![Sentinel Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)

## 🚀 Features

- **Real-time Access Evaluation**: Test URL permissions with AI-powered analysis
- **Family Member Management**: Add, edit, and manage family members with different roles
- **Smart Parental Rules**: Create sophisticated filtering rules with expressions
- **Activity Monitoring**: Track access attempts and decisions in real-time
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Local Data Persistence**: Rules and users saved locally for offline functionality

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **UI Components**: Radix UI, Lucide React icons
- **State Management**: TanStack Query (React Query)
- **Deployment**: GitHub Pages (Frontend) + Vercel (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies**:
```bash
npm run install:all
```

2. **Start both frontend and backend**:
```bash
npm run dev
```

3. **Open your browser**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📡 API Endpoints

- `GET /api/users` - Get all family members
- `GET /api/rules` - Get all parental control rules
- `POST /api/evaluate` - Evaluate URL access for a user
  ```json
  {
    "userId": "string",
    "url": "https://example.com",
    "isoDateTime": "2024-01-01T12:00:00.000Z" // optional
  }
  ```

## 🚀 Deployment

### Option 1: GitHub Pages + Vercel (Recommended)

Deploy your frontend to GitHub Pages and backend to Vercel for optimal performance:

#### 1. Deploy Backend to Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Vercel will automatically detect the `vercel.json` configuration
3. **No environment variables needed** - API routes are handled internally
4. Note your Vercel URL (e.g., `https://your-project.vercel.app`)

#### 2. Deploy Frontend to GitHub Pages
1. Ensure your repository has GitHub Pages enabled
2. Run the deployment command:
   ```bash
   cd web
   npm run deploy
   ```

#### 3. Your Application URLs
- **Frontend**: `https://Arham21-pixel.github.io/Sentinel.io`
- **Backend API**: `https://your-project.vercel.app/api`

### Option 2: Vercel (Alternative)

Deploy everything to Vercel:
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Deploy automatically - both frontend and backend will be on Vercel
3. Your app will be available at: `https://your-app.vercel.app`

## 📋 Example Rules

Create powerful filtering rules using expressions:

- **Block entertainment weekdays 5-8 PM**: `isWeekday and time:between(17:00,20:00) and url:category(is,entertainment)`
- **Allow Wikipedia always**: `url:host(is,wikipedia.org) or url:host(endsWith,.wikipedia.org)`
- **Parent override**: `role:is(parent)`
- **Block social media**: `url:category(is,social)`
- **Study time restrictions**: `time:between(09:00,15:00) and isWeekday and url:category(is,entertainment)`

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy full-stack to Railway
npm run deploy:fullstack
```

## 📁 Project Structure

```
sentinel-parental-control/
├── web/                 # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   └── lib/         # Utilities and configurations
│   ├── data/            # Backend data and logic (for Vercel functions)
│   ├── logic/           # Backend evaluation logic (for Vercel functions)
│   └── package.json
├── api/                 # Vercel serverless functions
│   ├── users/
│   ├── rules/
│   └── evaluate/
├── server/              # Express backend (for local dev)
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── logic/       # Business logic (tokenizer, evaluator)
│   │   ├── data/        # Data store
│   │   └── index.ts     # Server entry point
│   └── package.json
├── vercel.json          # Vercel deployment config
└── package.json        # Root package.json for scripts
```

## 🔒 Security Notes

- Data is currently stored in-memory
- For production, implement:
  - Database persistence (PostgreSQL, MongoDB)
  - Authentication and authorization
  - Audit logging
  - Rate limiting
  - HTTPS/SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and not licensed for public use.

---

**Note**: This application uses GitHub Pages for frontend hosting and Vercel serverless functions for the backend API. The frontend makes requests to `/api/*` endpoints which are handled by Vercel's serverless functions.
