# CodeAmbers: Next Steps to Get Everything Working

Now that you have all the Supabase SQL files, here's exactly what to do **in order** to wire everything together.

## 🎯 The Complete Path

```
1. Run SQL files in Supabase      (5 min)
   ↓
2. Configure environment vars     (2 min)
   ↓
3. Restart backend                (1 min)
   ↓
4. Run integration tests           (1 min)
   ↓
5. Wire frontend to backend        (5 min)
   ↓
6. Test end-to-end                 (5 min)
   ↓
✅ Everything works!
```

---

## 📋 STEP 1: Run SQL Files in Supabase (5 minutes)

### Files to run (in this exact order):
1. `backend/database/01-tables.sql`
2. `backend/database/02-rls.sql`
3. `backend/database/03-indexes.sql`
4. `backend/database/04-functions.sql`
5. `backend/database/05-initial-data.sql` (optional, for testing)

### For each file:

```
1. Go to https://supabase.com/dashboard
2. Select your CodeAmbers project
3. Click "SQL Editor" (left sidebar)
4. Click "+ New Query"
5. Copy ALL text from the SQL file
6. Paste into editor
7. Click "Run" (Cmd+Enter)
8. Wait for "Success" message
9. Proceed to next file
```

**⚠️ IMPORTANT:**
- Run files **IN ORDER** (01, 02, 03, 04, 05)
- Wait for each to complete before starting next
- Each should show "Success" with no errors
- Do NOT run multiple files at once
- Do NOT skip any files

### ✅ After completing all 5 files:

You should have:
- ✓ 10 tables created
- ✓ RLS policies active
- ✓ Performance indexes
- ✓ Trigger functions
- ✓ Sample demo data (if you ran 05)

---

## ⚙️ STEP 2: Configure Environment Variables (2 minutes)

### Get your Supabase keys:

1. Go to Supabase Dashboard
2. Select your CodeAmbers project
3. Click **Settings** → **API**
4. Copy these three values:
   - `Project URL`
   - `anon public` (key)
   - `service_role` (secret key)

### Create/Edit `backend/.env` file:

```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/backend
# Create .env file (or edit if exists)
```

### Add these lines to `.env`:

```bash
# === SUPABASE (NEW - Add these) ===
SUPABASE_URL=https://xxxxx-xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# === EXISTING VARIABLES (Keep these) ===
NODE_ENV=development
PORT=8080
API_PREFIX=/api
GEMINI_API_KEY=AIzaSy...your-gemini-key...
JWT_ACCESS_SECRET=your-secret-key-minimum-24-characters
JWT_REFRESH_SECRET=your-refresh-secret-minimum-24-chars
COOKIE_SECRET=your-cookie-secret
CLIENT_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=debug
WS_REQUIRE_AUTH=false
```

### Verify keys are correct:
- `SUPABASE_URL` should start with `https://`
- `SUPABASE_ANON_KEY` should start with `eyJhbGc`
- `SUPABASE_SERVICE_ROLE_KEY` should be long (150+ chars)
- No quotes around values
- No trailing spaces

### Save the file:
```bash
# Save .env in backend/ directory
```

---

## 🔄 STEP 3: Restart Backend (1 minute)

### Kill old process:
```bash
# If backend is still running, kill it
# In your terminal: Ctrl+C
```

### Start backend fresh:
```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/backend
PORT=8080 npm run dev
```

### Verify startup:
Look for these log lines (in this order):
```
> codeambers-backend@0.1.0 dev
> node server.js

{"level":"info","message":"CodeAmbers backend online",...
  "supabaseConfigured": true,    ← SHOULD BE TRUE NOW
  "hasGemini": true,
  ...
}
```

**If you see:**
- ✅ `supabaseConfigured: true` → Perfect! Supabase is wired
- ❌ `supabaseConfigured: false` → Check your `.env` variables

### Test health endpoint:
```bash
curl http://localhost:8080/api/health/detailed | jq .
```

