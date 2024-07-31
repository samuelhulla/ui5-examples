"use strict";
sap.ui.define(["sap/ui/core/UIComponent", "./model/models"], function (e, t) {
  "use strict";
  const i = t["createDeviceModel"];
  const n = e.extend("project1.Component", {
    metadata: { manifest: "json" },
    init: function t() {
      e.prototype.init.call(this);
      this.getRouter().initialize();
      this.setModel(i(), "device");
    },
  });
  return n;
});
//# sourceMappingURL=Component.js.map
