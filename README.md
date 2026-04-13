# OWASP A10: Mishandling of Exceptional Conditions

This repository contains a full demonstration environment for **OWASP Top 10 A10: Mishandling of Exceptional Conditions** (A10:2025). This category emphasizes the risks associated with how an application handles (or fails to handle) unexpected states, crashes, and exceptions.

## Overview

Software often encounters abnormal conditions (missing inputs, invalid syntaxes, network failures). When applications do not handle these exceptional conditions gracefully, they can:
- **Leak sensitive infrastructure details** via verbose error messages.
- **Bypass security controls** by failing open instead of failing securely.
- **Cause system instability** (Denial of Service).

---

## 🚀 Running the Demonstration

1. Run the application:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💥 Exploitation Demonstration

### Vulnerability Explanation
The vulnerable application uses a simulated backend database. The developer assumed the `id` field would always be an integer and did not include a protective `try-catch` wrapper inside the database context. 

### Method 1: Using the Web UI
1. Go to the **Vulnerable App** tab in the UI.
2. The UI tries to fetch user profile with ID `1`.
3. Try passing a single quote `'` in the ID field and click **Fetch User Profile**.
4. The database parsing fails. Because the exception is mishandled (recklessly passed back to the client), you will see the raw stack trace and crucially, the **Database Connection Details (including the supersecret password)**. 

### Method 2: Using cURL or Burp Suite
Threat actors often discover these by fuzzing parameters with special characters. Using cURL:
```bash
curl -X GET 'http://localhost:3000/api/vulnerable?id=1%27'
```
You will notice the `dbInfo` array is leaked in the `500 Internal Server Error` response.

### Impact & Detection
- **Impact**: Full exposure of backend credentials, potentially leading to immediate Remote Code Execution or a Data Breach.
- **Detection**: Check server logs (SIEM) for frequent HTTP 500 Responses with large response sizes, or unhandled Promise rejections indicating stack traces were fired back to clients.

---

## 🛡️ Hardening Techniques

Go to the **Hardened Defenses** tab. Try the exact same exploit (`'`).

**What Changed?**
1. **Global Error Middleware (Fail Securely)**: The `/api/hardened` endpoint wraps the operation in a generic `try/catch`. 
2. **Standardized Responses**: The error returns `{ success: false, message: "An unexpected error occurred..." }`. No sensitive structure or context is attached.
3. **Internal Logging**: The full stack trace and debugging context is logged securely on the server-side console, remaining invisible to the end user.

---

## 🚩 CAPTURE THE FLAG: "The Bad Patch"

The developer learned about exceptions crashing the system on invalid SQL keywords, so they added a patch. 

**Your Goal**: Retrieve the hidden `FLAG` located in the application's internal database exception context!

**The Setup**:
- The API is at `/api/challenge`.
- The developer implemented a regex to remove dangerous words like `UNION`, `DROP`, and `'`.
- **Hint**: Is the parameter *always* a string? What happens if you modify the JSON structure sent to the server from a string to an array?
- **How to Win**: You must cause the internal SQL parser to crash with a "Syntax Error" by bypassing the regex replacement, forcing the server to mishandle the exception and leak `FLAG{...}` to you!
