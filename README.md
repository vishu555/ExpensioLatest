# Expensio — Personal Finance OS

Daily expense tracker · Google Auth · 30-day trial · Razorpay Pro

## Quick deploy

1. Upload this folder to a GitHub repo
2. Connect repo to Netlify → Import from Git
3. Set environment variables (see below)
4. Add your Netlify domain to Firebase Authorized Domains
5. Redeploy — done

## Environment variables (Netlify → Site configuration → Environment variables)

| Variable | Value |
|---|---|
| `FIREBASE_API_KEY` | From Firebase Project Settings |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Your project ID |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Numeric sender ID |
| `FIREBASE_APP_ID` | App ID string |
| `RAZORPAY_KEY_ID` | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Secret key (never in code) |
| `SITE_URL` | `https://your-site.netlify.app` |
| `PRO_PRICE` | `499` |
| `TRIAL_DAYS` | `30` |
| `TRIAL_MAX_EXP` | `50` |
| `PRO_DURATION_DAYS` | `365` |

## Auto-deploy (GitHub Actions)

Add two GitHub Secrets (repo → Settings → Secrets → Actions):
- `NETLIFY_AUTH_TOKEN` — Netlify user settings → Personal access tokens
- `NETLIFY_SITE_ID` — Netlify site → Site configuration → Site ID

Every `git push` to `main` deploys automatically.

## Open `setup-guide.html` in your browser for the full interactive walkthrough.
