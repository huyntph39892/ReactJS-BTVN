import { useEffect, useState } from "react";

const useDebouce = (value, delay = 1000) => {
  const [deboucedValue, setDebouceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouceValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
  return deboucedValue;
};
export default useDebouce;
