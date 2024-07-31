sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("project2.controller.View1", {
        onInit: function () {
          const oModel = new sap.ui.model.json.JSONModel(this.aMockData);
          this.getView().setModel(oModel);
        },

        handleNewValue: function(oEvent) {
          const sNewValue = oEvent.getParameter("value");
          const oModel = this.getView().getModel();
          const aData = oModel.getData();
          aData.push({ "CountryId": sNewValue, "Name": sNewValue });
          oModel.setData(aData);
        },

        aMockData: [{
          "CountryId": 1,
				  "Name": "Sweden"
				}, {
				  "CountryId": 2,
				  "Name": "Japan"
				}, {
				  "CountryId": 3,
				  "Name": "Russia"
				}, {
				  "CountryId": 4,
				  "Name": "China"
				}, {
				  "CountryId": 5,
				  "Name": "Brazil"
				}, {
				  "CountryId": 6,
				  "Name": "France"
        }]
    });
});
