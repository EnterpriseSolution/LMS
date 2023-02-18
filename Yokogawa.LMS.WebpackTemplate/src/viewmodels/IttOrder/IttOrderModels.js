import { AppConfig, eworkspace, utils } from '../../global';
function getIttOrderModel() {
    return {
        title: "IttOrder",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus", page: { url: AppConfig.viewModelName + '.MainIttOrder', Id: "MainIttOrder" }},
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt", page: { url: AppConfig.viewModelName + '.MainIttOrder', Id: "MainIttOrder" } },
            { id: 'delete', text: "DELETE", name: "fa-trash" },
        ],
        filters: [],
        gridOptions: {
            dataSource: {
                data: [
                ],
                pageSize: 10,
                serverPaging: true,
                schema: {
                    data: 'Items',
                    total: 'RowCount'
                }
            },
            height: 590,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: 'DeliveryDate', title: 'DeliveryDate', template: "#=convertToDateString(DeliveryDate, 'dd MMM yyyy')#" },
                { field: 'FinalProductName', title: 'FinalProductName' },
                { field: 'FromCustomerName', title: 'FromCustomerName' },
                { field: 'FromTankNo', title: 'FromTankNo' },
                { field: 'OrderNo', title: 'OrderNo' },
                { field: 'OrderQty', title: 'OrderQty' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'SourceType', title: 'SourceType' },
                { field: 'Status', title: 'Status' },
                { field: 'ToCustomerName', title: 'ToCustomerName' },
                { field: 'ToTankNo', title: 'ToTankNo' },
                { field: 'TransferredQty', title: 'TransferredQty' },
                { field: 'UOM', title: 'Uom' }



            ]
        },
        conditions: [
            { field: 'Address', title: 'Address', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}


function getMainIttOrder() {
    return {

        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Order",
        headers: [{ title: "Order", field: "OrderNo" }],
        data: null,
        navigation: [
            { id: "IttOrder", text: 'CreateOrder', page: { url: AppConfig.viewModelName + '.IttOrderForm', Id: "IttOrderForm" } }

        ],
        content: []

    }
}


export default {
    getIttOrderModel, getMainIttOrder
}