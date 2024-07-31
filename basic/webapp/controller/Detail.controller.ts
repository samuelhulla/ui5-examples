import { getRouter } from "../util/router";
import Controller from "sap/ui/core/mvc/Controller";
import type ODataModel from "sap/ui/model/odata/v2/ODataModel";
import MessageToast from "sap/m/MessageToast";
import Fragment from "sap/ui/core/Fragment";
import formatter from "../model/formatter";
import type Control from "sap/ui/core/Control";
import type Button from "sap/m/Button";
import type VBox from "sap/m/VBox";

type Fragments = "Detail" | "Edit";

/**
 * @namespace project1.controller
 */
export default class Detail extends Controller {
  private FragmentCache: Partial<Record<Fragments, Control>> = {};
  public formatter = formatter;

  /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {
    const router = getRouter(this);
    router.getRoute("detail")?.attachPatternMatched((oEvent) => {
      const { id } = oEvent.getParameter("arguments") as { id: number };
      const model = this.getOwnerComponent()?.getModel() as ODataModel;
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
  }

  public onNavBack() {
    const router = getRouter(this);
    router.navTo("products");
  }

  public onEdit() {
    // ui5 cant pass async functions to event handlers, so we just pass this abstraction
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.toggle("Edit");
  }

  public onSave() {
    const model = this.getView()?.getModel() as ODataModel;
    model.submitChanges();
    this.toggle("Detail")
      .then(() => {
        MessageToast.show("Product succesfully saved!");
      })
      .catch((error) => {
        MessageToast.show(`Failed to save product: ${error.message}`);
      });
  }

  public onCancel() {
    const model = this.getView()?.getModel() as ODataModel;
    model
      ?.resetChanges()
      .then(async () => {
        await this.toggle("Detail");
        MessageToast.show("Changes discarded");
      })
      .catch((error) => {
        MessageToast.show(`Failed to discard changes: ${error.message}`);
      });
  }

  private async getFragment(fragment: Fragments): Promise<Control> {
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
    return oFragment as Control;
  }

  private getButton(id: "edit" | "save" | "cancel"): Button {
    return this.byId(id) as Button;
  }

  private async toggle(mode: Fragments) {
    const oForm = this.byId("detail") as VBox;
    const oFragment = await this.getFragment(mode);
    oForm.removeAllItems();
    oForm.addItem(oFragment);

    const toggleButtons = (isEditMode: boolean) => {
      const toggleButton = (id: Parameters<typeof this.getButton>[0], flag: boolean) => {
        this.getButton(id).setVisible(flag);
        this.getButton(id).setEnabled(flag);
      };

      toggleButton("edit", !isEditMode);
      toggleButton("save", isEditMode);
      toggleButton("cancel", isEditMode);
    };

    toggleButtons(mode === "Edit");
  }
}
