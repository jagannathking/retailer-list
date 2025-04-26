# Retailer-List Service API

A simple Node.js/Express API to manage and list retailers near a location. Features include searching, filtering by category, and sorting by distance.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 14 or later recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:** Comes bundled with Node.js.
*   **MongoDB:** A running MongoDB instance (either locally or a cloud service like MongoDB Atlas). You'll need the connection string.

## Installation

1.  **Clone the Repository (or Download Files):**
    If you have this project in a Git repository:
    ```bash
    git clone <your-repository-url>
    cd retailer-api # Or your project's folder name
    ```
    If you just have the code files, navigate to the project's root directory in your terminal.

2.  **Install Dependencies:**
    Run this command in the project's root directory:
    ```bash
    npm install
    ```
    This will download all the necessary packages listed in `package.json`.

## Configuration

1.  **Create `.env` File:**
    In the root directory of the project, create a file named `.env`.

2.  **Add Environment Variables:**
    Copy the following variables into your `.env` file and replace the placeholder values with your actual configuration:

    ```dotenv
    # Server Port
    PORT=5000

    # MongoDB Connection String
    MONGO_URI=mongodb://localhost:27017/retailer_db # Replace with your MongoDB connection string

    # JSON Web Token Secret (for securing POST requests)
    JWT_SECRET=your_very_strong_and_secret_key_change_this # Replace with a long, random, secret string

    # Default number of items per page for listing retailers
    DEFAULT_PAGE_SIZE=20
    ```

    *   Replace `mongodb://localhost:27017/retailer_db` with your actual MongoDB connection details.
    *   Replace `your_very_strong_and_secret_key_change_this` with a secure, random string for JWT signing.

## Running the API

1.  **Development Mode (Recommended for testing):**
    This command uses `nodemon` (if installed as a dev dependency) to automatically restart the server when you make code changes.
    ```bash
    npm run dev
    ```

2.  **Production Mode:**
    This command simply runs the server using `node`.
    ```bash
    npm start
    ```

The API server should now be running. By default (using the example `.env`), it will be accessible at `http://localhost:5000`. You'll see a message like "Server is running on PORT 5000" in your terminal.

## API Endpoints

Here are the main API endpoints provided:

*   **`GET /`**
    *   A simple health check endpoint.
    *   Response: `{ "success": true, "message": "Server is Healthy" }`

*   **`GET /retailers`**
    *   Lists retailers with filtering, searching, pagination, and distance sorting.
    *   **Query Parameters:**
        *   `search` (string, optional): Search retailer names (case-insensitive).
        *   `category` (string, optional): Filter by category (e.g., `GROCERY`, `MEDICINE`). Can be comma-separated for multiple categories (e.g., `GROCERY,MEDICINE`).
        *   `lat` (number, optional): Customer's latitude. Required if `lng` is provided. Enables distance sorting/filtering.
        *   `lng` (number, optional): Customer's longitude. Required if `lat` is provided. Enables distance sorting/filtering.
        *   `radiusKm` (number, optional): Maximum distance in kilometers from `lat`, `lng`. Requires `lat` and `lng`.
        *   `page` (number, optional, default: 1): Page number for pagination.
        *   `limit` (number, optional, default: 20): Number of results per page.
    *   **Response:** Includes `pagination` info (`total`, `page`, `pages`) and an array of `retailers` in `data`. If `lat`/`lng` are provided, retailers are sorted by distance and include a `distanceKm` field.

*   **`GET /retailers/:id`**
    *   Gets details for a single retailer by its UUID.
    *   Replace `:id` with the actual retailer ID.
    *   **Response:** Retailer object in `data`.

*   **`GET /retailers/:id/whatsapp`**
    *   Generates a WhatsApp "click to chat" link for the retailer's phone number.
    *   Replace `:id` with the actual retailer ID.
    *   **Response:** `{ "link": "https://wa.me/..." }`

*   **`POST /retailers`** (Protected)
    *   Creates a new retailer.
    *   **Requires Authentication:** You must include a valid JWT in the `Authorization: Bearer <token>` header.
    *   **Request Body (JSON):**
        ```json
        {
          "name": "Example Mart",
          "category": "GROCERY",
          "phoneNumber": "+15551234567",
          "address": "123 Main St, Anytown",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
        ```
    *   **Response:** The newly created retailer object in `data`.

## Technologies Used

*   Node.js
*   Express.js
*   MongoDB
*   Mongoose (ODM for MongoDB)
*   Zod (Validation)
*   jsonwebtoken (JWT Authentication)
*   dotenv (Environment variables)
*   uuid (Generating unique IDs)
