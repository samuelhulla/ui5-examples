"use strict";
sap.ui.define(
  [
    "../util/router",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "../model/formatter",
  ],
  function (t, e, n, o, s) {
    "use strict";
    function a(t) {
      return t && t.__esModule && typeof t.default !== "undefined" ? t.default : t;
    }
    const i = t["getRouter"];
    const c = a(s);
    const r = e.extend("project1.controller.Detail", {
      constructor: function t() {
        e.prototype.constructor.apply(this, arguments);
        this.FragmentCache = {};
        this.formatter = c;
      },
      onInit: function t() {
        const e = i(this);
        e.getRoute("detail")?.attachPatternMatched((t) => {
          const { id: e } = t.getParameter("arguments");
          const o = this.getOwnerComponent()?.getModel();
          o.getMetaModel()
            .loaded()
            .then(async () => {
              o.attachRequestCompleted(() => this.getButton("edit").setEnabled(true));
              await this.toggle("Detail");
              this.getView()?.bindElement(`/Products(${e})`, { expand: "Supplier,Category" });
            })
            .catch((t) => {
              n.show(`Failed to load model: ${t.message}`);
            });
        });
      },
      onNavBack: function t() {
        const e = i(this);
        e.navTo("products");
      },
      onEdit: function t() {
        this.toggle("Edit");
      },
      onSave: function t() {
        const e = this.getView()?.getModel();
        e.submitChanges();
        this.toggle("Detail")
          .then(() => {
            n.show("Product succesfully saved!");
          })
          .catch((t) => {
            n.show(`Failed to save product: ${t.message}`);
          });
      },
      onCancel: function t() {
        const e = this.getView()?.getModel();
        e?.resetChanges()
          .then(async () => {
            await this.toggle("Detail");
            n.show("Changes discarded");
          })
          .catch((t) => {
            n.show(`Failed to discard changes: ${t.message}`);
          });
      },
      getFragment: async function t(e) {
        const n = "project1.view.fragments." + e;
        if (this.FragmentCache[e]) {
          return this.FragmentCache[e];
        }
        const s = await o.load({ name: n, controller: this });
        this.FragmentCache = { ...this.FragmentCache, [e]: s };
        return s;
      },
      getButton: function t(e) {
        return this.byId(e);
      },
      toggle: async function t(e) {
        const n = this.byId("detail");
        const o = await this.getFragment(e);
        n.removeAllItems();
        n.addItem(o);
        const s = (t) => {
          const e = (t, e) => {
            this.getButton(t).setVisible(e);
            this.getButton(t).setEnabled(e);
          };
          e("edit", !t);
          e("save", t);
          e("cancel", t);
        };
        s(e === "Edit");
      },
    });
    return r;
  }
);
//# sourceMappingURL=Detail.controller.js.map
