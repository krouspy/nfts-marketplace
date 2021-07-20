import { useState } from 'react';

export const useLoader = () => {
  const [loading, setLoading] = useState(false);

  const openLoading = () => {
    setLoading(true);
  };

  const closeLoading = () => {
    setLoading(false);
  };

  return {
    loading,
    openLoading,
    closeLoading,
  };
};

export default useLoader;
