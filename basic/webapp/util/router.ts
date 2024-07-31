import type Controller from "sap/ui/core/mvc/Controller";
import type View from "sap/ui/core/mvc/View";
import UIComponent from "sap/ui/core/UIComponent";

export type Routes = {
  detail: {
    id: number;
  };
  products: never;
};

export function getRouter(thisArg: unknown) {
  return UIComponent.getRouterFor(thisArg as View | Controller) as Omit<
    ReturnType<typeof UIComponent.getRouterFor>,
    "navTo"
  > & {
    navTo: <K extends keyof Routes>(route: K, params?: Routes[K]) => void;
  };
}
