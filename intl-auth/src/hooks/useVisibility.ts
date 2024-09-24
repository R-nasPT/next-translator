import { useMemo } from "react";

const useVisibility = (pathname: string, paths: string[]) => {
  return useMemo(() => paths.includes(pathname), [pathname, paths]);
};

export default useVisibility;
