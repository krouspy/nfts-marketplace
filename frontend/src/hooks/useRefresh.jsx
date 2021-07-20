import { useState } from 'react';

export const useRefresh = () => {
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => {
    setRefresh(refresh + 1);
  };

  return [refresh, triggerRefresh];
};

export default useRefresh;
