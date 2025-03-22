# TransHLA Backend

This is the backend service for the TransHLA epitope prediction application. It provides a FastAPI-based REST API that interfaces with the TransHLA model for predicting HLA epitopes.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

To run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## API Endpoints

### POST /predict
Predict epitopes for given peptide sequences.

Request body:
```json
{
    "sequences": ["EDSAIVTPSR", "SVWEPAKAKYVFR"],
    "hla_class": 1  // 1 for HLA class I, 2 for HLA class II
}
```

Response:
```json
[
    {
        "peptide": "EDSAIVTPSR",
        "probability": 0.89,
        "is_epitope": true
    },
    {
        "peptide": "SVWEPAKAKYVFR",
        "probability": 0.23,
        "is_epitope": false
    }
]
```

## Development

The backend is structured as follows:
- `app/`: Main application directory
  - `main.py`: FastAPI application and model integration
- `tests/`: Test files directory 