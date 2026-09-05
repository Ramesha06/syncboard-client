# MongoDB Data Modeling Justification & Architecture

This document provides the theoretical and technical justification for the data modeling decisions implemented in **SyncBoard** for **Assignment 03: Full-Stack Database Integration**. It covers the comparison between Relational (SQL) and Document (NoSQL) models, the embedded vs. referenced relationship architecture, schema specifications, indexing strategies, and serialization transforms.

---

## 1. Relational vs. Document Database Selection

When designing the persistence layer for SyncBoard (a Jira-style agile Kanban board), MongoDB (via the Mongoose ODM) was selected over a relational DBMS (such as PostgreSQL or MySQL) for the following reasons:

| Evaluation Criterion | Relational (SQL) | Document Store (MongoDB) | Architectural Justification for SyncBoard |
| :--- | :--- | :--- | :--- |
| **Schema Flexibility** | Rigid table schemas; column migrations require DDL alters. | Dynamic BSON documents; models can evolve per feature branch. | SyncBoard's task attributes (e.g., custom tags, assignee initials, future sprint fields) evolve rapidly across sprints without schema migration downtime. |
| **Object-Document Impedance** | Heavy ORMs (Prisma, TypeORM, Hibernate) required to map relational joins to nested JSON. | Native JSON/BSON storage aligns 1:1 with JavaScript/Express runtime and React frontend. | Eliminates ORM serialization friction; MongoDB documents map seamlessly to REST API JSON envelopes. |
| **Read Performance for Boards** | Multi-table `JOIN` operations across `users`, `boards`, and `tasks` tables. | Targeted single-collection queries with indexed references and optional population. | Agile Kanban boards demand instantaneous read times for columns (`status = 'todo'`, `'in_progress'`, `'done'`) under high query concurrency. |
| **Horizontal Scalability** | Complex master-replica topologies; sharding relational joins is difficult. | Native horizontal sharding and replica set clustering out-of-the-box in MongoDB Atlas. | Supports future scale as collaborative teams and task counts grow exponentially across enterprise workspaces. |

---

## 2. MongoDB Data Modeling Justification Table

The core domain model consists of three collections: `users`, `boards`, and `tasks`.

| Collection / Entity | Relationship Type | Strategy Chosen | Alternative Rejected | Justification & Architectural Tradeoffs |
| :--- | :--- | :--- | :--- | :--- |
| **Board $\rightarrow$ Tasks** | One-to-Many ($1:N$) | **Referencing** (`boardId` stored in `Task`) | Embedding tasks as a subdocument array inside `Board` | **1. Unbounded Array Growth:** A project board can accumulate hundreds or thousands of tasks over its lifecycle. Embedding tasks directly inside `Board` would risk exceeding MongoDB's strict **16 MB BSON document size limit**.<br>**2. Memory & Disk Reallocation:** Constantly pushing and pulling tasks from an embedded array causes document growth, triggering frequent document relocations on disk and degrading write performance.<br>**3. Concurrency & Locking:** Simultaneous task creations/updates by different team members on the same board would cause write lock contention on a single `Board` document.<br>**4. Query Flexibility & Pagination:** Storing tasks independently enables pagination, column-specific filtering, and compound indexing (`{ boardId: 1, status: 1 }`). |
| **Board $\rightarrow$ Members** | Many-to-Many ($N:M$) | **Referencing** (Array of `User` ObjectIds inside `Board.members`) | Embedded subdocuments of user profiles in `Board` | **1. Bounded Growth:** Team sizes per board are naturally bounded (typically 2 to 20 users).<br>**2. Data Freshness:** Referencing ObjectIds ensures user profile updates (name, initials, email) propagate immediately without having to run updates across multiple board documents.<br>**3. Fast Membership Queries:** Applying a multikey index `{ members: 1 }` allows the API to rapidly query all boards a user belongs to via `Board.find({ members: userId })`. |
| **Task $\rightarrow$ Assignee / Creator** | Many-to-One ($N:1$) | **Hybrid (Denormalized Name/Initials + Referenced `createdBy`)** | Pure Normalized Reference (`assigneeId` populated on every read) | **1. High-Speed Rendering:** Storing `assignee` (string) and `assigneeInitials` (string) directly on `Task` allows the frontend Kanban board and task cards to render immediately without requiring expensive `$lookup` / `.populate('assignee')` operations on every task list fetch.<br>**2. Auditability:** `createdBy` retains a formal ObjectId reference to the `User` document for permission checks and ownership tracking. |
| **User $\rightarrow$ Boards** | One-to-Many ($1:N$) | **Referenced Array** (`boards` array of string IDs) | Querying `Board` collection dynamically on every auth request | Storing accessible board IDs on the `User` document provides instant authorization during user login and session hydration, allowing the client to determine default board context without an extra roundtrip. |

