export const formatDate = (timestamp: string): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
  const month = date.toLocaleString("en-US", { month: "short" }); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formattedDay = (timestamp: string): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return String(date.getDate()).padStart(2, "0");
};
export const formattedMonth = (timestamp: string): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", { month: "short" });
};
export const formattedYear = (timestamp: string): number => {
  if (!timestamp) return 0;
  const date = new Date(timestamp);
  return date.getFullYear();
};
