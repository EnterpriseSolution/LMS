import { AppConfig, eworkspace, utils } from '../../global';
function getOdTruckLoadingOrderModel() {
    return {
        title: "OdTruckLoadingOrder",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus", page: { url: AppConfig.viewModelName + '.MainOrder', Id: "MainOrder" }  },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt", page: { url: AppConfig.viewModelName + '.MainOrder', Id: "MainOrder" }   },
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
            pageable: false,
            columns: [
                { field: 'BayNo', title: 'BayNo' },
                { field: 'St_CardId', title: 'CardId' },
                { field: 'St_CarrierId', title: 'CarrierId' },
                { field: 'DeliveryDate', title: 'DeliveryDate', template: "#=convertToDateString(DeliveryDate, 'dd MMM yyyy')#" },
                { field: 'St_DriverId', title: 'DriverId' },
                { field: 'FrontLicense', title: 'FrontLicense' },
                { field: 'OrderNo', title: 'OrderNo' },
                { field: 'RearLicense', title: 'RearLicense' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'SourceType', title: 'SourceType' },
                { field: 'Status', title: 'Status' },
                { field: 'St_TruckId', title: 'TruckId' }
            ]
        } ,
        conditions: [
            { field: 'OrderNo', title: 'Address', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function MainOrder() {
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
            { id:'orderTab', text: 'CreateOrder', page: { url: AppConfig.viewModelName + '.OrderForm', Id: "OrderForm" } },
            { id:'jobTab', text: 'CreateJob', page: { url: AppConfig.viewModelName + '.JobForm', Id: "JobForm" } }
        ],
        content: []
        
    }


}


export default {
    getOdTruckLoadingOrderModel, MainOrder
}