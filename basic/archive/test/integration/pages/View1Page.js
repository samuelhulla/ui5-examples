"use strict";
sap.ui.define(["sap/ui/test/Opa5"], function (e) {
  "use strict";
  const s = "View1";
  class i extends e {
    iShouldSeeThePageView() {
      return this.waitFor({
        id: "page",
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
//# sourceMappingURL=View1Page.js.map
