export interface BillItem {
  name: string;
  amount: number;
}

export interface SankeyData {
  incomeValue: number;
  savingsValue: number;
  billItems: BillItem[];
}
