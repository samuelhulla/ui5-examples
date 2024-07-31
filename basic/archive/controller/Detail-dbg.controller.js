"use strict";

sap.ui.define(
  [
    "../util/router",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "../model/formatter",
  ],
  function (___util_router, Controller, MessageToast, Fragment, __formatter) {
    "use strict";

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
    }
    const getRouter = ___util_router["getRouter"];
    const formatter = _interopRequireDefault(__formatter);
    /**
     * @namespace project1.controller
     */
    const Detail = Controller.extend("project1.controller.Detail", {
      constructor: function constructor() {
        Controller.prototype.constructor.apply(this, arguments);
        this.FragmentCache = {};
        this.formatter = formatter;
      },
      /*eslint-disable @typescript-eslint/no-empty-function*/ onInit: function _onInit() {
        const router = getRouter(this);
        router.getRoute("detail")?.attachPatternMatched((oEvent) => {
          const { id } = oEvent.getParameter("arguments");
          const model = this.getOwnerComponent()?.getModel();
          model
            .getMetaModel()
            .loaded()
            .then(async () => {
              model.attachRequestCompleted(() => this.getButton("edit").setEnabled(true));
              await this.toggle("Detail");
              this.getView()?.bindElement(`/Products(${id})`, {
                expand: "Supplier,Category",
              });
            })
            .catch((error) => {
              MessageToast.show(`Failed to load model: ${error.message}`);
            });
        });
      },
      onNavBack: function _onNavBack() {
        const router = getRouter(this);
        router.navTo("products");
      },
      onEdit: function _onEdit() {
        // ui5 cant pass async functions to event handlers, so we just pass this abstraction
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.toggle("Edit");
      },
      onSave: function _onSave() {
        const model = this.getView()?.getModel();
        model.submitChanges();
        this.toggle("Detail")
          .then(() => {
            MessageToast.show("Product succesfully saved!");
          })
          .catch((error) => {
            MessageToast.show(`Failed to save product: ${error.message}`);
          });
      },
      onCancel: function _onCancel() {
        const model = this.getView()?.getModel();
        model
          ?.resetChanges()
          .then(async () => {
            await this.toggle("Detail");
            MessageToast.show("Changes discarded");
          })
          .catch((error) => {
            MessageToast.show(`Failed to discard changes: ${error.message}`);
          });
      },
      getFragment: async function _getFragment(fragment) {
        const name = "project1.view.fragments." + fragment;
        if (this.FragmentCache[fragment]) {
          return this.FragmentCache[fragment];
        }
        const oFragment = await Fragment.load({
          name,
          controller: this,
        });
        this.FragmentCache = {
          ...this.FragmentCache,
          [fragment]: oFragment,
        };
        return oFragment;
      },
      getButton: function _getButton(id) {
        return this.byId(id);
      },
      toggle: async function _toggle(mode) {
        const oForm = this.byId("detail");
        const oFragment = await this.getFragment(mode);
        oForm.removeAllItems();
        oForm.addItem(oFragment);
        const toggleButtons = (isEditMode) => {
          const toggleButton = (id, flag) => {
            this.getButton(id).setVisible(flag);
            this.getButton(id).setEnabled(flag);
          };
          toggleButton("edit", !isEditMode);
          toggleButton("save", isEditMode);
          toggleButton("cancel", isEditMode);
        };
        toggleButtons(mode === "Edit");
      },
    });
    return Detail;
  }
);
//# sourceMappingURL=Detail-dbg.controller.js.map
