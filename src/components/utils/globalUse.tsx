export const formatDate = (timestamp: string): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const month = date.toLocaleString("en-US", { month: "short" }); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
