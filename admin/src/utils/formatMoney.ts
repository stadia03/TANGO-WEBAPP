const formatMoney = (amount: number | string | null | undefined): string => {
  // Handle null/undefined
  if (amount === null || amount === undefined) {
    return '₹0.00';
  }
  
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN cases
  if (isNaN(numericAmount)) {
    return '₹0.00';
  }
  
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(numericAmount);
  
  return `₹${formattedAmount}`;
};
export default formatMoney;