Should show:
```json
{
  "services": {
    "database": {
      "enabled": true,
      "provider": "Supabase",     ← Should say Supabase, not "memory"
      "status": "connected"
    },
    ...
  }
}
```

---

## 🧪 STEP 4: Run Integration Tests (1 minute)

### Run tests:
```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/backend
API_URL=http://localhost:8080 \
WS_URL=ws://localhost:8080 \
node scripts/integration-test.js
```

### Expected output:
```
[INFO] CodeAmbers Backend Integration Tests
[SUCCESS] ✓ Health check passed
[SUCCESS] ✓ Detailed status retrieved
[INFO]   - Database: Supabase
[INFO]   - AI: ready
[SUCCESS] ✓ Auth flow passed
[SUCCESS] ✓ Workspace flow passed
[SUCCESS] ✓ File operations passed
[SUCCESS] ✓ WebSocket connected
[SUCCESS] ✓ WebSocket PING/PONG working
[SUCCESS] ✓ Credits endpoint passed

====================================
[SUCCESS] Tests Passed: 8
[SUCCESS] Tests Failed: 0
Success Rate: 100%
```

**If all 8 tests pass:** ✅ Backend is fully functional with Supabase

**If any tests fail:**
1. Check backend logs (terminal output)
2. Verify .env variables
3. Check Supabase SQL execution
4. See troubleshooting section below

---

## 🔗 STEP 5: Wire Frontend to Backend (5 minutes)

### Create `frontend/.env.local`:

```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
EOF
```

### Verify frontend env vars are set:
```bash
cat frontend/.env.local
# Should show:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
# NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Update frontend API client (if needed):

The frontend already has these files configured:
- ✅ `frontend/lib/api.ts` - REST client
- ✅ `frontend/lib/socket.ts` - WebSocket client
- ✅ `frontend/hooks/useBackendConnection.ts` - Connection management

These should automatically use your env vars.

---

## 🚀 STEP 6: Start Everything and Test (5 minutes)

### Terminal 1: Backend (keep running)
```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/backend
npm run dev
```

### Terminal 2: Frontend (keep running)
```bash
cd /Users/kartikaymg57/Documents/CodeAmbers/frontend
npm run dev
```

### Terminal 3: Test end-to-end
```bash
# Open browser
open http://localhost:3000

# You should see:
# 1. CodeAmbers landing page
# 2. Sign up / Sign in options
```

### Test the flow:

1. **Sign Up:**
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Name: `Test User`
   - Click "Sign Up"

2. **Create Workspace:**
   - Should redirect to workspace page
   - Click "Create Workspace"
   - Enter name: "Test Project"
   - Click create

3. **Chat with AI:**
   - Type: "Build me a React component that shows a counter"
   - Click send
   - Watch as agents collaborate
   - Files should appear in workspace

4. **Check Supabase:**
   - Go to Supabase dashboard
   - Check "conversations" table → should have your chat
   - Check "messages" table → should have responses
   - Check "files" table → should have generated code

### ✅ If all this works:
**🎉 You've successfully wired CodeAmbers end-to-end!**

---

## 🐛 TROUBLESHOOTING

### Problem: Backend won't start / crashes
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# 1. Check your .env variables
cat backend/.env | grep SUPABASE

# 2. Verify URL format (should start with https://)
# 3. Verify keys are correct (no extra spaces)
# 4. Restart backend
npm run dev
```

### Problem: "Supabase configured: false"
```
{"supabaseConfigured": false}
```

**Solution:**
```bash
# .env variables not being read. Check:
1. File is saved in: backend/.env
2. Variables have no quotes: SUPABASE_URL=...
3. No spaces around =: SUPABASE_URL=...
4. Restart backend: npm run dev
```

### Problem: Integration tests fail
```
✗ Auth flow failed
✗ Workspace flow failed
```

