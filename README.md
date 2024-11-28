# Notes API

Welcome to the Notes API! This API allows you to create, save, delete, and restore notes. Each note includes a title and text. To ensure security, access to the API requires authentication using JSON Web Tokens (JWT).

## Features

The API provides the following functionality:

1.  **Create a new note**  – Add a note with a title and text.
2.  **Retrieve all notes**  – Fetch all saved notes, including restored ones.
3. **Edit a note** - Edit an existing note.
4.  **Delete a note**  – Soft delete a note, marking it as deleted instead of removing it permanently. It is hard deleted after staying soft deleted for 10 days.
5. **Retrive all deleted notes** - Fetch all saved notes marked for deletion.
6.  **Restore a deleted note**  – Restore a previously deleted note.
7. **Permanently delete a note** - Hard delete note, this note can not be restored.

## Authentication

All API endpoints (except login and signup) require a valid JWT token. Include the token in the Authorization header as a Bearer token for each request:
Authorization: Bearer <your_token>

#### POST `/user/signup` 
Signup to be able to login and use the api.
**Request Body:** 
 ```json 
{
"username":  "your_username",
"password":  "your_password",
"firstname":  "your_firstname",
"lastname":  "your_lastname"
}
```

#### POST `/user/login` 
Authenticate a user and retrieve a JWT token. 
**Request Body:** 
 ```json 
 { 
 "username": "your_username", 
 "password": "your_password" 
 }
```
