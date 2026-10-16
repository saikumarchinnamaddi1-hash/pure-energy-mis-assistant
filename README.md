# PURE Energy MIS Assistant — Dealer Lead Router

## 1. Project Overview

The PURE Energy MIS Assistant is a lead management system developed as part of the MIS Assistant practical assignment. It helps manage customer leads, automatically assign leads to dealers based on pincode prefixes, track lead statuses, and clean legacy lead data.

The application uses React and TypeScript for the frontend, Node.js and Express.js for the backend, and Firebase Firestore for data storage.

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

## 4. Key Features

### Lead Management

- Create customer leads using a lead form.
- Validate mobile numbers to ensure exactly 10 digits.
- Validate pincodes to ensure exactly 6 digits.
- Detect duplicate leads based on mobile numbers.
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
- Validate required fields, mobile numbers, and pincodes.
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

*Note: Update the folder names and paths to match the actual repository structure.*

## 6. Setup and Installation

### Prerequisites

- Node.js and npm
- A Firebase project
- A Firestore database
- A Firebase service account for backend authentication

### Backend Setup

Open a terminal and run:

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

Replace the example project ID and credential path with your actual configuration.

**Security note:** Never commit service account JSON files, private keys, or `.env` files to GitHub.

Start the backend using the script defined in `backend/package.json`. If a `start` script is available, run:

```bash
npm start
```

Alternatively, use the development command defined in the package file.

### Frontend Setup

Open a separate terminal and run:

```bash
cd interface
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

Make sure the backend is running and the Firebase credentials are configured correctly.

## 7. API Endpoints

The backend API is intended to provide the following operations. Confirm the paths against the actual backend implementation.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/leads` | Retrieve leads |
| POST | `/api/leads` | Create a lead |
| PATCH | `/api/leads/:id/status` | Update lead status |
| DELETE | `/api/leads/:id` | Delete a lead |
| POST | `/api/import-legacy` | Import and reconcile legacy data |

## 8. Data Cleaning and Reconciliation

The legacy data cleaning process reads the input CSV file, validates each record, checks for duplicate mobile numbers, and processes valid records according to the implemented reconciliation rules.

The reconciliation report is generated at:

`backend/reports/reconciliation.csv`

The report should contain a result for every input record, including its lead identifier, action taken, and reason.

Example actions:

- **Imported:** A valid lead was imported successfully.
- **Merged:** An existing lead was updated using a matching mobile number.
- **Rejected:** A record was rejected because of missing required fields or an invalid mobile number or pincode.

## 9. AI Tools Usage Log

AI tools were used as development assistants during the assignment. The usage log should accurately describe the tools used and how their suggestions were reviewed.

| Tool | Purpose | Review |
|---|---|---|
| ChatGPT | Assistance with implementation, debugging, documentation, and development guidance | Suggestions reviewed and adapted to the project |
| Other tools | Add other AI tools actually used | Describe how the output was verified |

AI assistance supported the development process. The final implementation and testing should be reviewed by the developer.

## 10. Testing Checklist

Verify the following items before submitting the project:

- [ ] Backend health endpoint responds successfully.
- [ ] Valid leads can be created and saved to Firestore.
- [ ] Invalid mobile numbers and pincodes are rejected.
- [ ] Duplicate mobile numbers are handled correctly.
- [ ] Dealer assignment works for matching pincode prefixes.
- [ ] Dashboard counts and status filters display correctly.
- [ ] Status updates and lead deletion work.
- [ ] Legacy CSV import handles valid and invalid records.
- [ ] The reconciliation report contains one result per input row.
- [ ] The frontend communicates with the backend correctly.

Only mark items complete after testing them.

## 11. Demo Video

**Demo Video:** Add the shareable link to your recorded demonstration.

The video should briefly explain:

1. Project overview and technology stack.
2. Creating a lead and validating the form.
3. Automatic dealer assignment and duplicate prevention.
4. Dashboard analytics and lead status management.
5. Legacy CSV cleaning and the reconciliation report.
6. Project testing and a summary of the implementation.

## 12. Author

**Name:** Sai Kumar

**Project:** PURE Energy MIS Assistant — Dealer Lead Router