"use strict";
sap.ui.define(["sap/ui/test/Opa5"], function (e) {
  "use strict";
  const s = "App";
  class i extends e {
    iShouldSeeTheApp() {
      return this.waitFor({
        id: "app",
        viewName: s,
        success: function () {
          e.assert.ok(true, "The " + s + " view is displayed");
        },
        errorMessage: "Did not find the " + s + " view",
      });
    }
  }
  return i;
});
//# sourceMappingURL=AppPage.js.map
