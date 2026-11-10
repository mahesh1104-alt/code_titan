# Inkloom AI – BrandGuard
**An evidence-grounded, multimodal, human-controlled brand governance platform that reviews content before it is published.**

> **Team Name:** Dev Code  
> **Demo Company:** TechNova  
> **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui primitives + Vercel AI SDK + Recharts

---

## 🌟 Overview & Key Capabilities

BrandGuard acts as an immutable quality gate between content creation and publication. Whether drafts are written by employees, agency copywriters, or generative AI models, BrandGuard:
1. **Detects violations** against verified corporate brand guidelines, facts, terminology, and visual standards.
2. **Backs findings with evidence citations** directly referenced to approved source documents and SLAs.
3. **Generates intent-preserving corrections** using the creator's intended message so marketing appeal is retained while removing compliance liability.
4. **Enforces human review & role segregation** (Creator, Brand Manager, Legal/Compliance Reviewer, Org Admin) with required written rationale for any reviewer override.
5. **Surfaces guideline ambiguity intelligence** for Enterprise teams to refine unclear policies before mistakes repeat.

---

## 🚀 Live Demo Personas (1-Click Login)

Navigate to `/login` to access the **Demo Accounts Panel** with one-click cards:

| Persona | Tier | Role | Initial Route | Features & Workflow Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Vance** (`starter@technova.demo`) | **Starter** (Free) | Org Admin (Solo) | `/app/dashboard` | Solo workflow; visual & team features locked with upgrade prompts |
| **Elena Rostova** (`creator@pro.technova.demo`) | **Professional** ($49/mo) | Creator | `/app/submit` | Upload drafts, inspect highlights, accept/reject intent-preserving fixes |
| **Marcus Sterling** (`manager@pro.technova.demo`) | **Professional** ($49/mo) | Brand Manager | `/app/approvals` | Kanban board, edit brand facts & terminology, team analytics |
| **Rachel Zane** (`reviewer@pro.technova.demo`) | **Professional** ($49/mo) | Authorised Reviewer | `/app/content` | Review queue, sign-off approval, override findings with mandatory reason |
| **Sarah Chen** (`admin@enterprise.technova.demo`) | **Enterprise** ($299/mo) | Org Admin | `/app/dashboard` | Full platform control, audit trail export, ambiguity intelligence & billing |
| **David Thorne** (`reviewer@enterprise.technova.demo`) | **Enterprise** ($299/mo) | Chief Compliance Officer | `/app/approvals` | Multi-step gates, strict legal review, immutable audit trail |

---

## 🔬 The Six Compliance Checks

1. **Deterministic Terminology Engine**: Case-normalised exact match, word-boundary regex, and fuzzy Levenshtein matching. Flags banned terms (e.g. *"AI robot"* ➔ *"AI-powered platform"*; *"consumer"* ➔ *"customer"*).
2. **Promotional Claims & Superlatives**: Catches absolute warranties (*"100% guaranteed"*, *"zero risk"*), superlative rankings (*"world's No. 1"*), and unverified percentage metrics (*"300% better"*).
3. **Fact Verification Engine**: Compares claims against verified structured facts (e.g. *Founding year 2018*, *12 global countries*, *24/7 support exclusively for Enterprise tier*). Unsupported statements are labelled `unsupported`, never incorrectly branded false.
4. **Tone & Voice Consistency**: Evaluates professional, trustworthy, and customer-focused attributes; eliminates informal slang and hyperbole.
5. **Visual Identity Engine**: Palette verification using CIEDE2000 color distance against TechNova Deep Navy (`#164E8A`) and Amber Gold (`#F4B942`); validates logo clear-space padding (≥24px) and aspect ratio.
6. **WCAG 2.2 AA Accessibility**: Computes relative luminance contrast ratios (mandating ≥4.5:1 AA standard) and flags low-contrast text.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + custom TechNova tokens (`#164E8A`, `#F4B942`)
- **UI & Interactivity:** Lucide React, Radix UI primitives, Sonner toasts, Recharts, Framer Motion
- **Keyboard Navigation:** Review Workspace shortcuts (`J`/`K` next/prev finding, `A` accept, `R` reject, `E` edit, `O` override, `⌘K` Command Palette, `?` shortcuts guide)
- **Deployment:** Vercel serverless edge with Node.js runtime for document ingestion

---

## 📦 How to Deploy to Vercel

### Step 1: Push Code to GitHub
```bash
# If not already initialized:
git add .
git commit -m "feat: complete Inkloom AI BrandGuard platform"

# Create a new repository on your GitHub account (e.g., github.com/username/brandguard)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Visit [vercel.com/new](https://vercel.com/new) and select your GitHub repository.
2. Vercel automatically detects Next.js.
3. (Optional) Add your environment variables from `.env.example` in the **Environment Variables** section:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: *(Optional for live Gemini AI calls)*
   - `NEXT_PUBLIC_DEMO_MODE`: `true`
4. Click **Deploy**. The application compiles cleanly in under 60 seconds!

---

## 🧪 Acceptance Test & Evaluation Script

Follow this 5-minute evaluation script:
1. **Public Landing Page (`/`)**: Watch the animated typing demo where the TechNova non-compliant ad highlights 6 issues and transitions to the compliant version.
2. **Demo Playground (`/demo`)**: Paste any promotional draft or click *"Run Instant Check"* on the sample ad without logging in.
3. **Login as Creator (`creator@pro.technova.demo`)**:
   - Navigate to `/app/content/cnt_technova_sample_ad` (Review Workspace).
   - See the 6 highlighted findings synchronized with the document viewer.
   - Click **Accept Fix** on *"100% guaranteed protection"* ➔ watch the text change to *"robust, enterprise-grade data protection"*, the score lift, and the gate update.
4. **Switch to Reviewer (`reviewer@pro.technova.demo`)**:
   - Test the **Override** button on any finding. Notice that a written justification is strictly required.
5. **Switch to Enterprise Admin (`admin@enterprise.technova.demo`)**:
   - Open `/app/analytics` ➔ View the **Guideline Ambiguity Intelligence** cards (e.g. *"The term 'affordable' was flagged 14 times and overridden 9 times"*).
   - Click *"Open Terminology Editor"* to add the rule.
   - Open `/app/audit` ➔ Filter logs and click **Export CSV**.
6. **Switch to Starter (`starter@technova.demo`)**:
   - Confirm that Visual & Accessibility checks and Team Approvals display lock badges with the **Upgrade Dialog**.

---

Built with precision for enterprise brand governance.
