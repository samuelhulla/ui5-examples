//@ui5-bundle project1/Component-preload.js
sap.ui.require.preload({
  "project1/Component.js": function () {
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
  },
  "project1/controller/App.controller.js": function () {
    "use strict";
    sap.ui.define(["sap/ui/core/mvc/Controller"], function (t) {
      "use strict";
      const n = t.extend("project1.controller.App", { onInit: function t() {} });
      return n;
    });
  },
  "project1/controller/Detail.controller.js": function () {
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
  },
  "project1/controller/Products.controller.js": function () {
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
  },
  "project1/i18n/i18n.properties":
    "# This is the resource bundle for project1\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=App Title\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=App Title",
  "project1/manifest.json":
    '{"_version":"1.59.0","sap.app":{"id":"project1","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.14.1","toolsId":"7b53f908-b147-45ba-bc4b-edd2ff367627"},"dataSources":{"mainService":{"uri":"/V2/(S(op5lz2kfg5tcdcxgwkyi0lhy))/OData/OData.svc/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0","useBatch":false}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"handleValidation":true,"flexEnabled":false,"dependencies":{"minUI5Version":"1.125.1","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"project1.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","useBatch":false}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"project1.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"products","pattern":"","target":["TargetProducts"]},{"name":"detail","pattern":"detail/{id}","target":["TargetDetail"]}],"targets":{"TargetProducts":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Products","viewName":"Products"},"TargetDetail":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Detail","viewName":"Detail"}}},"rootView":{"viewName":"project1.view.App","type":"XML","async":true,"id":"App"}}}',
  "project1/model/formatter.js": function () {
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
  },
  "project1/model/models.js": function () {
    "use strict";
    sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (e, n) {
      "use strict";
      function t() {
        const t = new e(n);
        t.setDefaultBindingMode("OneWay");
        return t;
      }
      var i = { __esModule: true };
      i.createDeviceModel = t;
      return i;
    });
  },
  "project1/model/types/ODataDemoModel.js": function () {
    "use strict";
  },
  "project1/util/router.js": function () {
    "use strict";
    sap.ui.define(["sap/ui/core/UIComponent"], function (e) {
      "use strict";
      function t(t) {
        return e.getRouterFor(t);
      }
      var r = { __esModule: true };
      r.getRouter = t;
      return r;
    });
  },
  "project1/view/App.view.xml":
    '<mvc:View\n  controllerName="project1.controller.App"\n  xmlns:html="http://www.w3.org/1999/xhtml"\n  xmlns:mvc="sap.ui.core.mvc"\n  displayBlock="true"\n  xmlns="sap.m"\n><App id="app"></App></mvc:View>\n',
  "project1/view/Detail.view.xml":
    '<mvc:View\n  controllerName="project1.controller.Detail"\n  xmlns:mvc="sap.ui.core.mvc"\n  displayBlock="true"\n  xmlns="sap.m"\n><Page id="detailPage"><customHeader><Bar><contentLeft><Button type="Back" press="onNavBack" /><Title text="Product detail" /></contentLeft><contentRight><Button id="edit" text="Edit" enabled="false" press="onEdit" /><Button id="save" text="Save" type="Emphasized" visible="false" press="onSave" /><Button id="cancel" text="Cancel" visible="false" press="onCancel" /></contentRight></Bar></customHeader><content><VBox id="detail"></VBox><VBox class="sapUiSmallMargin"><Label text="Category Details" design="Bold" /><Table id="categoryTable"><columns><Column><Text text="Category ID" /></Column><Column><Text text="Category Name" /></Column></columns><items><ColumnListItem><cells><Text text="{Category/ID}" /><Text text="{Category/Name}" /></cells></ColumnListItem></items></Table><Label text="Supplier Details" class="sapUiSmallMarginTop" design="Bold" /><Table id="supplierTable"><columns><Column><Text text="Supplier ID" /></Column><Column><Text text="Supplier Name" /></Column><Column><Text text="Address" /></Column></columns><items><ColumnListItem><cells><Text text="{Supplier/ID}" /><Text text="{Supplier/Name}" /><Text\n                  text="{Supplier/Address/Street}, {Supplier/Address/City}, {Supplier/Address/State}, {Supplier/Address/Country}"\n                /></cells></ColumnListItem></items></Table></VBox></content></Page></mvc:View>\n',
  "project1/view/Products.view.xml":
    '<mvc:View\n  controllerName="project1.controller.Products"\n  xmlns:mvc="sap.ui.core.mvc"\n  displayBlock="true"\n  xmlns="sap.m"\n><Page id="page" title="Product Listing"><customHeader><Bar><contentLeft><Title text="Product Listing" /></contentLeft><contentRight><Button id="newProducts" press=".onDialogPress" type="Emphasized" text="+" /></contentRight></Bar></customHeader><content><Table inset="false" items="{/Products}" noDataText="No products found" id="products"><columns><Column id="productsColName"><Text id="productsColNameValue" text="Product Name" /></Column><Column id="productsColPrice"><Text id="productsColPriceValue" text="Price" /></Column><Column id="productsColRating"><Text id="productsColRatingValue" text="Rating" /></Column></columns><items><ColumnListItem\n            vAlign="Middle"\n            type="Navigation"\n            press=".onItemSelect"\n            id="productsRow"\n          ><cells><ObjectIdentifier id="productsRowName" title="{Name}" /><ObjectNumber id="productsRowPrice" number="{Price}" unit="EUR" /><ObjectStatus id="productsRowRating" state="{ path: \'Rating\', formatter: \'.formatter.ratingColor\' }" text="{ path: \'Rating\', formatter: \'.formatter.rating\' }" /></cells></ColumnListItem></items></Table></content></Page></mvc:View>\n',
  "project1/view/fragments/Detail.fragment.xml":
    '<core:FragmentDefinition\n  xmlns="sap.m"\n  xmlns:core="sap.ui.core"\n  xmlns:l="sap.ui.layout"\n  xmlns:f="sap.ui.layout.form"\n><VBox class="sapUiSmallMargin"><f:Form editable="false" id="productForm"><f:title><core:Title text="Product detail: {Name}" /></f:title><f:layout><f:ResponsiveGridLayout\n          labelSpanXL="3"\n          labelSpanL="3"\n          labelSpanM="3"\n          labelSpanS="12"\n          adjustLabelSpan="false"\n          emptySpanXL="4"\n          emptySpanL="4"\n          emptySpanM="4"\n          emptySpanS="0"\n          columnsXL="1"\n          columnsL="1"\n          columnsM="1"\n          singleContainerFullSize="false"\n        /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement label="Name"><f:fields><Text text="{Name}" /></f:fields></f:FormElement><f:FormElement label="ID"><f:fields><Text text="{ID}" /></f:fields></f:FormElement><f:FormElement label="Price"><f:fields><Text text="{Price}" /></f:fields></f:FormElement><f:FormElement label="Rating"><f:fields><Text text="{Rating}" /></f:fields></f:FormElement><f:FormElement label="Description"><f:fields><Text text="{Description}" /></f:fields></f:FormElement><f:FormElement label="Release Date"><f:fields><Text text="{ path: \'ReleaseDate\', formatter: \'.formatter.dateTime\'  }" /></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></VBox></core:FragmentDefinition>\n',
  "project1/view/fragments/Edit.fragment.xml":
    '<core:FragmentDefinition\n  xmlns="sap.m"\n  xmlns:core="sap.ui.core"\n  xmlns:l="sap.ui.layout"\n  xmlns:f="sap.ui.layout.form"\n><VBox class="sapUiSmallMargin"><f:Form editable="true" id="productFormEdit"><f:title><core:Title text="Product detail: {Name}" /></f:title><f:layout><f:ResponsiveGridLayout\n          labelSpanXL="3"\n          labelSpanL="3"\n          labelSpanM="3"\n          labelSpanS="12"\n          adjustLabelSpan="false"\n          emptySpanXL="4"\n          emptySpanL="4"\n          emptySpanM="4"\n          emptySpanS="0"\n          columnsXL="1"\n          columnsL="1"\n          columnsM="1"\n          singleContainerFullSize="false"\n        /></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement label="Name"><f:fields><Input value="{Name}" /></f:fields></f:FormElement><f:FormElement label="ID"><f:fields><Input value="{ID}" /></f:fields></f:FormElement><f:FormElement label="Price"><f:fields><Input type="Number" value="{Price}" /></f:fields></f:FormElement><f:FormElement label="Rating"><f:fields><Input type="Number" value="{Rating}" /></f:fields></f:FormElement><f:FormElement label="Description"><f:fields><Input value="{Description}" /></f:fields></f:FormElement><f:FormElement label="Release Date"><f:fields><Input value="{ReleaseDate}" /></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></VBox></core:FragmentDefinition>\n',
  "project1/view/fragments/Errors.fragment.xml":
    '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"><Popover modal="true" verticalScrolling="false" contentMinWidth="20rem" contentHeight="25rem"><customHeader><Bar><contentLeft><Button visible="false" id="errorBackButton" press="onErrorBack" /></contentLeft><contentMiddle><Title text="Product creation errors" /></contentMiddle></Bar></customHeader><content><MessageView\n        id="errorMessageView"\n        showDetailsPageHeader="false"\n        itemSelect="onErrorItemClick"\n      ></MessageView></content><footer><Bar><contentRight><Button text="Close" press="closePopover" /></contentRight></Bar></footer></Popover></core:FragmentDefinition>\n',
  "project1/view/fragments/NewProduct.fragment.xml":
    '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"><l:VerticalLayout id="newProduct"><Label text="Name" /><Input\n      name="Name"\n      placeholder="New product name"\n      fieldGroupIds="newProduct"\n      liveChange="onChange"\n    /><Label text="Price" /><Input\n      name="Price"\n      type="Number"\n      placeholder="14,23"\n      fieldGroupIds="newProduct"\n      liveChange="onChange"\n    /><Label text="Rating" /><Input\n      name="Rating"\n      type="Number"\n      placeholder="3"\n      fieldGroupIds="newProduct"\n      liveChange="onChange"\n    /></l:VerticalLayout></core:FragmentDefinition>\n',
});
//# sourceMappingURL=Component-preload.js.map
