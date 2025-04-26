# Retailer-List Service API

A simple Node.js/Express API to manage and list retailers near a location. Features include searching, filtering by category, and sorting by distance.

## Live Demo

🚀 **Check out the live deployed version here:**
[**https://retailer-list-sage.vercel.app/**](https://retailer-list-sage.vercel.app/)

*Note: The live demo database might be reset periodically.*

---

## Prerequisites (For Local Setup)

If you want to run this project locally, ensure you have the following installed:

*   **Node.js:** Version 14 or later recommended. Download from [nodejs.org](https://nodejs.org/).
*   **npm:** Comes bundled with Node.js.
*   **MongoDB:** A running MongoDB instance (locally or cloud service like MongoDB Atlas).

## Installation (For Local Setup)

1.  **Clone the Repository (or Download Files):**
    ```bash
    git clone <your-repository-url>
    cd retailer-api # Or your project's folder name
    ```
    Or navigate to the project's root directory if you downloaded the files.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

## Configuration (For Local Setup)

1.  **Create `.env` File:**
    In the project's root directory, create a file named `.env`.

2.  **Add Environment Variables:**
    Copy these variables into `.env` and update with your local configuration:

    ```dotenv
    # Server Port for local machine
    PORT=5000

    # Your local or cloud MongoDB Connection String
    MONGO_URI=mongodb://localhost:27017/retailer_db

    # Secret for signing JWTs (for POST route protection)
    JWT_SECRET=a_different_local_secret_key # Use a different secret for local dev

    # Default items per page
    DEFAULT_PAGE_SIZE=20
    ```
    *   **Important:** Use a *different* `JWT_SECRET` locally than what might be used in production/deployment.

## Running the API Locally

1.  **Development Mode:**
    Uses `nodemon` for auto-restarting on changes.
    ```bash
    npm run dev
    ```

2.  **Production Mode (Local):**
    Runs the server directly with `node`.
    ```bash
    npm start
    ```

If running locally, the API will typically be available at `http://localhost:5000` (or the port you set in `.env`).

## API Endpoints

You can test the following endpoints against your local setup or the **live deployment** at `https://retailer-list-sage.vercel.app/`.

*   **`GET /`**
    *   Health check endpoint.
    *   Live Link: [`https://retailer-list-sage.vercel.app/`](https://retailer-list-sage.vercel.app/)
    *   Response: `{ "success": true, "message": "Server is Healthy" }`

*   **`GET /retailers`**
    *   Lists retailers with filtering, searching, pagination, and distance sorting.
    *   Live Link Example: [`https://retailer-list-sage.vercel.app/retailers?category=GROCERY&limit=5`](https://retailer-list-sage.vercel.app/retailers?category=GROCERY&limit=5)
    *   **Query Parameters:** `search`, `category` (comma-separated ok), `lat`, `lng`, `radiusKm`, `page`, `limit`.
    *   **Response:** Includes `pagination` info and an array of `retailers` in `data`. If `lat`/`lng` are provided, results are sorted by distance and include `distanceKm`.

*   **`GET /retailers/:id`**
    *   Gets details for a single retailer by its UUID.
    *   Live Link Example (Replace `:id` with a valid ID): [`https://retailer-list-sage.vercel.app/retailers/your_retailer_id`](https://retailer-list-sage.vercel.app/retailers/your_retailer_id)
    *   **Response:** Retailer object in `data`.

*   **`GET /retailers/:id/whatsapp`**
    *   Generates a WhatsApp "click to chat" link.
    *   Live Link Example (Replace `:id`): [`https://retailer-list-sage.vercel.app/retailers/your_retailer_id/whatsapp`](https://retailer-list-sage.vercel.app/retailers/your_retailer_id/whatsapp)
    *   **Response:** `{ "link": "https://wa.me/..." }`

*   **`POST /retailers`** (Protected)
    *   Creates a new retailer.
    *   **Requires Authentication:** Needs a valid JWT in the `Authorization: Bearer <token>` header. *Authentication might be complex to test against the public demo unless a login/token generation endpoint is provided.*
    *   **Request Body (JSON):** See previous README example.
    *   **Response:** The newly created retailer object in `data`.

## Technologies Used

*   Node.js
*   Express.js
*   MongoDB
*   Mongoose
*   Zod
*   jsonwebtoken
*   dotenv
*   uuid

## Deployment

This project is deployed on [Vercel](https://vercel.com/).
