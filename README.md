# SofreBooks (MERN Stack)

## Overview

This is an internal company application designed to facilitate book sharing among employees. Each employee has a personal list of books they own. The application allows employees to search for books by title or author, view detailed information about a book, and request to borrow a book from a colleague if it is available. The owner of the book can then accept or decline the borrowing request. Employees can also view the history of their book loans, including the status of each request (accepted, pending, or declined).

## Features

- **Book Search**: Employees can search for books by title or author using a search engine.
- **Book Details**: Each book has a dedicated page with detailed information.
- **Borrowing Requests**: Employees can request to borrow a book if it is not already lent out. The "Request" button is disabled if the book is currently on loan.
- **Request Management**: Book owners receive borrowing requests and can choose to accept or decline them.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS, Tailwind CSS

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running (local or Atlas).

### Steps

1. **Clone the Repository**

    ```bash
    git clone https://github.com/amineekilani/sofrebooks.git
    cd sofrebooks
    ```

2. **Install Dependencies**

Navigate to both the frontend and backend directories and run the following commands:

    cd frontend
    npm install
    
    cd ../backend
    npm install

3. **Set Up Environment Variables**

Create a `.env` file in the backend directory and add the following variables:

    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
    JWT_SECRET=your_jwt_secret

4. **Run the Application**

Once the dependencies are installed, you can run both the frontend and backend.

- Start the backend server:

    ```bash
    cd backend
    npm run dev
    ```

    This will start the server on `http://localhost:5000`.
- Start the frontend development server:

    ```bash
    cd frontend
    npm run dev
    ```

    This will open the React app on `http://localhost:5173`.

5. **Testing**

To test the application, ensure the following:

- The backend API is running on `http://localhost:5000`.
- The frontend is accessible via `http://localhost:5173`.

You can use Postman or similar tools to test the API endpoints.