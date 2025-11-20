# DAM Frontend

React TypeScript frontend for the Digital Asset Management system.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Zustand for state management
- Lucide React for icons

## Environment

The frontend expects the backend API to be available at `http://localhost:5000`.
Vite proxy is configured to forward `/api` requests to the backend.

