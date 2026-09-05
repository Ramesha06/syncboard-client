# SyncBoard — Full-Stack Kanban Task Management System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success.svg)](https://www.mongodb.com/atlas)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red.svg)](https://mongoosejs.com/)

A full-stack, Jira-style collaborative Kanban board application developed for **Assignment 03**. SyncBoard features a responsive **React + Vite** frontend, a scalable **Node.js + Express** REST API, and a persistent cloud database powered by **MongoDB Atlas** with **Mongoose ODM**.

---

## 📚 Assignment 03 Documentation Links

- 📊 **[MongoDB Data Modeling Justification](docs/DATA_MODELING.md)**: Architectural analysis, NoSQL vs SQL justification, referencing vs. embedding tradeoffs, compound indexes, and schemas.
- ☁️ **[MongoDB Atlas Setup Guide](docs/ATLAS_SETUP.md)**: Step-by-step walkthrough for deploying an M0 Atlas cluster, configuring database users, IP whitelisting, and connection URIs.
- 📋 **[Assignment 03 Project Report](docs/ASSIGNMENT_03_REPORT.md)**: Formal academic report covering full-stack architecture, error handling, status code mapping, and acceptance results.
- 🧪 **[Postman & Newman Acceptance Testing](postman/README.md)**: API test collection instructions, dynamic environment variables, server restart persistence verification, and CI execution.

---

## 👥 Group 96 — Team Contributions (Assignment 03)

| Member # | Member Name | Student ID | Git Author / Username | Assignment 03 Contribution | Key Commit |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **1** | KGG Theekshana | 30751 | `theekshana-git` | Configured Mongoose connection manager, environment variables, dynamic Atlas URI loading, and database health check endpoint (`/api/health`). | `b568ab9` |
| **2** | ALD Semitha | 30789 | `dinsara0611` | Implemented centralized error handler mapping Mongoose `E11000` duplicate key to `409 Conflict`, `CastError` to `404 Not Found`, and built `validateObjectId` middleware. | `e35f3c5` |
| **3** | ATN Fernando | 30966 | `thihanf` | Designed User Mongoose schema, email validation regex, bcrypt hashing lifecycle hooks, `toJSON` password-stripping transform, and migrated `userRepository`. | `994a8da` |
| **4** | MS Liyanaaracchi | 30860 | `Malik Shiran Liyanaarachchi` | Implemented Board Mongoose schema with member references, configured `{ members: 1 }` multikey index, and migrated `boardRepository`. | `97a1eca` |
| **5** | RRP Weerasinghe | 30851 | `Rashmie` | Implemented Task Mongoose schema, enum status validation, compound index `{ boardId: 1, status: 1 }`, and migrated `taskRepository` to MongoDB. | `d8afdb4` |
| **6** | PKPGSD Gunarathna | 29921 | `Siluni` | Built automated database seeding script (`npm run db:seed`) and refactored backend services (`taskService`, `authService`) for Mongoose query alignment. | `7b2d564` |
| **7** | DMSK Dissanayake | 33337 | `sithumi-i` | Updated React frontend client for 24-character hex MongoDB ObjectId compatibility, updated state synchronization, and live database persistence. | `5010cb9` |
| **8** | MHF Zaina | 33211 | `zaina-hz` | Extended Postman test suite with dynamic environment extraction (`boardId`, `taskId`), restart persistence tests, duplicate conflict checks, and Newman CLI runner docs. | `df72ab2` |
| **9** | PSD Wijesinghe | 30843 | `senura-d` | Authored MongoDB data modeling justification table, Atlas setup guide, Assignment 03 report documentation, executed final integration merge, and tagged release `Assignment-03`. | `Member 9` |

---

## 🗄️ MongoDB Data Modeling Justification Table

| Collection | Relationship | Implementation | Alternative Rejected | Justification & Architectural Tradeoffs |
| :--- | :--- | :--- | :--- | :--- |
| **Board $\rightarrow$ Tasks** | $1:N$ | **Referenced** (`boardId` in `Task`) | Embedded tasks array in `Board` | **1. 16MB Document Limit:** Boards can have thousands of tasks; embedding risks hitting MongoDB's 16MB limit.<br>**2. Memory Reallocation:** Frequent task additions cause continuous document growth and disk fragmentation.<br>**3. Concurrency:** Embedding creates write lock contention on the Board document.<br>**4. Querying:** Referencing allows compound indexing (`{ boardId: 1, status: 1 }`) and pagination. |
| **Board $\rightarrow$ Members** | $N:M$ | **Referenced Array** (`members: [ObjectId]`) | Embedded user profiles in `Board` | **1. Bounded Growth:** Team sizes per board are naturally small (2-20 users).<br>**2. Data Freshness:** User profile changes update once in `users` without board sync overhead.<br>**3. Fast Lookups:** Multikey index `{ members: 1 }` allows rapid user-workspace queries. |
| **Task $\rightarrow$ Assignee** | $N:1$ | **Hybrid (Denormalized Name + `createdBy` Ref)** | Pure normalized `$lookup` on every read | **1. Instant Board Render:** Frontend task cards display assignee name and initials directly without expensive join queries.<br>**2. Audit Trail:** `createdBy` retains an immutable ObjectId reference for access control. |
| **User $\rightarrow$ Boards** | $1:N$ | **Referenced Array** (`boards` in `User`) | Dynamic query across all boards | Enables instant workspace authorization during JWT login hydration without extra database roundtrips. |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** cluster URI (or local MongoDB v6+)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Ramesha06/syncboard-client.git
cd syncboard-client

