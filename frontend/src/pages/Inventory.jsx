import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';

const InventoryPage = ({
  inventory,
  vegetableDatabase,
  inventoryFilter,
  setInventoryFilter,
  showAddHarvest,
  setShowAddHarvest,
  newHarvest,
  setNewHarvest,
  handleAddHarvest,
  getQualityStatus,
}) => {
  let filteredInventory = [...inventory];

  if (inventoryFilter.type === 'leafy') {
    filteredInventory = filteredInventory.filter((item) => vegetableDatabase[item.name]?.type === 'leafy');
  } else if (inventoryFilter.type === 'nonLeafy') {
    filteredInventory = filteredInventory.filter((item) => vegetableDatabase[item.name]?.type === 'nonLeafy');
  }

  filteredInventory.sort((a, b) => {
    if (inventoryFilter.sort === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    if (inventoryFilter.sort === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (inventoryFilter.sort === 'quality') {
      const aQuality = getQualityStatus(a.name, a.daysStored).percentage;
      const bQuality = getQualityStatus(b.name, b.daysStored).percentage;
      return aQuality - bQuality;
    }
    if (inventoryFilter.sort === 'quantity') {
      return b.gradeA - a.gradeA;
    }
    return 0;
  });

  const riskyInventory = filteredInventory.filter((item) => {
    const status = getQualityStatus(item.name, item.daysStored);
    return status.color === 'orange' || status.color === 'red';
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    unit: vegInfo?.unit || '把',
                  });
                }}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">-- 請選擇 --</option>
                <optgroup label="葉菜類">
                  {Object.entries(vegetableDatabase)
                    .filter(([, info]) => info.type === 'leafy')
                    .map(([name]) => (
                      <option key={name}>{name}</option>
                    ))}
                </optgroup>
                <optgroup label="非葉菜類">
                  {Object.entries(vegetableDatabase)
                    .filter(([, info]) => info.type === 'nonLeafy')
                    .map(([name]) => (
                      <option key={name}>{name}</option>
                    ))}
                </optgroup>
              </select>
            </div>

            {newHarvest.name && (
              <div className="md:col-span-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
                onChange={(e) => setNewHarvest({ ...newHarvest, gradeA: e.target.value })}
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
                onChange={(e) => setNewHarvest({ ...newHarvest, gradeB: e.target.value })}
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
                onChange={(e) => setNewHarvest({ ...newHarvest, gradeC: e.target.value })}
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

      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">類型篩選:</label>
            <select
              value={inventoryFilter.type}
              onChange={(e) => setInventoryFilter({ ...inventoryFilter, type: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">全部</option>
              <option value="leafy">葉菜類</option>
              <option value="nonLeafy">非葉菜類</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">排序方式:</label>
            <select
              value={inventoryFilter.sort}
              onChange={(e) => setInventoryFilter({ ...inventoryFilter, sort: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="date">採收日期</option>
              <option value="name">品項名稱</option>
              <option value="quality">品質狀態</option>
              <option value="quantity">A級數量</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">共 {filteredInventory.length} 項</div>
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          vegInfo?.type === 'leafy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {vegInfo?.type === 'leafy' ? '葉菜' : '非葉菜'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold">
                        {item.gradeA} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-orange-600">
                        {item.gradeB} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-600">
                        {item.gradeC} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          item.daysStored === 0
                            ? 'text-green-600'
                            : item.daysStored <= 2
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {item.daysStored} 天
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          qualityStatus.color === 'green'
                            ? 'bg-green-100 text-green-800'
                            : qualityStatus.color === 'yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : qualityStatus.color === 'orange'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
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

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
          品質管理警示
        </h2>
        <div className="space-y-2">
          {riskyInventory.length === 0 && <div className="text-center text-gray-500 py-4">✓ 所有庫存品質良好</div>}
          {riskyInventory.map((item) => {
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
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

