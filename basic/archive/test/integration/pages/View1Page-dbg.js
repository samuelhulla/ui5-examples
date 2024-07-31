"use strict";

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  const sViewName = "View1";
  class View1Page extends Opa5 {
    // Actions

    // Assertions
    iShouldSeeThePageView() {
      return this.waitFor({
        id: "page",
        viewName: sViewName,
        success: function () {
          Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
        },
        errorMessage: "Did not find the " + sViewName + " view",
      });
    }
  }
  return View1Page;
});
//# sourceMappingURL=View1Page-dbg.js.map
