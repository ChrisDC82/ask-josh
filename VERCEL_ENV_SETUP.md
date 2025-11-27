# How to Add HUGGINGFACE_API_KEY to Vercel

## Step-by-Step Instructions:

### 1. Get Your HuggingFace API Key
- Go to: https://huggingface.co/settings/tokens
- If you don't have a token, click "New token"
- Name it: `ask-josh-production`
- Select "Read" access
- Copy the token (starts with `hf_`)

### 2. Add to Vercel Dashboard
- Go to: https://vercel.com/chrisdc82s-projects/ask-josh/settings/environment-variables
- Click the **"Add New"** button (top right)
- Fill in:
  - **Key:** `HUGGINGFACE_API_KEY` (exactly this, case-sensitive)
  - **Value:** Paste your HuggingFace token (the `hf_...` value)
  - **Environments:** Check ALL THREE boxes:
    - ☑ Production
    - ☑ Preview
    - ☑ Development
- Click **"Save"**

### 3. Verify It Was Added
- You should see `HUGGINGFACE_API_KEY` in the list
- It should show "Production, Preview, Development" under environments

### 4. Redeploy
After adding, let me know and I'll redeploy, or run:
```bash
vercel --prod
```

## Common Issues:
- **Key name must be exact:** `HUGGINGFACE_API_KEY` (all caps, underscores)
- **Must select Production environment** (not just Preview/Development)
- **Token must start with `hf_`**
- **After adding, you MUST redeploy** for it to take effect

