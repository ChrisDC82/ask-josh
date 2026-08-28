# Hugging Face API key — not required for Phase A

AskJosh currently uses deterministic catalogue guidance and makes no Hugging Face API calls. No key is required. Do not configure a paid AI service without explicit approval.

## Historical instructions

## Quick Steps:

1. **Get your HuggingFace API key:**
   - Go to: https://huggingface.co/settings/tokens
   - Copy your token (starts with `hf_`)

2. **Add it to Vercel via Dashboard:**
   - Go to: https://vercel.com/chrisdc82s-projects/ask-josh/settings/environment-variables
   - Click "Add New"
   - Key: `HUGGINGFACE_API_KEY`
   - Value: Your token (paste it)
   - Environments: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

3. **Redeploy:**
   - Go to: https://vercel.com/chrisdc82s-projects/ask-josh
   - Click latest deployment → "Redeploy"
   - OR run: `vercel --prod`

## Or use CLI (interactive):

```bash
vercel env add HUGGINGFACE_API_KEY production
vercel env add HUGGINGFACE_API_KEY preview  
vercel env add HUGGINGFACE_API_KEY development
```

Then redeploy:
```bash
vercel --prod
```

