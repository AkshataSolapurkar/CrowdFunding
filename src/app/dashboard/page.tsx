'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Home,
  BarChart2,
  Users,
  Settings,
  Menu,
  X
} from 'lucide-react'

const sidebarItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Users, label: 'Users' },
  { icon: Settings, label: 'Settings' },
]

const barChartData = [
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sept', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0.05 },
]

const pieChartData = [
  { name: 'Group A', value: 1 },
  { name: 'Group B', value: 0 },
  { name: 'Group C', value: 0.5 },
  { name: 'Group D', value: 0.7 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-[50px] to-purple-50 flex">
      {/* Animated grid background */}
      <div className="fixed inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 mt-[50px] left-0 z-50 w-64 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-r border-gray-200 border-opacity-50 p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Web3 Dashboard
              </h1>
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-white hover:bg-opacity-30 transition duration-200"
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={`flex-1 p-8 ${isSidebarOpen ? 'ml-64' : ''} transition-all duration-300 relative z-10`}>
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg text-gray-700 hover:text-gray-900 transition duration-200"
        >
          <Menu size={24} />
        </button>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                  <XAxis dataKey="name" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }:any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: '2' },
              { label: 'Active Campaigns', value: '2' },
              { label: 'Total Revenue', value: '0.2 sepholia ETH' },
              { label: 'Avg. Engagement', value: '0.1%' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-medium text-gray-600 mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}