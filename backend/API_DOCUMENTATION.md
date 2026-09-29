# CRM Platform Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/login`) require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "username": "joe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "username": "joe",
      "email": "joe@quantic.com",
      "full_name": "Joe"
    }
  }
  ```

#### Logout
- **POST** `/auth/logout`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get Current User
- **GET** `/auth/me`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "id": "uuid",
    "username": "joe",
    "email": "joe@quantic.com",
    "full_name": "Joe"
  }
  ```

---

### 2. Users

#### Get All Users
- **GET** `/users`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "username": "joe",
      "email": "joe@quantic.com",
      "full_name": "Joe",
      "created_at": "2026-09-29T12:00:00Z"
    },
    ...
  ]
  ```

#### Get User by ID
- **GET** `/users/:id`
- **Auth Required:** Yes
- **Response:** Single user object

#### Create User
- **POST** `/users`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "securepassword",
    "full_name": "New User"
  }
  ```
- **Response:** Created user object

#### Update User
- **PUT** `/users/:id`
- **Auth Required:** Yes
- **Body:** (optional fields)
  ```json
  {
    "email": "newemail@example.com",
    "full_name": "Updated Name"
  }
  ```
- **Response:** Updated user object

#### Delete User
- **DELETE** `/users/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

---

### 3. Process Types

#### Get All Process Types
- **GET** `/process-types`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "name": "Private",
      "description": "Private sales process",
      "created_at": "2026-09-29T12:00:00Z"
    },
    ...
  ]
  ```

#### Get Process Type by ID
- **GET** `/process-types/:id`
- **Auth Required:** Yes
- **Response:** Single process type object

#### Create Process Type
- **POST** `/process-types`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "Custom Process",
    "description": "Description of the custom process"
  }
  ```
- **Response:** Created process type object

#### Update Process Type
- **PUT** `/process-types/:id`
- **Auth Required:** Yes
- **Body:** (optional fields)
  ```json
  {
    "name": "Updated Process Name",
    "description": "Updated description"
  }
  ```
- **Response:** Updated process type object

#### Delete Process Type
- **DELETE** `/process-types/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "Process type deleted successfully"
  }
  ```

---

### 4. Deals

#### Get All Deals (with filtering)
- **GET** `/deals`
- **Auth Required:** Yes
- **Query Parameters:**
  - `stage`: Filter by stage (interested, requirement_confirmed, proposal_sent, negotiation, closed_won, closed_lost)
  - `process_type_id`: Filter by process type ID
  - `country`: Search by country (searches in location field)
  - `product`: Search by product (searches in company name field)
- **Example:** `/deals?stage=interested&country=Gujarat`
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "company_name": "JSW Cement",
      "location": "Nandyal, Andhra Pradesh",
      "deal_value": "5000000",
      "stage": "interested",
      "process_type_id": "uuid",
      "process_type_name": "Private",
      "primary_owner_id": "uuid",
      "owner_name": "joe",
      "team_members": [
        {"id": "uuid", "username": "joe"},
        {"id": "uuid", "username": "senthil"}
      ],
      "created_at": "2026-09-29T12:00:00Z",
      "updated_at": "2026-09-29T12:00:00Z"
    },
    ...
  ]
  ```

#### Get Deal by ID
- **GET** `/deals/:id`
- **Auth Required:** Yes
- **Response:** Single deal object with full details

#### Create Deal
- **POST** `/deals`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "company_name": "New Company",
    "location": "Mumbai, Maharashtra",
    "deal_value": 5000000,
    "process_type_id": "uuid",
    "team_member_ids": ["uuid1", "uuid2"]
  }
  ```
- **Response:** Created deal object
- **Note:** The authenticated user becomes the primary owner automatically

#### Update Deal
- **PUT** `/deals/:id`
- **Auth Required:** Yes
- **Auth Restriction:** Only team members of the deal can update it
- **Body:** (optional fields)
  ```json
  {
    "company_name": "Updated Name",
    "location": "New Location",
    "deal_value": 7500000,
    "team_member_ids": ["uuid1", "uuid2", "uuid3"]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Deal updated successfully"
  }
  ```

#### Delete Deal
- **DELETE** `/deals/:id`
- **Auth Required:** Yes
- **Auth Restriction:** Only the deal's primary owner can delete it
- **Response:**
  ```json
  {
    "message": "Deal deleted successfully"
  }
  ```

#### Update Deal Stage (Move Deal)
- **PATCH** `/deals/:id/stage`
- **Auth Required:** Yes
- **Auth Restriction:** Only team members of the deal can update the stage
- **Body:**
  ```json
  {
    "stage": "proposal_sent"
  }
  ```
- **Valid Stages:** interested, requirement_confirmed, proposal_sent, negotiation, closed_won, closed_lost
- **Response:**
  ```json
  {
    "message": "Deal stage updated successfully",
    "stage": "proposal_sent"
  }
  ```

---

## Sample Data (After Seeding)

### Users
| Username | Email | Password |
|----------|-------|----------|
| joe | joe@quantic.com | password123 |
| senthil | senthil@quantic.com | password123 |
| cto_viewer | cto@quantic.com | password123 |

### Process Types
1. Private
2. PSU — Relationship
3. PSU — Tender

### Sample Deals
- 4 in "interested" stage
- 2 in "proposal_sent" stage
- 2 in "negotiation" stage
- 1 in "closed_won" stage
- 0 in "closed_lost" stage

---

## Testing with curl

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joe","password":"password123"}'
```

### Get All Deals (with token)
```bash
curl -X GET http://localhost:5000/api/deals \
  -H "Authorization: Bearer <your_token>"
```

### Create Deal
```bash
curl -X POST http://localhost:5000/api/deals \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name":"Acme Corp",
    "location":"Delhi",
    "deal_value":1000000,
    "process_type_id":"<process_type_uuid>"
  }'
```

### Update Deal Stage
```bash
curl -X PATCH http://localhost:5000/api/deals/<deal_id>/stage \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"stage":"proposal_sent"}'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Description of what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid authorization header"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Authorization Rules

### Deal Movement (updateDealStage)
- ✅ Primary owner can move deals
- ✅ Team members can move deals
- ❌ Non-team members cannot move deals

### Deal Updates
- ✅ Primary owner can edit deal details
- ✅ Team members can edit deal details
- ❌ Non-team members cannot edit deal details

### Deal Deletion
- ✅ Only the primary owner can delete a deal
- ❌ Team members cannot delete the deal

---

## Rate Limiting
No rate limiting implemented in this version. Add middleware as needed for production.

## Pagination
No pagination implemented in this version. Consider adding for large datasets.
