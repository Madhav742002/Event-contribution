"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TaskManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Task Management</h1>

        {/* Task Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Total Tasks</h3>
            <span className="text-3xl font-bold">48</span>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Completed</h3>
            <span className="text-3xl font-bold">32</span>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <h3 className="text-xl font-semibold mb-2">In Progress</h3>
            <span className="text-3xl font-bold">12</span>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-red-500 to-red-600 text-white">
            <h3 className="text-xl font-semibold mb-2">Pending</h3>
            <span className="text-3xl font-bold">4</span>
          </Card>
        </div>

        {/* Task List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Current Tasks</h3>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              Add New Task
            </Button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Task {i}</h4>
                    <p className="text-sm text-gray-600">Assigned to Team {i}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    i === 1 ? 'bg-green-100 text-green-800' :
                    i === 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {i === 1 ? 'Completed' : i === 2 ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${i * 25}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Progress: {i * 25}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
