import { useEffect, useState } from "react";

const useFetchListWithParams = (endpoint, params) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildUrl = () => {
    if (params.search?.trim()) {
      return `https://dummyjson.com/products/search?q=${encodeURIComponent(
        params.search
      )}`;
    }

    const url = new URL(`https://dummyjson.com/${endpoint}`);
    if (params.limit) url.searchParams.set("limit", params.limit);
    if (params.skip) url.searchParams.set("skip", params.skip);
    return url.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildUrl());
        const json = await res.json();
        let products = json.products || [];

        if (params.sortBy && params.order) {
          products.sort((a, b) => {
            const valA = a[params.sortBy];
            const valB = b[params.sortBy];
            if (typeof valA === "string") {
              return params.order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            } else {
              return params.order === "asc" ? valA - valB : valB - valA;
            }
          });
        }

        if (params.search) {
          const start = params.skip || 0;
          const end = start + (params.limit || 12);
          products = products.slice(start, end);
        }

        setData(products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return [data, loading, error];
};

export default useFetchListWithParams;
