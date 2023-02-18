import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/ProductService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function ProductList(id, selector) {
    var model = uiModels.getProductModel();

    var ProductPage = new eworkspace.framework.ListPage(id, model, selector);
    ProductPage.setLoadDataHandler(uiServices.getProductList);

    //create
    ProductPage.onButtonClickById("new", function (page) {
        var dialog = new ProductEditDialog('Product-edit', [""], ProductPage);
        dialog.show();
    });

    ProductPage.onButtonClickById("edit", function (page) {

        var data = ProductPage.getSelectedRow();

        if (data != null) {
            var dialog = new ProductEditDialog('Product-edit', [data.Id], ProductPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            ProductPage.show();
        }

    });

    ProductPage.onButtonClickById("delete", function (page) {
        var data = ProductPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteProduct(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            ProductPage.show();
        }
    });

    return ProductPage;
}

function ProductForm(id, selector) {
    var template = { Id: 'ProductForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getProductDetails);
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveProduct(data, function (Product) {
            page.setData(Product);
            eworkspace.ViewModel.info('Save the Product!');
        })

    }
    return page;
}

function ProductEditDialog(id, params, ProductPage) {
    var model = {
        title: "Product Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".ProductForm", Id: "ProductForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var ProductForm = dialog.pages[dialog.model.content.Id];
        ProductForm.save();
        dialog.close();
        ProductPage.display();
       
    }
    var cancel = function () {
        dialog.close();
        
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { ProductList, ProductForm, ProductEditDialog }

