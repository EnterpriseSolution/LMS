import { AppConfig, eworkspace, utils } from '../../global';
function getVesselLoadingOrderModel() {
    return {
        title: "VesselLoadingOrder",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search"  },
            { id: 'new', text: "NEW", name: "fa-plus", page: { url: AppConfig.viewModelName + '.VesselMainOrder', Id: "VesselMainOrder" }},
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt", page: { url: AppConfig.viewModelName + '.VesselMainOrder', Id: "VesselMainOrder" } },
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
                { field: 'CustomerName', title: 'CustomerName' },
                { field: 'Destination', title: 'Destination' },
                { field: 'Eta', title: 'Eta', template: "#=convertToDateString(Eta, 'dd MMM yyyy')#" },
                { field: 'JettyNo', title: 'JettyNo' },
                { field: 'LoadedQty', title: 'LoadedQty' },
                { field: 'OperationType', title: 'OperationType' },
                { field: 'OrderNo', title: 'OrderNo' },
                { field: 'OrderQty', title: 'OrderQty' },
                { field: 'ProductName', title: 'ProductName' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'ShipmentNo', title: 'ShipmentNo' },
                { field: 'SourceType', title: 'SourceType' },
                { field: 'Status', title: 'Status' },
                { field: 'UOM', title: 'UOM' },
                { field: 'VesselName', title: 'VesselName' },


              ]
        }  ,
        conditions: [
            { field: 'JobNo', title: 'JobNo', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function getMainLoadingOrder() {
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
            { id:"OrderForm", text: 'CreateOrder', page: { url: AppConfig.viewModelName + '.VesselLoadingOrderForm', Id: "VesselLoadingOrderForm" } },
          
        ],
        content: []

    }
}
export default {
    getVesselLoadingOrderModel, getMainLoadingOrder
}