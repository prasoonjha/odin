# Library Management API

A RESTful API for a library management system with book management, user reviews, and book transaction features (purchasing and renting).

## Features

- **Authentication** (optional): Register, login, logout, token refresh, forgot password, email verification
- **User Management**: CRUD operations for users
- **Book Management**: CRUD operations for books
- **Review System**: Users can write reviews for books (max 25 words)
- **Transaction System**: Buy or rent books

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication (optional)
- Nodemailer for emails

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```
   # Port number
   PORT=3000
   
   # URL of the Mongo DB
   MONGODB_URL=mongodb://127.0.0.1:27017/library-management
   
   # JWT secret key
   JWT_SECRET=your-secret-key
   
   # JWT access token expiration
   JWT_ACCESS_EXPIRATION_MINUTES=30
   
   # JWT refresh token expiration
   JWT_REFRESH_EXPIRATION_DAYS=30
   
   # SMTP configuration for email service
   SMTP_HOST=email-server
   SMTP_PORT=587
   SMTP_USERNAME=email-username
   SMTP_PASSWORD=email-password
   EMAIL_FROM=your-email@example.com
   ```

### Running the Application

Development mode with hot-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Running Tests
```bash
npm test
```

## API Documentation

API documentation is available at `/v1/docs` when the application is running.

If you encounter issues with the Swagger UI interface (blank screen), you can access the static HTML documentation at:
- `/v1/docs/static` - Static HTML documentation
- `/v1/docs?format=html` - Redirect to static HTML documentation

### Available Endpoints

#### Authentication
- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login a user
- `POST /v1/auth/logout` - Logout a user
- `POST /v1/auth/refresh-tokens` - Refresh auth tokens
- `POST /v1/auth/forgot-password` - Send reset password email
- `POST /v1/auth/reset-password` - Reset password
- `POST /v1/auth/send-verification-email` - Send verification email
- `POST /v1/auth/verify-email` - Verify email

#### Users
- `GET /v1/users` - Get all users
- `POST /v1/users` - Create a user
- `GET /v1/users/:userId` - Get a specific user
- `PATCH /v1/users/:userId` - Update a user
- `DELETE /v1/users/:userId` - Delete a user

#### Books
- `GET /v1/books` - Get all books
- `POST /v1/books` - Create a book
- `GET /v1/books/:bookId` - Get a specific book
- `PATCH /v1/books/:bookId` - Update a book
- `DELETE /v1/books/:bookId` - Delete a book

#### Reviews
- `POST /v1/reviews` - Create a review
- `GET /v1/reviews/book/:bookId` - Get all reviews for a book
- `DELETE /v1/reviews/:reviewId` - Delete a review

#### Transactions
- `POST /v1/transactions/buy/:bookId` - Buy a book
- `POST /v1/transactions/rent/:bookId` - Rent a book
- `GET /v1/transactions/my` - Get user's transactions

## No Authentication Mode

All endpoints can now be accessed without authentication. For endpoints that previously required user authentication, the user ID must be provided explicitly:

### Reviews
For creating reviews, include the user ID in the request body:
```json
{
  "user": "userId",
  "book": "bookId",
  "review": "This is a great book!"
}
```

For deleting reviews, include the user ID in the request body:
```json
{
  "userId": "userId"
}
```

### Transactions
For buying books, include the user ID in the request body:
```json
{
  "userId": "userId"
}
```

For renting books, include the user ID in the request body:
```json
{
  "userId": "userId",
  "duration": 14
}
```

For getting user transactions, include the user ID as a query parameter:
```
GET /v1/transactions/my?userId=userId
```

### Email Verification
For sending verification emails, include the user ID in the request body:
```json
{
  "userId": "userId"
}
```

## Deployment

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t library-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e MONGODB_URL=mongodb://mongo:27017/library-management library-api
   ```

### Heroku Deployment

1. Login to Heroku:
   ```bash
   heroku login
   ```

2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

3. Add MongoDB add-on:
   ```bash
   heroku addons:create mongodb:sandbox
   ```

4. Push to Heroku:
   ```bash
   git push heroku main
   ```

### AWS Deployment

1. Set up an EC2 instance with Node.js
2. Configure MongoDB (using Atlas or self-hosted)
3. Clone your repository to the server
4. Install dependencies: `npm install`
5. Use PM2 to manage the Node.js process:
   ```bash
   npm install -g pm2
   pm2 start npm --name "library-api" -- start
   ```

## Data Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (required)
- role: String (enum: ['user', 'admin'])
- isEmailVerified: Boolean

### Book
- title: String (required)
- author: String (required)
- isbn: String (required, unique)
- publishYear: Number (required)
- description: String
- price: Number (required)
- rentalPrice: Number
- availableForRent: Boolean
- availableForSale: Boolean
- quantityAvailable: Number

### Review
- user: ObjectId (reference to User)
- book: ObjectId (reference to Book)
- review: String (required, max 100 characters)

### Transaction
- user: ObjectId (reference to User)
- book: ObjectId (reference to Book)
- type: String (enum: ['buy', 'rent'])
- status: String (enum: ['pending', 'completed', 'cancelled'])
- rentalDuration: Number (required for rent transactions)
- returnDate: Date (required for rent transactions)
- price: Number (required)

## License

[MIT](LICENSE)
