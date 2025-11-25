import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, Plus, Search, Bell, Menu, Home, Database, Truck, User, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const LadybugFarmSystem = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  // 蔬菜資料庫 - 包含季節性與保存期限資訊
  const vegetableDatabase = {
    // 葉菜類
    '空心菜': { type: 'leafy', season: [5,6,7,8,9,10], shelfLife: 3, growthDays: 30, unit: '把' },
    '青江菜': { type: 'leafy', season: [4,5,6,7,8,9,10,11,12,1], shelfLife: 5, growthDays: 35, unit: '把' },
    '小白菜': { type: 'leafy', season: [9,10,11,12,1,2,3], shelfLife: 5, growthDays: 30, unit: '把' },
    '油菜': { type: 'leafy', season: [6,7,8,9,10], shelfLife: 4, growthDays: 25, unit: '把' },
    '地瓜葉': { type: 'leafy', season: [6,7,8,9,10], shelfLife: 3, growthDays: 20, unit: '把' },
    '莧菜': { type: 'leafy', season: [5,6,7,8,9,10], shelfLife: 2, growthDays: 25, unit: '把' },
    '芥藍菜': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 5, growthDays: 60, unit: '把' },
    '茼蒿': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 4, growthDays: 40, unit: '把' },
    '菠菜': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 5, growthDays: 35, unit: '把' },
    '高麗菜': { type: 'leafy', season: [11,12,1,2,3], shelfLife: 14, growthDays: 90, unit: '顆' },
    // 果菜類
    '番茄': { type: 'fruit', season: [11,12,1,2,3,4], shelfLife: 7, growthDays: 90, unit: '斤' },
    '茄子': { type: 'fruit', season: [4,5,6,7,8,9,10,11], shelfLife: 5, growthDays: 70, unit: '條' },
    '青椒': { type: 'fruit', season: [4,5,6,7,8,9,10,11], shelfLife: 7, growthDays: 75, unit: '斤' },
    '小黃瓜': { type: 'fruit', season: [4,5,6,7,8,9], shelfLife: 5, growthDays: 50, unit: '條' },
    '絲瓜': { type: 'fruit', season: [5,6,7,8,9,10], shelfLife: 4, growthDays: 50, unit: '條' },
    '南瓜': { type: 'fruit', season: [9,10,11,12,1], shelfLife: 60, growthDays: 90, unit: '顆' },
    '長豆': { type: 'fruit', season: [5,6,7,8], shelfLife: 4, growthDays: 60, unit: '斤' },
    '花椰菜': { type: 'fruit', season: [9,10,11,12,1], shelfLife: 7, growthDays: 80, unit: '顆' },
  };

  const [inventory, setInventory] = useState([
    { id: 1, name: '高麗菜', gradeA: 45, gradeB: 23, gradeC: 8, unit: '顆', date: '2025-11-25', daysStored: 2 },
    { id: 2, name: '青江菜', gradeA: 120, gradeB: 45, gradeC: 15, unit: '把', date: '2025-11-25', daysStored: 0 },
    { id: 3, name: '小白菜', gradeA: 89, gradeB: 34, gradeC: 12, unit: '把', date: '2025-11-25', daysStored: 1 },
    { id: 4, name: '番茄', gradeA: 67, gradeB: 28, gradeC: 9, unit: '斤', date: '2025-11-24', daysStored: 1 },
    { id: 5, name: '茄子', gradeA: 34, gradeB: 18, gradeC: 7, unit: '條', date: '2025-11-24', daysStored: 1 },
    { id: 6, name: '菠菜', gradeA: 56, gradeB: 22, gradeC: 8, unit: '把', date: '2025-11-25', daysStored: 0 },
    { id: 7, name: '花椰菜', gradeA: 28, gradeB: 12, gradeC: 4, unit: '顆', date: '2025-11-23', daysStored: 2 },
    { id: 8, name: '小黃瓜', gradeA: 78, gradeB: 32, gradeC: 10, unit: '條', date: '2025-11-25', daysStored: 0 },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD001', customer: '王小明', box: '大份蔬菜箱 $450', status: '配送中', date: '2025-11-25', items: ['高麗菜x1', '青江菜x2', '小白菜x2', '番茄x1', '茄子x1'] },
    { id: 'ORD002', customer: '李小華', box: '大份蔬菜箱 $480', status: '分配完成', date: '2025-11-25', items: ['高麗菜x2', '青江菜x1', '小白菜x1', '番茄x2', '茄子x1'] },
    { id: 'ORD003', customer: '張大同', box: '小份蔬菜箱 $320', status: '揀貨中', date: '2025-11-25', items: ['青江菜x2', '小白菜x2', '番茄x1'] },
    { id: 'ORD004', customer: '陳美玲', box: '小份蔬菜箱 $300', status: '訂單成立', date: '2025-11-25', items: [] },
  ]);

  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: '王小明', 
      email: 'wang@email.com', 
      orders: 24, 
      totalSpent: 10800, 
      lastOrder: '2025-11-25',
      recency: 0,
      frequency: 24,
      monetary: 10800,
      rfmScore: '333',
      segment: '頂級忠誠客戶'
    },
    { 
      id: 2, 
      name: '李小華', 
      email: 'li@email.com', 
      orders: 12, 
      totalSpent: 5400, 
      lastOrder: '2025-11-20',
      recency: 5,
      frequency: 12,
      monetary: 5400,
      rfmScore: '322',
      segment: '忠誠客戶'
    },
    { 
      id: 3, 
      name: '張大同', 
      email: 'zhang@email.com', 
      orders: 18, 
      totalSpent: 7560, 
      lastOrder: '2025-11-25',
      recency: 0,
      frequency: 18,
      monetary: 7560,
      rfmScore: '332',
      segment: '忠誠客戶'
    },
    { 
      id: 4, 
      name: '陳美玲', 
      email: 'chen@email.com', 
      orders: 3, 
      totalSpent: 1350, 
      lastOrder: '2025-10-15',
      recency: 41,
      frequency: 3,
      monetary: 1350,
      rfmScore: '111',
      segment: '潛在的忠誠客戶'
    },
    { 
      id: 5, 
      name: '林志豪', 
      email: 'lin@email.com', 
      orders: 8, 
      totalSpent: 3200, 
      lastOrder: '2025-11-10',
      recency: 15,
      frequency: 8,
      monetary: 3200,
      rfmScore: '221',
      segment: '潛在的忠誠客戶'
    },
    { 
      id: 6, 
      name: '劉小美', 
      email: 'liu@email.com', 
      orders: 15, 
      totalSpent: 4500, 
      lastOrder: '2025-11-22',
      recency: 3,
      frequency: 15,
      monetary: 4500,
      rfmScore: '323',
      segment: '忠誠客戶'
    },
    { 
      id: 7, 
      name: '黃大明', 
      email: 'huang@email.com', 
      orders: 6, 
      totalSpent: 8100, 
      lastOrder: '2025-11-24',
      recency: 1,
      frequency: 6,
      monetary: 8100,
      rfmScore: '313',
      segment: '有錢途潛力的客戶'
    },
  ]);

  const [showAddHarvest, setShowAddHarvest] = useState(false);
  const [newHarvest, setNewHarvest] = useState({ name: '', gradeA: 0, gradeB: 0, gradeC: 0, unit: '把' });
  const [inventoryFilter, setInventoryFilter] = useState({ type: 'all', sort: 'date' });
  const [customerFilter, setCustomerFilter] = useState({ segment: 'all', sort: 'totalSpent' });

  // 統計數據
  const totalInventoryA = inventory.reduce((sum, item) => sum + item.gradeA, 0);
  const totalOrders = orders.length;
  const activeCustomers = customers.length;
  const monthlyRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  // 庫存趨勢數據
  const inventoryTrend = [
    { date: '11/20', 數量: 180 },
    { date: '11/21', 數量: 210 },
    { date: '11/22', 數量: 195 },
    { date: '11/23', 數量: 230 },
    { date: '11/24', 數量: 245 },
    { date: '11/25', 數量: 355 },
  ];

  // 品質分布數據
  const qualityData = [
    { name: 'A級', value: totalInventoryA, color: '#10b981' },
    { name: 'B級', value: inventory.reduce((sum, item) => sum + item.gradeB, 0), color: '#f59e0b' },
    { name: 'C級', value: inventory.reduce((sum, item) => sum + item.gradeC, 0), color: '#ef4444' },
  ];

  const handleAddHarvest = () => {
    if (newHarvest.name && (newHarvest.gradeA > 0 || newHarvest.gradeB > 0 || newHarvest.gradeC > 0)) {
      const vegInfo = vegetableDatabase[newHarvest.name];
      setInventory([...inventory, {
        id: inventory.length + 1,
        name: newHarvest.name,
        gradeA: parseInt(newHarvest.gradeA) || 0,
        gradeB: parseInt(newHarvest.gradeB) || 0,
        gradeC: parseInt(newHarvest.gradeC) || 0,
        unit: vegInfo?.unit || newHarvest.unit,
        date: new Date().toISOString().split('T')[0],
        daysStored: 0
      }]);
      setNewHarvest({ name: '', gradeA: 0, gradeB: 0, gradeC: 0, unit: '把' });
      setShowAddHarvest(false);
    }
  };

  // RFM 分級函數 (根據圖片標準)
  const getRFMSegment = (rfmScore) => {
    const segments = {
      '333': '頂級忠誠客戶',
      '233': '頂級忠誠客戶',
      '332': '忠誠客戶',
      '331': '忠誠客戶',
      '223': '忠誠客戶',
      '323': '忠誠客戶',
      '322': '忠誠客戶',
      '232': '潛在的忠誠客戶',
      '231': '潛在的忠誠客戶',
      '221': '潛在的忠誠客戶',
      '321': '潛在的忠誠客戶',
      '313': '有錢途潛力的客戶',
      '312': '有錢途潛力的客戶',
      '222': '有錢途潛力的客戶',
      '213': '有錢途潛力的客戶',
      '212': '有錢途潛力的客戶',
    };
    return segments[rfmScore] || '一般客戶';
  };

  // 計算 RFM 分數
  const calculateRFMScore = (recency, frequency, monetary) => {
    let R = 1, F = 1, M = 1;
    
    // R (Recency): 0-14天=3分, 15-28天=2分, 29天以上=1分
    if (recency <= 14) R = 3;
    else if (recency <= 28) R = 2;
    
    // F (Frequency): 15次以上=3分, 8-14次=2分, 7次以下=1分
    if (frequency >= 15) F = 3;
    else if (frequency >= 8) F = 2;
    
    // M (Monetary): $6000以上=3分, $3000-5999=2分, $3000以下=1分
    if (monetary >= 6000) M = 3;
    else if (monetary >= 3000) M = 2;
    
    return `${R}${F}${M}`;
  };

  const getBoxSuggestion = (boxType) => {
    const leafyVeggies = inventory.filter(item => {
      const vegInfo = vegetableDatabase[item.name];
      return vegInfo && vegInfo.type === 'leafy' && item.gradeA > 0;
    });
    const fruitVeggies = inventory.filter(item => {
      const vegInfo = vegetableDatabase[item.name];
      return vegInfo && vegInfo.type === 'fruit' && item.gradeA > 0;
    });

    if (boxType === 'large') {
      return {
        leafy: '6-8種葉菜',
        fruit: '2-3種果菜',
        price: '$400-$500',
        available: leafyVeggies.length >= 6 && fruitVeggies.length >= 2
      };
    }

    return {
      leafy: '5-6種葉菜',
      fruit: '1-2種果菜',
      price: '$300-$350',
      available: leafyVeggies.length >= 5 && fruitVeggies.length >= 1
    };
  };

  // 計算品質衰退狀況
  const getQualityStatus = (vegName, daysStored) => {
    const vegInfo = vegetableDatabase[vegName];
    if (!vegInfo) return { status: 'unknown', color: 'gray', percentage: 100 };
    
    const shelfLife = vegInfo.shelfLife;
    const remaining = ((shelfLife - daysStored) / shelfLife) * 100;
    
    if (remaining > 70) return { status: '新鮮', color: 'green', percentage: remaining };
    if (remaining > 40) return { status: '良好', color: 'yellow', percentage: remaining };
    if (remaining > 0) return { status: '需盡速出貨', color: 'orange', percentage: remaining };
    return { status: '品質不佳', color: 'red', percentage: 0 };
  };

  // 計算當季可種植蔬菜
  const getCurrentSeasonVegetables = () => {
    const currentMonth = 11; // 11月
    const inSeason = [];
    const outSeason = [];
    
    Object.entries(vegetableDatabase).forEach(([name, info]) => {
      if (info.season.includes(currentMonth)) {
        inSeason.push({ name, ...info });
      } else {
        outSeason.push({ name, ...info });
      }
    });
    
    return { inSeason, outSeason };
  };

  // 預測未來7天採收需求
  const predictHarvestNeeds = () => {
    const currentMonth = 11;
    const avgDailyOrders = 15; // 假設每日平均訂單數
    const seasonVegs = getCurrentSeasonVegetables().inSeason;
    
    // 葉菜類需求 (每箱平均6種)
    const leafyNeeds = seasonVegs.filter(v => v.type === 'leafy').slice(0, 6);
    // 果菜類需求 (每箱平均2種)
    const fruitNeeds = seasonVegs.filter(v => v.type === 'fruit').slice(0, 2);
    
    return {
      daily: avgDailyOrders,
      leafyVegetables: leafyNeeds.map(v => ({ name: v.name, quantity: avgDailyOrders * 2 })),
      fruitVegetables: fruitNeeds.map(v => ({ name: v.name, quantity: avgDailyOrders * 1.5 })),
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      '訂單成立': 'bg-gray-100 text-gray-800',
      '揀貨中': 'bg-blue-100 text-blue-800',
      '分配完成': 'bg-purple-100 text-purple-800',
      '配送中': 'bg-yellow-100 text-yellow-800',
      '已送達': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      '訂單成立': <Clock className="w-4 h-4" />,
      '揀貨中': <Package className="w-4 h-4" />,
      '分配完成': <CheckCircle className="w-4 h-4" />,
      '配送中': <Truck className="w-4 h-4" />,
      '已送達': <CheckCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  // 渲染儀表板
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">營運儀表板</h1>
        <div className="text-sm text-gray-500">最後更新: 2025-11-25 14:30</div>
      </div>

      {/* 統計卡片 */}
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

      {/* 圖表區 */}
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

      {/* 低庫存警示 */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
          庫存警示
        </h2>
        <div className="space-y-2">
          {inventory.filter(item => item.gradeA < 50).map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-orange-600 font-medium">A級剩餘 {item.gradeA} {item.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染庫存管理
  const renderInventory = () => {
    // 篩選和排序庫存
    let filteredInventory = [...inventory];
    
    // 類型篩選
    if (inventoryFilter.type === 'leafy') {
      filteredInventory = filteredInventory.filter(item => {
        const vegInfo = vegetableDatabase[item.name];
        return vegInfo?.type === 'leafy';
      });
    } else if (inventoryFilter.type === 'fruit') {
      filteredInventory = filteredInventory.filter(item => {
        const vegInfo = vegetableDatabase[item.name];
        return vegInfo?.type === 'fruit';
      });
    }
    
    // 排序
    filteredInventory.sort((a, b) => {
      if (inventoryFilter.sort === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (inventoryFilter.sort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (inventoryFilter.sort === 'quality') {
        const aQuality = getQualityStatus(a.name, a.daysStored).percentage;
        const bQuality = getQualityStatus(b.name, b.daysStored).percentage;
        return aQuality - bQuality; // 品質差的排前面
      } else if (inventoryFilter.sort === 'quantity') {
        return b.gradeA - a.gradeA;
      }
      return 0;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">智慧庫存管理</h1>
          <button
            onClick={() => setShowAddHarvest(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            登錄採收
          </button>
        </div>

        {showAddHarvest && (
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
            <h3 className="text-lg font-semibold mb-4">新增採收記錄</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">選擇蔬菜品項</label>
                <select
                  value={newHarvest.name}
                  onChange={(e) => {
                    const vegName = e.target.value;
                    const vegInfo = vegetableDatabase[vegName];
                    setNewHarvest({
                      ...newHarvest, 
                      name: vegName,
                      unit: vegInfo?.unit || '把'
                    });
                  }}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">-- 請選擇 --</option>
                  <optgroup label="🥬 葉菜類">
                    <option>青江菜</option>
                    <option>小白菜</option>
                    <option>高麗菜</option>
                    <option>菠菜</option>
                    <option>油菜</option>
                    <option>地瓜葉</option>
                    <option>空心菜</option>
                    <option>莧菜</option>
                    <option>芥藍菜</option>
                    <option>茼蒿</option>
                  </optgroup>
                  <optgroup label="🍅 果菜類">
                    <option>番茄</option>
                    <option>茄子</option>
                    <option>青椒</option>
                    <option>小黃瓜</option>
                    <option>絲瓜</option>
                    <option>南瓜</option>
                    <option>長豆</option>
                    <option>花椰菜</option>
                  </optgroup>
                </select>
              </div>
              
              {newHarvest.name && (
                <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{newHarvest.name}</span> 的建議單位: 
                    <span className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 rounded font-medium">
                      {vegetableDatabase[newHarvest.name]?.unit || '把'}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    A級數量 (外觀佳、成熟度佳)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newHarvest.gradeA}
                  onChange={(e) => setNewHarvest({...newHarvest, gradeA: e.target.value})}
                  className="w-full border border-green-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    B級數量 (外觀稍差但可食用)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newHarvest.gradeB}
                  onChange={(e) => setNewHarvest({...newHarvest, gradeB: e.target.value})}
                  className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    C級數量 (需挑除、不可配送)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newHarvest.gradeC}
                  onChange={(e) => setNewHarvest({...newHarvest, gradeC: e.target.value})}
                  className="w-full border border-red-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddHarvest}
                disabled={!newHarvest.name}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                儲存
              </button>
              <button
                onClick={() => {
                  setShowAddHarvest(false);
                  setNewHarvest({ name: '', gradeA: 0, gradeB: 0, gradeC: 0, unit: '把' });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 篩選和排序控制 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">類型篩選:</label>
              <select
                value={inventoryFilter.type}
                onChange={(e) => setInventoryFilter({...inventoryFilter, type: e.target.value})}
                className="border rounded-lg px-3 py-2"
              >
                <option value="all">全部</option>
                <option value="leafy">葉菜類</option>
                <option value="fruit">果菜類</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">排序方式:</label>
              <select
                value={inventoryFilter.sort}
                onChange={(e) => setInventoryFilter({...inventoryFilter, sort: e.target.value})}
                className="border rounded-lg px-3 py-2"
              >
                <option value="date">採收日期</option>
                <option value="name">品項名稱</option>
                <option value="quality">品質狀態</option>
                <option value="quantity">A級數量</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              共 {filteredInventory.length} 項
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">品項</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">類型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">A級</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">B級</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">C級</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">採收日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">庫存天數</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">品質狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const vegInfo = vegetableDatabase[item.name];
                  const qualityStatus = getQualityStatus(item.name, item.daysStored);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          vegInfo?.type === 'leafy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {vegInfo?.type === 'leafy' ? '葉菜' : '果菜'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-semibold">{item.gradeA} {item.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-orange-600">{item.gradeB} {item.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-600">{item.gradeC} {item.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          item.daysStored === 0 ? 'text-green-600' :
                          item.daysStored <= 2 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {item.daysStored} 天
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          qualityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                          qualityStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          qualityStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {qualityStatus.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 品質警示 */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            品質管理警示
          </h2>
          <div className="space-y-2">
            {filteredInventory.filter(item => {
              const status = getQualityStatus(item.name, item.daysStored);
              return status.color === 'orange' || status.color === 'red';
            }).map(item => {
              const status = getQualityStatus(item.name, item.daysStored);
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">已存放 {item.daysStored} 天</span>
                  </div>
                  <span className="text-orange-600 font-medium">{status.status} - 建議優先出貨</span>
                </div>
              );
            })}
            {filteredInventory.filter(item => {
              const status = getQualityStatus(item.name, item.daysStored);
              return status.color === 'orange' || status.color === 'red';
            }).length === 0 && (
              <div className="text-center text-gray-500 py-4">
                ✓ 所有庫存品質良好
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染訂單管理
  const renderOrders = () => {
    const largeSuggestion = getBoxSuggestion('large');
    const smallSuggestion = getBoxSuggestion('small');

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">訂單與配送管理</h1>
          <div className="flex gap-2">
            <select className="border rounded-lg px-4 py-2">
              <option>全部狀態</option>
              <option>訂單成立</option>
              <option>揀貨中</option>
              <option>配送中</option>
            </select>
          </div>
        </div>

        {/* 蔬菜箱方案說明 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-green-800">🥬 大份蔬菜箱</h3>
              <span className="text-xl font-bold text-green-700">{largeSuggestion.price}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• {largeSuggestion.leafy}</p>
              <p>• {largeSuggestion.fruit}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-green-300">
              <span className={`text-xs px-2 py-1 rounded-full ${
                largeSuggestion.available 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-orange-200 text-orange-800'
              }`}>
                {largeSuggestion.available ? '✓ 可配送' : '⚠ 品項不足'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-blue-800">🥗 小份蔬菜箱</h3>
              <span className="text-xl font-bold text-blue-700">{smallSuggestion.price}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• {smallSuggestion.leafy}</p>
              <p>• {smallSuggestion.fruit}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <span className={`text-xs px-2 py-1 rounded-full ${
                smallSuggestion.available 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-orange-200 text-orange-800'
              }`}>
                {smallSuggestion.available ? '✓ 可配送' : '⚠ 品項不足'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{order.customer} · {order.box}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">訂單日期</p>
                  <p className="font-medium">{order.date}</p>
                </div>
              </div>
              
              {order.items.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">配送內容:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">查看詳情</button>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">更新狀態</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染客戶管理
  const renderCustomers = () => {
    // 計算RFM分布
    const segmentCounts = customers.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1;
      return acc;
    }, {});

    const segmentRevenue = customers.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + customer.totalSpent;
      return acc;
    }, {});

    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">客戶關係管理 (CRM)</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋客戶..."
                className="border rounded-lg pl-10 pr-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* RFM 說明卡片 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 RFM 分析說明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-purple-700">R (Recency):</span>
              <span className="text-gray-600 ml-2">最近一次購買距今天數</span>
              <div className="mt-1 text-xs text-gray-500">
                • 3分: 0-14天<br/>
                • 2分: 15-28天<br/>
                • 1分: 29天以上
              </div>
            </div>
            <div>
              <span className="font-semibold text-blue-700">F (Frequency):</span>
              <span className="text-gray-600 ml-2">購買次數</span>
              <div className="mt-1 text-xs text-gray-500">
                • 3分: 15次以上<br/>
                • 2分: 8-14次<br/>
                • 1分: 7次以下
              </div>
            </div>
            <div>
              <span className="font-semibold text-green-700">M (Monetary):</span>
              <span className="text-gray-600 ml-2">累計消費金額</span>
              <div className="mt-1 text-xs text-gray-500">
                • 3分: $6,000以上<br/>
                • 2分: $3,000-$5,999<br/>
                • 1分: $3,000以下
              </div>
            </div>
          </div>
        </div>

        {/* 客戶列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">客戶姓名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">訂單數</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">消費金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最後訂購</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">距今天數</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RFM分數</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">客戶分級</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{customer.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.orders} 次</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{customer.lastOrder}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        customer.recency <= 14 ? 'text-green-600' :
                        customer.recency <= 28 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {customer.recency} 天
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {customer.rfmScore.split('').map((score, idx) => (
                          <span key={idx} className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold ${
                            score === '3' ? 'bg-green-100 text-green-700' :
                            score === '2' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {score}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        customer.segment === '重要忠實客戶' ? 'bg-purple-100 text-purple-800' :
                        customer.segment === '重要價值客戶' ? 'bg-pink-100 text-pink-800' :
                        customer.segment === '忠實客戶' ? 'bg-blue-100 text-blue-800' :
                        customer.segment === '潛在流失客戶' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.segment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RFM 分析儀表板 */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">RFM 客戶分群分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700 font-medium">重要忠實客戶</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{segmentCounts['重要忠實客戶'] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">
                營收貢獻: ${(segmentRevenue['重要忠實客戶'] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 font-medium mt-1">
                ({((segmentRevenue['重要忠實客戶'] || 0) / totalRevenue * 100).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">
                RFM: 333 (高-高-高)
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
              <p className="text-sm text-gray-700 font-medium">重要價值客戶</p>
              <p className="text-2xl font-bold text-pink-600 mt-2">{segmentCounts['重要價值客戶'] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">
                營收貢獻: ${(segmentRevenue['重要價值客戶'] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-pink-600 font-medium mt-1">
                ({((segmentRevenue['重要價值客戶'] || 0) / totalRevenue * 100).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">
                RFM: 32X (高消費)
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-medium">忠實客戶</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{segmentCounts['忠實客戶'] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">
                營收貢獻: ${(segmentRevenue['忠實客戶'] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                ({((segmentRevenue['忠實客戶'] || 0) / totalRevenue * 100).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">
                RFM: X3X (高頻率)
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-700 font-medium">一般客戶</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{segmentCounts['一般客戶'] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">
                營收貢獻: ${(segmentRevenue['一般客戶'] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 font-medium mt-1">
                ({((segmentRevenue['一般客戶'] || 0) / totalRevenue * 100).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">
                RFM: 22X (中等級)
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <p className="text-sm text-gray-700 font-medium">潛在流失客戶</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{segmentCounts['潛在流失客戶'] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">
                營收貢獻: ${(segmentRevenue['潛在流失客戶'] || 0).toLocaleString()}
              </p>
              <p className="text-xs text-red-600 font-medium mt-1">
                ({((segmentRevenue['潛在流失客戶'] || 0) / totalRevenue * 100).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">
                RFM: 111 (低-低-低)
              </div>
            </div>
          </div>
        </div>

        {/* 行銷策略建議 */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">💡 分眾行銷策略建議</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <h3 className="font-semibold text-purple-800 mb-2">重要忠實客戶 (RFM: 333)</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 提供 VIP 專屬優惠與早鳥預購權</li>
                <li>• 邀請參與新品試吃與意見回饋</li>
                <li>• 生日/節慶特別禮品</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">忠實客戶 (高頻率)</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 推薦升級大份蔬菜箱方案</li>
                <li>• 推出「買10送1」集點活動</li>
                <li>• 朋友推薦獎勵計畫</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
              <h3 className="font-semibold text-orange-800 mb-2">一般客戶 (中等級)</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 定期推送農場故事與食譜</li>
                <li>• 季節性促銷活動通知</li>
                <li>• 鼓勵加入定期配送方案</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
              <h3 className="font-semibold text-red-800 mb-2">潛在流失客戶 (低活躍)</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 發送「我們想念您」優惠券</li>
                <li>• 回購專屬折扣 (例:原價85折)</li>
                <li>• 問卷調查瞭解未回購原因</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 側邊欄選單
  const menuItems = [
    { id: 'dashboard', name: '儀表板', icon: Home },
    { id: 'inventory', name: '庫存管理', icon: Database },
    { id: 'orders', name: '訂單管理', icon: ShoppingCart },
    { id: 'customers', name: '客戶管理', icon: Users },
    { id: 'analytics', name: '預測分析', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 側邊欄 */}
      <div className="w-64 bg-gradient-to-b from-green-700 to-green-800 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-green-600">
          <h1 className="text-xl font-bold">小瓢蟲農場</h1>
          <p className="text-sm text-green-200 mt-1">管理系統</p>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                currentPage === item.id
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-green-600">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium">管理員</p>
              <p className="text-xs text-green-200">admin@ladybug.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'inventory' && renderInventory()}
          {currentPage === 'orders' && renderOrders()}
          {currentPage === 'customers' && renderCustomers()}
          {currentPage === 'analytics' && (
            <div className="bg-white rounded-xl p-12 shadow-md text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">產銷預測模組</h2>
              <p className="text-gray-600 mt-2">此功能正在開發中，敬請期待...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LadybugFarmSystem;