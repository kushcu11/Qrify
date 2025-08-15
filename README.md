# Firebase Studio

This is a NextJS starter in Firebase Studio.

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
