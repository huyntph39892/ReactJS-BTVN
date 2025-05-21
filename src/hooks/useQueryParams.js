import { useState } from "react";

const initialParams = {
  search: "",
  sortBy: "price",
  order: "asc",
  limit: 12,
  page: 1,
};

const useQueryParams = (query) => {
  const [params, setParams] = useState(query);
  const resetParams = () => {
    setParams(initialParams);
  };
  const updateParams = (query) => {
    setParams((prev) => ({
      ...prev,
      ...query,
    }));
  };
  return [params, updateParams, resetParams];
};

export default useQueryParams;
