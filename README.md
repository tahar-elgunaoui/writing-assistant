# Writing Assistant

A minimalist writing assistant that transforms messages into easy French, English, or writes/replies to emails in French.

## Features
- **French Mode**: Translates or corrects text to simple French.
- **English Mode**: Grammatically corrects English text.
- **Email Mode**: Writes or replies to emails in simple French, starting with "Hello" and ending with:
  ```text
  Cordialement,
  Tahar
  ```
- **Secure Backend**: Uses a serverless function proxy (`/api/transform`) to call OpenAI's API securely without exposing your API key in the browser.

## Deployment to Vercel

1. **Push to GitHub/GitLab/Bitbucket** (or use the Vercel CLI).
2. **Import the project** in Vercel.
3. **Configure Environment Variables**:
   - Go to your project settings in Vercel: **Settings** > **Environment Variables**.
   - Add a new variable:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: *[Your OpenAI API Key]*
4. Click **Deploy**.

## Local Development
If you have the [Vercel CLI](https://vercel.com/cli) installed:
1. Run `vercel dev` in this directory.
2. Create a local environment file `.env` in this directory containing:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Open `http://localhost:3000`.
