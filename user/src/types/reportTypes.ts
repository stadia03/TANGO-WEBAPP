export interface InputFieldProps {
  label: string;
  name: keyof FormData | string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export interface FormData {
  roomSold: number | undefined;
  totalAdultPax: number | undefined;
  totalChildPax: number | undefined;
  expectedArrival: number | undefined;
  stayOver: number | undefined;
  noShow: number | undefined;
  roomRevenue: number | undefined;
  restaurantSale: number | undefined;
  mealPlanSale: number | undefined;
  barSale: number | undefined;
  mealPlanPax: number | undefined;
  roomsUpgraded: number | undefined;
  roomHalfDay: number | undefined;
  cld: number | undefined;
  cake: number | undefined;
  tableDecoration: number | undefined;
  expense: number | undefined;
  cashDeposit: number | undefined;
  pettyCash: number | undefined;
  upiDeposit: number | undefined;
  cashReceived: number | undefined;
  totalRevenue: number | undefined;
}

