# Newsly - RAG Chatbot Frontend

A modern React frontend for a RAG-powered chatbot that answers questions over a news corpus. Built with TypeScript, Tailwind CSS, and Shadcn UI components.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI / Radix UI
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Features

- 🎨 Modern, responsive chat interface with dark mode
- ⚡ Real-time streaming responses via Socket.io
- 💬 Chat history with sidebar navigation
- 🔄 Session management with persistence
- 📚 Source links for retrieved articles
- 📱 Mobile-first responsive design
- 🎯 Collapsible sidebar with keyboard shortcuts
- 🔍 Search and filter chat history
- 🗑️ Delete individual chats or clear all
- ⚙️ Accessible UI components (ARIA compliant)

## Prerequisites

- Node.js 18+
- Backend server running (see [backend README](https://github.com/vamsi4845/voosh-backend))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vamsi4845/voosh-frontend
cd voosh-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist/` directory.

## Usage

1. Open the application in your browser
2. A session ID will be automatically generated on first message
3. Type your question in the input box and press Enter or click Send
4. Watch the bot response stream in real-time
5. View source links below bot responses (expandable accordion)
6. Navigate chat history from the sidebar
7. Delete individual chats or clear all chats
8. Use keyboard shortcut `Ctrl/Cmd + B` to toggle sidebar

## Project Structure

```
voosh-frontend/
├── src/
│   ├── App.tsx                    # Main app component with routing
│   ├── index.tsx                  # Entry point
│   ├── index.css                  # Global styles and Tailwind imports
│   ├── components/
│   │   ├── app-sidebar.tsx        # Main sidebar component
│   │   ├── chat/
│   │   │   ├── chat-area.tsx      # Chat message display area
│   │   │   ├── chat-header.tsx     # Header with title and info
│   │   │   ├── chat-input.tsx      # Message input component
│   │   │   ├── greeting.tsx        # Welcome greeting component
│   │   │   └── message-preview.tsx # Message preview component
│   │   ├── sidebar-history.tsx     # Chat history sidebar
│   │   ├── sidebar-history-item.tsx # Individual history item
│   │   ├── sidebar-toggle.tsx      # Sidebar toggle button
│   │   ├── sidebar-user-nav.tsx    # User navigation in sidebar
│   │   ├── icons.tsx               # Custom icon components
│   │   ├── layout.tsx              # Main layout wrapper
│   │   ├── toast.tsx               # Toast notification component
│   │   └── ui/                     # Shadcn UI components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── sidebar.tsx
│   │       ├── sheet.tsx
│   │       └── ... (other UI components)
│   ├── contexts/
│   │   └── socket-context.tsx       # Socket.io context provider
│   ├── hooks/
│   │   ├── use-chats.ts            # Chat management hooks
│   │   └── use-mobile.ts           # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts                # Utility functions (cn helper)
│   ├── pages/
│   │   ├── chat-page.tsx           # Chat page component
│   ├── providers/
│   │   └── query-provider.tsx      # React Query provider
│   ├── services/
│   │   ├── apiService.ts           # REST API client
│   │   └── socketService.ts        # Socket.io client
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Key Components

### AppSidebar
Main sidebar component that includes:
- Chat history navigation
- New chat button
- Delete all chats functionality
- User navigation

### ChatScreen
Main chat interface container that:
- Manages socket connection via context
- Handles message state
- Loads session history
- Coordinates between chat components

### ChatArea
Displays chat messages with:
- Auto-scrolling to bottom
- Streaming text display
- Source links in expandable accordion
- User and assistant message styling

### ChatInput
Input component with:
- Text input with auto-resize
- Send button
- Enter key support
- Disabled state during loading
- Keyboard shortcuts

### SidebarHistory
Chat history sidebar that:
- Groups chats by date (Today, Yesterday, Last 7 days, etc.)
- Displays chat titles
- Handles chat deletion
- Navigates to selected chat

## Hooks

### useChats
React Query hook for managing chat list:
- Fetches chats from localStorage
- Provides mutations for add/update/delete operations
- Integrates with backend API for session clearing

### useDeleteChat
Mutation hook for deleting a single chat:
- Clears session from backend Redis
- Removes chat from localStorage
- Updates React Query cache

### useDeleteAllChats
Mutation hook for deleting all chats:
- Clears all sessions from backend
- Clears all chats from localStorage
- Updates React Query cache

## Services

### Socket Service
Manages Socket.io connection:
- Connection/disconnection handling
- Reconnection logic
- Event listeners for streaming responses
- Session management

### API Service
REST API client for:
- Sending messages (non-streaming fallback)
- Fetching session history
- Clearing sessions

## Styling

The app uses Tailwind CSS with:
- Custom color scheme via CSS variables
- Dark mode support
- Responsive design (mobile-first)
- Custom scrollbar styling
- Smooth animations and transitions
- Shadcn UI component styling

### Theme Configuration

Colors are defined in `src/index.css` using CSS variables:
- Primary, secondary, accent colors
- Background and foreground colors
- Sidebar-specific colors
- Border and input colors

Tailwind config (`tailwind.config.ts`) extends these variables for use in components.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend REST API URL | `http://localhost:3001` |

## Development

### Running the Dev Server
```bash
npm run dev
```

### Type Checking
```bash
npm run build
```
This runs TypeScript compiler to check for type errors.

### Code Style
- TypeScript strict mode enabled
- Functional components with explicit prop types
- No comments in code (per project rules)
- PascalCase for components, camelCase for functions

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`
4. Deploy

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Environment Variables for Production

Set these in your hosting platform:
- `VITE_API_URL` - Your backend API URL

**Note**: Make sure your backend CORS settings allow requests from your frontend domain.

## Features in Detail

### Streaming Responses
The frontend receives streaming chunks via Socket.io and displays them in real-time with a blinking cursor indicator.

### Session Management
- Session ID is stored in localStorage
- Automatically loads chat history on page reload
- Session persists across page refreshes
- Each chat has a unique session ID (UUID format)

### Chat History
- Chats are stored in localStorage
- Grouped by date (Today, Yesterday, Last 7 days, Last 30 days, Older)
- Can delete individual chats or clear all
- Clicking a chat loads its session history

### Source Links
When the bot responds, it includes source links to the news articles used. These are displayed in an expandable accordion below the message.

### Sidebar
- Collapsible sidebar with icon and expanded states
- Keyboard shortcut: `Ctrl/Cmd + B` to toggle
- Mobile-responsive with sheet overlay
- Persists state in cookies

### Error Handling
- Connection errors are displayed via toast notifications
- Failed API calls show error messages
- Socket disconnections trigger reconnection attempts
- Graceful fallback for backend errors

## Troubleshooting

### Socket Connection Issues
- Verify `VITE_SOCKET_URL` is correct
- Check backend CORS settings
- Ensure backend server is running
- Check browser console for errors

### API Calls Failing
- Verify `VITE_API_URL` is correct
- Check network tab in browser DevTools
- Ensure backend is accessible
- Verify CORS configuration

### Messages Not Appearing
- Check browser console for errors
- Verify Socket.io connection status
- Check session ID in localStorage
- Verify backend is processing messages

### Tailwind Styles Not Working
- Ensure `index.css` is imported in `index.tsx`
- Check `tailwind.config.ts` content paths
- Verify PostCSS configuration
- Restart dev server after config changes

### Links
- [Backend Repository](https://github.com/vamsi4845/voosh-backend)
- [Live](https://voosh-newsly.vercel.app/)
