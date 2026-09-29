# API Testing Guide

This guide provides methods to test all CRM Platform APIs.

## Prerequisites

- Backend server running: `npm run dev`
- PostgreSQL with seeded data
- curl or Postman

---

## Option 1: Using Postman (Recommended)

1. **Open Postman**
2. **Import Collection:**
   - Click `Import`
   - Select `CRM_API.postman_collection.json`
   - Click `Import`

3. **Set Variables:**
   - Click the environment icon (gear) in top-right
   - Set `base_url` to `http://localhost:5000/api`

4. **Test the APIs:**
   - Start with "Authentication → Login (joe)"
   - This will automatically save the token
   - Run other requests in sequence

---

## Option 2: Using curl (Terminal)

### 1. Login and Get Token

```bash
# Login as Joe
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joe","password":"password123"}'

# Response will include a token, copy it
# Example: eyJhbGciOiJIUzI1NiIs...
```

**Save the token to a variable:**
```bash
TOKEN="<your_token_here>"
```

---

### 2. Authentication Endpoints

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. User Management

#### Get All Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Specific User
```bash
curl -X GET http://localhost:5000/api/users/<user_id> \
  -H "Authorization: Bearer $TOKEN"
```

#### Create New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "email":"newuser@example.com",
    "password":"password123",
    "full_name":"New User"
  }'
```

#### Update User
```bash
curl -X PUT http://localhost:5000/api/users/<user_id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name":"Updated Name",
    "email":"newemail@example.com"
  }'
```

#### Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/<user_id> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Process Types

#### Get All Process Types
```bash
curl -X GET http://localhost:5000/api/process-types \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Specific Process Type
```bash
curl -X GET http://localhost:5000/api/process-types/<process_type_id> \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Process Type
```bash
curl -X POST http://localhost:5000/api/process-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Custom Process",
    "description":"A custom sales process"
  }'
```

#### Update Process Type
```bash
curl -X PUT http://localhost:5000/api/process-types/<process_type_id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description":"Updated description"
  }'
```

#### Delete Process Type
```bash
curl -X DELETE http://localhost:5000/api/process-types/<process_type_id> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Deals

#### Get All Deals
```bash
curl -X GET http://localhost:5000/api/deals \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Deals Filtered by Stage
```bash
curl -X GET "http://localhost:5000/api/deals?stage=interested" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Deals Filtered by Country
```bash
curl -X GET "http://localhost:5000/api/deals?country=Gujarat" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Deals Filtered by Process Type
```bash
curl -X GET "http://localhost:5000/api/deals?process_type_id=<process_type_uuid>" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Multiple Filters
```bash
curl -X GET "http://localhost:5000/api/deals?stage=interested&country=Gujarat" \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Specific Deal
```bash
curl -X GET http://localhost:5000/api/deals/<deal_id> \
  -H "Authorization: Bearer $TOKEN"
```

#### Create Deal
```bash
curl -X POST http://localhost:5000/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name":"Acme Corporation",
    "location":"Mumbai, Maharashtra",
    "deal_value":5000000,
    "process_type_id":"<process_type_uuid>",
    "team_member_ids":["<user_id_1>", "<user_id_2>"]
  }'
```

#### Update Deal Details
```bash
curl -X PUT http://localhost:5000/api/deals/<deal_id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name":"Updated Name",
    "deal_value":7500000
  }'
```

#### Move Deal to Different Stage (Drag-Drop Action)
```bash
curl -X PATCH http://localhost:5000/api/deals/<deal_id>/stage \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage":"proposal_sent"}'
```

**Valid stages:**
- `interested`
- `requirement_confirmed`
- `proposal_sent`
- `negotiation`
- `closed_won`
- `closed_lost`

#### Update Team Members
```bash
curl -X PUT http://localhost:5000/api/deals/<deal_id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "team_member_ids":["<user_id_1>", "<user_id_2>", "<user_id_3>"]
  }'
```

#### Delete Deal
```bash
curl -X DELETE http://localhost:5000/api/deals/<deal_id> \
  -H "Authorization: Bearer $TOKEN"
```

---

## Sample Test Workflow

### Complete Flow to Test Entire API

```bash
# 1. Set token variable (after login)
TOKEN="your_token_here"

# 2. Get all process types (need ID for deal creation)
curl -X GET http://localhost:5000/api/process-types \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, name}'

# Save a process_type_id
PROCESS_TYPE_ID="<copy_id_from_response>"

# 3. Create a new deal
curl -X POST http://localhost:5000/api/deals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"company_name\":\"Test Corp\",\"location\":\"Bangalore\",\"deal_value\":2000000,\"process_type_id\":\"$PROCESS_TYPE_ID\"}"

# Save the deal_id from response
DEAL_ID="<copy_id_from_response>"

# 4. Get the deal details
curl -X GET http://localhost:5000/api/deals/$DEAL_ID \
  -H "Authorization: Bearer $TOKEN"

# 5. Move deal to next stage
curl -X PATCH http://localhost:5000/api/deals/$DEAL_ID/stage \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage":"requirement_confirmed"}'

# 6. Verify stage was updated
curl -X GET http://localhost:5000/api/deals/$DEAL_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.stage'
```

---

## Common Errors & Solutions

### 401 Unauthorized
**Problem:** "Missing or invalid authorization header"
**Solution:** 
- Check token is included: `Authorization: Bearer <token>`
- Ensure token hasn't expired (24h expiry)
- Re-login to get new token

### 403 Forbidden
**Problem:** "Unauthorized to perform this action"
**Solution:**
- For deal updates: User must be primary owner or team member
- For deal deletion: User must be primary owner
- For stage update: User must be team member

### 400 Bad Request
**Problem:** Invalid data or missing required fields
**Solution:**
- Check request body for required fields
- Verify data types (deal_value should be number)
- Check process_type_id and user_id are valid UUIDs

### 404 Not Found
**Problem:** Resource doesn't exist
**Solution:**
- Verify the ID is correct
- Check resource exists in database

---

## Tips for Testing

1. **Use jq for JSON formatting:**
   ```bash
   curl ... | jq '.'  # Pretty print
   curl ... | jq '.id'  # Extract specific field
   ```

2. **Save tokens to file:**
   ```bash
   TOKEN=$(curl -s -X POST ... | jq -r '.token')
   echo $TOKEN > token.txt
   ```

3. **Test authorization restrictions:**
   - Create deal as user A
   - Try to delete as user B (should fail with 403)
   - Add user B to team
   - Try to update stage as user B (should succeed)

4. **Test filtering:**
   - Get deals by stage
   - Get deals by country
   - Combine multiple filters
   - Verify correct results returned

---

## Next Steps

After testing the APIs:
1. Proceed to Phase 3: Frontend Setup
2. Frontend will consume these APIs
3. Create React components to display deals
4. Implement drag-drop to call stage update endpoint

All APIs are now ready for frontend integration! ✅
