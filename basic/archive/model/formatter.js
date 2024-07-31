"use strict";
sap.ui.define(["sap/ui/core/format/DateFormat", "sap/ui/core/library"], function (r, e) {
  "use strict";
  const t = e["ValueState"];
  var n = {
    dateTime: function (e) {
      return r.getDateTimeInstance({ pattern: "y/MM/dd HH:mm" }).format(new Date(e));
    },
    rating: function (r) {
      return Array.from({ length: r }, (r, e) => e + 1)
        .map(() => "★")
        .join("");
    },
    ratingColor: function (r) {
      switch (r) {
        case 1:
          return t.Error;
        case 2:
          return t.Warning;
        case 3:
          return t.Information;
        case 4:
          return t.Success;
        case 5:
          return t.Success;
        default:
          return t.None;
      }
    },
  };
  return n;
});
//# sourceMappingURL=formatter.js.map
