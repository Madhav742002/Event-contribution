"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FundCollection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Fund Collection</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Collection</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">₹12,500</span>
              <span className="text-sm opacity-80">This Month</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Departments</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">8</span>
              <span className="text-sm opacity-80">Active</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Target</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">₹25,000</span>
              <span className="text-sm opacity-80">Monthly Goal</span>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <h4 className="font-semibold">Department {i}</h4>
                  <p className="text-sm text-gray-600">Transaction ID: #2023{i}456</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+₹2,500</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            View All Transactions
          </Button>
        </Card>
      </div>
    </div>
  );
}
