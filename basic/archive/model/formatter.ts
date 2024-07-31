import DateFormat from "sap/ui/core/format/DateFormat";
import { ValueState } from "sap/ui/core/library";
import Controller from "sap/ui/core/mvc/Controller";

export default {
  dateTime: function (this: Controller, value: string) {
    return DateFormat.getDateTimeInstance({ pattern: "y/MM/dd HH:mm" }).format(new Date(value));
  },
  rating: function (this: Controller, value: number) {
    return Array.from({ length: value }, (_, i) => i + 1)
      .map(() => "★")
      .join("");
  },
  ratingColor: function (this: Controller, value: number) {
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
