import type { Product } from "../model/types/ODataDemoModel";
import { getRouter } from "../util/router";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import { ButtonType } from "sap/m/library";
import type Event from "sap/ui/base/Event";
import type ManagedObject from "sap/ui/base/ManagedObject";
import Controller from "sap/ui/core/mvc/Controller";
import Input from "sap/m/Input";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import { ValueState } from "sap/ui/core/library";
import Popover from "sap/m/Popover";
import type Control from "sap/ui/core/Control";
import MessageView from "sap/m/MessageView";
import MessageItem, { type $MessageItemSettings } from "sap/m/MessageItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import IconPool from "sap/ui/core/IconPool";
import MessageType from "sap/ui/core/message/MessageType";
import type ODataModel from "sap/ui/model/odata/v2/ODataModel";
import MessageToast from "sap/m/MessageToast";
import formatter from "../model/formatter";

type FormKeys = keyof Pick<Product, "Name" | "Price" | "Rating">;
type Form = {
  values: Record<FormKeys, string>;
  errors: Record<FormKeys, string>;
  hasErrors: boolean;
};

/**
 * @namespace project1.controller
 */
export default class Products extends Controller {
  private AddItemDialog: Dialog | null = null;
  private MessageView: MessageView | null = null;
  private Popover: Popover | null = null;
  private BackButton: Button | null = null;

  public formatter = formatter;

  public onInit(): void {
    /* ------------------------------- 1. Popover ------------------------------- */
    this.loadFragment({
      name: "project1.view.fragments.Errors",
    })
      .then((oFragment) => {
        this.Popover = oFragment as Popover;
        this.MessageView = this.byId("errorMessageView") as MessageView;
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
        this.BackButton = this.byId("errorBackButton") as Button;
        this.BackButton.setIcon(IconPool.getIconURI("nav-back"));
      })
      .catch((error) => {
        MessageToast.show(`Failed to load form validation with error: ${error}`);
      });
  }

  /**
   * handles item click and redirects to detail page
   * @public
   * @param {sap.ui.base.Event} oEvent Standard UI5 event object
   */
  public onItemSelect(oEvent: Event) {
    const source = oEvent.getSource<ManagedObject>();
    const ctx = source.getBindingContext();
    const data = ctx?.getObject() as Product;
    const router = getRouter(this);
    router.navTo("detail", { id: data.ID });
  }

  /**
   * Utility function to validate input fields
   * used both in liveChange of input fields and on submit
   * @private
   * @param {Input} input Input field source
   * @returns {boolean} wether the input is valid. `true` if valid
   */
  private validate(input: Input) {
    const key = input.getProperty("name") as keyof Form["values"];
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
  }

  /**
   * Transforms the input fields into a form object
   * @param {Control[]} items Indivual inputs
   * @returns {Form} Form object with values and errors
   */
  private getValues(items: Control[]) {
    return items.reduce(
      (acc, item) => {
        const input = item as Input;
        const key = input.getProperty("name") as keyof Form["values"];
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
      { errors: {}, values: {}, hasErrors: false } as Form
    );
  }

  private submit(oEvent: Event, content: VerticalLayout) {
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
          .map(([key, value]) => `• ${key}: ${value}`)
          .join("\n"),
        counter: Object.keys(form.values).length,
      } satisfies $MessageItemSettings;
      const incorrectItems = {
        type: MessageType.Error,
        title: "Incorrect fields",
        subtitle: "Please correct the following errors",
        description: Object.entries(form.errors)
          .map(([key, value]) => `• ${key}: ${value}`)
          .join("\n"),
        counter: Object.keys(form.errors).length,
      } satisfies $MessageItemSettings;
      // Add items to the view, remove items with 0 children
      jModel.setData([correctItems, incorrectItems].filter(({ counter }) => counter));
      this.MessageView?.navigateBack();
      this.MessageView?.setModel(jModel, "messageModel");
      this.Popover?.openBy(oEvent.getSource<Control>());
    } else {
      // succesful form validation - let's submit the row!
      const oModel = this.getView()?.getModel() as ODataModel;
      const payload: Partial<{
        [K in keyof Product]: K extends FormKeys ? string : Product[K];
      }> = form.values;
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
  }

  /**
   * opens a dialog to add a new product
   * @public
   */
  public onDialogPress() {
    if (!this.AddItemDialog) {
      const close = () => this.AddItemDialog?.close();
      close.bind(this);

      this.loadFragment({
        name: "project1.view.fragments.NewProduct",
      })
        .then((oFragment) => {
          const content = oFragment as VerticalLayout;
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
  }

  public onChange(oEvent: Event) {
    const input = oEvent.getSource<Input>();
    this.validate(input);
  }

  public onErrorBack() {
    this.MessageView?.navigateBack();
    this.BackButton?.setVisible(false);
  }

  public closePopover() {
    this.Popover?.close();
  }

  public onErrorItemClick() {
    this.BackButton?.setVisible(true);
  }
}
