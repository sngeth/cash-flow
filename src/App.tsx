import { useLocalStorage } from './hooks/useLocalStorage';
import SankeyChart from './components/SankeyChart';
import BudgetInputs from './components/BudgetInputs';
import BillItems from './components/BillItems';
import { BillItem } from './types';

interface SankeyData {
  savings: number;
  billItems: BillItem[];
}

const initialData: SankeyData = {
  savings: 1000,
  billItems: [
    { name: 'Phone Bill', amount: 100 },
    { name: '', amount: 0 }
  ]
};

export default function App() {
  const [sankeyData, setSankeyData] = useLocalStorage<SankeyData>('sankeyData', initialData);

  const handleSavingsChange = (newSavings: number) => {
    setSankeyData(prev => ({ ...prev, savings: newSavings }));
  };

  const handleAddBillItem = () => {
    setSankeyData(prev => ({
      ...prev,
      billItems: [...prev.billItems, { name: '', amount: 0 }]
    }));
  };

  const handleUpdateBillItem = (index: number, field: keyof BillItem, value: string | number) => {
    setSankeyData(prev => ({
      ...prev,
      billItems: prev.billItems.map((item, i) => 
        i === index 
          ? { ...item, [field]: field === 'amount' ? Number(value) : value }
          : item
      )
    }));
  };
  
  const handleDeleteBillItem = (index: number) => {
    setSankeyData(prev => ({
      ...prev,
      billItems: prev.billItems.filter((_, i) => i !== index)
    }));
  };
  
  const requiredIncome = sankeyData.savings + sankeyData.billItems.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cash Flow Sankey Diagram
        </h1>
        <div className="space-y-6">
          <BudgetInputs
              income={requiredIncome}
              savings={sankeyData.savings}
              onSavingsChange={handleSavingsChange}
            />
          <BillItems
            items={sankeyData.billItems}
            onAddItem={handleAddBillItem}
            onUpdateItem={handleUpdateBillItem}
            onDeleteItem={handleDeleteBillItem}
          />
        </div>
        <div className="chart-container mt-8">
          <SankeyChart
            income={requiredIncome}
            savings={sankeyData.savings}
            billItems={sankeyData.billItems}
          />
        </div>
      </div>
    </div>
  );
}
