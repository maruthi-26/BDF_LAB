# Lab 1: Node.js and Express Server

## Student Details

- **Name:** N. Maruthi Prasanna Kumar Reddy
- **Registration Number:** 252U1R9105
- **Section:** GEN-AI 2B
- **Room:** 111
- **Course:** Backend Development Fundamentals
- **Lab Number:** 01

## Live Link

**Deployment URL:**  https://bdf-lab.onrender.com

## Objective

To set up a Node.js project, create a basic HTTP server using the built-in `http` module, and build an Express server with multiple routes and appropriate HTTP status codes.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- npm
- Visual Studio Code

## Project Structure

```text
Lab-01/
├── Screenshots/
│   ├── Home.png
│   ├── about.png
│   ├── time.png
│   └── NotFound.png
├── http-server.js
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Visual Studio Code or another code editor

### Steps to Run

1. Clone the repository or download the project.
2. Open the `Lab-01` folder in the terminal.
3. Install the dependencies:

```bash
npm install
```

4. Start the Express server:

```bash
node index.js
```

5. Open the following URL in your browser:

`http://localhost:3000`

### Run the Basic HTTP Server

To run the server implemented using Node.js's built-in HTTP module:

```bash
node http-server.js
```

Stop the running server with `Ctrl + C` before starting another server on the same port.

## Endpoints

| Method | Endpoint    | Description                                      | Expected Status |
|--------|-------------|--------------------------------------------------|-----------------|
| GET    | `/`         | Returns a welcome message                        | 200 OK          |
| GET    | `/about`    | Returns the student's name and section as JSON   | 200 OK          |
| GET    | `/time`     | Returns the current date and time                | 200 OK          |
| GET    | `/anything` | Demonstrates the response for an unknown route   | 404 Not Found   |

The `/anything` path is an example of an unknown route. Other undefined paths should also return a 404 response.

## Screenshots

### 1. Home Route

Displays the welcome message.

![Home route response](Screenshots/Home.png)

### 2. About Route

Displays the student's name and section in JSON format.

![About route response](Screenshots/about.png)

### 3. Time Route

Displays the current date and time.

![Time route response](Screenshots/time.png)

### 4. Unknown Route

Displays the 404 Page Not Found response.

![404 route response](Screenshots/NotFound.png)

## HTTP Status Codes

- **200 OK:** The request was successful.
- **404 Not Found:** The requested route does not exist.

## Viva Questions

### 1. What is the difference between `package.json` and `node_modules`?

`package.json` stores project metadata, scripts, and dependency information. `node_modules` contains the installed packages required by the project.

### 2. What does `app.listen()` do?

`app.listen()` starts the Express server and makes it listen for incoming requests on a specified port.

### 3. What do `request` and `response` represent?

`request` contains information about the incoming HTTP request. `response` is used to send data and status codes back to the client.

## Problems Faced and Solutions

### 1. Handling Unknown Pages (404)

Initially, requests to unknown routes were not returning a proper 404 status.  
**Solution:** Added a catch-all middleware at the end of the routes:

```js
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});
```

### 2. Deploying the Project on Render

While deploying on Render, the build failed because `package.json` was inside the `Lab-01` folder.  
**Solution:**
- Set **Root Directory** to `Lab-01`
- Set **Build Command** to `npm install`
- Set **Start Command** to `node index.js`

After correcting these settings, the deployment was successful.

## Git and Repository Notes

- The `.gitignore` file excludes `node_modules/`, `.env`, and `desktop.ini`.
- The `node_modules/` directory must not be committed.
- Screenshots are stored in the `Screenshots/` directory.
- The project is submitted through the course GitHub repository.
```
