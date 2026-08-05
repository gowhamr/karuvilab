import { ToolContent } from '../../registry/types';

export const oauthTokenDecoder: ToolContent = {
  detailedDescription: `
# KaruviLab Elite Learning Hub: OAuth 2.0 & Token Architecture

Welcome to the engineering guide to OAuth 2.0. This handbook explains the protocol that powers "Sign in with Google" and why modern APIs completely abandoned session cookies.

---

## 1. Prerequisites: The "Give Me Your Password" Problem

In the early 2000s, if Yelp wanted to see if your friends were already on Yelp, they would ask you: *"Please type your Google Email and Google Password into our form, and we will log in as you to read your contacts."*

**The Problem:** Yelp now has your master Google password. If Yelp gets hacked, the hacker gets your Gmail, your Google Drive, and your Google Wallet.

**The Solution:** OAuth (Open Authorization). 
OAuth allows a user to grant Yelp temporary, restricted access (e.g., "Only read contacts") to their Google account **without ever giving Yelp the password**.

---

## 2. Core Concepts: The OAuth Dance

OAuth introduces distinct roles:
1. **Resource Owner:** You.
2. **Client:** The app you are trying to use (Yelp).
3. **Authorization Server:** The bouncer (Google Login page).
4. **Resource Server:** The API holding the data (Google Contacts API).

**The Flow:**
1. Yelp redirects you to Google.
2. You log in to Google (Yelp never sees this).
3. Google asks you: "Do you want to let Yelp read your contacts?"
4. You click Yes. Google gives Yelp a **Token**.
5. Yelp uses that Token to access the Google Contacts API.

---

## 3. The Architecture: Access Tokens vs Refresh Tokens

The OAuth spec doesn't actually define what a token must look like (it can be random gibberish), but today, 99% of modern architectures use **JSON Web Tokens (JWTs)**.

### Access Token
- **Lifespan:** Very short (usually 15 to 60 minutes).
- **Purpose:** Sent with every API request (in the \`Authorization: Bearer <token>\` header).
- **Why short-lived?** Because APIs verify Access Tokens mathematically without checking the database. If a hacker steals an Access Token, there is no way for the server to easily revoke it. It simply expires in 15 minutes.

### Refresh Token
- **Lifespan:** Long (Days, Months, or Infinite).
- **Purpose:** Used strictly to request a *new* Access Token when the old one expires.
- **Security:** Refresh tokens are strictly validated against a backend database. If a user clicks "Log out of all devices", the backend deletes the Refresh Token from the database, preventing the hacker from generating any more Access Tokens.

---

## 4. Threat Model & Security Disasters

| Threat | Defended By | Explanation |
|--------|-------------|-------------|
| **XSS Token Theft** | 🚨 Architecture | If a developer stores the Access Token in the browser's \`localStorage\`, any malicious JavaScript (XSS) can instantly steal it and impersonate the user. Tokens must be stored in \`HttpOnly\` cookies to block JavaScript access. |
| **CSRF (Cross-Site Request Forgery)** | ✅ \`state\` Parameter | The OAuth flow requires a cryptographic \`state\` parameter to ensure that the login request was genuinely initiated by the user, not a malicious third-party site forcing a login. |
| **Scope Escalation** | ✅ Token Scopes | If Yelp requests the \`contacts.read\` scope, the Access Token mathematically bakes that restriction in. If Yelp tries to use the token to access the \`gmail.read\` API, the API rejects it. |

---

## 5. Production Workflows

- **Microservices (Zero-Trust):** In massive corporate networks (like Netflix), dozens of internal microservices must talk to each other. Instead of every microservice querying a central database to check if a user is valid, they simply validate the RSA signature of the OAuth JWT Access Token. This enables massive scalability.
- **Machine-to-Machine (Client Credentials Flow):** OAuth isn't just for humans. If a backend cron job needs to talk to the Stripe API, it uses its Client ID and Secret to negotiate a token directly, with no human browser interaction involved.

---

## 6. Standards & References
- **RFC 6749:** The OAuth 2.0 Authorization Framework.
- **RFC 7519:** JSON Web Token (JWT) standard.

---

## 7. Interactive Quiz

**Beginner:**
1. What problem does OAuth solve? *(Answer: It allows you to grant a third-party app limited access to your data without giving them your master password).*

**Intermediate:**
2. Why do Access Tokens expire so quickly (e.g., 15 minutes)? *(Answer: Because they are often verified statelessly by the API (without checking a database). A short lifespan minimizes the damage window if the token is stolen).*

**Advanced:**
3. Why is storing an OAuth Access Token in \`localStorage\` considered a critical security vulnerability? *(Answer: Because any malicious JavaScript executed via an XSS attack can read \`localStorage\`, steal the token, and impersonate the user. Secure architectures use HttpOnly cookies).*

---

`,
  howTo: [
    "**Step 1:** Paste your OAuth Access Token (usually a Base64-encoded JWT).",
    "**Step 2:** The tool instantly decodes the Header and Payload locally.",
    "**Step 3:** Inspect the 'scp' or 'scopes' array to see exactly what permissions this token grants.",
    "**Step 4:** Inspect the 'exp' (Expiration) timestamp to see when the token mathematically dies."
  ],
  faq: [
    {
      question: "Can I validate the signature here?",
      answer: "No. Validating the signature requires the Authorization Server's Private Key (or Public Key for RS256). This tool strictly decodes the Base64 payload for debugging purposes."
    },
    {
      question: "Is it safe to paste a production token?",
      answer: "KaruviLab parses the token entirely offline in your browser. However, as a rule of thumb, you should immediately revoke any production token pasted into a web browser."
    }
  ],
  useCases: [],
  examples: [],
  commonErrors: [],
  alternatives: ["SAML Decoder", "JWT Decoder"]
};
