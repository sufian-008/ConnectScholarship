## Backend Workflow Architecture
<img width="832" height="615" alt="image" src="https://github.com/user-attachments/assets/83b0d223-deb0-4759-8ffb-8f57ccaf0445" />


# ConnectScholarship API

A RESTful API for managing scholarship opportunities, posts, and user authentication, with admin controls.

## Base URL : http://localhost:5000/api
 
## API Endpoints
# 1.Auth Routes (/api/auth)
| Method | Endpoint       | Access  | Description                       |
| ------ | -------------- | ------- | --------------------------------- |
| POST   | /auth/register | Public  | Register a new user               |
| POST   | /auth/login    | Public  | Login and get JWT token           |
| GET    | /auth/me       | Private | Get currently logged-in user info |

# 2.Posts Routes (/api/posts)
| Method | Endpoint                  | Access  | Description                                                                      |
| ------ | ------------------------- | ------- | -------------------------------------------------------------------------------- |
| GET    | /posts                    | Public  | Get all approved posts (optional query: `opportunity`, `country`, `fundingType`) |
| GET    | /posts/my-posts           | Private | Get posts created by the logged-in user                                          |
| POST   | /posts                    | Private | Create a new post                                                                |
| PUT    | /posts/:id                | Private | Update a post by ID                                                              |
| DELETE | /posts/:id                | Private | Delete a post by ID                                                              |
                                                                                  |

# 3.Admin Routes (/api/admin) 
| Method | Endpoint                  | Description                                                    |
| ------ | ------------------------- | -------------------------------------------------------------- |
| GET    | /admin/posts              | Get all posts (any status)                                     |
| GET    | /admin/stats              | Get dashboard stats (total, approved, pending, rejected posts) |
| PUT    | /admin/posts/:id/approve  | Approve a post                                                 |
| PUT    | /admin/posts/:id/reject   | Reject a post                                                  |
| DELETE | /admin/posts/:id          | Delete any post                                                |
                               |
