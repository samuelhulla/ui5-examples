"use strict";

sap.ui.define(
  ["sap/ui/core/format/DateFormat", "sap/ui/core/library"],
  function (DateFormat, sap_ui_core_library) {
    "use strict";

    const ValueState = sap_ui_core_library["ValueState"];
    var __exports = {
      dateTime: function (value) {
        return DateFormat.getDateTimeInstance({
          pattern: "y/MM/dd HH:mm",
        }).format(new Date(value));
      },
      rating: function (value) {
        return Array.from(
          {
            length: value,
          },
          (_, i) => i + 1
        )
          .map(() => "★")
          .join("");
      },
      ratingColor: function (value) {
        switch (value) {
          case 1:
            return ValueState.Error;
          case 2:
            return ValueState.Warning;
          case 3:
            return ValueState.Information;
          case 4:
            return ValueState.Success;
          case 5:
            return ValueState.Success;
          default:
            return ValueState.None;
        }
      },
    };
    return __exports;
  }
);
//# sourceMappingURL=formatter-dbg.js.map
