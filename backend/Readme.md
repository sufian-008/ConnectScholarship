### 🔌 Complete Backend API Endpoints

#  Authentication Endpoints
| # | Endpoint             | Method | Auth   | Description                |
| - | -------------------- | ------ | ------ | -------------------------- |
| 1 | `/api/auth/register` | POST   | ❌ No   | Register a new user        |
| 2 | `/api/auth/login`    | POST   | ❌ No   | Login user                 |
| 3 | `/api/auth/me`       | GET    | ✅ User | Get current logged-in user |

# Posts Endpoints
| # | Endpoint              | Method | Auth   | Description                                                                  |
| - | --------------------- | ------ | ------ | ---------------------------------------------------------------------------- |
| 4 | `/api/posts`          | GET    | ❌ No   | Get all approved posts (optional filters: opportunity, country, fundingType) |
| 5 | `/api/posts/my-posts` | GET    | ✅ User | Get logged-in user's posts                                                   |
| 6 | `/api/posts`          | POST   | ✅ User | Create new post                                                              |
| 7 | `/api/posts/:id`      | PUT    | ✅ User | Update post (pending posts only or admin)                                    |
| 8 | `/api/posts/:id`      | DELETE | ✅ User | Delete post (pending posts only or admin)                                    |

# Admin Endpoints
| #  | Endpoint                       | Method | Auth    | Description                       |
| -- | ------------------------------ | ------ | ------- | --------------------------------- |
| 9  | `/api/admin/posts`             | GET    | ✅ Admin | Get all posts (all statuses)      |
| 10 | `/api/admin/stats`             | GET    | ✅ Admin | Get dashboard statistics          |
| 11 | `/api/admin/posts/:id/approve` | PUT    | ✅ Admin | Approve a post                    |
| 12 | `/api/admin/posts/:id/reject`  | PUT    | ✅ Admin | Reject a post                     |
| 13 | `/api/admin/posts/:id`         | DELETE | ✅ Admin | Delete any post                   |
| 14 | `/api/admin/users`             | GET    | ✅ Admin | Get all users                     |
| 15 | `/api/admin/users/:id/role`    | PUT    | ✅ Admin | Change user role                  |
| 16 | `/api/admin/users/:id`         | DELETE | ✅ Admin | Delete a user and all their posts |
| 17 | `/api/admin/analytics`         | GET    | ✅ Admin | Get analytics data                |


# Chatbot Endpoints
| #  | Endpoint                   | Method | Auth       | Description                   |
| -- | -------------------------- | ------ | ---------- | ----------------------------- |
| 19 | `/api/chatbot/query`       | POST   | ❌ Optional | Process chatbot query         |
| 20 | `/api/chatbot/suggestions` | GET    | ❌ No       | Get quick chatbot suggestions |

fundingType → Full / Partial / None
