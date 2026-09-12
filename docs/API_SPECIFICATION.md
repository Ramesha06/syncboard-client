# 📡 SyncBoard API Specifications Guide

**Course:** Software Engineering / Web Application Development  
**Project:** SyncBoard — Collaborative Agile Kanban Management Platform  
**Deliverable Item:** **API Specifications (Swagger / Postman collection)**  
**Specification Version:** OpenAPI 3.0.3 / Postman Collection v2.1.0  

---

## 1. Overview of the Deliverable

For the **"API Specifications (Swagger / Postman collection)"** deliverable, SyncBoard provides a comprehensive, production-ready specification through **two complementary formats**:

1. **Interactive Swagger (OpenAPI 3.0)**:
   - Hosted live directly within the Express backend at `/api-docs`.
   - Allows evaluators to visually inspect all endpoints, data schemas, validation constraints, and run live interactive tests directly in any browser.
   - Raw OpenAPI 3.0 specification file exportable at `/api/docs.json` or located in `syncboard-server/src/config/swagger.json`.

2. **Automated Postman Collection & Environment**:
   - Standardized `postman/SyncBoard.postman_collection.json` and `postman/SyncBoard.postman_environment.json`.
   - Covers 100% of CRUD endpoints across Authentication, Boards, Tasks, and Health diagnostics.
   - Features automated dynamic chaining (JWT token capture, `boardId` and `taskId` parameter extraction).
   - Includes test assertions for status codes (`200 OK`, `201 Created`, `204 No Content`, `404 Not Found`, `409 Conflict`).

---

## 2. Interactive Swagger UI (OpenAPI 3.0)

### 2.1 How to Access Swagger UI
1. Start the SyncBoard backend server:
   ```bash
   cd syncboard-server
   npm run dev
   ```
2. Open your browser and navigate to:
   - **Interactive Documentation:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
   - **Raw JSON Specification:** [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)
   *(If testing on your deployed cloud server, replace `http://localhost:5000` with your deployed URL, e.g. `https://your-app.onrender.com/api-docs`)*

### 2.2 Features Available in Swagger UI
- **Live Testing ("Try it out"):** Test every endpoint directly with one click.
- **Authorize with JWT:** Click the green **Authorize** button at the top right, paste your Bearer token, and test protected task routes.
- **Data Model Inspection:** View exact schema structures for `Task`, `Board`, `User`, and error responses.

---

## 3. Postman Collection & Environment

### 3.1 Files Included
- **Collection File:** `postman/SyncBoard.postman_collection.json`
- **Environment File:** `postman/SyncBoard.postman_environment.json`

### 3.2 Step-by-Step Instructions to Import into Postman
1. Open the **Postman** desktop application or Postman Web.
2. Click the **Import** button in the top-left corner.
3. Drag and drop both files:
   - `postman/SyncBoard.postman_collection.json`
   - `postman/SyncBoard.postman_environment.json`
4. In the top-right environment selector dropdown, select **SyncBoard Environment**.

### 3.3 Running the Automated Test Suite in Postman
1. Right-click the **SyncBoard API - Complete Specification & Test Suite** collection in the left sidebar.
2. Click **Run collection**.
3. Ensure all requests are checked and click **Run SyncBoard API**.
4. **Result:** All test assertions will execute in sequence with 100% PASS results:
   - ✅ `Health Check & DB Status` -> `200 OK`
   - ✅ `Register New User` -> `201 Created`
   - ✅ `Register Duplicate Email` -> `409 Conflict` (verifies MongoDB `E11000` error mapping)
   - ✅ `Login User` -> `200 OK` (extracts and saves `{{token}}` automatically)
   - ✅ `Get Boards` -> `200 OK` (extracts and saves `{{boardId}}`)
   - ✅ `Create Board Workspace` -> `201 Created`
   - ✅ `Create Task` -> `201 Created` (extracts and saves `{{taskId}}`)
   - ✅ `Get All Tasks` -> `200 OK`
   - ✅ `Get Task by ID` -> `200 OK`
   - ✅ `Update Task (PATCH Status)` -> `200 OK`
   - ✅ `Update Task (PUT Full Replace)` -> `200 OK`
   - ✅ `Delete Task by ID` -> `204 No Content`
   - ✅ `Malformed Task ID Check` -> `404 Not Found` (verifies `validateObjectId` middleware)

---

## 4. Headless Execution with Newman (CI/CD Automated Testing)

You can run the entire collection from the command line or within GitHub Actions CI pipelines using Newman:

```bash
# Run collection using npx (no global install required)
npx newman run postman/SyncBoard.postman_collection.json \
  -e postman/SyncBoard.postman_environment.json \
  --env-var "baseUrl=http://localhost:5000" \
  --reporters cli
```

---

## 5. Summary Table of REST API Endpoints

| Category | HTTP Method | Endpoint Path | Description | Expected Status Codes | Auth Required |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **Diagnostics** | `GET` | `/api/health` | Server uptime & MongoDB connection state | `200 OK` | No |
| **Authentication**| `POST`| `/api/auth/register` | Register new account with bcrypt hashing | `201 Created`, `409 Conflict` | No |
| **Authentication**| `POST`| `/api/auth/login` | Authenticate credentials & return JWT | `200 OK`, `401 Unauthorized` | No |
| **Boards** | `GET` | `/api/boards` | List accessible workspaces | `200 OK` | Optional |
| **Boards** | `GET` | `/api/boards/:id` | Fetch specific board details | `200 OK`, `404 Not Found` | Optional |
| **Boards** | `POST`| `/api/boards` | Create a new board workspace | `201 Created`, `400 Bad Request` | Optional |
| **Tasks** | `GET` | `/api/tasks` | List tasks (filters: `boardId`, `status`, `search`) | `200 OK`, `401 Unauthorized` | **Yes (JWT)** |
| **Tasks** | `GET` | `/api/tasks/:id` | Fetch task by MongoDB ObjectId | `200 OK`, `404 Not Found` | **Yes (JWT)** |
| **Tasks** | `POST`| `/api/tasks` | Create task with board assignment | `201 Created`, `400 Bad Request` | **Yes (JWT)** |
| **Tasks** | `PATCH`| `/api/tasks/:id`| Update status or specific task fields | `200 OK`, `404 Not Found` | **Yes (JWT)** |
| **Tasks** | `PUT` | `/api/tasks/:id` | Full replacement / update of task | `200 OK`, `404 Not Found` | **Yes (JWT)** |
| **Tasks** | `DELETE`| `/api/tasks/:id`| Delete task permanently | `204 No Content`, `404 Not Found` | **Yes (JWT)** |

---

## 6. What to Submit in Your Assignment Form

When filling out your final project submission form, paste the following information in the **API Specifications (Swagger / Postman collection)** section:

```markdown
### Deliverable: API Specifications (Swagger / Postman collection)

1. Swagger (OpenAPI 3.0) Interactive UI:
   - Local: http://localhost:5000/api-docs
   - Deployed: <Your Deployed Backend URL>/api-docs
   - OpenAPI Spec JSON: <Your Deployed Backend URL>/api/docs.json (also located at syncboard-server/src/config/swagger.json)

2. Postman Collection & Environment:
   - Collection File: postman/SyncBoard.postman_collection.json
   - Environment File: postman/SyncBoard.postman_environment.json
   - Includes automated pre-request scripts, JWT token chaining, dynamic ID propagation, and test assertions.

3. Headless Verification:
   - Automated Newman test command:
     npx newman run postman/SyncBoard.postman_collection.json -e postman/SyncBoard.postman_environment.json --env-var "baseUrl=http://localhost:5000"
```
