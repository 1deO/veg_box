import React, { useState, useMemo, useEffect } from 'react';
import { Package, ShoppingCart, Users, Truck, Home, Database, User, BarChart3, CheckCircle, Clock } from 'lucide-react';
import DashboardPage from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import OrdersPage from './pages/Orders';
import CustomersPage from './pages/Customers';

const LadybugFarmSystem = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  // 蔬菜資料庫 - 包含季節性與保存期限資訊
  const vegetableDatabase = {
    // 葉菜類 (Shelf Life: 2 days, except for specific 1-day items)
    '空心菜': { type: 'leafy', season: [5,6,7,8,9,10], shelfLife: 2, growthDays: 30, unit: '把' },
    '皇宮菜': { type: 'leafy', season: [5,6,7,8,9,10], shelfLife: 2, growthDays: 35, unit: '把' },
    '芹菜': { type: 'leafy', season: [10,11,12,1,2,3], shelfLife: 2, growthDays: 90, unit: '把' },
    '油菜': { type: 'leafy', season: [6,7,8,9,10], shelfLife: 2, growthDays: 25, unit: '把' },
    '地瓜葉': { type: 'leafy', season: [6,7,8,9,10], shelfLife: 1, growthDays: 20, unit: '把' }, // Corrected to 1 day
    '體菜': { type: 'leafy', season: [9,10,11,12,1,2], shelfLife: 2, growthDays: 40, unit: '把' },
    '莧菜': { type: 'leafy', season: [5,6,7,8,9,10], shelfLife: 1, growthDays: 25, unit: '把' }, // Corrected to 1 day
    '青江菜': { type: 'leafy', season: [4,5,6,7,8,9,10,11,12,1], shelfLife: 2, growthDays: 35, unit: '把' },
    '白菜': { type: 'leafy', season: [9,10,11,12,1,2,3], shelfLife: 2, growthDays: 45, unit: '顆' },
    '菠菜': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 2, growthDays: 35, unit: '把' },
    '小松菜': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 2, growthDays: 30, unit: '把' },
    '刈菜': { type: 'leafy', season: [11,12,1,2], shelfLife: 2, growthDays: 60, unit: '顆' },
    '芥藍菜': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 2, growthDays: 60, unit: '把' },
    '萵苣': { type: 'leafy', season: [10,11,12,1,2,3], shelfLife: 2, growthDays: 50, unit: '顆' },
    '山茼蒿': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 1, growthDays: 40, unit: '把' }, // Corrected to 1 day
    '茼蒿': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 1, growthDays: 40, unit: '把' }, // Corrected to 1 day
    '蘿蔓': { type: 'leafy', season: [10,11,12,1,2,3], shelfLife: 2, growthDays: 60, unit: '顆' },
    '香菜': { type: 'leafy', season: [9,10,11,12,1,2], shelfLife: 2, growthDays: 45, unit: '把' },
    '蔥': { type: 'leafy', season: [10,11,12,1,2,3], shelfLife: 2, growthDays: 90, unit: '把' },
    '茴香': { type: 'leafy', season: [10,11,12,1,2], shelfLife: 2, growthDays: 70, unit: '把' },
    '韭菜': { type: 'leafy', season: [3,4,5,9,10,11], shelfLife: 2, growthDays: 90, unit: '把' },
    // 非葉菜類
    '黃秋葵': { type: 'nonLeafy', season: [5,6,7,8,9,10], shelfLife: 7, growthDays: 60, unit: '斤' },
    '豌豆': { type: 'nonLeafy', season: [11,12,1,2,3], shelfLife: 1, growthDays: 70, unit: '斤' }, // Corrected to 1 day
    '長豆': { type: 'nonLeafy', season: [5,6,7,8], shelfLife: 7, growthDays: 60, unit: '斤' },
    '四季豆': { type: 'nonLeafy', season: [4,5,6,7,8,9], shelfLife: 4, growthDays: 60, unit: '斤' },
    '花椰菜': { type: 'nonLeafy', season: [9,10,11,12,1], shelfLife: 1, growthDays: 80, unit: '顆' }, // Corrected to 1 day
    '青椒': { type: 'nonLeafy', season: [4,5,6,7,8,9,10,11], shelfLife: 7, growthDays: 75, unit: '斤' },
    '彩椒': { type: 'nonLeafy', season: [4,5,6,7,8,9,10,11], shelfLife: 7, growthDays: 80, unit: '斤' },
    '小黃瓜': { type: 'nonLeafy', season: [4,5,6,7,8,9], shelfLife: 7, growthDays: 50, unit: '條' },
    '茄子': { type: 'nonLeafy', season: [4,5,6,7,8,9,10,11], shelfLife: 7, growthDays: 70, unit: '條' },
    '馬鈴薯': { type: 'nonLeafy', season: [11,12,1,2,3], shelfLife: 90, growthDays: 100, unit: '斤' },
    '胡蘿蔔': { type: 'nonLeafy', season: [10,11,12,1,2], shelfLife: 10, growthDays: 120, unit: '條' }, // Corrected to 10 days
    '玉米': { type: 'nonLeafy', season: [5,6,7,8,9,10], shelfLife: 1, growthDays: 80, unit: '根' }, // Corrected to 1 day
    '絲瓜': { type: 'nonLeafy', season: [5,6,7,8,9,10], shelfLife: 7, growthDays: 50, unit: '條' },
    '南瓜': { type: 'nonLeafy', season: [9,10,11,12,1], shelfLife: 60, growthDays: 90, unit: '顆' },
    '夏南瓜': { type: 'nonLeafy', season: [4,5,6,7,8,9], shelfLife: 7, growthDays: 50, unit: '條' },
    '冬瓜': { type: 'nonLeafy', season: [5,6,7,8,9,10], shelfLife: 60, growthDays: 100, unit: '顆' },
    '白蘿蔔': { type: 'nonLeafy', season: [10,11,12,1,2], shelfLife: 6, growthDays: 70, unit: '條' }, // Corrected to 6 days (白蘿蔔)
    '結頭菜': { type: 'nonLeafy', season: [10,11,12,1,2], shelfLife: 7, growthDays: 60, unit: '顆' },
    '包心菜': { type: 'nonLeafy', season: [11,12,1,2,3], shelfLife: 30, growthDays: 90, unit: '顆' },
    '高麗菜': { type: 'nonLeafy', season: [11,12,1,2,3], shelfLife: 30, growthDays: 90, unit: '顆' },
  };

  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // 讀取庫存採收資料（HarvestRecord）
    fetch("/api/harvest_records")
      .then(res => res.json())
      .then(data => {
        // 轉換格式：React 目前 UI 用的是 name / gradeA / gradeB / date / unit
        const converted = data.map(r => ({
          id: r.HarvestID,
          name: r.Produce.ProduceName,
          gradeA: r.gradeA,
          gradeB: r.gradeB,
          gradeC: r.gradeC,
          unit: r.Produce.unit,
          date: r.HarvestDate,
          daysStored: r.daysStored
        }));
        setInventory(converted);
      });
  
    // 讀取訂單
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        const converted = data.map(o => ({
          id: "ORD" + o.OrderID.toString().padStart(3, "0"),
          customer: o.Customer.CustomerName,
          box: `${o.TotalAmount}份蔬菜箱 $${o.TotalPrice}`,
          status: o.DeliveryStatus?.Status || "未知",
          date: o.OrderDate,
          items: o.OrderItems.map(i => `${i.Produce.ProduceName} x${i.Quantity}`)
        }));
        setOrders(converted);
      });
  
    // 讀取客戶
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => {
        const converted = data.map(c => ({
          id: c.CustomerID,
          name: c.CustomerName,
          email: c.CustomerName + "@email.com",
          orders: c.PurchaseCount,
          totalSpent: c.TotalSpent,
          lastOrder: c.LastPurchaseDate || "",
          recency: 0,        
          frequency: c.PurchaseCount,
          monetary: c.TotalSpent,
          rfmScore: "222",    // 暫時給預設
          segment: "一般客戶"
        }));
        setCustomers(converted);
      });

  }, []);

  const [showAddHarvest, setShowAddHarvest] = useState(false);
  const [newHarvest, setNewHarvest] = useState({ name: '', gradeA: 0, gradeB: 0, gradeC: 0, unit: '把' });
  const [inventoryFilter, setInventoryFilter] = useState({ type: 'all', sort: 'date' });
  const [customerFilter, setCustomerFilter] = useState({ segment: 'all', sort: 'totalSpent' });

  // 過濾客戶
  const getFilteredCustomers = () => {
    let filtered = [...customers];
    
    // 分群篩選
    if (customerFilter.segment !== 'all') {
      filtered = filtered.filter(c => c.segment === customerFilter.segment);
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (customerFilter.sort) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.orders - a.orders;
        case 'recency':
          return a.recency - b.recency;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

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
      '323': '忠誠客戶',
      '322': '忠誠客戶',
      '232': '忠誠客戶',
      '231': '忠誠客戶',
      '223': '潛在的忠誠客戶',
      '221': '潛在的忠誠客戶',
      '321': '潛在的忠誠客戶',
      '313': '有潛力的客戶',
      '312': '有潛力的客戶',
      '222': '有潛力的客戶',
      '213': '有潛力的客戶',
      '212': '有潛力的客戶',
    };
    return segments[rfmScore] || '一般客戶';
  };
 // 計算 RFM 分數 (三等分法)
 const customersWithRFM = useMemo(() => {
  const totalCount = customers.length;
  const groupSize = Math.ceil(totalCount / 3);

  // R: Recency 越小越好,所以遞增排序
  const sortedByRecency = [...customers].sort((a, b) => a.recency - b.recency);
  // F: Frequency 越大越好,所以遞減排序
  const sortedByFrequency = [...customers].sort((a, b) => b.frequency - a.frequency);
  // M: Monetary 越大越好,所以遞減排序
  const sortedByMonetary = [...customers].sort((a, b) => b.monetary - a.monetary);

  // 分配分數
  const rScores = {};
  const fScores = {};
  const mScores = {};

  sortedByRecency.forEach((customer, index) => {
    if (index < groupSize) rScores[customer.id] = 3; // 前1/3得3分
    else if (index < groupSize * 2) rScores[customer.id] = 2; // 中1/3得2分
    else rScores[customer.id] = 1; // 後1/3得1分
  });

  sortedByFrequency.forEach((customer, index) => {
    if (index < groupSize) fScores[customer.id] = 3;
    else if (index < groupSize * 2) fScores[customer.id] = 2;
    else fScores[customer.id] = 1;
  });

  sortedByMonetary.forEach((customer, index) => {
    if (index < groupSize) mScores[customer.id] = 3;
    else if (index < groupSize * 2) mScores[customer.id] = 2;
    else mScores[customer.id] = 1;
  });

  // 為每位客戶計算 RFM 分數和分群
  return customers.map(customer => {
    const R = rScores[customer.id];
    const F = fScores[customer.id];
    const M = mScores[customer.id];
    const rfmScore = `${R}${F}${M}`;
    const segment = getRFMSegment(rfmScore);

    return {
      ...customer,
      rfmScore,
      segment,
      rScore: R,
      fScore: F,
      mScore: M,
    };
  });
}, [customers]);

  const getBoxSuggestion = (boxType) => {
    const leafyVeggies = inventory.filter(item => {
      const vegInfo = vegetableDatabase[item.name];
      return vegInfo && vegInfo.type === 'leafy' && item.gradeA > 0;
    });
    const nonLeafyVeggies = inventory.filter(item => {
      const vegInfo = vegetableDatabase[item.name];
      return vegInfo && vegInfo.type === 'nonLeafy' && item.gradeA > 0;
    });
  
    if (boxType === 'large') {
      const leafyShortage = Math.max(0, 6 - leafyVeggies.length);
      const nonLeafyShortage = Math.max(0, 2 - nonLeafyVeggies.length);
      
      return {
        leafy: '6-8種葉菜類',
        nonLeafy: '2-3種非葉菜類',
        price: '$400-$500',
        available: leafyVeggies.length >= 6 && nonLeafyVeggies.length >= 2,
        leafyShortage,
        nonLeafyShortage,
        shortageMessage: leafyShortage > 0 || nonLeafyShortage > 0 
          ? `還缺${leafyShortage > 0 ? `${leafyShortage}種葉菜類` : ''}${leafyShortage > 0 && nonLeafyShortage > 0 ? '、' : ''}${nonLeafyShortage > 0 ? `${nonLeafyShortage}種非葉菜類` : ''}`
          : ''
      };
    }
  
    const leafyShortage = Math.max(0, 5 - leafyVeggies.length);
    const nonLeafyShortage = Math.max(0, 1 - nonLeafyVeggies.length);
    
    return {
      leafy: '5-6種葉菜類',
      nonLeafy: '1-2種非葉菜類',
      price: '$300-$350',
      available: leafyVeggies.length >= 5 && nonLeafyVeggies.length >= 1,
      leafyShortage,
      nonLeafyShortage,
      shortageMessage: leafyShortage > 0 || nonLeafyShortage > 0 
        ? `還缺${leafyShortage > 0 ? `${leafyShortage}種葉菜類` : ''}${leafyShortage > 0 && nonLeafyShortage > 0 ? '、' : ''}${nonLeafyShortage > 0 ? `${nonLeafyShortage}種非葉菜類` : ''}`
        : ''
    };
  };

  // 計算品質衰退狀況
  const getQualityStatus = (vegName, daysStored) => {
    const vegInfo = vegetableDatabase[vegName];
    if (!vegInfo) return { status: 'unknown', color: 'gray', percentage: 100 };
    
    const shelfLife = vegInfo.shelfLife;
    const remaining = ((shelfLife - daysStored) / shelfLife) * 100;
    
    if (remaining > 80) return { status: '新鮮', color: 'green', percentage: remaining };
    if (remaining > 60) return { status: '良好', color: 'yellow', percentage: remaining };
    if (remaining > 30) return { status: '需盡速出貨', color: 'orange', percentage: remaining };
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
    // 非葉菜類需求 (每箱平均2種)
    const nonLeafyNeeds = seasonVegs.filter(v => v.type === 'nonLeafy').slice(0, 2);
    
    return {
      daily: avgDailyOrders,
      leafyVegetables: leafyNeeds.map(v => ({ name: v.name, quantity: avgDailyOrders * 2 })),
      nonLeafyVegetables: nonLeafyNeeds.map(v => ({ name: v.name, quantity: avgDailyOrders * 1.5 })),
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
          {currentPage === 'dashboard' && (
            <DashboardPage
              inventory={inventory}
              totalInventoryA={totalInventoryA}
              totalOrders={totalOrders}
              activeCustomers={activeCustomers}
              monthlyRevenue={monthlyRevenue}
              inventoryTrend={inventoryTrend}
              qualityData={qualityData}
            />
          )}
          {currentPage === 'inventory' && (
            <InventoryPage
              inventory={inventory}
              vegetableDatabase={vegetableDatabase}
              inventoryFilter={inventoryFilter}
              setInventoryFilter={setInventoryFilter}
              showAddHarvest={showAddHarvest}
              setShowAddHarvest={setShowAddHarvest}
              newHarvest={newHarvest}
              setNewHarvest={setNewHarvest}
              handleAddHarvest={handleAddHarvest}
              getQualityStatus={getQualityStatus}
            />
          )}
          {currentPage === 'orders' && (
            <OrdersPage
              orders={orders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getBoxSuggestion={getBoxSuggestion}
            />
          )}
          {currentPage === 'customers' && <CustomersPage customers={customers} />}
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