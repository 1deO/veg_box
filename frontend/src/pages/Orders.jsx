import React from 'react';

const OrdersPage = ({ orders, getStatusColor, getStatusIcon, getBoxSuggestion }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-green-800">大份蔬菜箱</h3>
            <span className="text-xl font-bold text-green-700">{largeSuggestion.price}</span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• {largeSuggestion.leafy}</p>
            <p>• {largeSuggestion.nonLeafy}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-green-300">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                largeSuggestion.available ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
              }`}
            >
              {largeSuggestion.available ? '✓ 可配送' : `⚠ 品項不足：${largeSuggestion.shortageMessage}`}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-blue-800">小份蔬菜箱</h3>
            <span className="text-xl font-bold text-blue-700">{smallSuggestion.price}</span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• {smallSuggestion.leafy}</p>
            <p>• {smallSuggestion.nonLeafy}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-300">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                smallSuggestion.available ? 'bg-blue-200 text-blue-800' : 'bg-orange-200 text-orange-800'
              }`}
            >
              {smallSuggestion.available ? '✓ 可配送' : `⚠ 品項不足：${smallSuggestion.shortageMessage}`}
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
                <p className="text-gray-600 mt-1">
                  {order.customer} · {order.box}
                </p>
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

export default OrdersPage;

