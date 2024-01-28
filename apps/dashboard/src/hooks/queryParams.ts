import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
  const [data, setData] = useState<{
    isLoading: boolean;
    params: Record<string, string | undefined>;
  }>({
    isLoading: true,
    params: {},
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setData({
      isLoading: false,
      params: Object.fromEntries(params.entries()),
    });
  }, [location.search]);

  return data;
};
