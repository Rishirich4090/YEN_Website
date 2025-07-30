# Local Setup Instructions for YEN(Young Entrepreneur Network ) Platform

## Prerequisites
- Node.js (v16 or later recommended)
- npm (comes with Node.js)
- MongoDB Community Edition (local installation)
- Git (for version control)

---

## Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables (adjust values as needed):
     ```
     MONGODB_URI=mongodb://localhost:27017/hopehands
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. Start the backend server:
   ```bash
   npm run start
   ```
   or if using a custom start script:
   ```bash
   node start-server.js
   ```

---

## Frontend Setup

1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   or if using a custom start script:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## MongoDB Local Setup

1. Download and install MongoDB Community Edition from:
   https://www.mongodb.com/try/download/community

2. Install MongoDB following the installer instructions:
   - Choose "Complete" setup type.
   - Optionally install MongoDB Compass (GUI for MongoDB).

3. Start the MongoDB server:
   - On Windows, MongoDB is installed as a service and should start automatically.
   - To manually start the service, open Command Prompt as Administrator and run:
     ```
     net start MongoDB
     ```
   - To stop the service, run:
     ```
     net stop MongoDB
     ```

4. Verify MongoDB is running:
   - Open Command Prompt and run:
     ```
     mongo
     ```
   - This should open the MongoDB shell if the server is running.

5. (Optional) Use MongoDB Compass for GUI management:
   - Launch MongoDB Compass from the Start menu.
   - Connect to `mongodb://localhost:27017`.

6. Create the database and collections:
   - The backend will auto-create the database and collections on first run.
   - If you want to create manually, use the MongoDB shell or Compass to create a database named `hopehands`.

7. (Optional) Create a MongoDB user with access:
   - In the MongoDB shell, switch to the admin database:
     ```
     use admin
     ```
   - Create a user:
     ```
     db.createUser({
       user: "hopehandsUser",
       pwd: "your_password",
       roles: [{ role: "readWrite", db: "hopehands" }]
     })
     ```
   - Update your backend `.env` file to use this user in the connection string:
     ```
     MONGODB_URI=mongodb://hopehandsUser:your_password@localhost:27017/hopehands
     ```

8. Ensure MongoDB is running on the default port `27017`.
     net stop MongoDB

---

## Additional Notes

- Make sure ports `5000` (backend) and `3000` (frontend) are free.
- Adjust environment variables as needed for your local setup.
- For testing, refer to the backend `tests` directory and run:
  ```bash
  npm test
  ```

---

This setup guide should help you get the backend, frontend, and MongoDB running locally for development and testing.
