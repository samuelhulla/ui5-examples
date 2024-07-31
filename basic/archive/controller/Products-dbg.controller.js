"use strict";

sap.ui.define(
  [
    "../util/router",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/m/MessageItem",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/IconPool",
    "sap/ui/core/message/MessageType",
    "sap/m/MessageToast",
    "../model/formatter",
  ],
  function (
    ___util_router,
    Button,
    Dialog,
    sap_m_library,
    Controller,
    sap_ui_core_library,
    MessageItem,
    JSONModel,
    IconPool,
    MessageType,
    MessageToast,
    __formatter
  ) {
    "use strict";

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
    }
    const getRouter = ___util_router["getRouter"];
    const ButtonType = sap_m_library["ButtonType"];
    const ValueState = sap_ui_core_library["ValueState"];
    const formatter = _interopRequireDefault(__formatter);
    /**
     * @namespace project1.controller
     */
    const Products = Controller.extend("project1.controller.Products", {
      constructor: function constructor() {
        Controller.prototype.constructor.apply(this, arguments);
        this.AddItemDialog = null;
        this.MessageView = null;
        this.Popover = null;
        this.BackButton = null;
        this.formatter = formatter;
      },
      onInit: function _onInit() {
        /* ------------------------------- 1. Popover ------------------------------- */
        this.loadFragment({
          name: "project1.view.fragments.Errors",
        })
          .then((oFragment) => {
            this.Popover = oFragment;
            this.MessageView = this.byId("errorMessageView");
            this.MessageView.bindAggregation("items", {
              path: "messageModel>/",
              template: new MessageItem({
                title: "{messageModel>title}",
                counter: "{messageModel>counter}",
                type: "{messageModel>type}",
                subtitle: "{messageModel>subtitle}",
                description: "{messageModel>description}",
              }),
            });
            this.BackButton = this.byId("errorBackButton");
            this.BackButton.setIcon(IconPool.getIconURI("nav-back"));
          })
          .catch((error) => {
            MessageToast.show(`Failed to load form validation with error: ${error}`);
          });
      },
      /**
       * handles item click and redirects to detail page
       * @public
       * @param {sap.ui.base.Event} oEvent Standard UI5 event object
       */
      onItemSelect: function _onItemSelect(oEvent) {
        const source = oEvent.getSource();
        const ctx = source.getBindingContext();
        const data = ctx?.getObject();
        const router = getRouter(this);
        router.navTo("detail", {
          id: data.ID,
        });
      },
      /**
       * Utility function to validate input fields
       * used both in liveChange of input fields and on submit
       * @private
       * @param {Input} input Input field source
       * @returns {boolean} wether the input is valid. `true` if valid
       */
      validate: function _validate(input) {
        const key = input.getProperty("name");
        let error = "";
        switch (key) {
          case "Name": {
            const value = input.getValue();
            if (value.length === 0) {
              input.setValueState(ValueState.Error);
              error = "Name is required";
              input.setValueStateText(error);
            } else if (value.length > 40) {
              input.setValueState(ValueState.Error);
              error = "Name must be less than 40 characters";
              input.setValueStateText(error);
            } else {
              input.setValueState(ValueState.Success);
              input.setValueStateText("");
            }
            break;
          }
          case "Price": {
            const value = parseFloat(input.getValue());
            if (isNaN(value)) {
              input.setValueState(ValueState.Error);
              error = "Price must be a number";
              input.setValueStateText(error);
            } else if (value < 0) {
              input.setValueState(ValueState.Error);
              error = "Price must be a positive number";
              input.setValueStateText(error);
            } else {
              input.setValueState(ValueState.Success);
              input.setValueStateText("");
            }
            break;
          }
          case "Rating": {
            const value = parseFloat(input.getValue());
            if (isNaN(value)) {
              input.setValueState(ValueState.Error);
              error = "Rating must be a number";
              input.setValueStateText(error);
            } else if (value % 1 !== 0) {
              input.setValueState(ValueState.Error);
              error = "Rating must be a whole number";
              input.setValueStateText(error);
            } else if (value < 0 || value > 5) {
              input.setValueState(ValueState.Error);
              error = "Rating must be between 0 and 5";
              input.setValueStateText(error);
            } else {
              input.setValueState(ValueState.Success);
              input.setValueStateText("");
            }
            break;
          }
        }
        return error;
      },
      /**
       * Transforms the input fields into a form object
       * @param {Control[]} items Indivual inputs
       * @returns {Form} Form object with values and errors
       */
      getValues: function _getValues(items) {
        return items.reduce(
          (acc, item) => {
            const input = item;
            const key = input.getProperty("name");
            const error = this.validate(input);
            const value = input.getValue(); // OData always accepts strings

            if (error) {
              acc.errors[key] = error;
              acc.hasErrors = true;
            } else {
              acc.values[key] = value;
            }
            return acc;
          },
          {
            errors: {},
            values: {},
            hasErrors: false,
          }
        );
      },
      submit: function _submit(oEvent, content) {
        const items = content
          .getControlsByFieldGroupId("newProduct")
          // filter out popup elements related to input
          .filter((item) => !item.getId().includes("popup"));
        const form = this.getValues(items);
        if (form.hasErrors) {
          const jModel = new JSONModel();
          const correctItems = {
            type: MessageType.Success,
            title: "Correctly filled inputs",
            subtitle: "No further action necessary",
            description: Object.entries(form.values)
              .map((_ref) => {
                let [key, value] = _ref;
                return `• ${key}: ${value}`;
              })
              .join("\n"),
            counter: Object.keys(form.values).length,
          };
          const incorrectItems = {
            type: MessageType.Error,
            title: "Incorrect fields",
            subtitle: "Please correct the following errors",
            description: Object.entries(form.errors)
              .map((_ref2) => {
                let [key, value] = _ref2;
                return `• ${key}: ${value}`;
              })
              .join("\n"),
            counter: Object.keys(form.errors).length,
          };
          // Add items to the view, remove items with 0 children
          jModel.setData(
            [correctItems, incorrectItems].filter((_ref3) => {
              let { counter } = _ref3;
              return counter;
            })
          );
          this.MessageView?.navigateBack();
          this.MessageView?.setModel(jModel, "messageModel");
          this.Popover?.openBy(oEvent.getSource());
        } else {
          // succesful form validation - let's submit the row!
          const oModel = this.getView()?.getModel();
          const payload = form.values;
          oModel.createEntry("/Products", {
            properties: {
              ...payload,
              // necessary otherwise the request fails
              ID: Math.floor(Math.random() * 1001).toString(),
            },
          });
          this.AddItemDialog?.close();
          oModel.submitChanges({
            success: () => {
              MessageToast.show("Product successfully created!");
              this.AddItemDialog?.close();
            },
            error: () => {
              MessageToast.show("Failed to create product! Please try again");
              this.AddItemDialog?.close();
            },
          });
        }
      },
      /**
       * opens a dialog to add a new product
       * @public
       */
      onDialogPress: function _onDialogPress() {
        if (!this.AddItemDialog) {
          const close = () => this.AddItemDialog?.close();
          close.bind(this);
          this.loadFragment({
            name: "project1.view.fragments.NewProduct",
          })
            .then((oFragment) => {
              const content = oFragment;
              content.addStyleClass("sapUiContentPadding");
              this.AddItemDialog = new Dialog({
                title: "New Product",
                content,
                beginButton: new Button({
                  type: ButtonType.Emphasized,
                  text: "OK",
                  press: (oEvent) => this.submit(oEvent, content),
                }),
                endButton: new Button({
                  text: "Close",
                  press: close,
                }),
              });
              this.getView()?.addDependent(this.AddItemDialog);
              this.AddItemDialog.open();
            })
            .catch(() => {
              MessageToast.show("Failed to load new product form");
            });
        }
        this.AddItemDialog?.open();
      },
      onChange: function _onChange(oEvent) {
        const input = oEvent.getSource();
        this.validate(input);
      },
      onErrorBack: function _onErrorBack() {
        this.MessageView?.navigateBack();
        this.BackButton?.setVisible(false);
      },
      closePopover: function _closePopover() {
        this.Popover?.close();
      },
      onErrorItemClick: function _onErrorItemClick() {
        this.BackButton?.setVisible(true);
      },
    });
    return Products;
  }
);
//# sourceMappingURL=Products-dbg.controller.js.map
