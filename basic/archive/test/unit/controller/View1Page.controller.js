"use strict";
sap.ui.define(["@/controller/Products.controller"], function (t) {
  "use strict";
  function e(t) {
    return t && t.__esModule && typeof t.default !== "undefined" ? t.default : t;
  }
  const n = e(t);
  QUnit.module("View1 Controller");
  QUnit.test("I should test the View1 controller", function (t) {
    const e = new n("View1");
    e.onInit();
    t.ok(e);
  });
});
//# sourceMappingURL=View1Page.controller.js.map
