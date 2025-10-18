import { useApp } from "@playcanvas/react/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as pc from "playcanvas";

export const useAsset = (
  src: string,
  type: string,
  props: Record<string, unknown>
) => {
  const app = useApp();
  const queryKey = [app.root?.getGuid(), src, type, props];

  // Construct a query for the asset
  const query = useSuspenseQuery({
    queryKey,
    queryFn: () => {
      if (!app) return null;

      return new Promise<pc.Asset>((resolve) => {
        const assets = {
          splat: new pc.Asset("splat", "gsplat", { url: src }),
        };

        const assetListLoader = new pc.AssetListLoader(
          Object.values(assets),
          app.assets
        );

        // 这里应该返回asset，而不是entity
        assetListLoader.load(() => {
          resolve(assets.splat)
        });
      });
    }
  });

  return query;
};

export const useSplatAsset = (src: string, props = {}) =>
  useAsset(src, "gsplat", props);
