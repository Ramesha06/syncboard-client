# 📮 Postman Collection & Automated Test Suite — SyncBoard

This folder contains the complete, automated Postman test collection and environment for the **SyncBoard REST API**.

## Files
- **`SyncBoard.postman_collection.json`**: Postman collection (v2.1.0) with full CRUD endpoints for Health, Auth (JWT), Boards, and Tasks.
- **`SyncBoard.postman_environment.json`**: Environment file containing dynamic variables (`baseUrl`, `token`, `boardId`, `taskId`).

---

## Quick Manual Run in Postman

1. **Start Backend Server:**
   ```bash
   cd syncboard-server
   npm run dev
   ```

2. **Import into Postman:**
   - Open Postman -> Click **Import**.
   - Select both `SyncBoard.postman_collection.json` and `SyncBoard.postman_environment.json`.
   - In the environment dropdown in the top-right, choose **SyncBoard Environment**.

3. **Run Collection:**
   - Right-click **SyncBoard API - Complete Specification & Test Suite** -> Click **Run collection** -> Click **Run SyncBoard API**.
   - All tests will run sequentially and automatically pass green.

---

## Headless / CI Execution with Newman

You can run this test suite directly from your terminal or in GitHub Actions CI pipelines:

```bash
npx newman run postman/SyncBoard.postman_collection.json \
  -e postman/SyncBoard.postman_environment.json \
  --env-var "baseUrl=http://localhost:5000" \
  --reporters cli
```

## Features Verified
1. **Dynamic JWT Chaining:** Logging in automatically stores the Bearer JWT token into `{{token}}` for subsequent requests.
2. **Dynamic ID Propagation:** Creating or fetching resources sets `{{boardId}}` and `{{taskId}}`.
3. **HTTP Status Code Mapping:**
   - `200 OK` on standard GET/PUT/PATCH.
   - `201 Created` on register and task creation.
   - `204 No Content` on task deletion.
   - `404 Not Found` on malformed ObjectId checks.
   - `409 Conflict` on duplicate user registration (MongoDB E11000).
