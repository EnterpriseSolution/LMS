import { AppConfig, eworkspace, utils } from '../../global';

function getTruckUnLoadingOrderModelList() {
    return {
        title: "Truck UnLoading Order",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'view', text: "VIEW", name: "fa-pencil-alt", page: { url: AppConfig.viewModelName + '.TruckUnloadingOrderDetails', Id: 'view' }  },           
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
                { field: "Id", title: 'Id', hidden: true },
                { field: 'OrderNo', title: 'Order No' },
                { field: 'SourceTypeDescription', title: 'Type' },
                { field: 'UnloadingDate', title: 'Unloading Date', template: "#=convertToDateString(UnloadingDate, 'dd MMM yyyy')#" },
                { field: 'CustomerName', title: 'Customer' },
                { field: 'ProductName', title: 'Product' },
                { field: 'OrderQty', title: 'Order Qty' },
                { field: 'UOMDescription', title: 'UOM' },
                { field: 'StatusDescription', title: 'Status' },
            ]
        },
        conditions: [
            { field: 'OrderNo', title: 'OrderNo', type: 'text', dataType: 'string' }
        ],
        data: []

    }
}

function getTruckUnLoadingOrderModel() {
    return {
        toolBarItems: [
            { id: 'new', template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { id: 'save', template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { id: 'close', template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { id: 'delete', template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Truck UnLoading",
        headers: [
            { title: 'Order No', field: "OrderNo" },
            { title: 'Customer', field: "CustomerName" },
            { title: 'Status', field: "StatusDescription" },
            { title: "Last Modify on", field: "LastModifiedOn" },
            { title: 'Last Modified', field: "LastModifiedByName" }
        ],
        data: null,
        navigation: [
            { id: 'schedule', text: 'Truck UnLoading', page: { url: AppConfig.viewModelName + '.TruckUnloadingOrderForm', Id: "jettySchedule" } },
        ],
        content: []
    }
}

export default { getTruckUnLoadingOrderModelList, getTruckUnLoadingOrderModel }