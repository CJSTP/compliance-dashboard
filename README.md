# Crypto Exchange Compliance Dashboard

A full-stack regulatory compliance management tool built for cryptocurrency exchanges operating under U.S. money transmission and BSA/AML obligations. Designed to surface compliance gaps, track remedial actions, and monitor license status across jurisdictions.

**🔗 [Live Demo](https://compliance-dashboard-gamma.vercel.app)**

---

## Why This Exists

Crypto exchanges face a patchwork of state Money Transmitter Licenses (MTLs), ongoing BSA/AML program obligations, and regulatory examination findings that generate remedial action backlogs. Most compliance teams manage this in spreadsheets. This dashboard centralizes it into a real-time, auditable system.

---

## What It Tracks

###  MTL License Portfolio
- License status by state (Active, Pending, Expired, Surrendered)
- Renewal countdown — flags licenses expiring within 90 days
- Regulator and application date tracking

### Remedial Actions
- Open findings from regulatory exams and internal audits
- Priority levels (Critical, High, Medium, Low)
- Due date tracking with overdue flagging
- Source tracking (Regulatory Exam, Internal Audit, Risk Assessment, Management)

### BSA/AML Program Health
- Metric status across core program areas:
  - Customer Identification Program (CIP)
  - Transaction Monitoring
  - SAR Filing
  - OFAC Screening
  - Enhanced Due Diligence (EDD)
  - Training & Independent Testing
- At-Risk and Deficient indicator counts by program area

### Compliance Areas & Risk Assessments
- KYC, AML, sanctions, and other compliance area status by jurisdiction
- High-risk item flagging with review schedules

### Position Limits
- Asset-level position monitoring
- At-risk and non-compliant position tracking

---

## Tech Stack

**Backend**
- Python 3.11 / FastAPI
- SQLAlchemy ORM with SQLite
- Pydantic v2 for schema validation
- Deployed on [Render](https://render.com)

**Frontend**
- React 18 / TypeScript
- Vite build tool
- React Router v6
- Recharts for data visualization
- Axios for API communication
- Deployed on [Vercel](https://vercel.com)

---

## Project Structure

```
compliance-dashboard/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models (MTL, Remedial, BSA, Compliance, Positions)
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic layer
│   │   └── routes/         # FastAPI route handlers
│   ├── sample_data.py      # Realistic sample compliance data
│   ├── init_db.py          # Database seeding
│   └── main.py             # App entrypoint with CORS, routing, startup seeding
└── frontend/
    └── src/
        ├── pages/          # Dashboard, MTLPage, RemedialActionsPage, BSAAMLPage
        ├── components/     # Navbar, tables, stat cards
        ├── services/       # Typed API client
        └── types/          # TypeScript interfaces for all domain models
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py     # seeds sample data
python main.py
```

API runs at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard runs at `http://localhost:5173`

---

## API Endpoints

### MTL Licenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mtl/licenses` | All licenses (filterable by status) |
| GET | `/api/mtl/licenses/expiring-soon` | Licenses expiring within N days |
| POST | `/api/mtl/licenses` | Create license |
| PUT | `/api/mtl/licenses/{id}` | Update license |

### Remedial Actions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/remedial/actions` | All actions (filterable by status/priority) |
| GET | `/api/remedial/actions/overdue` | Overdue open actions |
| GET | `/api/remedial/actions/open-critical` | Open critical actions |
| POST | `/api/remedial/actions` | Create action |
| PUT | `/api/remedial/actions/{id}` | Update action |

### BSA/AML Indicators
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bsa/indicators` | All indicators (filterable by status/program area) |
| GET | `/api/bsa/indicators/deficient` | Deficient indicators only |
| POST | `/api/bsa/indicators` | Create indicator |
| PUT | `/api/bsa/indicators/{id}` | Update indicator |

### Compliance Areas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/compliance/areas` | All areas |
| GET | `/api/compliance/areas/overdue-reviews` | Areas past review date |
| GET | `/api/compliance/risk-assessments/high-risk` | High-risk assessments |

### Position Limits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/positions/limits` | All position limits |
| GET | `/api/positions/at-risk` | At-risk positions |
| GET | `/api/positions/non-compliant` | Non-compliant positions |

---

## Sample Data

The app seeds realistic sample data on startup including:
- 8 state MTL licenses (NY, CA, TX, FL, WA, IL, NV, WY) across multiple statuses
- 10 remedial actions across exam findings and audit observations
- 13 BSA/AML program metrics across 7 program areas
- 5 compliance areas with risk assessments

---

## Roadmap

- [ ] FINRA/SEC regulatory calendar with filing deadline tracking
- [ ] Transaction monitoring alert queue with SAR workflow
- [ ] AML risk scoring model for wallet activity
- [ ] User authentication and role-based access
- [ ] Export to PDF/Excel for examiner submissions
- [ ] Email alerts for expiring licenses and overdue actions

---

<img width="2392" height="1238" alt="image" src="https://github.com/user-attachments/assets/8ee7d31a-312d-4ff6-87f5-1233265e1825" />


## License

MIT
