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
  function (e, t, s, o, a, r, i, n, l, c, u, d) {
    "use strict";
    function g(e) {
      return e && e.__esModule && typeof e.default !== "undefined" ? e.default : e;
    }
    const h = e["getRouter"];
    const m = o["ButtonType"];
    const p = r["ValueState"];
    const f = g(d);
    const V = a.extend("project1.controller.Products", {
      constructor: function e() {
        a.prototype.constructor.apply(this, arguments);
        this.AddItemDialog = null;
        this.MessageView = null;
        this.Popover = null;
        this.BackButton = null;
        this.formatter = f;
      },
      onInit: function e() {
        this.loadFragment({ name: "project1.view.fragments.Errors" })
          .then((e) => {
            this.Popover = e;
            this.MessageView = this.byId("errorMessageView");
            this.MessageView.bindAggregation("items", {
              path: "messageModel>/",
              template: new i({
                title: "{messageModel>title}",
                counter: "{messageModel>counter}",
                type: "{messageModel>type}",
                subtitle: "{messageModel>subtitle}",
                description: "{messageModel>description}",
              }),
            });
            this.BackButton = this.byId("errorBackButton");
            this.BackButton.setIcon(l.getIconURI("nav-back"));
          })
          .catch((e) => {
            u.show(`Failed to load form validation with error: ${e}`);
          });
      },
      onItemSelect: function e(t) {
        const s = t.getSource();
        const o = s.getBindingContext();
        const a = o?.getObject();
        const r = h(this);
        r.navTo("detail", { id: a.ID });
      },
      validate: function e(t) {
        const s = t.getProperty("name");
        let o = "";
        switch (s) {
          case "Name": {
            const e = t.getValue();
            if (e.length === 0) {
              t.setValueState(p.Error);
              o = "Name is required";
              t.setValueStateText(o);
            } else if (e.length > 40) {
              t.setValueState(p.Error);
              o = "Name must be less than 40 characters";
              t.setValueStateText(o);
            } else {
              t.setValueState(p.Success);
              t.setValueStateText("");
            }
            break;
          }
          case "Price": {
            const e = parseFloat(t.getValue());
            if (isNaN(e)) {
              t.setValueState(p.Error);
              o = "Price must be a number";
              t.setValueStateText(o);
            } else if (e < 0) {
              t.setValueState(p.Error);
              o = "Price must be a positive number";
              t.setValueStateText(o);
            } else {
              t.setValueState(p.Success);
              t.setValueStateText("");
            }
            break;
          }
          case "Rating": {
            const e = parseFloat(t.getValue());
            if (isNaN(e)) {
              t.setValueState(p.Error);
              o = "Rating must be a number";
              t.setValueStateText(o);
            } else if (e % 1 !== 0) {
              t.setValueState(p.Error);
              o = "Rating must be a whole number";
              t.setValueStateText(o);
            } else if (e < 0 || e > 5) {
              t.setValueState(p.Error);
              o = "Rating must be between 0 and 5";
              t.setValueStateText(o);
            } else {
              t.setValueState(p.Success);
              t.setValueStateText("");
            }
            break;
          }
        }
        return o;
      },
      getValues: function e(t) {
        return t.reduce(
          (e, t) => {
            const s = t;
            const o = s.getProperty("name");
            const a = this.validate(s);
            const r = s.getValue();
            if (a) {
              e.errors[o] = a;
              e.hasErrors = true;
            } else {
              e.values[o] = r;
            }
            return e;
          },
          { errors: {}, values: {}, hasErrors: false }
        );
      },
      submit: function e(t, s) {
        const o = s
          .getControlsByFieldGroupId("newProduct")
          .filter((e) => !e.getId().includes("popup"));
        const a = this.getValues(o);
        if (a.hasErrors) {
          const e = new n();
          const s = {
            type: c.Success,
            title: "Correctly filled inputs",
            subtitle: "No further action necessary",
            description: Object.entries(a.values)
              .map((e) => {
                let [t, s] = e;
                return `• ${t}: ${s}`;
              })
              .join("\n"),
            counter: Object.keys(a.values).length,
          };
          const o = {
            type: c.Error,
            title: "Incorrect fields",
            subtitle: "Please correct the following errors",
            description: Object.entries(a.errors)
              .map((e) => {
                let [t, s] = e;
                return `• ${t}: ${s}`;
              })
              .join("\n"),
            counter: Object.keys(a.errors).length,
          };
          e.setData(
            [s, o].filter((e) => {
              let { counter: t } = e;
              return t;
            })
          );
          this.MessageView?.navigateBack();
          this.MessageView?.setModel(e, "messageModel");
          this.Popover?.openBy(t.getSource());
        } else {
          const e = this.getView()?.getModel();
          const t = a.values;
          e.createEntry("/Products", {
            properties: { ...t, ID: Math.floor(Math.random() * 1001).toString() },
          });
          this.AddItemDialog?.close();
          e.submitChanges({
            success: () => {
              u.show("Product successfully created!");
              this.AddItemDialog?.close();
            },
            error: () => {
              u.show("Failed to create product! Please try again");
              this.AddItemDialog?.close();
            },
          });
        }
      },
      onDialogPress: function e() {
        if (!this.AddItemDialog) {
          const e = () => this.AddItemDialog?.close();
          e.bind(this);
          this.loadFragment({ name: "project1.view.fragments.NewProduct" })
            .then((o) => {
              const a = o;
              a.addStyleClass("sapUiContentPadding");
              this.AddItemDialog = new s({
                title: "New Product",
                content: a,
                beginButton: new t({
                  type: m.Emphasized,
                  text: "OK",
                  press: (e) => this.submit(e, a),
                }),
                endButton: new t({ text: "Close", press: e }),
              });
              this.getView()?.addDependent(this.AddItemDialog);
              this.AddItemDialog.open();
            })
            .catch(() => {
              u.show("Failed to load new product form");
            });
        }
        this.AddItemDialog?.open();
      },
      onChange: function e(t) {
        const s = t.getSource();
        this.validate(s);
      },
      onErrorBack: function e() {
        this.MessageView?.navigateBack();
        this.BackButton?.setVisible(false);
      },
      closePopover: function e() {
        this.Popover?.close();
      },
      onErrorItemClick: function e() {
        this.BackButton?.setVisible(true);
      },
    });
    return V;
  }
);
//# sourceMappingURL=Products.controller.js.map
