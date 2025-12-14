import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Database, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardPage = ({
  inventory,
  totalInventoryA,
  totalOrders,
  activeCustomers,
  monthlyRevenue,
  inventoryTrend,
  qualityData,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">營運儀表板</h1>
      <div className="text-sm text-gray-500">最後更新: 2025-11-25 14:30</div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">A級庫存</p>
            <p className="text-3xl font-bold mt-2">{totalInventoryA}</p>
            <p className="text-green-100 text-xs mt-1">可配送數量</p>
          </div>
          <Database className="w-12 h-12 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">待處理訂單</p>
            <p className="text-3xl font-bold mt-2">{totalOrders}</p>
            <p className="text-blue-100 text-xs mt-1">今日訂單</p>
          </div>
          <ShoppingCart className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">活躍客戶</p>
            <p className="text-3xl font-bold mt-2">{activeCustomers}</p>
            <p className="text-purple-100 text-xs mt-1">本月購買</p>
          </div>
          <Users className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">累計營收</p>
            <p className="text-3xl font-bold mt-2">${(monthlyRevenue / 1000).toFixed(1)}K</p>
            <p className="text-orange-100 text-xs mt-1">本月統計</p>
          </div>
          <TrendingUp className="w-12 h-12 text-orange-200" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">庫存趨勢</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={inventoryTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="數量" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">品質分布</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={qualityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {qualityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
        庫存警示
      </h2>
      <div className="space-y-2">
        {inventory
          .filter((item) => item.gradeA < 50)
          .map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-orange-600 font-medium">
                A級剩餘 {item.gradeA} {item.unit}
              </span>
            </div>
          ))}
      </div>
    </div>
  </div>
);

export default DashboardPage;

