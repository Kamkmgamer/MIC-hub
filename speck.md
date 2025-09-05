# **Micro-Influencer Hub – Technical Spec**

## **1. Frontend + Backend**

* **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)

  * Server-side rendering (SSR) for SEO (campaign listings, influencer profiles).
  * Static Site Generation (SSG) for public landing pages.
  * Edge functions (via Vercel) for fast global delivery.

* **API Layer**: [tRPC](https://trpc.io/)

  * End-to-end type-safe API calls (no REST/GraphQL boilerplate).
  * Shared types between client & server.
  * Great DX and perfect fit with Next.js.

## **2. Database & ORM**

* **Database**: [PostgreSQL (Neon)](https://neon.tech/)

  * Serverless Postgres with branching for testing.
  * Autoscaling storage & compute.

* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

  * Fully type-safe queries.
  * Schema-first migrations (no raw SQL headaches).
  * Easy integration with Neon.

## **3. Authentication**

* **Auth provider**: [Clerk](https://clerk.com/)

  * User sign-up/sign-in (Email, Google, Social logins).
  * Role-based auth (influencer vs business).
  * Profile management (profile photo, social accounts).
  * Session management baked into Next.js middleware.

## **4. Deployment**

* **Hosting**: [Vercel](https://vercel.com/)

  * Automatic deploys from GitHub.
  * Edge functions for tRPC endpoints.
  * Built-in CDN for frontend assets.

## **5. Payments (MVP & Future)**

* **Option A (MVP)**: Mock payments for testing campaigns.
* **Option B (Production)**:

  * [Stripe Connect](https://stripe.com/connect) → Escrow-based payouts to influencers.
  * Businesses pay → funds held → released after campaign approval.

## **6. Core MVP Features (with stack in mind)**

1. **Auth & Profiles**

   * Business / Influencer roles via Clerk.
   * Profile setup form stored in PostgreSQL via Drizzle.

2. **Campaigns**

   * Businesses: create campaign (title, budget, requirements).
   * Influencers: browse/apply.
   * Store in Neon DB with relations (user → campaign).

3. **Matching**

   * Simple search & filters (e.g., niche, budget, followers).
   * Drizzle queries + indexed search.

4. **Collaboration Dashboard**

   * Campaign status (open, in progress, completed).
   * Deliverable uploads (stored in Neon/S3 in future).

5. **Payments**

   * Integrate Stripe (or keep simple in MVP).

6. **Notifications**

   * Email notifications (Vercel + Resend API).

## **7. Future Features (Scaling Up)**

* AI matching engine (e.g., embeddings in Pinecone/Weaviate).
* Analytics integration (Instagram Graph API, TikTok API).
* CRM features for long-term business-influencer relationships.
* Mobile app (React Native, sharing tRPC backend).

## **8. Dev Workflow**

* **Local dev**:

  * Next.js + tRPC API in dev server.
  * Neon local branch for dev DB.
  * Clerk dev instances for auth.

* **CI/CD**:

  * GitHub → Vercel auto deploy.
  * Neon DB migrations via Drizzle kit in pipeline.
