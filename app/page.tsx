// app/page.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const primary = "bg-gradient-to-r from-[#477ACE] via-[#15BDD7] to-[#98C9DA]";
const ctaColor = "bg-[#F9891C]";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FDFDFD_0%,#EFF0F0_100%)]">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background:'#477ACE'}}>R</div>
          <div>
            <h1 className="text-xl font-semibold">Referral & Credit System</h1>
            <p className="text-sm text-gray-500">Digital product marketplace</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm px-4 py-2 rounded-md hover:underline">Login</Link>
          <Link href="/auth/register" className={`text-sm px-4 py-2 rounded-md text-white ${ctaColor}`}>Get Started</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{color:'#0f172a'}}>
            Build referral growth.<br />
            Reward users instantly.
          </h2>
          <p className="mt-6 text-gray-600 max-w-xl">
            Create referral links, reward both referrer and referred user on first purchase, and track all conversions in a clean dashboard.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg text-white ${ctaColor} shadow-lg`}>
              Create account
            </Link>
            <a href="#how" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-200">
              How it works
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl shadow-sm" style={{background: 'white'}}>
              <div className="text-sm font-semibold text-gray-600">Referral</div>
              <div className="mt-2 text-2xl font-bold">Unique Code</div>
            </div>
            <div className="p-4 rounded-xl shadow-sm" style={{background: 'white'}}>
              <div className="text-sm font-semibold text-gray-600">Credits</div>
              <div className="mt-2 text-2xl font-bold">2 / first buy</div>
            </div>
            <div className="p-4 rounded-xl shadow-sm" style={{background: 'white'}}>
              <div className="text-sm font-semibold text-gray-600">Dashboard</div>
              <div className="mt-2 text-2xl font-bold">Realtime</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="rounded-2xl shadow-xl overflow-hidden">
            <div className={`${primary} p-6`}>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-white text-lg font-semibold">Your Dashboard</h3>
                  <p className="text-white/90 mt-2 text-sm max-w-sm">Monitor referrals, purchases and credits in one place.</p>
                </div>
                <div className="text-white/90 text-sm">Due: <strong>26 Oct 2025</strong></div>
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Referred" value="12" />
                <StatCard label="Bought" value="4" />
                <StatCard label="Credits" value="28" />
              </div>

              <div className="mt-6">
                <h4 className="text-sm text-gray-600">Your referral link</h4>
                <div className="mt-3 flex gap-3">
                  <input readOnly value="https://yourapp.com/register?r=LINA123" className="flex-1 p-3 rounded-md border border-gray-200 bg-gray-50" />
                  <button className="px-4 py-2 rounded-md text-white" style={{background:'#477ACE'}}>Copy</button>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-5 py-3 rounded-md text-white" style={{background:'#F9891C'}}>Simulate Purchase</button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-semibold">How it works</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <InfoCard title="Sign up" desc="User registers and receives a referral code." />
          <InfoCard title="Share link" desc="Share your unique referral link with friends." />
          <InfoCard title="Earn credits" desc="Both get 2 credits on first purchase." />
        </div>
      </section>

      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
          <div>© {new Date().getFullYear()} Referral & Credit System</div>
          <div>Built with ❤️ • Developed By Md Raihan</div>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm mt-2 text-gray-600">{desc}</div>
    </motion.div>
  );
}
