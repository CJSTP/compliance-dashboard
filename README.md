# Regulatory Compliance Dashboard

A comprehensive dashboard for tracking crypto exchange regulatory compliance, risk assessments, and position limits.

## Features

- **Compliance Area Management**: Track KYC, AML, and other compliance areas by jurisdiction
- **Risk Assessment**: Manage risk assessments and track high-risk items
- **Position Limits**: Monitor asset position limits and utilization across jurisdictions
- **Audit Logging**: Complete audit trails for all compliance activities
- **Real-time Monitoring**: Track compliance status and position utilization in real-time

## Project Structure

```
compliance-dashboard/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── db/          # Database configuration
│   ├── main.py          # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env.example     # Environment variables template
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── types/       # TypeScript types
│   │   └── styles/      # CSS styles
│   ├── package.json     # npm dependencies
│   └── index.html       # HTML entry point
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 12+ (for production)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```bash
cp .env.example .env
```

5. Update the database URL in `.env` (or use SQLite for development):
```
DATABASE_URL=sqlite:///./compliance.db
```

6. Run the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- OpenAPI: `http://localhost:8000/openapi.json`

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

The dashboard will be available at `http://localhost:5173`

## API Endpoints

### Compliance Areas
- `GET /api/compliance/areas` - List all compliance areas
- `POST /api/compliance/areas` - Create compliance area
- `GET /api/compliance/areas/{id}` - Get specific area
- `PUT /api/compliance/areas/{id}` - Update compliance area
- `GET /api/compliance/areas/overdue-reviews` - Get overdue reviews

### Risk Assessments
- `GET /api/compliance/risk-assessments/area/{id}` - Get assessments for area
- `POST /api/compliance/risk-assessments` - Create risk assessment
- `GET /api/compliance/risk-assessments/high-risk` - Get high-risk items

### Position Limits
- `GET /api/positions/limits` - List all position limits
- `POST /api/positions/limits` - Create position limit
- `GET /api/positions/limits/{id}` - Get specific limit
- `PUT /api/positions/limits/{id}` - Update limit
- `GET /api/positions/at-risk` - Get at-risk positions
- `GET /api/positions/non-compliant` - Get non-compliant positions

### Audit Logs
- `GET /api/audit/logs` - List audit logs
- `POST /api/audit/logs` - Create audit log
- `GET /api/audit/logs/entity/{type}/{id}` - Get logs for entity

## Development

### Testing the Backend

```bash
cd backend
pytest
```

### Building for Production

**Backend:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

**Frontend:**
```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/compliance_db
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Dashboard Pages

- **Dashboard**: Overview with key metrics and summary charts
- **Compliance Areas**: Manage compliance areas by jurisdiction and status
- **Position Limits**: Track position limits and utilization by asset
- **Audit Logs**: View complete audit trail of all compliance activities

## Key Metrics

- Total compliance areas tracked
- Compliant vs. non-compliant areas
- Pending reviews
- High-risk assessments
- At-risk positions
- Non-compliant positions

## License

MIT
