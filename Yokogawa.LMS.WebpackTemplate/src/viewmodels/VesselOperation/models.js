import { AppConfig, eworkspace, utils } from '../../global';

function getVesselScheduleHistoryModel() {
    return {
        title: "Vessel Schedule History",
        buttons: [
            { text: "SEARCH", name: "fa-search" },
            { id: 'view', text: "VIEW", name: "fa-pencil-alt", page: { url: AppConfig.viewModelName+'.VesselSchehduleDetails', Id: 'test' } },
        ],
        filters: [
            {
                width: '20%',
                items: [
                    { text: 'Departure', value: '4' },
                    { text: 'Cancellation', value: '99' }
                ]

            }
        ],
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
                { field: "Id", hidden: true },
                { field: "VesselScheduleNo", title: 'Shipment No', width: '160px' },
                { field: "VesselName", title: 'Vessel Name', width: '138px' },
                { field: "DWT", title: 'DWT', width: '138px' },
                {
                    field: "PlannedArrivalTime", title: 'ETA', width: '160px',
                    template: "#= convertToDateString(PlannedArrivalTime, 'dd MMM yyyy') #"
                },
                {
                    field: "PlannedDepartureTime", title: 'ETD', width: '160px',
                    template: "#= (PlannedDepartureTime===null? '': convertToDateString(PlannedDepartureTime, 'dd MMM yyyy')) #"
                },
                { field: "StatusName", title: 'Status', width: '100px' },
                { field: "JettyName", title: 'Jetty No', width: '80px' }
            ]
        },
        conditions: [
            { field: "VesselScheduleNo", title: 'Shipment No', type: 'text', dataType: 'string' },
            { field: "VesselName", title: 'Vessel Name', type: 'text', dataType: 'string' },
            { field: "PlannedArrivalTime", title: 'ETA', type: 'text', dataType: 'datetime' },
            { field: "JettyName", title: 'Jetty Name', type: 'text', dataType: 'string' }
        ],
        data: []
    }
}

