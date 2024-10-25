interface BudgetInputsProps {
  income: number;
  savings: number;
  onSavingsChange: (value: number) => void;
}

export default function BudgetInputs({
  income,
  savings,
  onSavingsChange
}: BudgetInputsProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Budget Values</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Required Income:</span>
          <input
            type="number"
            value={income === 0 ? '' : income}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Savings:</span>
          <input
            type="number"
            value={savings === 0 ? '' : savings}
            onChange={(e) => {
              const value = e.target.value;
              const numberValue = value === '' ? 0 : Number(value.replace(/^0+/, ''));
              onSavingsChange(numberValue);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div>
    </div>
  );
}