# Install all dependencies for both client and server
npm run install:all
```

*(Alternatively, run `npm install` inside both `syncboard-client/` and `syncboard-server/`)*.

---

### 2. Configure Environment Variables

#### Backend (`syncboard-server/.env`)
Create `syncboard-server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/syncboard?retryWrites=true&w=majority
```

#### Frontend (`syncboard-client/.env`)
Create `syncboard-client/.env` (optional, defaults to proxy `http://localhost:5000`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

### 3. Seed Database with Initial Data

Populate default workspaces, users, and tasks into your MongoDB Atlas database:

```bash
cd syncboard-server
npm run db:seed
```

**Seeded Credentials:**
- `ramesha@syncboard.com` / `password123`
- `gimhan@syncboard.com` / `password123`
- `kavindu@syncboard.com` / `password123`

---

### 4. Run Development Servers

From the repository root, start both servers:

```bash
# Terminal 1 — Start Backend Server (runs on port 5000)
npm run dev:server

# Terminal 2 — Start Frontend Client (runs on port 5173)
npm run dev:client
```

Open your browser at `http://localhost:5173/syncboard-client/`.

---

## 📡 REST API Endpoints Specification

All API endpoints reside under the `/api` prefix and return standard JSON response envelopes.

### Health & Diagnostics
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Database connection status and server health | No |

### Authentication
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | 201 / 409 |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | 200 / 401 |

### Boards & Workspaces
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/boards` | List workspaces accessible to user | 200 |
| `GET` | `/api/boards/:id` | Get single board details | 200 / 404 |
| `POST` | `/api/boards` | Create a new board workspace | 201 / 400 |

### Tasks
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | List tasks (supports `?boardId=` and `?status=`) | 200 |
| `GET` | `/api/tasks/:id` | Fetch task by MongoDB ObjectId | 200 / 404 |
| `POST` | `/api/tasks` | Create task attached to `boardId` | 201 / 400 |
| `PUT` | `/api/tasks/:id` | Replace / full update of a task | 200 / 404 |
| `PATCH` | `/api/tasks/:id` | Partial update (status, assignee, etc.) | 200 / 404 |
| `DELETE` | `/api/tasks/:id` | Delete task from database | 204 / 404 |

---

## 🧪 Postman & Newman Automated Testing

SyncBoard provides a verified Postman collection and environment in `postman/` that validates live MongoDB persistence:

```bash
# Run automated acceptance test suite with Newman CLI
newman run postman/SyncBoard.postman_collection.json \
  -e postman/SyncBoard.postman_environment.json \
  --env-var "baseUrl=http://localhost:5000" \
  --reporters cli
```

### Acceptance Test Verifications:
1. **Dynamic ID Chaining:** Extracts `boardId` from `/api/boards` and `taskId` from `/api/tasks`.
2. **Server Restart Persistence:** Data created prior to a server reboot remains intact upon server relaunch.
3. **Duplicate Prevention:** Attempting duplicate registration triggers HTTP `409 Conflict` (`E11000`).
4. **Malformed ID Guard:** Requesting an invalid hex string (e.g. `/api/tasks/invalid-123`) triggers HTTP `404 Not Found` (`CastError`).

---

## 🏗️ Repository Monorepo Structure

```text
syncboard/
├── README.md                      # Primary project documentation
├── package.json                   # Monorepo root scripts & dev runners
├── .env.example                   # Environment variable template
├── docs/                          # Assignment 03 documentation
│   ├── DATA_MODELING.md           # MongoDB data modeling justification
│   ├── ATLAS_SETUP.md             # MongoDB Atlas cloud setup guide
│   └── ASSIGNMENT_03_REPORT.md    # Assignment 03 formal report
├── postman/                       # Postman testing suite
│   ├── README.md                  # Test instructions & Newman guide
│   ├── SyncBoard.postman_collection.json
│   └── SyncBoard.postman_environment.json
├── syncboard-client/              # React 18 + Vite frontend
│   ├── src/
│   │   ├── api/                   # API clients (taskApi, authApi)
│   │   ├── components/            # Kanban board, modals, task cards
│   │   ├── context/               # AuthContext, TaskContext, ThemeContext
│   │   ├── pages/                 # BoardPage, LoginPage, RegisterPage
│   │   └── utils/                 # Client validation & formatters
│   ├── package.json
│   └── vite.config.js
└── syncboard-server/              # Node.js + Express backend
    ├── server.js                  # Entry point
    ├── app.js                     # Express app setup & route mounting
    ├── src/
    │   ├── config/                # Environment variables & constants
    │   ├── controllers/           # HTTP request & response handlers
    │   ├── db/                    # Mongoose connection & seed script
    │   ├── middlewares/           # Error handler, auth, validateObjectId
    │   ├── models/                # User, Board, Task Mongoose schemas
    │   ├── repositories/          # MongoDB data access layer
    │   ├── routes/                # Express REST router definitions
    │   └── services/              # Business logic layer
    └── package.json
```

---

## 📄 License

This project was developed for academic coursework by Group 96. All rights reserved.
