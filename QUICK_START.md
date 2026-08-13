# CodeAmbers: Quick Reference - Supabase SQL Setup

**TL;DR - Run these 5 SQL files in Supabase in order, then add 3 env vars to backend/.env**

---

## 🏃 FAST TRACK (10 minutes to working)

### 1️⃣ SQL Files (Run in Supabase SQL Editor)

**Order matters!** Run each file, wait for "Success", then next.

```
File 1: backend/database/01-tables.sql
File 2: backend/database/02-rls.sql
File 3: backend/database/03-indexes.sql
File 4: backend/database/04-functions.sql
File 5: backend/database/05-initial-data.sql    (optional)
```

**How:**
```
1. Go to https://supabase.com/dashboard
2. Select project → SQL Editor → New Query
3. Copy-paste entire file content
4. Click Run (Cmd+Enter)
5. Wait for "Success"
6. Repeat for next file
```

---

### 2️⃣ Environment Variables

**Get from Supabase:**
1. Dashboard → Settings → API
2. Copy: Project URL, anon key, service_role key

**Create `backend/.env`:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-key...
```

---

### 3️⃣ Start & Test

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Run tests
cd backend && \
API_URL=http://localhost:8080 \
WS_URL=ws://localhost:8080 \
node scripts/integration-test.js

# Should see: Tests Passed: 8, Tests Failed: 0
```

---

### 4️⃣ Start Frontend

```bash
# Terminal 3
cd frontend && npm run dev

# Open http://localhost:3000
```

---

## ✅ What Each SQL File Does

| # | File | What It Creates |
|---|------|-----------------|
| 1 | 01-tables.sql | 10 tables (users, workspaces, files, etc) |
| 2 | 02-rls.sql | Security (who can see what) |
| 3 | 03-indexes.sql | Speed (45+ performance indexes) |
| 4 | 04-functions.sql | Automation (triggers, helpers) |
| 5 | 05-initial-data.sql | Demo data (optional, for testing) |

---

## 🔍 How to Know It Works

- ✅ Backend logs: `"supabaseConfigured": true`
- ✅ Integration tests: `8 passed, 0 failed`
- ✅ Health check: `curl http://localhost:8080/api/health/detailed | jq .`
- ✅ Supabase tables: Have data in them
- ✅ Frontend: Can sign up and create workspace
- ✅ Can chat with AI and get responses

---

## ⚠️ Common Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Running SQL files out of order | Run: 01, 02, 03, 04, 05 (in that order) |
| Running SQL files twice | Just run once per file |
| Wrong Supabase keys in .env | Copy from: Dashboard → Settings → API |
| Forgot to save .env file | Make sure file is saved in backend/ folder |
| Running tests without backend | Start backend first: `npm run dev` |
| Frontend can't connect | Check frontend/.env.local has correct URLs |

---

## 🆘 If Tests Fail

```bash
# 1. Check backend logs for errors
# Look for: "Error connecting to Supabase"

# 2. Verify .env variables
cat backend/.env | grep SUPABASE

# 3. Check all SQL files ran successfully
# Go to Supabase → Table Editor
# Should see: users, workspaces, files, conversations, messages, etc

# 4. Restart everything
# Kill backend (Ctrl+C)
# npm run dev
# Run tests again
```

---

## 📁 File Locations

```
/backend/database/
  ├─ 01-tables.sql         ← Run first in Supabase
  ├─ 02-rls.sql            ← Run second in Supabase
  ├─ 03-indexes.sql        ← Run third in Supabase
  ├─ 04-functions.sql      ← Run fourth in Supabase
  └─ 05-initial-data.sql   ← Run fifth (optional)

/backend/
  ├─ .env                  ← Create this with Supabase keys
  ├─ server.js             ← Backend entry point
  └─ scripts/
     └─ integration-test.js ← Run tests with this

/frontend/
  └─ .env.local            ← Create this with API URLs
```

---

## 🚀 Commands Reference

```bash
# Start backend
cd backend && npm run dev

# Run tests
cd backend && API_URL=http://localhost:8080 WS_URL=ws://localhost:8080 node scripts/integration-test.js

# Start frontend
cd frontend && npm run dev

# Check health
curl http://localhost:8080/api/health

# Check detailed status
curl http://localhost:8080/api/health/detailed | jq .

# Create test workspace
curl -X POST http://localhost:8080/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' | jq .
```

---

## 🎯 Success Path

```
SQL files ✓
   ↓
.env vars ✓
   ↓
Backend start ✓ (supabaseConfigured: true)
   ↓
Tests pass ✓ (8/8)
   ↓
Frontend start ✓ (localhost:3000)
   ↓
Sign up ✓
   ↓
Create workspace ✓
   ↓
Chat with AI ✓
   ↓
🎉 DONE!
```

---

## 📖 Full Guides

- **SUPABASE_SETUP.md** - Detailed Supabase guide
- **NEXT_STEPS.md** - Complete wiring instructions  
- **INTEGRATION_GUIDE.md** - API documentation
- **COMPLETION_SUMMARY.md** - Architecture overview

---

**Last Updated:** May 29, 2026
**Status:** All systems ready for Supabase integration
