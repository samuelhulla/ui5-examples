"use strict";
sap.ui.define([], function () {
  "use strict";
  function e(e) {
    return new Promise(function (t, i) {
      sap.ui.require(
        [e],
        function (i) {
          if (!(i && i.__esModule)) {
            i =
              i === null || !(typeof i === "object" && e.endsWith("/library")) ? { default: i } : i;
            Object.defineProperty(i, "__esModule", { value: true });
          }
          t(i);
        },
        function (e) {
          i(e);
        }
      );
    });
  }
  QUnit.config.autostart = false;
  void Promise.all([e("integration/NavigationJourney")]).then(() => {
    QUnit.start();
  });
});
//# sourceMappingURL=opaTests.qunit.js.map