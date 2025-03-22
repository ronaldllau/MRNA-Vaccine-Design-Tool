# TransHLA Epitope Prediction Application

This repository contains a full-stack application for predicting HLA epitopes using the TransHLA model. The application consists of a React frontend and a FastAPI backend.

## Project Structure

```
.
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
│
└── backend/           # FastAPI backend application
    ├── app/          # Application code
    ├── tests/        # Test files
    └── requirements.txt  # Backend dependencies
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`

## Development

- Frontend development server runs on port 5173
- Backend API server runs on port 8000
- API documentation is available at `http://localhost:8000/docs`

## License

MIT License
