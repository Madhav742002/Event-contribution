"use client";
import { Card } from "@/components/ui/card";
import DepartmentChart from "../charts/chartCircle";
import BarChartOne from "../charts/barChart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Event Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Events</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">24</span>
              <span className="text-sm opacity-80">Active Events</span>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Volunteers</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">156</span>
              <span className="text-sm opacity-80">Registered</span>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">92%</span>
              <span className="text-sm opacity-80">This Month</span>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Department Distribution</h3>
            <DepartmentChart />
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Monthly Events</h3>
            <BarChartOne />
          </Card>
        </div>
      </div>
    </div>
  );
}
