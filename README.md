
# Referral System Overview

This project is built with **Next.js**, **Tailwind CSS**, and **MongoDB** and features a **custom user authentication system**. It implements a **referral and credit mechanism** as follows:

- **User Registration & Login:** Users can register and log in through a custom authentication flow.  
- **Dashboard & Referral Link:** After logging in, users have access to their dashboard, which displays a unique referral link and a purchase button.  
- **Referral Credits:**  
  - When **User A** shares their referral link with **User B**, and User B registers using the link and makes their **first purchase**, both users receive **2 credits**.  
  - The dashboard reflects referral statistics:
    - **Referrals:** Number of users referred.  
    - **Purchases (Bought):** Number of purchases made by the user.  
    - **Credits:** Total credits earned.  
  - Subsequent purchases by User B do **not** generate additional credits for either user.  

**Example Flow:**  
- User A refers User B.  
- User B registers via the link and makes the first purchase:  
  - **User A:** Referrals: 1 | Bought: 0 | Credits: 2  
  - **User B:** Referrals: 0 | Bought: 1 | Credits: 2  
- User B makes a second purchase:  
  - **User B:** Referrals: 0 | Bought: 2 | Credits: 2  
  - **User A:** Credits remain 2  
- Further purchases increase **Bought** but do not add credits.  

---

### Referral System Diagram

![Referral System Diagram](/referral-diagram.png)






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
