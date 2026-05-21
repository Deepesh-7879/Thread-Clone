# Threadly Frontend 🧵

Threadly is a feature-rich, high-performance web clone of Threads, designed to offer users a modern social media experience for sharing thoughts, connecting with others, and staying updated in real time.

---

## 🚀 Live Demo & Endpoints

- **Frontend Deployment**: [https://thread-clone-frontend-green.vercel.app](https://thread-clone-frontend-green.vercel.app)
- **Backend API**: [https://thread-clone-backend-1-zwlq.onrender.com/api](https://thread-clone-backend-1-zwlq.onrender.com/api)

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev) (Single Page Application)
- **Build Tool**: [Vite](https://vite.dev) (for lightning-fast Hot Module Replacement)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & Custom Premium CSS transitions
- **Routing**: [React Router DOM v6](https://reactrouter.com) (using `HashRouter` for routing stability across static hosting)
- **HTTP Client**: [Axios](https://axios-http.com) (with custom request/response interceptors)
- **State Management**: React Context API (`AuthContext`, `DMContext`) & Custom Hooks

---

## 🌟 Key Features

1. **User Authentication**:
   - Secure User Registration & Login with validation.
   - JWT session management stored in `localStorage` and sent via `Authorization: Bearer <token>` header interceptors.
   - Dynamic error messaging for login/registration failures.
2. **Interactive Home Feed**:
   - Fetching and displaying posts from followed users.
   - Multi-format posting supporting text content and image attachments.
3. **Engagement Mechanics**:
   - Like, share, and bookmark posts.
   - Detailed nesting of post comments and reply threads.
4. **Direct Messaging (DMs)**:
   - Full-screen real-time direct messaging layout.
5. **Global Search**:
   - Discover other users by name or username.
   - Instant Follow/Unfollow toggle.
6. **Notifications Panel**:
   - Real-time interaction tracking (likes, comments, follows).
7. **Rich Profiles**:
   - Comprehensive user profile displaying posts, follower/following lists, custom bio, and avatars.

---

## 📂 Project Structure

```
Threadly-Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # API Client and Configuration
│   │   ├── authApi.js      # Auth API endpoints (login, register, me)
│   │   ├── axiosInstance.js# Axios client with request & response interceptors
│   │   ├── feedApi.js      # Feed endpoint requests
│   │   ├── messageApi.js   # Chat/message endpoints
│   │   ├── notificationApi.js# User notification endpoints
│   │   ├── postApi.js      # Post creation, likes, comments, bookmarks
│   │   └── userApi.js      # Profiles, followers, search, follow toggles
│   ├── components/         # Shared Components
│   │   ├── common/         # Modals, Avatars, Loaders, Badges
│   │   ├── layout/         # Sidebar, Navbar, ProtectedRoute components
│   │   ├── post/           # Post Cards, Action bars, Comment Lists, Posting forms
│   │   └── user/           # Follow Buttons, User Info Cards
│   ├── context/            # React Context Providers (State Management)
│   │   ├── AuthContext.jsx # Auth state, login/register handlers, session checks
│   │   └── DMContext.jsx   # DM states, active chats, message histories
│   ├── hooks/              # Custom Hooks
│   │   ├── useAuth.js      # Quick-access Hook to AuthContext state
│   │   ├── useFollow.js    # Follow/unfollow handler hooks
│   │   └── usePosts.js     # Post list handling, pagination & action triggers
│   ├── pages/              # Primary Route Views
│   │   ├── BookmarksPage.jsx
│   │   ├── DMPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── SearchPage.jsx
│   ├── styles/             # Common style definitions & theme configurations
│   ├── App.jsx             # App layout wrapper & route definitions
│   └── main.jsx            # Entry mount point
├── .env                    # Local environment variables
├── eslint.config.js        # Linter configuration
├── index.html              # HTML entry document
├── package.json            # Script definitions and project dependencies
├── vercel.json             # Vercel routing rules & API proxying
└── vite.config.js          # Vite config (ports, proxies, tailwind compilation)
```

---

## ⚙️ Configuration & Environment Variables

### Local Development
To run the frontend locally and connect it to your local backend server, create a `.env` file in the root of the `Threadly-Frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production Deployment
When deploying the frontend to hosting services like Vercel, the application is set to automatically route API calls:
- **Vercel Reverse Proxy**: Vercel reads the `vercel.json` file, which rewrites all traffic from `/api/:path*` directly to `https://thread-clone-backend-1-zwlq.onrender.com/api/:path*`.
- **CORS Handling**: The backend dynamically processes origins, allowing secure, credential-enabled requests from your production frontend.

---

## 🏃 Getting Started

### Prerequisites
- Node.js installed (v16.x or newer recommended)
- The Threadly Backend running locally on port `5000` (optional, for local testing)

### Installation
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd Threadly-Frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000/`.

### Building for Production
To build the application for production deployment (generates optimized files under the `/dist` directory):
```bash
npm run build
```
You can preview the built production app locally using:
```bash
npm run preview
```