function getVesselScheduleDetailsModel() {
    return {
        toolBarItems: [
            { id: 'new', template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { id: 'save', template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { id: 'close', template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { id: 'delete', template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Vessel Schedule",
        headers: [
            { title: 'Vessel Schedule No', field: "VesselScheduleNo" },
            { title: 'Vessel Name', field: "VesselName" },
            { title: 'Status', field: "StatusName" },
            { title: "Last Modify on", field: "LastModifiedOn" },
            { title: 'Owner', field: "LastModifiedByName" }
        ],
        data: null,
        navigation: [
            { id: 'schedule', text: 'Jetty Schedule', page: { url: AppConfig.viewModelName + '.VesselSchehduleForm', Id: "jettySchedule" } },
            { id: 'bol', text: 'BOL Instruction', page: { url: AppConfig.viewModelName +'.BOLForm', Id: 'bol' }, dataSourceField: 'BOLList', visible: true },
            { id: 'timesheet', text: 'Vessel Timesheet', page: { url: AppConfig.viewModelName+'.TimeSheetForm', Id: 'timesheet' }, dataSourceField: "Timesheet" },
            { id: 'docs', text: 'Documents', page: { url: AppConfig.viewModelName+'.ShipmentDocumentExportForm', Id: 'docs' }, dataSourceField: "DocList", visible: false },

        ],
        content: []
    }
}

function getVesselScheduleFormModel() {
    return {
        gridDataSourceField: "OrderList",
        gridOptions: {
            dataSource: {
                data: [],
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            CustomerOrderNo: { defaultValue: "", editable: false },
                            Customer: { defaultValue: null },
                            Product: { defaultValue: null },
                            UOMEntity: { defaultValue: null },
                            OrderTypeEntity: { defaultValue: null },
                            IsBlending: { type: 'boolean' }
                        }
                    }
                }

            },
            height: 220,
            editable: true,
            groupable: false,
            scrollable: true,
            sortable: false,
            pageable: false,
            toolbar: ["create", "save", "cancel"],
            columns: [
                { field: "CustomerOrderNo", title: 'Order No.', width: '137px' },
                { field: "Customer", title: 'Customer', template: "#=Customer==null?'':Customer.Name#", width: '180px' },
                { field: "Product", title: 'Product', template: "#=Product==null?'':Product.ProductName#", width: '180px' },
                { field: "OrderQty", title: 'Qty', width: '126px' },
                { field: "UOMEntity", title: 'UOM', template: "#=UOMEntity==null?'':UOMEntity.Name#", width: '150px' },
                { field: "OrderTypeEntity", title: 'Type', template: "#=OrderTypeEntity==null?'':OrderTypeEntity.Name#", width: '112px' },
                { field: "IsBlending", title: 'Bld?', template: '<input type="checkbox" #= IsBlending ? \'checked="checked"\' : "" # class="chkbx k-checkbox" />', width: '67px' },
                { command: ["destroy"], title: "", width: '110px' }
            ]
        },
        data: {
            items: []
        }
    }
}

function getVesselScheduleHistoryBOLFormModel() {
   return {
        pageSize: 10,
            itemTemplate: { Id: 'vesselBOLTemplate' },
        itemEditTemplate: { Id: 'vesselBOLEditTemplate' },
        selectable: false,
            data: [],
                schema: {
            model: {
                id: "Id",
                    fields: {
                    Index: { defaultValue: 0, type: "number" },
                    BOLNo: { defaultValue: '', type: "string" },
                    CustomerName: { defaultValue: '', type: "string" },
                    Destination: { defaultValue: '', type: "string" },
                    ProductName: { defaultValue: '', type: "string" },
                    NominatedQTY: { defaultValue: 0, type: "number" },
                    TotalQty: { defaultValue: 0, type: "number" },
                    QtyActual: { defaultValue: 0, type: "number" },
                    UOMName: { defaultValue: '', type: "string" },
                    CustomPermitNo: { type: 'string' },
                    Consignor: { type: 'string' },
                    Consignee: { type: 'string' },
                    Freight: { type: 'string' },
                    CountryOfLoading: { type: "string" },
                    CuttingPlanList: { nullable: true },

                    Id: { defaultValue: '', type: "string" },
                    VesselScheduleId: { defaultValue: '', type: "string" },
                    CustomerId: { defaultValue: '', type: "string" },
                    CustomerList: { defaultValue: '', type: "string" },
                    DOCInstructor: { defaultValue: '', type: "string" },
                    IsNewRecord: { defaultValue: 'true', type: "string" },
                    LastModifiedBy: { defaultValue: '', type: "string" },
                    LastModifiedByName: { defaultValue: '', type: "string" },
                    LastModifiedOn: { defaultValue: '', type: "string" },
                    SellingName: { defaultValue: '', type: "string" },
                    Remark: { defaultValue: '', type: "string" },
                    UOM: { defaultValue: '', type: "string" },
                    UOMList: { nullable: true },
                    UnitValue: { defaultValue: '', type: "string" },
                    AllowEdit: { defaultValue: 'inline-block', type: "string" }
                }
            }
        }
    }
}

export let UOMList =  [
    { Id: 1, Name: 'M³@15℃' },
    { Id: 2, Name: 'M³@Obs.Temp' },
    { Id: 3, Name: 'Litres@15℃' },
    { Id: 4, Name: 'Litres@Obs.Temp' },
    { Id: 5, Name: 'MT' },
    { Id: 6, Name: 'Long Tons' },
    { Id: 7, Name: 'US BBLs@60℉' }
]

export default {
    getVesselScheduleHistoryModel,
    getVesselScheduleDetailsModel,
    getVesselScheduleFormModel,
    getVesselScheduleHistoryBOLFormModel
}

