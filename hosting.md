# Free Hosting Guide for Hacktoberfest 2025

This guide provides **free hosting options** for your Hacktoberfest projects.  
You can host your frontend, backend, or full-stack projects so they are live and shareable.

---

## 1️⃣ Hosting Frontend / Static Projects

### **Option A: Vercel**
- **Website:** [https://vercel.com](https://vercel.com)
- **Best for:** React, Next.js, static HTML/CSS/JS
- **Steps:**
  1. Sign up with GitHub.
  2. Connect your Hacktoberfest repo.
  3. Vercel auto-detects your project type and sets up deployment.
  4. Click **Deploy**.
  5. Get a live URL like: `https://hacktoberfest-project.vercel.app`.

**Advantages:** Auto-deploys on every push, free for unlimited personal projects.

---

### **Option B: Netlify**
- **Website:** [https://www.netlify.com](https://www.netlify.com)
- **Best for:** Static sites, frontends
- **Steps:**
  1. Sign up with GitHub.
  2. Click **New site from Git**.
  3. Select your Hacktoberfest repo.
  4. Configure build settings (auto-detected for most frameworks).
  5. Click **Deploy Site**.
  6. Share your live site URL.

**Advantages:** Free tier includes 125k requests/month and 100GB bandwidth.

---

## 2️⃣ Hosting Backend / Full-Stack Projects

### **Option A: Render Free Tier**
- **Website:** [https://render.com](https://render.com)
- **Best for:** Node.js, Python, APIs, small databases
- **Steps:**
  1. Sign up and link your GitHub account.
  2. Click **New → Web Service**.
  3. Select your repository and branch.
  4. Render auto-deploys your project and gives a live URL.

**Free Tier:** 750 hours/month, 512MB RAM – enough for small projects.

---

### **Option B: DigitalOcean Free Credits**
- **Website:** [https://www.digitalocean.com/try/free/](https://www.digitalocean.com/try/free/)
- **Best for:** Multi-module projects, backend-heavy apps, temporary server hosting
- **Steps:**
  1. Sign up for $100 free credits (new account only).
  2. Create a **Droplet** (Ubuntu server is recommended).
  3. SSH into the server:
     ```bash
     git clone https://github.com/hackdaydvsiet-debug/hacktoberfest-2025.git
     cd hacktoberfest-2025
     ```
  4. Install project dependencies (Node.js, Python, etc.).
  5. Run the project and expose it on port 80 (or use NGINX).
  6. Share the public IP or a free domain (e.g., Freenom).

---

### **Option C: AWS Free Tier**
- **Website:** [https://aws.amazon.com/free/](https://aws.amazon.com/free/)
- **Best for:** Scalable backend, serverless apps, APIs, databases
- **Steps:**
  1. Sign up for AWS Free Tier (new accounts only).
  2. Free tier includes:
     - **EC2:** 750 hours/month of t2.micro/t3.micro instances (Linux/Windows)
     - **S3:** 5GB storage for static websites
     - **Lambda:** 1M free requests/month for serverless functions
     - **RDS:** 750 hours/month of managed database (MySQL/PostgreSQL)
  3. Deploy backend or full-stack apps on EC2 or Lambda.
  4. Host static frontends on S3 + CloudFront if needed.
  5. Share the endpoint URL or public site URL with participants.

**Tips:**  
- Use **Lambda + API Gateway** for serverless APIs to avoid managing servers.  
- S3 + CloudFront is best for static frontends.  
- Free tier lasts 12 months from account creation.

---

## 3️⃣ Tips for Students

- Each project folder in the repo can be deployed individually.
- Share the live URL in your Pull Request description.
- For simple static projects, GitHub Pages is also an option:
  - Add your project folder as a branch or in `/docs`.
  - Enable GitHub Pages in repo settings.

---

## 4️⃣ Summary

| Project Type | Free Hosting Option |
|-------------|------------------|
| Static Frontend / HTML/CSS/JS | **Vercel**, **Netlify**, **GitHub Pages** |
| React / Next.js Frontend | **Vercel** |
| Small Full-Stack / Backend | **Render Free Tier**, **AWS Free Tier** |
| Multi-module Backend / Database | **DigitalOcean Free Credits**, **AWS Free Tier** |

> Choose the option that best fits your project type.  
> Hosting your project live will help you showcase it during Hacktoberfest and for future contributions!
