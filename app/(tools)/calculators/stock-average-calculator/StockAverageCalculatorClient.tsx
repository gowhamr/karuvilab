"use client";

import { useState, useMemo, memo } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { ToolInput } from "@/components/ui/ToolInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { Plus, Trash2 } from "lucide-react";

interface BuyOrder {
  id: string;
  quantity: number;
  price: number;
}

const StockAverageCalculatorClient = memo(function StockAverageCalculatorClient() {
  const [orders, setOrders] = useState<BuyOrder[]>([
    { id: '1', quantity: 10, price: 100 },
    { id: '2', quantity: 5, price: 120 },
  ]);

  const result = useMemo(() => {
    let totalQty = 0;
    let totalCost = 0;
    
    orders.forEach(o => {
      totalQty += o.quantity;
      totalCost += o.quantity * o.price;
    });
    
    const average = totalQty > 0 ? totalCost / totalQty : 0;
    
    return { totalQty, totalCost, average };
  }, [orders]);

  const addOrder = () => {
    setOrders([...orders, { id: Math.random().toString(), quantity: 0, price: 0 }]);
  };

  const removeOrder = (id: string) => {
    if (orders.length > 1) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const updateOrder = (id: string, field: keyof BuyOrder, val: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, [field]: val } : o));
  };

  const summary = `Stock Average Calculator Results\n----------------------\nOrders: ${orders.length}\nTotal Quantity: ${result.totalQty}\nTotal Investment: ₹${result.totalCost.toLocaleString("en-IN")}\nAverage Buy Price: ₹${result.average.toLocaleString("en-IN", { maximumFractionDigits: 2 })}\n\nGenerated via KaruviLab`;

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="hidden md:grid grid-cols-7 gap-4 mb-2">
          <div className="col-span-3 text-xs font-black uppercase tracking-wider text-text-4 px-2">Quantity</div>
          <div className="col-span-3 text-xs font-black uppercase tracking-wider text-text-4 px-2">Price per Share</div>
          <div className="col-span-1"></div>
        </div>

        {orders.map((order, idx) => (
          <div key={order.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-4 items-end bg-bg/20 p-3 rounded-xl border border-border/50">
            <div className="col-span-3">
              <label className="md:hidden text-xs font-black uppercase tracking-wider text-text-4 mb-1 block">Quantity</label>
              <input
                type="number"
                value={order.quantity || ""}
                onChange={(e) => updateOrder(order.id, 'quantity', Number(e.target.value))}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                placeholder="Qty"
              />
            </div>
            <div className="col-span-3">
              <label className="md:hidden text-xs font-black uppercase tracking-wider text-text-4 mb-1 block">Buy Price</label>
              <input
                type="number"
                value={order.price || ""}
                onChange={(e) => updateOrder(order.id, 'price', Number(e.target.value))}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-blue outline-none transition-all text-sm font-bold"
                placeholder="Price"
              />
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => removeOrder(order.id)}
                className="p-2 text-text-4 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addOrder}
          className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl text-text-4 hover:border-blue hover:text-blue transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Add Buy Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Average Buy Price" value={"₹" + result.average.toLocaleString("en-IN", { maximumFractionDigits: 2 })} accent />
        <MetricCard label="Total Quantity" value={result.totalQty.toString()} />
        <MetricCard label="Total Investment" value={"₹" + result.totalCost.toLocaleString("en-IN")} />
      </div>

      <div className="flex justify-end">
        <CopyButton text={summary} label="Copy Summary" />
      </div>
    </div>
  );
});

export default StockAverageCalculatorClient;
