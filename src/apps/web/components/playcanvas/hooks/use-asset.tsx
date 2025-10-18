import { useApp } from "@playcanvas/react/hooks";
import { fetchAsset } from "@playcanvas/react/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useAsset = (
  src: string,
  type: string,
  props: Record<string, unknown>
) => {
  const app = useApp();
  const queryKey = [app.root?.getGuid(), src, type, props];

  // Construct a query for the asset
  return useSuspenseQuery({
    queryKey,
    queryFn: () => app && fetchAsset({app, url:src, type, props}),
  });
};

export const useSplat = (src: string, props = {}) =>
  useAsset(src, "gsplat", props);
