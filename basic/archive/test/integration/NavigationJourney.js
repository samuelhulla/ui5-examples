"use strict";
sap.ui.define(
  ["sap/ui/test/opaQunit", "./pages/AppPage", "./pages/View1Page", "sap/ui/test/Opa5"],
  function (e, t, n, i) {
    "use strict";
    function a(e) {
      return e && e.__esModule && typeof e.default !== "undefined" ? e.default : e;
    }
    const o = a(t);
    const p = a(n);
    QUnit.module("Navigation Journey");
    const u = new o();
    const s = new p();
    i.extendConfig({ viewNamespace: "project1.view.", autoWait: true });
    e("Should see the initial page of the app", async function () {
      await u.iStartMyUIComponent({ componentConfig: { name: "project1" } });
      u.iShouldSeeTheApp();
      s.iShouldSeeThePageView();
      await u.iTeardownMyApp();
    });
  }
);
//# sourceMappingURL=NavigationJourney.js.map
