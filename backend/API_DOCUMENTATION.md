# API Documentation

This document explains the backend APIs created for this assignment. The APIs are used for user authentication, profile management, and task management. It is written to help understand how the frontend or tools like Postman can interact with the backend.

Base URL: `http://localhost:5000/api`

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/signup`
This API is used to create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "msg": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "msg": "User already exists with this email"
}
```

---

### 2. Login User

**POST** `/auth/login`
This API is used to log in an existing user and get a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "msg": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "msg": "Invalid email or password"
}
```

---

## Profile Endpoints

### 3. Get User Profile

**GET** `/profile`
This API fetches the logged-in user's profile details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

### 4. Update User Profile

**PUT** `/profile`
This API is used to update the user's name or email.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "msg": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "johnupdated@example.com"
  }
}
```

## Task Endpoints

### 5. Create Task

**POST** `/tasks`
This API creates a new task for the logged-in user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish dashboard features",
  "status": "pending"
}
```

### 6. Get All Tasks
**GET** `/tasks`
This API returns all tasks of the logged-in user. Search and filter options are supported.

**Query Parameters (Optional):**
* `search`   for now only searh my name is fully implied 
* `status`   I have applied logic but not shown in the frontend 
* `sort`     logic applied in the backend but not shown in the    frontend


### 7. Update Task
**PUT** `/tasks/:id`
This API updates an existing task.

### 8. Delete Task
**DELETE** `/tasks/:id`
This API deletes a task by ID.


## Error Codes
* **400** - Bad Request
* **401** - Unauthorized
* **404** - Not Found
* **500** - Server Error

## Authentication Flow
1. User registers or logs in
2. Backend returns a JWT token
3. Token is sent in headers for protected APIs
4. User must re-login after token expiry

---

## Testing
These APIs can be tested using Postman or cURL by sending requests to the above endpoints with the required headers and data.

## Not Proficient
Please suggest any documentaion changes that is required because I'm not proficient in creating perfect documentation. 

## Thank You
