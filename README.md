# PURE Energy MIS Assistant — Dealer Lead Router

## 1. Project Overview

The PURE Energy MIS Assistant is a lead management system developed as part of the MIS Assistant assignment. It helps manage customer leads, automatically assign leads to dealers based on pincode prefixes, track lead statuses, and clean legacy lead data.

The application uses React and TypeScript for the frontend, Node.js and Express for the backend, and Firebase Firestore for data storage.

## 2. Objectives

- Build a Dealer Lead Router using Firebase.
- Collect and validate customer lead information.
- Automatically assign dealers based on customer pincode.
- Prevent duplicate leads using mobile numbers.
- Clean and reconcile legacy lead data using Node.js.
- Generate a reconciliation report for every input record.
- Display lead and status statistics in a dashboard.
- Document AI tool usage and provide a demonstration video.

## 3. Technology Stack

- **Frontend:** React, TypeScript, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Firebase Integration:** Firebase Admin SDK
- **Data Processing:** Node.js, CSV
- **Version Control:** Git and GitHub
- **Deployment:** Vercel (frontend), Render (backend)

## 4. Key Features

### Lead Management
- Create customer leads using a lead form.
- Validate mobile numbers to ensure exactly 10 digits.
- Validate pincodes to ensure exactly 6 digits.
- Detect duplicate leads based on mobile number.
- Save lead information to Firestore.
- Update lead statuses and delete leads.

### Automatic Dealer Assignment
- Match customer pincodes against dealer pincode prefixes.
- Support multiple pincode prefixes for a dealer.
- Assign unmatched leads to the configured fallback, such as In-house Sales.

### Dashboard
- Display lead summary statistics.
- Show lead counts by dealer and status.
- Provide charts for lead analytics.
- Search and filter leads.
- Display leads with pagination.

### Legacy Data Cleaning and Reconciliation
- Read legacy lead records from CSV.
- Validate required fields and mobile numbers and pincodes.
- Identify records with matching mobile numbers.
- Merge matching records according to the implemented reconciliation logic.
- Reject invalid records with reasons.
- Import valid records into Firestore.
- Generate `reports/reconciliation.csv` with a result for each input row.

## 5. Project Structure

```text
pure-energy-mis-assistant/
├── interface/
│   ├── public/
│   │   └── data/
│   │       ├── dealers.csv
│   │       └── legacy_leads.csv
│   ├── src/
│   │   ├── components/
│   │   ├── api.ts
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── firebase.js
│   │   └── importService.js
│   ├── data/
│   ├── reports/
│   ├── package.json
│   └── ...
└── README.md
```

*Note: Update the folder names and paths above to match the actual repository.*

## 6. Setup and Installation

### Prerequisites

- Node.js and npm
- A Firebase project
- A Firestore database
- A Firebase service account for backend authentication

### Backend Setup

```bash
cd backend
npm install
```

Configure the required environment variables and Firebase credentials locally. For example:

```env
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your-firebase-project-id
```

Use your actual Firebase project ID and credential file path. Never commit service account JSON files, private keys, or `.env` files to GitHub.

Start the backend using the script defined in `backend/package.json`. If the project has a `start` script:

```bash
npm start
```

### Frontend Setup

Open a separate terminal:

```bash
cd interface
npm install
```

Create a local `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

For production, configure `VITE_API_URL` with the deployed backend API base URL in the frontend hosting environment, then rebuild and redeploy the frontend.

## 7. API Endpoints

The backend provides the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/leads` | Retrieve leads |
| POST | `/api/leads` | Create a lead |
| PATCH | `/api/leads/:id/status` | Update lead status |
| DELETE | `/api/leads/:id` | Delete a lead |
| POST | `/api/import-legacy` | Import and reconcile legacy data |

Confirm the endpoint paths against the current backend implementation before submission.

## 8. Data Cleaning and Reconciliation

The legacy data cleaning process reads the input CSV, validates each record, checks for duplicate mobile numbers, and processes valid records according to the implemented reconciliation rules.

The reconciliation report is generated at:

`backend/reports/reconciliation.csv`

The report should include one result for every input record, including its lead identifier, action taken, and reason.

Example actions:

- `imported` — valid lead imported successfully.
- `merged` — existing lead updated using the matching mobile number.
- `rejected` — record rejected because of missing required fields or invalid mobile number/pincode.

## 9. AI Tools Usage Log

AI tools were used as development assistants during the assignment. The usage log should accurately describe the tools used and how their suggestions were reviewed.

| Tool | Purpose | Review |
|---|---|---|
| ChatGPT | Assistance with implementation, debugging, documentation, and deployment steps | Suggestions reviewed and adapted to the project |
| Other tools | Add any other AI tools actually used | Describe how the output was verified |

AI assistance was used to support development. The final implementation, testing, and submission should be reviewed by the developer.

## 10. Testing Checklist

Before submission, verify the following:

- [ ] Backend health endpoint responds successfully.
- [ ] Valid leads can be created and saved to Firestore.
- [ ] Invalid mobile numbers and pincodes are rejected.
- [ ] Duplicate mobile numbers are handled correctly.
- [ ] Dealer assignment works for matching pincode prefixes.
- [ ] Dashboard counts and status filters display correctly.
- [ ] Status updates and lead deletion work.
- [ ] Legacy CSV import handles valid and invalid records.
- [ ] Reconciliation report contains one result per input row.
- [ ] Deployed frontend communicates with the deployed backend.

Only mark items complete after testing them.

## 11. Deployment

- **GitHub Repository:** https://github.com/saikumarchinnamaddi1-hash/pure-energy-mis-assistant
- **Backend:** https://pure-energy-mis-assistant.onrender.com
- **Frontend:** Add the final deployed Vercel URL here.

The backend health endpoint can be checked at:

https://pure-energy-mis-assistant.onrender.com/api/health

## 12. Demo Video

**Demo Video:** Add the shareable link to your recorded demonstration.

The video should briefly explain:

1. Project architecture and technology stack.
2. Creating a lead and validating the form.
3. Automatic dealer assignment and duplicate prevention.
4. Dashboard and lead status management.
5. Legacy CSV cleaning and reconciliation report.
6. Deployment and a brief summary of the implementation.

## 13. Author

**Name:** Sai Kumar

**Project:** PURE Energy MIS Assistant — Dealer Lead Router
