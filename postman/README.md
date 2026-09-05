# Postman Test Run - Member 8 (End-to-End Persistence)

This file documents the quick, repeatable steps to run the Postman collection added for Assignment 03 and the expected outcomes. It is intended for local/manual verification and for running with Newman in CI.

Prerequisites
- MongoDB URI configured in syncboard-server/.env (MONGODB_URI)
- Node and npm installed
- Backend seeded and runnable (see syncboard-server/src/db/seed.js)

Quick Manual Run
1. From the syncboard-server folder:
   - npm install
   - npm run db:seed    # or: node src/db/seed.js
   - npm run dev        # or: npm start

2. Import into Postman:
   - Collection: postman/SyncBoard.postman_collection.json
   - Environment: postman/SyncBoard.postman_environment.json
   - Select the "SyncBoard Environment" before running any requests.

3. Run requests in the exact order below (the collection contains small test scripts that set environment variables):
   - Get Boards            -> extracts first board id and sets {{boardId}}
   - Create task           -> uses {{boardId}} and sets {{taskId}}
   - Get task by id        -> verifies the created task exists (expect 200)

   Manual restart step:
   - Stop the backend server (Ctrl+C) and restart it (npm run dev)
   - Run Get task by id again with the same {{taskId}} -> expect 200 (confirms persistence)

   Acceptance checks:
   - Register user (first)   -> 201 Created
   - Register user (duplicate)-> 409 Conflict (duplicate email, E11000 mapped to 409)
   - Malformed task id        -> GET /api/tasks/invalid-123 -> expect 404 Not Found

Headless / CI run with Newman
1. Install newman: npm i -g newman
2. Run the collection against a local server:
   newman run postman/SyncBoard.postman_collection.json -e postman/SyncBoard.postman_environment.json --env-var "baseUrl=http://localhost:4000" --reporters cli,json

Notes & Troubleshooting
- If Create task succeeds but Get task by id fails after restart: verify the DB seed and that your backend uses a persistent MongoDB (not in-memory) and MONGODB_URI is correct.
- If Register user duplicate returns 500: verify the centralized error handler maps MongoDB E11000 duplicate key errors to HTTP 409 responses.
- If Malformed task id returns 500: verify validateObjectId middleware is implemented and applied to /api/tasks/:id.
- The Postman test scripts read id or _id from responses; model toJSON transforms that map _id -> id are recommended but not required for the collection to work.

Files included
- postman/SyncBoard.postman_collection.json
- postman/SyncBoard.postman_environment.json

If you want, I can also open a PR with these files and this README section included in the repository README.md instead of a separate file. Reply with your preference and I'll proceed.
