# Frontend Structure

## 📁 Project Organization

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Chatbot/        # Chatbot module (modular)
│   │   │   ├── index.js           # Main chatbot component
│   │   │   ├── MessageBubble.js   # Message display component
│   │   │   ├── PropertyCard.js    # Property card component
│   │   │   ├── TypingIndicator.js # Loading indicator
│   │   │   └── ChatInput.js       # Input component
│   │   ├── PropertyList.js
│   │   ├── PropertyComparison.js
│   │   └── SavedProperties.js
│   ├── hooks/              # Custom React hooks
│   │   └── useChat.js      # Chat functionality hook
│   ├── services/           # API services
│   │   └── api.js          # API client & endpoints
│   ├── utils/              # Utility functions
│   │   └── constants.js    # App constants
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
└── package.json            # Dependencies
```

## ✨ Key Features

### 🎨 Modern Design
- **Gradient backgrounds** - Beautiful color transitions
- **Glassmorphism** - Backdrop blur effects
- **Smooth animations** - Fade-in effects for messages
- **Responsive design** - Works on all screen sizes
- **Custom scrollbars** - Thin, styled scrollbars

### 💬 Chat Interface
- **Message bubbles** - User and bot messages with avatars
- **Typing indicator** - Animated dots while waiting
- **Property cards** - Rich property display in chat
- **Quick actions** - One-click common queries
- **Auto-scroll** - Automatically scrolls to latest message
- **Clear chat** - Reset conversation button

### 🏗️ Architecture
- **Modular components** - Each feature in its own folder
- **Custom hooks** - Reusable logic (useChat)
- **API service layer** - Centralized API calls
- **Constants** - Configurable values
- **Type safety** - Proper prop validation

## 🎯 Component Structure

### Chatbot Module
- **index.js** - Main orchestrator
- **MessageBubble.js** - Individual message display
- **PropertyCard.js** - Property preview cards
- **TypingIndicator.js** - Loading animation
- **ChatInput.js** - Input with quick actions

### Custom Hooks
- **useChat** - Manages chat state, messages, API calls

### Services
- **api.js** - Axios instance with interceptors
- **propertyAPI** - Property-related endpoints
- **chatAPI** - Chat endpoints

## 🚀 Usage

```jsx
import Chatbot from './components/Chatbot';

<Chatbot
  onPropertiesFound={(properties) => setProperties(properties)}
  onViewProperties={() => setActiveTab('properties')}
/>
```

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom animations** - fadeIn keyframes
- **Gradient utilities** - bg-gradient-to-r, etc.
- **Backdrop blur** - backdrop-blur-md for glass effect

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Flexible layouts with flexbox/grid
- Touch-friendly buttons and inputs

## 🔧 Configuration

Environment variables:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000)

