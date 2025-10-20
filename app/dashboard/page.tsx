"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/UseStore";
import axios from "axios";

interface ReferralUser {
  _id: string;
  name: string;
  purchased: boolean;
}

interface Stats {
  referred: number;
  bought: number;
  referralUsers: ReferralUser[];
}

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser, updateCredits } = useStore();
  const [stats, setStats] = useState<Stats>({
    referred: 0,
    bought: 0,
    referralUsers: [],
  });

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Unauthorized");

      const res = await axios.get("/api/user/me", {
        headers: { "x-user-id": userId },
      });

      const userData = res.data.user;
      setUser(userData);

      setStats({
        referred: res.data.referredCount || 0,
        bought: res.data.purchasedCount || 0,
        referralUsers: res.data.referralUsers || [],
      });
    } catch (err) {
      console.error(err);
      localStorage.removeItem("userId"); // clear invalid user
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async () => {
    try {
      const res = await axios.post(
        "/api/purchase",
        { amount: 10 },
        {
          headers: {
            "x-user-id": user._id, // send ID as header
          },
        }
      );

      // ✅ Optimistically update bought count immediately
      setStats((prev) => ({
        ...prev,
        bought: prev.bought + 1,
      }));

      // ✅ Update credits if first purchase bonus applied
      if (res.data.purchase?.isFirstPurchase) {
        updateCredits(2); // add credits to store immediately
      }

      alert(res.data.message);
    } catch (err: any) {
      console.error("Purchase error:", err);
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/auth/login");
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer">
            {user.name[0]?.toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats & Referral */}
      <section className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Welcome, {user.name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Referred Users" value={stats.referred} />
          <StatCard label="Bought" value={stats.bought} />
          <StatCard label="Credits" value={user.credits || 0} />
        </div>

        {/* Referral Link */}
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

        {/* Purchase button */}
        <button
          onClick={handlePurchase}
          className="px-6 py-3 bg-orange-500 text-white rounded"
        >
          Simulate Purchase
        </button>

        {/* Referral Users */}
        <section className="mt-10 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Referral Users
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stats.referralUsers.length > 0 ? (
              stats.referralUsers.map((ref) => (
                <div
                  key={ref._id}
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
