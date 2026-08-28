# Hugging Face API key — not required for Phase A

AskJosh does not call Hugging Face during the stabilization and stakeholder-polish phase. Do not add or enable a paid AI service for this build.

The instructions below are retained only as historical notes and should not be followed unless a later implementation is explicitly approved.

## Historical instructions

## Option 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/chrisdc82s-projects/ask-josh/settings/environment-variables

2. Click "Add New" button

3. Fill in:
   - **Key:** `HUGGINGFACE_API_KEY`
   - **Value:** Your HuggingFace API token (starts with `hf_`)
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. Click "Save"

5. **Important:** After adding, you need to redeploy:
   - Go to: https://vercel.com/chrisdc82s-projects/ask-josh
   - Click on the latest deployment
   - Click "Redeploy" button
   - Or run: `vercel --prod` from command line

## Option 2: Via Vercel CLI

Run these commands (you'll be prompted for the API key value):

```bash
vercel env add HUGGINGFACE_API_KEY production
vercel env add HUGGINGFACE_API_KEY preview
vercel env add HUGGINGFACE_API_KEY development
```

Then redeploy:
```bash
vercel --prod
```

## Get Your HuggingFace API Key

1. Go to: https://huggingface.co/settings/tokens
2. Create a new token (or use existing)
3. Copy the token value (starts with `hf_`)

