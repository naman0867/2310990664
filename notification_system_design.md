# Notification System Design

---

## Stage 2

### Database Choice:
I would use **PostgreSQL** because it provides strong consistency, indexing support, and scalability for structured data like notifications.

### Schema:

Table: notifications
- id (UUID, Primary Key)
- student_id (INT, indexed)
- type (ENUM: Event, Result, Placement)
- message (TEXT)
- is_read (BOOLEAN, default false)
- created_at (TIMESTAMP, indexed)

### Scaling Problems:
- Large data → slow queries
- High read traffic
- Sorting delays

### Solutions:
- Composite indexing (student_id, is_read, created_at)
- Pagination (LIMIT/OFFSET)
- Table partitioning by date

---

## Stage 3

### Problem with Query:

### Issues:
- Full table scan without index
- Sorting overhead
- Fetching unnecessary columns

### Optimized Solution:

### Index:

### Why NOT index every column?
- Slows insert/update operations
- Wastes storage
- Not useful for unused queries

### Placement Query (Last 7 Days):

---

## Stage 4

### Problem:
Database overload due to frequent reads.

### Solutions:

1. **Caching (Redis)**
   - Store recent notifications
   - Reduce DB load

2. **Pagination**
   - Load only required data

3. **Lazy Loading**
   - Load data on scroll

4. **Read Replicas**
   - Distribute read traffic

### Tradeoffs:
- Cache inconsistency
- Additional infrastructure complexity

---

## Stage 5

### Problems:
- Sequential processing → slow
- No retry mechanism
- Failure stops execution

### Improved Design:

Use **Message Queue (Kafka / RabbitMQ)**

### Flow:
1. Save notification to DB
2. Push event to queue
3. Workers process:
   - Send email
   - Push app notification

### Benefits:
- Scalable
- Fault-tolerant
- Retry support

### DB + Email together?
No → use **eventual consistency**

---

## Stage 6

### Approach:
Priority based on:
- Type weight
- Recency

### Weights:
- Placement = 3
- Result = 2
- Event = 1

### Code:

```js
function getPriorityScore(notification) {
    const weights = {
        Placement: 3,
        Result: 2,
        Event: 1
    };

    const timeDiff = Date.now() - new Date(notification.Timestamp).getTime();

    return weights[notification.Type] * 1000000 - timeDiff;
}

function getTopNotifications(notifications, n = 10) {
    return notifications
        .map(noti => ({
            ...noti,
            score: getPriorityScore(noti)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, n);
}

---

# ⚡ STEP 2 — QUICK README (important)

Create `README.md`:

```md
# Notification System Backend

## Features
- Logging Middleware
- Notification API
- Priority Notification Logic
- Scalable Design

## Tech Stack
- Node.js
- Express

## How to Run
npm install
node index.js