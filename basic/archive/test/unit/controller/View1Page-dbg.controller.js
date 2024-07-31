"use strict";

sap.ui.define(["@/controller/Products.controller"], function (__Controller) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  /*global QUnit*/
  const Controller = _interopRequireDefault(__Controller);
  QUnit.module("View1 Controller");
  QUnit.test("I should test the View1 controller", function (assert) {
    const oAppController = new Controller("View1");
    oAppController.onInit();
    assert.ok(oAppController);
  });
});
//# sourceMappingURL=View1Page-dbg.controller.js.map
