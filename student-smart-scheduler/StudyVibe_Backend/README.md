# StudyVibe Backend 📚

Smart study scheduler and planner backend API built with Express.js, MongoDB, and AI integration (Google Gemini & OpenAI).

## Features

- 📅 Study planner generation
- 🕒 Timetable management
- 📊 Schedule parsing and optimization
- 🤖 AI-powered study recommendations
- 📁 File upload support for schedules

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB
- **AI Services**: Google Gemini, OpenAI
- **File Handling**: Multer

## Quick Start

### 1. Clone and Install

```bash
cd StudyVibe_Backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
PORT=3001
APP_NAME=StudyVibe Backend
API_VERSION=v1
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run Development Server

```bash
npm run server
# or
npm run dev
```

Server will start at `http://localhost:3001`

### 4. Run Production Server

```bash
npm start
```

## API Endpoints

### Base URL

- Local: `http://localhost:3001`
- Production: `https://your-render-url.onrender.com`

### Available Routes

- `GET /` - API info
- `GET /health` - Health check endpoint
- `POST /api/planner` - Generate study plan
- `GET/POST /api/timetable` - Manage timetables
- `POST /api/schedule` - Upload and parse schedules

## Project Structure

```
StudyVibe_Backend/
├── app/
│   ├── main.js                 # Main application entry
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.js
│   │   ├── planner.controller.js
│   │   ├── schedule.controller.js
│   │   ├── subject.controller.js
│   │   └── timeTable.controler.js
│   ├── db/
│   │   └── connectToMongoDB.js # Database connection
│   ├── middleware/
│   │   ├── logging.js          # Request logging
│   │   └── verifyToken.js      # Authentication
│   ├── models/                 # MongoDB schemas
│   │   ├── Subject.js
│   │   └── Timetable.js
│   ├── routes/                 # API routes
│   │   ├── planner.route.js
│   │   ├── schedule.route.js
│   │   ├── subject.route.js
│   │   └── timeTable.route.js
│   ├── services/               # External services
│   │   ├── gemini_api.js       # Google Gemini integration
│   │   ├── openai_api.js       # OpenAI integration
│   │   └── scheduleParser.js   # Schedule parsing logic
│   └── utils/
│       └── studyPlanGenerator.js
├── uploads/
│   └── schedules/              # Uploaded schedule files
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── render.yaml                 # Render deployment config
└── DEPLOYMENT.md              # Deployment guide
```

## Deployment

### Deploy to Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick steps:**

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Add environment variables
5. Deploy!

### Important for Production

- Set `NODE_ENV=production`
- Use MongoDB Atlas for database
- Configure CORS for your frontend domain
- Consider persistent disk for file uploads (Render add-on)

## Development

### Scripts

- `npm start` - Start production server
- `npm run server` - Start development server with nodemon
- `npm run dev` - Alias for development server

### Adding New Routes

1. Create controller in `app/controllers/`
2. Create route in `app/routes/`
3. Import and use route in `app/main.js`

## Environment Variables

| Variable         | Description               | Required              |
| ---------------- | ------------------------- | --------------------- |
| `PORT`           | Server port               | No (default: 3001)    |
| `MONGODB_URI`    | MongoDB connection string | Yes                   |
| `GOOGLE_API_KEY` | Google Gemini API key     | Yes (for AI features) |
| `OPENAI_API_KEY` | OpenAI API key            | Yes (for AI features) |
| `APP_NAME`       | Application name          | No                    |
| `API_VERSION`    | API version               | No                    |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

ISC

## Author

Shailav Malik

## Support

For issues and questions, please open an issue on GitHub.
