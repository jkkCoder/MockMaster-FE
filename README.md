# MockMaster Frontend

React frontend application for MockMaster - a mock test management system.

## Tech Stack

- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router v6 for routing
- Axios for API calls
- React Hook Form for form handling

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── store/          # Redux store and slices
│   ├── utils/          # Utility functions and types
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json
```

## Features

- User authentication (Login/Register)
- View available mock tests
- View mock test details
- Take mock tests with timer
- Question navigation
- Submit tests and view results
- Section-wise score breakdown
- Responsive design

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend API (default: http://localhost:3000/api/v1)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
