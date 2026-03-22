# Expensio — Personal Finance OS

> Daily expense tracker with Google Auth, 30-day trial, and Razorpay Pro payments.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Single HTML file — no framework |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Firebase Firestore (license records) |
| Payments | Razorpay (UPI / Card / Net Banking) |
| Hosting | Netlify (static + serverless functions) |
| CI/CD | GitHub Actions → auto-deploys on `git push` |

---

## One-time setup (30 minutes)

### Step 1 — Fork / clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/expensio.git
cd expensio
```

### Step 2 — Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → name it `expensio` → Create
3. **Authentication** → Get started → **Google** → Enable → Save
4. **Firestore** → Create database → Production mode → `asia-south1` → Enable
5. Paste these **Firestore Security Rules**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /licenses/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```
6. **Project Settings** (⚙) → **Your apps** → **</>** → Register → copy the 6 config values

### Step 3 — Create Razorpay account

1. Sign up at [razorpay.com](https://razorpay.com) and complete KYC
2. **Settings → API Keys** → Generate Live Key
3. Copy both **Key ID** (`rzp_live_...`) and **Key Secret**

### Step 4 — Create Netlify site

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Connect GitHub → select this repo → **Deploy site**
3. Copy your site URL (e.g. `expensio-abc123.netlify.app`)

### Step 5 — Set environment variables in Netlify

**Site configuration → Environment variables → Add variable**

| Variable | Value |
|---|---|
| `FIREBASE_API_KEY` | from Firebase Project Settings |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | `your-project-id` |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | from Firebase |
| `FIREBASE_APP_ID` | from Firebase |
| `RAZORPAY_KEY_ID` | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | your Razorpay secret key |
| `SITE_URL` | `https://your-site.netlify.app` |
| `PRO_PRICE` | `499` |
| `TRIAL_DAYS` | `30` |
| `TRIAL_MAX_EXP` | `50` |
| `PRO_DURATION_DAYS` | `365` |

After saving → **Deploys → Trigger deploy → Deploy site**

### Step 6 — Add authorized domain in Firebase

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Add your Netlify URL: `expensio-abc123.netlify.app`

### Step 7 — Set up GitHub Actions (auto-deploy)

1. Get your Netlify Personal Access Token:
   - Netlify → **User settings → Applications → Personal access tokens → New access token**
   - Copy the token

2. Get your Netlify Site ID:
   - Netlify → your site → **Site configuration → General → Site ID**

3. Add both as GitHub Secrets:
   - GitHub repo → **Settings → Secrets and variables → Actions → New secret**
   - Add `NETLIFY_AUTH_TOKEN` = your token
   - Add `NETLIFY_SITE_ID` = your site ID

From now on: every `git push` to `main` automatically deploys to Netlify.

---

## Development workflow

```bash
# Make changes locally
# Test with Netlify Dev (runs functions locally)
npx netlify-cli dev

# Push to GitHub → auto-deploys to production
git add .
git commit -m "your change"
git push origin main
```

---

## Customising the plan

Change pricing without editing any HTML — just update Netlify env vars:

| Env var | Default | Change to |
|---|---|---|
| `PRO_PRICE` | `499` | Any amount in ₹ |
| `TRIAL_DAYS` | `30` | Any number of days |
| `TRIAL_MAX_EXP` | `50` | Any number |

Redeploy after changing.

---

## Project structure

```
expensio/
├── index.html                    # Full app (no secrets)
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker
├── netlify.toml                  # Netlify config + headers
├── icons/                        # App icons
├── netlify/
│   └── functions/
│       ├── config.js             # Serves Firebase config from env vars
│       └── pay.js                # Razorpay order + payment verification
└── .github/
    └── workflows/
        └── deploy.yml            # GitHub Actions → auto-deploy
```

---

## Security model

| What | Where | Visible to users? |
|---|---|---|
| Firebase API key | Netlify env var → served by `/config` function | Safe — by Firebase design |
| Razorpay Key ID | Netlify env var → served by `/config` function | Safe — public identifier |
| **Razorpay Secret** | Netlify env var only | **Never** — server only |
| Payment verification | `netlify/functions/pay.js` | **Never** — server only |
| License activation | `netlify/functions/pay.js` → Firestore | **Never** — server only |
