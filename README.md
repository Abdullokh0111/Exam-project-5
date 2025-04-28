# Blog Platform API

A RESTful API for a blog platform built with TypeScript, Express.js, and PostgreSQL.

## Features

- User authentication (register, login)
- Blog management (create, read, update, delete)
- Posts management (create, read, update, delete)
- Comments management (create, read, update, delete)
- Blog membership (join, leave)
- Search functionality

## Technologies

- TypeScript
- Express.js
- PostgreSQL
- JWT for authentication
- Bcrypt for password hashing

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/blog-platform-api.git
cd blog-platform-api
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/blog_platform
JWT_SECRET=your_jwt_secret_key
COOKIE_SECRET=your_cookie_secret_key
```

4. Create and populate the database:
```
npm run migrate
```

5. Start the development server:
```
npm run dev
```

## API Endpoints

### Users
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get token

### Blogs
- `POST /blogs/create` - Create a new blog
- `GET /blogs/get-my-blogs` - Get user's blogs
- `GET /blogs/get-my-joined-blogs` - Get user's joined blogs
- `GET /blogs/get-blog-info/:id` - Get blog info
- `PUT /blogs/update/:id` - Update blog
- `DELETE /blogs/delete/:id` - Delete blog
- `GET /blogs/search?query=` - Search blogs
- `POST /blogs/join-blog/:id` - Join blog
- `POST /blogs/leave-blog/:id` - Leave blog
- `GET /blogs/get-users/:id` - Get blog users

### Posts
- `POST /posts/create` - Create a new post
- `GET /posts/get-all/:blog_id` - Get blog's posts
- `GET /posts/get-by-id/:id` - Get post by ID
- `PUT /posts/update/:id` - Update post
- `DELETE /posts/delete/:id` - Delete post
- `GET /posts/sort-by-date/:blog_id` - Get blog's posts sorted by date
- `GET /posts/:post_id/get-comments` - Get post's comments

### Comments
- `POST /comments/create` - Create a new comment
- `PUT /comments/update/:id` - Update comment
- `DELETE /comments/delete/:id` - Delete comment

## Authentication

All routes except `/users/register` and `/users/login` require authentication. To authenticate, include the token in the request cookies. The token is automatically set in cookies when logging in.