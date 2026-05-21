# 🧵 Threadly — Social Media Backend

RESTful API for Threadly (Threads clone) built with **Node.js**, **Express 5**, **MongoDB Atlas**, and **Cloudinary**.

**Live API:** `https://thread-clone-backend-1-zwlq.onrender.com`

---

## 🚀 Tech Stack

| | |
|---|---|
| Framework | Express 5.x (ES Modules) |
| Database | MongoDB Atlas + Mongoose 9.x |
| Auth | JWT + bcryptjs + httpOnly Cookie |
| Images | Cloudinary + Multer |
| Deploy | Vercel / Render |

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
DB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

---

## 🛠️ Local Setup

```bash
git clone https://github.com/Deepesh-7879/Thread-Clone_Backend.git
cd Social-Media-Backend
npm install
# create .env with values above
npx nodemon server.js   # dev
npm start               # production
```

---

## 📡 API Endpoints

> 🔒 = Requires `Authorization: Bearer <token>` header or `token` cookie

### Auth — `/api/auth-api`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login → returns JWT cookie + token |
| GET | `/me` | 🔒 | Get current user |
| GET | `/logout` | ❌ | Clear auth cookie |

### Users — `/api/user-api`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | 🔒 | Current user with followers/following |
| GET | `/search?q=` | ❌ | Search by name/username/bio |
| GET | `/:username` | ❌ | User profile + their posts |
| PUT | `/profile` | 🔒 | Update name/bio |
| POST | `/profile-picture` | 🔒 | Upload profile image |
| POST | `/:userId/follow` | 🔒 | Follow user |
| POST | `/:userId/unfollow` | 🔒 | Unfollow user |

### Posts — `/api/post-api`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 | Create post (up to 4 images) |
| GET | `/feed` | 🔒 | Personalized feed |
| GET | `/all` | ❌ | All posts (explore) |
| GET | `/:postId` | ❌ | Single post |
| POST | `/:postId/like` | 🔒 | Toggle like |
| POST | `/:postId/bookmark` | 🔒 | Toggle bookmark |
| POST | `/:postId/comment` | 🔒 | Add comment |
| POST | `/:postId/comment/:commentId/reply` | 🔒 | Add reply |
| DELETE | `/:postId` | 🔒 | Delete post (author only) |

### Messages — `/api/messages`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/conversations` | 🔒 | All conversations |
| POST | `/` | 🔒 | Send a message `{ receiverId, text }` |
| PUT | `/:otherUserId/read` | 🔒 | Mark messages as read |

### Notifications — `/api/notifications`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 | Get notifications (latest 50) |
| PUT | `/read` | 🔒 | Mark all as read |

---

## 🗃️ Data Models (Summary)

| Model | Key Fields |
|-------|-----------|
| **User** | name, username, email, password (hashed), bio, profileImage, followers[], following[] |
| **Post** | author, content, image, likes[], bookmarks[], comments[{user, content, replies[]}] |
| **Message** | senderId, receiverId, text, read |
| **Notification** | receiverId, senderId, type (like/follow/comment/message), postId, read |

---

## 🚀 Deploy to Vercel

`vercel.json` routes all traffic to `server.js` automatically. Add `.env` vars in the Vercel dashboard, then:

```bash
npx vercel --prod
```

---

## 📄 License

ISC © 2024 Deepesh
