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

## Base URL 
All endpoints are accessible under the following base URL:
https://mf1g4s6ogi.execute-api.eu-north-1.amazonaws.com/api/


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
**Response**
```json
{
	"success":  true,
	"userId":  "your_userId"
}
```
---
#### POST `/user/login` 
Authenticate a user and retrieve a JWT token. 
**Request Body:** 
 ```json 
 { 
	 "username": "your_username", 
	 "password": "your_password" 
 }
```

**Response**
```json
{
	"success":  true,
	"token":  "your_token"
}
```
___
#### POST `/notes` 
Add a note. 
**Request Body:** 
 ```json 
{
	"title":  "note_title",
	"text":  "note_text"
}
```

**Response**
```json
{
	"success":  true,
	"noteId":  "the_noteId"
}
```
___
#### Get `/notes` 
Retrive all notes. 

**Response**
```json
{
	"success":  true,
	"notes":  [
			{
			"modifiedAt":  "2024-11-26T11:52:51.830Z",
			"userId":  "userId",
			"createdAt":  "2024-11-25T12:30:29.489Z",
			"text":  "note_text",
			"id":  "note_id",
			"title":  "the_title"
			}
	]
}
```

___
#### Put `/notes/{noteId}` 
Add a note. 

**Request Body:** 
 ```json 
{
"title":  "note_title",
"text":  "note_text"
}
```

**Response**
```json
{
	"success":  true,
	"message":  "Note updated",
	"noteId":  "note_id"
}
```
___
#### Delete `/notes/{noteId}` 
Soft delete note.

**Response**
```json
{
	"success":  true,
	"message":  "Note deleted",
	"noteId":  "note_id"
}
```

---
#### Get `/deleted-notes` 
Retrive all notes marked for deletion.

**Response**
```json
{
	"success":  true,
	"notes":  [
			{
			"modifiedAt":  "2024-11-26T11:52:51.830Z",
			"userId":  "userId",
			"deleted":  true,
			"expiresAt":  1733486108,
			"createdAt":  "2024-11-25T12:30:29.489Z",
			"text":  "note_text",
			"id":  "note_id",
			"title":  "the_title"
			}
	]
}
```

---
#### Put `/deleted-notes/{noteId}` 
Restore soft deleted note.

**Response**
```json
{
	"success":  true,
	"message":  "Note restored",
	"noteId":  "note_id"
}
```
 
 ---
 #### Delete `/deleted-notes/{noteId}` 
Hard delete note.

**Response**
```json
{
	"success":  true,
	"message":  "Note is permanetly erased",
	"noteId":  "note_id"
}
```
