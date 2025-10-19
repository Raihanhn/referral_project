"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import useStore from "@/store/UseStore";
import { motion } from "framer-motion";
import axios from "axios";

interface ReferralUser {
  id: string;
  name: string;
  purchased: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser, updateCredits } = useStore();
  const [stats, setStats] = useState({
    referred: 0,
    bought: 0,
    referralUsers: [] as ReferralUser[],
  });

  // Fetch user dashboard data
  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/user/me");
      setUser(res.data.user);
      setStats({
        referred: res.data.referredCount,
        bought: res.data.purchasedCount,
        referralUsers: res.data.referralUsers || [],
      });
    } catch (err) {
      console.error(err);
      router.push("/auth/login"); // redirect if not logged in
    }
  };

  // ✅ useEffect fix: stable dependency
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []); // run once on mount

  const handlePurchase = async () => {
    if (!user) return;
    try {
      const res = await axios.post("/api/purchase", { amount: 10 });
      if (res.data.ok) {
        // Only update local credits if first purchase was credited
        if (res.data.purchase.isFirstPurchase) {
          updateCredits(2);
        }
        // setStats((prev) => ({
        //   ...prev,
        //   bought: prev.bought + 1,
        // }));
        await fetchDashboard(); // refresh stats from server
        alert("Purchase simulated!");
      }
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  };

  if (!user) return null; // or a loader

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer">
            {user.name[0].toUpperCase()}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Referred Users" value={stats.referred} />
          <StatCard label="Bought" value={stats.bought} />
          <StatCard label="Credits" value={user.credits} />
        </div>

        <div className="mb-6">
          <h4 className="text-sm text-gray-600 mb-2">Your referral link</h4>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${window.location.origin}/auth/register?r=${user.referralCode}`}
              className="flex-1 p-3 border rounded bg-gray-50"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/auth/register?r=${user.referralCode}`
                )
              }
            >
              Copy
            </button>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          className="px-6 py-3 bg-orange-500 text-white rounded"
        >
          Simulate Purchase
        </button>

        {/* ✅ Referral Users Section */}
        <section className="mt-10 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Referral Users
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.referralUsers && stats.referralUsers.length > 0 ? (
              stats.referralUsers.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 bg-gray-100 rounded flex flex-col items-center"
                >
                  <div className="text-lg font-bold">{ref.name}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {ref.purchased ? "Purchased ✅" : "No Purchase"}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No referral users yet
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
