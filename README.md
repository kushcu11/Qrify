# QRify - Single-Use QR Code Generator

This is a Next.js application that allows users to generate unique, single-use QR codes. Users can enter a URL or a search term, and the application will generate a QR code. Once the QR code is scanned, it becomes invalid and cannot be used again.

This project was built inside **Firebase Studio**.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **UI**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
*   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Core Workflows

### 1. QR Code Generation

This is the process flow when a user generates a new QR code:

1.  **User Input**: The user enters a URL or a search query into the input field in the `QrGenerator` component (`src/components/qr-generator.tsx`).
2.  **Server Action**: On form submission, the `generateQrCodeAction` server action (`src/app/actions.ts`) is called.
3.  **Input Handling**:
    *   If the input is a URL, it's validated for safety using the `validateRedirectURL` Genkit flow (`src/ai/flows/validate-redirect-url-flow.ts`).
    *   If the input is a search term, it's sent to the `enhanceRedirectURL` Genkit flow (`src/ai/flows/enhance-redirect-flow.ts`) to find the most relevant official URL.
4.  **Database Write**: The final, validated URL is stored in a new document in the `qr-codes` collection in Firestore. This document gets a unique ID.
5.  **QR Code Creation**: The unique document ID is used to construct a "scan URL" pointing to our API route (e.g., `https://<your-app-url>/api/qr/<document-id>`). This scan URL is then encoded into a QR code image using an external API (`qrserver.com`).
6.  **Display**: The generated QR code image and the final destination URL are displayed to the user.

### 2. QR Code Scanning & Invalidation

This is the process flow when a user scans a generated QR code:

1.  **API Route Hit**: The QR code's "scan URL" directs the user's device to our API route at `src/app/api/qr/[id]/route.ts`, with the unique document ID in the path.
2.  **Database Read**: The API route handler queries the `qr-codes` collection in Firestore for a document with the matching ID.
3.  **Validation & Deletion**:
    *   If the document exists, its destination URL is retrieved. The document is then **immediately deleted** from Firestore. This is the step that makes the QR code single-use.
    *   If the document does not exist (meaning the code was already scanned and deleted), the API returns a "not found" error.
4.  **Redirection**: If the code was valid, the user is redirected to the final destination URL.

## Running Locally

To run this project on your local machine, please follow these steps. The instructions are compatible with macOS, Windows, and Linux.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 20 or later) installed on your system.

### 1. Set up Environment Variables

The project uses Google's Generative AI. To access the API, you need to provide an API key.

1.  Create a new file named `.env` in the root of the project.
2.  Add your Google AI API key to the `.env` file as follows:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

    You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 2. Install Dependencies

Open your terminal (on macOS, you can find the Terminal app in `/Applications/Utilities`), navigate to the project's root directory, and run the following command to install the required packages:

```bash
npm install
```

### 3. Run the Development Servers

This project requires two separate development servers to be running at the same time: one for the Next.js application and another for Genkit (which handles the AI functionality).

1.  **Start the Next.js server:**
    Open a terminal window and run:
    ```bash
    npm run dev
    ```
    Your application should now be running at [http://localhost:9002](http://localhost:9002).

2.  **Start the Genkit server:**
    Open a **second** terminal window (on macOS, you can use `Cmd + T` in the existing Terminal window to open a new tab) and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development server, which your Next.js app will communicate with for AI features.

Now you have the complete setup running locally!

## Sharing with Your Client

There are two main ways to share this project with a client: by sending them the code directly, or by deploying a live version they can visit online.

### Option 1: Sharing the Code

If your client is technical and wants to run the project themselves, you can:
1.  Download the project files from Firebase Studio (look for an "Export" or "Download ZIP" button).
2.  Zip the entire project folder.
3.  Send the ZIP file to your client.

They can then follow the "Running Locally" instructions above to get it working on their own machine.

### Option 2: Deploying a Live Version (Recommended)

The best way to share your work with a client is to deploy it to the web. This gives them a public URL they can visit to see and interact with the live application. Since this project uses Firebase, you can deploy it easily using Firebase App Hosting.

#### Prerequisites

*   Make sure you have followed the "Running Locally" steps first.
*   You will need to have the **Firebase CLI** (Command Line Interface) installed. If you don't have it, open your terminal and run:
    ```bash
    npm install -g firebase-tools
    ```

#### Deployment Steps

1.  **Login to Firebase:**
    In your terminal, run this command and follow the prompts to log in to your Google account:
    ```bash
    firebase login
    ```

2.  **Deploy the App:**
    Once you are logged in, navigate to your project's root directory in the terminal and run the following command:
    ```bash
    firebase deploy --only apphosting
    ```

    The CLI will build your Next.js application and deploy it to Firebase App Hosting. This may take a few minutes.

3.  **Get the Live URL:**
    Once the deployment is complete, the terminal will output the public URL for your live application. It will look something like `https://your-project-name.web.app`.

You can now send this URL to your client! They will be able to use the QR code generator live in their browser.
