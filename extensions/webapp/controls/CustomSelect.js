// File: /webapp/control/CustomSelect.js

sap.ui.define([
  "sap/m/Select",
  "sap/m/SelectRenderer"
], function(Select, SelectRenderer) {
  "use strict";
  
  const CustomSelect = Select.extend("project2.controls.CustomSelect", {
    metadata: {
      properties: {
        "addValueEnabled": {
          type: "boolean",
          defaultValue: true
        }
      },
      events: {
        "newValueCreated": {}
      }
    },
  
    ADD_OPTION_KEY: "__addNewValue",
    ADD_OPTION_TEXT: "Add...",
  
    init: function() {
      this._isLoading = true;
      Select.prototype.init.apply(this, arguments);
    },
    
    onBeforeRendering: function() {
      if (this.getAddValueEnabled() && this._isLoading) {
        if (!this.getItemByKey(this.ADD_OPTION_KEY)) {
          const oItem = new sap.ui.core.Item({
            key: this.ADD_OPTION_KEY,
            text: this.ADD_OPTION_TEXT
          });
          this.insertItem(oItem, 0);
        }
  
        if (this._isLoading && this.getItems().length > 1) {
          this.setSelectedItem(this.getItems()[1]);
          this._isLoading = false;
        }
      }
      Select.prototype.onBeforeRendering.apply(this, arguments);
    },
  
    onSelectionChange: function(oEvent) {
      const oItem = oEvent.getParameter("selectedItem");
  
      if (this.getAddValueEnabled() && oItem.getKey() === this.ADD_OPTION_KEY) {
        this._createNewOption();
      }
  
      Select.prototype.onSelectionChange.apply(this, arguments);
    },
  
    _createNewOption: function() {
      const that = this;
      const oDialog = new sap.m.Dialog({
        title: "Add value",
        content: new sap.m.Input({
          id: "idNewValueInput"
        }),
        beginButton: new sap.m.Button({
          text: "Add",
          press: function() {
            that._handleNewOption();
            oDialog.close(); 
          }
        }),
        afterClose: function() {
          oDialog.destroy();
        }
      });
      oDialog.open();
    },
  
    _handleNewOption: function() {
      const oInput = sap.ui.getCore().byId("idNewValueInput");
      const sNewValue = oInput.getValue();
  
      const oItem = new sap.ui.core.Item({
        key: sNewValue,
        text: sNewValue
      });
  
      this.addItem(oItem);
      this.setSelectedItem(oItem);
  
      this.fireNewValueCreated({
        value: sNewValue
      });
    },
  
    destroy: function() {
      this._isLoading = true;
      Select.prototype.destroy.apply(this, arguments);
    },

    onAfterRendering: function() {
      Select.prototype.onAfterRendering.apply(this, arguments);
    },

    renderer: SelectRenderer
  });

  return CustomSelect;
});