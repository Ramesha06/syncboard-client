# MongoDB Atlas Setup & Configuration Guide

This guide provides a step-by-step walkthrough for provisioning, configuring, securing, and connecting a cloud-hosted **MongoDB Atlas** database cluster for the **SyncBoard** full-stack application (Assignment 03).

---

## 1. Prerequisites

Before beginning, ensure you have:
- A modern web browser.
- A free account at [MongoDB Cloud](https://www.mongodb.com/cloud/atlas).
- Node.js (v18+) and npm (v9+) installed locally.
- Git repository cloned to your workstation.

---

## 2. Step-by-Step Cluster Setup

### Step 1: Create an Atlas Project
1. Log in to your [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. In the top-left navigation, click **Projects** $\rightarrow$ **New Project**.
3. Name your project (e.g., `SyncBoard-Project` or `Group-96-Workspace`).
4. Click **Next**, add team members if required, and click **Create Project**.

### Step 2: Deploy an M0 Free Tier Cluster
1. From the project overview, click the green **Build a Database** button.
2. Under deployment options, select the **M0 Shared (Free)** tier:
   - **Cloud Provider:** AWS (or Google Cloud).
   - **Recommended Region:** Select the region geographically closest to you (e.g., `ap-southeast-1` Singapore or `eu-central-1` Frankfurt) to minimize network latency.
   - **Cluster Name:** Leave as `Cluster0` or name it `syncboard-cluster`.
3. Click **Create Deployment**.

---

### Step 3: Create Database User Credentials
1. In the left navigation menu, under **Security**, click **Database Access**.
2. Click **Add New Database User**.
3. Configure the user credentials:
   - **Authentication Method:** Password (SCRAM-SHA-256).
   - **Username:** `syncboard_admin` (or your chosen username).
   - **Password:** Click **Autogenerate Secure Password** or enter a strong alphanumeric password (e.g., `SyncBoardSecret2026!`).
   - **Database User Privileges:** Select **Read and write to any database** (built-in role).
4. Click **Add User** to finalize credentials.

> [!WARNING]
> Keep your password secure. Do not use special characters that require URL-encoding (such as `@`, `:`, `/`, or `%`) in your raw password string to prevent connection string parsing issues.

---

### Step 4: Configure Network Access & IP Whitelist
1. In the left navigation menu, under **Security**, click **Network Access**.
2. Click **Add IP Address**.
3. To allow connections from any development workstation and CI runners (e.g., Newman automated testing):
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Comment: `Development & Testing Access`.
4. Click **Confirm**. The status will show as **Pending**, then transition to **Active** within 60 seconds.

> [!NOTE]
> For production deployments, restrict IP access to your static production server IP address rather than using `0.0.0.0/0`.

---

### Step 5: Extract the Connection String (SRV URI)
1. In the left navigation menu, under **Deployment**, click **Database**.
2. Click the **Connect** button next to your cluster.
3. Select **Drivers** (Node.js).
4. Select Driver: **Node.js**, Version: **6.7 or later**.
5. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@<cluster-url>/syncboard?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials, and specify the database name `syncboard`.

---

## 3. Local Server Configuration

### Step 1: Configure Environment Variables
Inside the `syncboard-server/` directory, create or edit your `.env` file:

```bash
# Navigate to backend server
cd syncboard-server

# Create .env from template
cp .env.example .env
```

Set the `MONGODB_URI` environment variable in `syncboard-server/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_32_characters_long
MONGODB_URI=mongodb+srv://syncboard_admin:YourSecurePassword123@cluster0.abcde.mongodb.net/syncboard?retryWrites=true&w=majority
```

---

## 4. Seeding the Database

SyncBoard includes an automated seeding script (`syncboard-server/src/db/seed.js`) that provisions initial test data, including default users, workspaces, boards, and pre-categorized tasks.

Run the seed script from the `syncboard-server` directory:

```bash
npm run db:seed
```

### Expected Output:
```text
MongoDB connected: cluster0-shard-00-00.abcde.mongodb.net/syncboard
Clearing existing collections...
Seeding users...
Seeding boards...
Seeding tasks...

Seed complete:
  Users:  3
  Boards: 2
  Tasks:  9

Login with any seeded user + password: "password123"
  ramesha@syncboard.com / gimhan@syncboard.com / kavindu@syncboard.com
```

---

## 5. Verification & Health Monitoring

### 5.1 Verifying via API Health Endpoint
Start the server:
```bash
npm run dev
```

Send a GET request to the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected JSON response (HTTP 200):
```json
{
  "status": "ok",
  "database": {
    "status": "connected",
    "name": "syncboard",
    "host": "cluster0-shard-00-00.abcde.mongodb.net"
  },
  "timestamp": "2026-09-05T16:00:00.000Z"
}
```

### 5.2 Verifying via MongoDB Atlas Data Explorer
1. Open the Atlas web console and navigate to **Database** $\rightarrow$ **Browse Collections**.
2. Confirm the presence of the `syncboard` database with three collections:
   - `users`: Contains 3 seeded user documents with bcrypt-hashed passwords.
   - `boards`: Contains `Main Workspace` and `Executive Board` documents with `members` references.
   - `tasks`: Contains 9 initial task cards categorized into `todo`, `in_progress`, and `done`.

### 5.3 Verifying via MongoDB Compass
1. Download and open [MongoDB Compass](https://www.mongodb.com/products/compass).
2. Paste your `mongodb+srv://...` connection URI.
3. Click **Connect** to interactively view documents, schemas, and compound index performance.

---

## 6. Troubleshooting Common Connection Issues

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`MongoServerSelectionError: connection timed out`** | IP whitelist missing or workstation IP changed. | Navigate to Atlas $\rightarrow$ **Network Access** and verify `0.0.0.0/0` is listed and active. |
| **`MongoServerError: bad auth : Authentication failed`** | Incorrect username or password in connection URI. | Verify password in Atlas **Database Access**. If password contains special characters (e.g. `@`, `/`), URL-encode them or create a simple alphanumeric password. |
| **`getaddrinfo ENOTFOUND ...`** | DNS resolver blocking SRV records. | Change local DNS to Google Public DNS (`8.8.8.8` / `8.8.4.4`) or Cloudflare (`1.1.1.1`). |
| **`E11000 duplicate key error collection`** | Attempting to register an email that already exists. | Expected behavior; server error handler returns HTTP 409 Conflict. Use a new unique email address. |
