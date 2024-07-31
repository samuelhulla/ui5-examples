"use strict";

sap.ui.define(
  ["sap/ui/test/opaQunit", "./pages/AppPage", "./pages/View1Page", "sap/ui/test/Opa5"],
  function (opaTest, __AppPage, __ViewPage, Opa5) {
    "use strict";

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
    }
    const AppPage = _interopRequireDefault(__AppPage);
    const ViewPage = _interopRequireDefault(__ViewPage);
    QUnit.module("Navigation Journey");
    const onTheAppPage = new AppPage();
    const onTheViewPage = new ViewPage();
    Opa5.extendConfig({
      viewNamespace: "project1.view.",
      autoWait: true,
    });
    opaTest("Should see the initial page of the app", async function () {
      // Arrangements
      await onTheAppPage.iStartMyUIComponent({
        componentConfig: {
          name: "project1",
        },
      });

      // Assertions
      onTheAppPage.iShouldSeeTheApp();
      onTheViewPage.iShouldSeeThePageView();

      //Cleanup
      await onTheAppPage.iTeardownMyApp();
    });
  }
);
//# sourceMappingURL=NavigationJourney-dbg.js.map
