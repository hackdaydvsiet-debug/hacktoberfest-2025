# StudyVibe Backend - Technical Documentation

## Overview

StudyVibe Backend is a RESTful API service that powers the StudyVibe study planning platform. It provides intelligent study plan generation, timetable management, and schedule parsing capabilities using AI integration.

## Architecture

### Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB with Mongoose ODM
- **AI Services:**
  - Google Gemini AI for study plan generation
  - OpenAI for advanced text processing
- **File Handling:** Multer for multipart form data

### Project Structure

```
app/
├── main.js                 # Application entry point
├── controllers/            # Request handlers (business logic)
├── db/                     # Database connection setup
├── middleware/             # Custom Express middleware
├── models/                 # Mongoose schemas and models
├── routes/                 # API route definitions
├── services/               # External service integrations
└── utils/                  # Helper functions and utilities
```

## API Endpoints

### Health & Status

#### GET /

Returns API information and available endpoints.

**Response:**

```json
{
  "message": "Welcome to StudyVibe API!",
  "app_name": "StudyVibe Backend",
  "version": "v1",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "planner": "/api/planner",
    "timetable": "/api/timetable",
    "schedule": "/api/schedule"
  }
}
```

#### GET /health

Health check endpoint for monitoring services.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-31T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Study Planner

#### POST /api/planner

Generate a personalized study plan based on subjects and exam dates.

**Request Body:**

```json
{
  "subjects": [
    {
      "name": "Mathematics",
      "examDate": "2025-11-15",
      "hours": 20
    }
  ],
  "dailyHours": 3
}
```

### Timetable Management

#### GET /api/timetable

Retrieve all timetables for a user.

#### POST /api/timetable

Create a new timetable.

#### PUT /api/timetable/:id

Update an existing timetable.

#### DELETE /api/timetable/:id

Remove a timetable.

### Schedule Processing

#### POST /api/schedule/upload

Upload a schedule file (PDF, image, etc.).

**Content-Type:** multipart/form-data

#### POST /api/schedule/parse

Parse uploaded schedule data using AI.

## Database Models

### Subject Model

Stores information about subjects the user needs to study.

**Fields:**

- `name` (String, required) - Subject name
- `examDate` (Date, required) - Exam date
- `hours` (Number, required) - Total study hours needed
- `userId` (ObjectId, required) - User reference
- `createdAt` (Date) - Auto-generated
- `updatedAt` (Date) - Auto-generated

### Timetable Model

Manages study schedules with time slots.

**Fields:**

- `userId` (ObjectId, required) - User reference
- `plan` (Array, required) - Study slots
  - `date` (Date) - Session date
  - `subject` (String) - Subject name
  - `hours` (Number) - Duration
- `createdAt` (Date) - Auto-generated
- `updatedAt` (Date) - Auto-generated

## Middleware

### Logging Middleware

Logs all incoming requests and responses with timing information.

**Logs:**

- Request timestamp, method, and URL
- Response status code and processing time
- Color-coded success (✅) and error (❌) indicators

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Application Info
APP_NAME=StudyVibe Backend
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyvibe

# AI Services
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Development Guide

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (see above)

3. Start development server:

```bash
npm run dev
```

### Adding New Features

#### 1. Create a Model (if needed)

```javascript
// app/models/YourModel.js
import mongoose from "mongoose";

const YourSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("YourModel", YourSchema);
```

#### 2. Create Controller

```javascript
// app/controllers/your.controller.js

/**
 * Handler for your feature
 */
export const yourHandler = async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 3. Create Route

```javascript
// app/routes/your.route.js
import express from "express";
import { yourHandler } from "../controllers/your.controller.js";

const router = express.Router();
router.post("/", yourHandler);

export default router;
```

#### 4. Register Route in main.js

```javascript
import yourRoute from "./routes/your.route.js";
app.use("/api/your-feature", yourRoute);
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas connection
- [ ] Set up proper CORS origins
- [ ] Add API keys to environment
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting (optional)

### Render Deployment

The app is configured for deployment on Render using `render.yaml`.

**Requirements:**

- Node.js 18+
- MongoDB Atlas database
- Environment variables configured in Render dashboard

See `DEPLOYMENT.md` for detailed instructions.

## Testing

### Manual Testing

Use tools like Postman or curl:

```bash
# Test health endpoint
curl https://studyvibe-backend.onrender.com/health

# Test planner endpoint
curl -X POST https://studyvibe-backend.onrender.com/api/planner \
  -H "Content-Type: application/json" \
  -d '{"subjects":[{"name":"Math","examDate":"2025-11-15","hours":20}]}'
```

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Change PORT in .env or kill the process
lsof -ti:3001 | xargs kill
```

**MongoDB connection fails:**

- Check connection string in .env
- Verify MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

**Module not found errors:**

- Run `npm install`
- Check import paths (use .js extension)
- Verify file names match imports

## Performance Optimization

- Use MongoDB indexes for frequently queried fields
- Implement caching for AI responses (Redis recommended)
- Add request rate limiting for public endpoints
- Enable gzip compression for responses
- Use connection pooling for database

## Security Best Practices

- Never commit `.env` file
- Use HTTPS in production
- Validate and sanitize all inputs
- Implement authentication/authorization
- Set secure CORS policies
- Keep dependencies updated
- Use environment variables for secrets

## Contributing

When contributing code:

1. Write clear, descriptive comments
2. Follow existing code style
3. Add error handling
4. Test your changes
5. Update documentation

## Support

For bugs or feature requests, open an issue on GitHub.

## License

ISC License - see LICENSE file for details.
