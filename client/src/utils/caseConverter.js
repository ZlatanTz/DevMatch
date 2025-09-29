export const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      return [camelKey, val];
    }),
  );
};

export const camelToSnake = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      return [snakeKey, val];
    }),
  );
};
