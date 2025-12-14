import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const CustomersPage = ({ customers }) => {

  const [customerFilter, setCustomerFilter] = useState({ segment: 'all', sort: 'totalSpent' });

  // RFM 分群標準
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

  // 過濾和排序客戶
  const filteredCustomers = useMemo(() => {
    let filtered = [...customersWithRFM];
    
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
  }, [customersWithRFM, customerFilter]);

  // 統計數據
  const segmentCounts = customersWithRFM.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {});

  const segmentRevenue = customersWithRFM.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + customer.totalSpent;
    return acc;
  }, {});

  const totalRevenue = customersWithRFM.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">客戶關係管理 (CRM)</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="搜尋客戶..." className="border rounded-lg pl-10 pr-4 py-2" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 RFM 分析說明 (三等分法)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-purple-700">R (Recency):</span>
            <span className="text-gray-600 ml-2">最近一次購買距今天數</span>
            <div className="mt-1 text-xs text-gray-500">
              • 3分: 活躍客 (前1/3名,距今最近)
              <br />• 2分: 一般客 (中間1/3)
              <br />• 1分: 沉睡客 (後1/3名,最久未購買)
            </div>
          </div>
          <div>
            <span className="font-semibold text-blue-700">F (Frequency):</span>
            <span className="text-gray-600 ml-2">購買次數</span>
            <div className="mt-1 text-xs text-gray-500">
              • 3分: 常客 (前1/3名,購買最頻繁)
              <br />• 2分: 中等客 (中間1/3)
              <br />• 1分: 稀客 (後1/3名,購買最少)
            </div>
          </div>
          <div>
            <span className="font-semibold text-green-700">M (Monetary):</span>
            <span className="text-gray-600 ml-2">累計消費金額</span>
            <div className="mt-1 text-xs text-gray-500">
              • 3分: 黃金客 (前1/3名,消費最高)
              <br />• 2分: 中消費客 (中間1/3)
              <br />• 1分: 一般客 (後1/3名,消費最低)
            </div>
          </div>
        </div>
      </div>

      {/* 篩選和排序 */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">客群篩選:</label>
            <select
              value={customerFilter.segment}
              onChange={(e) => setCustomerFilter({...customerFilter, segment: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">全部客戶</option>
              <option value="頂級忠誠客戶">頂級忠誠客戶</option>
              <option value="忠誠客戶">忠誠客戶</option>
              <option value="潛在的忠誠客戶">潛在的忠誠客戶</option>
              <option value="有潛力的客戶">有潛力的客戶</option>
              <option value="一般客戶">一般客戶</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">排序方式:</label>
            <select
              value={customerFilter.sort}
              onChange={(e) => setCustomerFilter({...customerFilter, sort: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="totalSpent">消費金額</option>
              <option value="orders">訂單數</option>
              <option value="recency">最近購買</option>
              <option value="name">姓名</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            共 {filteredCustomers.length} 位客戶
          </div>
        </div>
      </div>

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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{customer.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-700">{customer.orders} 次</td>
                  <td className="px-6 py-4 font-semibold text-green-600">${customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{customer.lastOrder}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        customer.rScore === 3 ? 'text-green-600' : 
                        customer.rScore === 2 ? 'text-orange-600' : 
                        'text-red-600'
                      }`}
                    >
                      {customer.recency} 天
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {[customer.rScore, customer.fScore, customer.mScore].map((score, idx) => (
                        <span
                          key={idx}
                          className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold ${
                            score === 3
                              ? 'bg-green-100 text-green-700'
                              : score === 2
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          title={idx === 0 ? 'Recency' : idx === 1 ? 'Frequency' : 'Monetary'}
                        >
                          {score}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        customer.segment === '頂級忠誠客戶'
                          ? 'bg-purple-100 text-purple-800'
                          : customer.segment === '忠誠客戶'
                          ? 'bg-blue-100 text-blue-800'
                          : customer.segment === '潛在的忠誠客戶'
                          ? 'bg-cyan-100 text-cyan-800'
                          : customer.segment === '有潛力的客戶'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {customer.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">RFM 客戶分群分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              key: '頂級忠誠客戶',
              label: '頂級忠誠客戶',
              info: 'RFM: 333/233 (活躍+常客+黃金)',
              wrapper: 'p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200',
              valueClass: 'text-2xl font-bold text-purple-600 mt-2',
              ratioClass: 'text-xs text-purple-600 font-medium mt-1',
            },
            {
              key: '忠誠客戶',
              label: '忠誠客戶',
              info: 'RFM: 332/331/323/322/232/231',
              wrapper: 'p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200',
              valueClass: 'text-2xl font-bold text-blue-600 mt-2',
              ratioClass: 'text-xs text-blue-600 font-medium mt-1',
            },
            {
              key: '潛在的忠誠客戶',
              label: '潛在的忠誠客戶',
              info: 'RFM: 223/221/321',
              wrapper: 'p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200',
              valueClass: 'text-2xl font-bold text-cyan-600 mt-2',
              ratioClass: 'text-xs text-cyan-600 font-medium mt-1',
            },
            {
              key: '有潛力的客戶',
              label: '有潛力的客戶',
              info: 'RFM: 313/312/222/213/212',
              wrapper: 'p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200',
              valueClass: 'text-2xl font-bold text-green-600 mt-2',
              ratioClass: 'text-xs text-green-600 font-medium mt-1',
            },
            {
              key: '一般客戶',
              label: '一般客戶',
              info: 'RFM: 其他組合',
              wrapper: 'p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200',
              valueClass: 'text-2xl font-bold text-gray-600 mt-2',
              ratioClass: 'text-xs text-gray-600 font-medium mt-1',
            },
          ].map((segment) => (
            <div key={segment.key} className={segment.wrapper}>
              <p className="text-sm text-gray-700 font-medium">{segment.label}</p>
              <p className={segment.valueClass}>{segmentCounts[segment.key] || 0} 位</p>
              <p className="text-xs text-gray-600 mt-1">營收貢獻: ${(segmentRevenue[segment.key] || 0).toLocaleString()}</p>
              <p className={segment.ratioClass}>
                ({(((segmentRevenue[segment.key] || 0) / totalRevenue) * 100 || 0).toFixed(1)}%)
              </p>
              <div className="mt-2 text-xs text-gray-600">{segment.info}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">分眾行銷策略建議</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
            <h3 className="font-semibold text-purple-800 mb-2">頂級忠誠客戶 (RFM: 333)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 提供 VIP 專屬優惠與早鳥預購權</li>
              <li>• 邀請參與新品試吃與意見回饋</li>
              <li>• 生日/節慶特別禮品</li>
            </ul>
          </div>

          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">忠誠客戶 (高頻率)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 推薦升級大份蔬菜箱方案</li>
              <li>• 推出「買10送1」集點活動</li>
              <li>• 朋友推薦獎勵計畫</li>
            </ul>
          </div>

          <div className="p-4 border-l-4 border-cyan-500 bg-cyan-50 rounded">
            <h3 className="font-semibold text-cyan-800 mb-2">潛在的忠誠客戶</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 定期推送農場故事與食譜</li>
              <li>• 季節性促銷活動通知</li>
              <li>• 鼓勵加入定期配送方案</li>
            </ul>
          </div>

          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
            <h3 className="font-semibold text-green-800 mb-2">有潛力的客戶 (高消費)</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 提升購買頻率的促銷方案</li>
              <li>• 定期配送優惠吸引回購</li>
              <li>• 個人化推薦提升黏著度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;

