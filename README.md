# The Tiebreaker App

The Tiebreaker App helps to make decisions. You need to provide a decision that you need to make, and it will show different pros and cons. This can be through a pros and cons list, a comparison table, or even a SWOT analysis.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6b161079-38b0-4670-ace0-ca87254f99a4

## Run Locally

**Prerequisites:**  Node.js (v16 or higher) and npm

### Setting up locally in VS Code

Regardless of how you get the code, follow these steps to run it locally:

#### 1. Install Dependencies

Open the terminal in VS Code (`Ctrl+`` on Windows/Linux or `Cmd+`` on Mac) and run:

```bash
npm install
```

This will install all required dependencies for the project.

#### 2. Configure Environment Variables

1. Create a new file named `.env` in the root folder (or copy the existing `.env.example`)
2. Copy the contents from `.env.example` into `.env`
3. Add your own Gemini API Key from the [Google AI Studio API Key page](https://aistudio.google.com/app/apikey)

Your `.env` file should look like this:

```env
GEMINI_API_KEY="YOUR_ACTUAL_KEY_HERE"
```

> ⚠️ **Important:** Never commit your `.env` file to Git. The `.gitignore` is already configured to prevent this.

#### 3. Run the App

```bash
npm run dev
```

This will start your Express server, which handles both the AI logic and serves the React frontend. The app will typically be available at `http://localhost:5173`