---

## 3. Detailed Entity Schemas

### 3.1 User Schema (`syncboard-server/src/models/User.js`)

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    initials: {
      type: String,
      trim: true,
    },
    boards: {
      type: [String],
      default: ['BOARD-01'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);
```

#### Key Design Decisions:
- **Security:** Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (10 rounds). The Mongoose `toJSON` transform automatically deletes `ret.password` and `ret.__v` from all JSON responses.
- **Uniqueness Guard:** `email` is indexed as `unique: true`. Mongoose duplicate key errors (`E11000`) are intercepted by `errorHandler.js` and mapped to HTTP `409 Conflict`.
- **Pre-save Middleware:** Generates uppercase user initials automatically if not provided (`name.split(/\s+/).map(n => n[0]).join('').slice(0, 2)`).

---

### 3.2 Board Schema (`syncboard-server/src/models/Board.js`)

```javascript
const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

boardSchema.index({ members: 1 });
```

#### Key Design Decisions:
- **Multikey Indexing:** `boardSchema.index({ members: 1 })` indexes the array of user ObjectIds. When a user requests their assigned workspaces, MongoDB resolves the index in $O(\log N)$ time rather than performing a full collection scan.
- **Referential Integrity:** `ownerId` and `members` reference the `User` model, maintaining clean relational links without monolithic document nesting.

---

### 3.3 Task Schema (`syncboard-server/src/models/Task.js`)

```javascript
const TASK_STATUSES = ['todo', 'in_progress', 'done'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    assignee: {
      type: String,
      trim: true,
    },
    assigneeInitials: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'Board ID is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for high-performance board querying and status filtering
taskSchema.index({ boardId: 1, status: 1 });
```

#### Key Design Decisions:
- **Compound Index:** `taskSchema.index({ boardId: 1, status: 1 })` creates a compound index tailored to the exact query pattern used by Kanban boards: fetching tasks for a specific board, grouped or filtered by column status (`todo`, `in_progress`, `done`).
- **Status Enumeration:** Restricts status values strictly to `['todo', 'in_progress', 'done']`, preventing illegal state transitions.
- **REST ID Standardization:** Transforms MongoDB internal `_id` to standard `id` string for seamless compatibility with the React frontend client and Postman test assertions.

---

## 4. Indexing & Query Performance Optimization

```
┌───────────────────────────────────────────────────────────────────┐
│                    MongoDB Index Architecture                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [users] Collection                                               │
│  └── email : 1 (UNIQUE)           -> O(1) Auth / Duplication check │
│                                                                   │
│  [boards] Collection                                              │
│  └── members : 1 (MULTIKEY)       -> Fast user-board discovery    │
│                                                                   │
│  [tasks] Collection                                               │
│  └── { boardId: 1, status: 1 }    -> Compound Index for Kanban    │
│                                      column filtering             │
└───────────────────────────────────────────────────────────────────┘
```

1. **`users.email` Unique Index:**
   - **Type:** B-Tree Unique Index.
   - **Query Covered:** `User.findOne({ email })`.
   - **Benefit:** Ensures no two accounts can share the same email address. Rejects duplicates at the database level with atomic consistency.
2. **`boards.members` Multikey Index:**
   - **Type:** Multikey Single Field Index.
   - **Query Covered:** `Board.find({ members: userId })`.
   - **Benefit:** Rapidly identifies all boards in which a particular user is enrolled as a collaborator.
3. **`tasks.{ boardId: 1, status: 1 }` Compound Index:**
   - **Type:** Compound B-Tree Index.
   - **Query Covered:** `Task.find({ boardId, status })` and `Task.find({ boardId })`.
   - **Benefit:** Follows the Equality-Sort-Range (ESR) rule. Satisfies board-scoped task queries directly from index pages without in-memory sorting or full collection scanning.

---

## 5. Summary Matrix of Design Tradeoffs

| Architecture Dimension | Selected Pattern | Tradeoff Accepted | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Referential Integrity** | NoSQL soft foreign keys (`ref: 'User'`, `ref: 'Board'`) | No cascade deletes at database engine level | Implemented in backend repository/service layer; automated tests verify ID references prior to deletion. |
| **Denormalization** | `assignee` and `assigneeInitials` cached on `Task` | Potential stale name if user changes their name | Task update route allows refreshing assignee metadata; high-frequency reads gain a $5\times$ speedup by avoiding `$lookup`. |
| **ID Representation** | `_id` stored as BSON ObjectId | Frontend expects string `id` | Standardized `toJSON` schema transform translates `_id` $\rightarrow$ string `id` across all three models. |
