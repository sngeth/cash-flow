import { BillItem } from '../types';

interface BillItemsProps {
  items: BillItem[];
  onAddItem: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: string | number) => void;
  onDeleteItem: (index: number) => void;
}

export default function BillItems({ 
  items, 
  onAddItem, 
  onUpdateItem,
  onDeleteItem 
}: BillItemsProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4 text-gray-700">Bill Line Items</h4>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => onUpdateItem(index, 'name', e.target.value)}
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              placeholder="Amount"
              value={item.amount === 0 ? '' : item.amount}
              onChange={(e) => onUpdateItem(index, 'amount', parseFloat(e.target.value) || 0)}
              className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button
              onClick={() => onDeleteItem(index)}
              className="p-2 text-gray-500 hover:text-red-500 focus:outline-none text-xl"
              title="Delete item"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAddItem}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add Bill Item
      </button>
    </div>
  );
}