**Solution:**
```bash
# 1. Make sure SQL files ran successfully (all 5)
# 2. Check backend logs (terminal output)
# 3. Restart backend (Ctrl+C, then npm run dev)
# 4. Try tests again
```

### Problem: "Connection refused" or "Network error"
```
Error: Failed to connect to http://localhost:8080
```

**Solution:**
```bash
# 1. Make sure backend is running
ps aux | grep "node server.js"

# 2. Make sure it's on port 8080
curl http://localhost:8080/api/health

# 3. If not running, start it:
cd backend && npm run dev
```

### Problem: RLS policy errors
```
Error: Row level security denied
```

**Solution:**
This is expected for unauthenticated access. The tests should handle it.
If tests are failing:
1. Make sure 02-rls.sql ran
2. Check RLS is enabled: Supabase → Authentication → Policies
3. Verify policies exist

### Problem: Frontend can't connect to backend
```
WebSocket connection failed
```

**Solution:**
```bash
# 1. Check frontend .env.local exists
cat frontend/.env.local

# 2. Should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
# NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# 3. Restart frontend (frontend runs on 3000)
cd frontend && npm run dev
```

---

## 📊 Verification Checklist

Before saying "it works", verify:

- [ ] All 5 SQL files ran successfully in Supabase
- [ ] `.env` file created in backend/ with Supabase keys
- [ ] Backend starts with `supabaseConfigured: true`
- [ ] Health check shows "Supabase" as database provider
- [ ] All 8 integration tests pass
- [ ] Frontend `.env.local` created with API URLs
- [ ] Can sign up and create workspace
- [ ] Can chat with AI
- [ ] Files appear in workspace
- [ ] Data shows in Supabase tables

---

## 🎓 Understanding the Architecture

```
Frontend (localhost:3000)
    ↓ HTTP/REST (CORS enabled)
    ↓ WebSocket (real-time)
    ↓
Backend (localhost:8080)
    ↓
Supabase (cloud database)
    ├─ Tables (workspaces, files, etc)
    ├─ RLS (security policies)
    └─ Functions (triggers, helpers)
```

**Data flow:**
1. User signs up → Backend creates user in Supabase
2. User creates workspace → Saved to Supabase
3. User chats with AI → Message saved to Supabase
4. AI generates code → File saved to Supabase
5. User edits file → Changes synced via WebSocket

---

## 🚀 Production Deployment

Once everything works locally:

1. **Deploy backend:**
   ```bash
   # Use Vercel, Railway, Render, or any Node.js host
   # Set same .env variables on hosting platform
   ```

2. **Deploy frontend:**
   ```bash
   # Use Vercel (recommended for Next.js)
   # Update NEXT_PUBLIC_API_URL to production backend URL
   ```

3. **Use production Supabase:**
   ```bash
   # Create separate Supabase project for production
   # Run same SQL files there
   # Update .env with production keys
   ```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Configuration (your secrets) |
| `backend/database/01-tables.sql` | Database schema |
| `backend/database/02-rls.sql` | Security policies |
| `frontend/.env.local` | Frontend config |
| `backend/scripts/integration-test.js` | Test suite |
| `backend/SUPABASE_SETUP.md` | Detailed Supabase guide |

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Backend logs show `supabaseConfigured: true`
✅ All integration tests pass (8/8)
✅ Can sign up and create workspaces
✅ Can chat with AI and get responses
✅ Generated files appear in workspace
✅ Data persists after refresh
✅ WebSocket connection is active
✅ Credits update in real-time

---

## 🆘 Still Stuck?

1. **Re-read SUPABASE_SETUP.md** (in backend/)
2. **Check all 5 SQL files ran** (Supabase → SQL Editor)
3. **Verify .env variables** (no typos, correct format)
4. **Check backend logs** (terminal output for errors)
5. **Run integration tests** (tells you what's broken)
6. **Check Supabase logs** (Dashboard → Logs tab)

You're almost there! Let me know what specific error you see and I can help debug. 🚀
