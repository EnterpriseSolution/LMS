import { AppConfig, eworkspace, utils } from '../../global'; 

function getJettyModel() {
    return {
        title: "Jetty",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: "Id", title: 'Id', hidden: true },
                { field: "JettyId", title: 'JettyId', hidden: true },
                { field: "JettyNo", title: 'Jetty No' },
                { field: "LOA", title: 'LOA' },
                { field: "Displacement", title: 'Displacement' },
                { field: "MaxDraft", title: 'Max Draft' },
                { field: "ManifoldHeight", title: 'Manifold Height' },
                { field: "CommissionDate", title: 'Commission Date', template: "#=convertToDateString(CommissionDate, 'dd MMM yyyy')#" },
                { field: "Status", title: 'Status' },
                { field: "Remarks", title: 'Remarks' }
            ]
        },
        conditions: [
            { field: "JettyNo", title: 'Jetty No', type: 'text', dataType: 'string' },
            { field: "LOA", title: 'LOA', type: 'text', dataType: 'float' }
        ],
        queries: [
            {
                name: 'default',
                editable: true,
                filters: [
                    { field: "JettyNo", value: "", operator: "==" },
                    { joinoperator: 'Or',field: "LOA", value: 0, operator: "==" }
                ],
                isDefault: true
            }],
        data: []
    }

}

function getAgentModel() {
    return {
        title: "Agent",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'Id', title: 'Id', hidden: true },
                { field: 'AgentCode', title: 'AgentCode' },
                { field: 'AgentCRNo', title: 'AgentCRNo' },
                { field: 'AgentName', title: 'AgentName' },
                { field: 'PersonInCharge', title: 'PersonInCharge' },
                { field: 'Status', title: 'Status' }
            ]
        },
        conditions: [
           { field: 'AgentCode', title: 'AgentCode', type: 'text', dataType: 'string'  }
        ],
        data: []

    }


}

function getCarrierModel() {
    return {
        title: "Carrier",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'Id', title: 'Id', hidden: true },
                { field: 'Address', title: 'Address' },
                { field: 'CarrierCode', title: 'CarrierCode' },
                { field: 'CarrierName', title: 'CarrierName' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'Status', title: 'Status' },
                { field: 'ValidDate', title: 'ValidDate', template: '#=convertToDateString(ValidDate, "dd MMM yyyy")#'}
            ]
        },
        conditions: [
            { field: 'CarrierCode', title: 'CarrierCode', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function getCompartmentModel() {
    return {
        title: "Compartment",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'Capacity', title: 'Capacity' },
                { field: 'CompartmentNo', title: 'CompartmentNo' },
                { field: 'ProductId', title: 'ProductId' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'TruckId', title: 'TruckId' }
            ]
        },
        conditions: [
            { field: 'Capacity', title: 'CarrierCode', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function getCustomerModel() {
    return {
        title: "Customer",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'Address', title: 'Address' },
                { field: 'Customer', title: 'CustomerCode' },
                { field: 'BillingAddress', title: 'BillingAddress' },
                { field: 'BillingCountry', title: 'BillingCountry' },
                { field: 'BillTelephone', title: 'BillTelephone' },
                { field: 'CustomerName', title: 'CustomerName' },
                { field: 'Country', title: 'Country' },
                { field: 'CustomerAlias', title: 'CustomerAlias' },
                { field: 'CustomerCode', title: 'CustomerCode' },
                { field: 'CustomerCRNo', title: 'CustomerCRNo' },
                { field: 'Fax', title: 'Fax' },
                { field: 'Mobile', title: 'Mobile' },
                { field: 'PersonInCharge', title: 'PersonInCharge' },
                { field: 'PhoneO', title: 'PhoneO' },
                { field: 'PhoneR', title: 'PhoneR' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'Status', title: 'Status'}

            ]
        },
        conditions: [
            { field: 'Address', title: 'Address', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function getDriverModel() {
    return {
        title: "Driver",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'Age', title: 'Age' },
                { field: 'DriverCode', title: 'DriverCode' },
                { field: 'DriverGrade', title: 'DriverGrade' },
                { field: 'DriverName', title: 'DriverName' },
                { field: 'Gender', title: 'Gender' },
                { field: 'License', title: 'License' },
                { field: 'PIN', title: 'PIN' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'ReTrainingDate', title: 'ReTrainingDate', template: "#=convertToDateString(ReTrainingDate, 'dd MMM yyyy')#" },
                { field: 'Status', title: 'Status' },
                { field: 'ValidDate', title: 'ValidDate', template: "#=convertToDateString(ValidDate, 'dd MMM yyyy')#"},
                { field: 'YearsExperience', title: 'YearsExperience' }


            ]
        },
        conditions: [
            { field: 'Address', title: 'Address', type: 'text', dataType: 'string' }
        ],
        data: []

    }


}

function getProductModel() {
    return {
        title: "Product",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'AvgRefDensity', title: 'AvgRefDensity' },
                { field: 'AvgVCF', title: 'AvgVCF' },
                { field: 'HSCode', title: 'HSCode' },
                { field: 'ProductGroup', title: 'ProductGroup' },
                { field: 'ProductName', title: 'ProductName' },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'Status', title: 'Status' }

            ]
        },
        conditions: [
            { field: 'Address', title: 'Address', type: 'text', dataType: 'string' }
        ],
        data: []

    }
}

function getRFIDCardModel() {
    return {
        title: "Card",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'CardNo', title: 'Card No' },
                { field: 'CardTypeDescription', title: 'Card Type' },
                { field: 'ValidDate', title: 'Valid Date', template: "#=convertToDateString(ValidDate, 'dd MMM yyyy')#" },
                { field: 'Remarks', title: 'Remarks' },
                { field: 'StatusDescription', title: 'Status' }
            ]
        },
        conditions: [
            { field: 'CardNo', title: 'Card No', type: 'text', dataType: 'string' }
        ],
        data: []
    }
}

function getTankModel() {
    return {
        title: "Tank",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'TankNo', title: 'Tank No' },
                { field: 'TankTypeDescription', title: 'Tank Type' },
                { field: 'MaxSafeLevel', title: 'Max Level' },
                { field: 'MaxOperationVolume', title: 'Max Volume' },                  
                { field: 'Remarks', title: 'Remarks' },
                { field: 'CreatedOn', title: 'Created On', template: "#=convertToDateString(CreatedOn, 'dd MMM yyyy')#" },
                { field: 'StatusDescription', title: 'Status' }
            ]
        },
        conditions: [
            { field: 'TankNo', title: 'Tank No', type: 'text', dataType: 'string' }
        ],
        data: []

    }
}

function getTruckModel() {
    return {
        title: "Truck",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'TruckCode', title: 'Truck Code' },
                { field: 'Maker', title: 'Maker' },
                { field: 'St_YearBuilt', title: 'Year Built' },
                { field: 'RegisteredTareWeight', title: 'Tare Weight' },
                { field: 'RegisteredGrossWeight', title: 'Gross Weight' },                     
                { field: 'ValidDate', title: 'ValidDate', template: "#=convertToDateString(ValidDate, 'dd MMM yyyy')#" },
                { field: 'Status', title: 'Status' },
                { field: 'Remarks', title: 'Remarks' },
            ]
        },
        conditions: [
            { field: 'TruckCode', title: 'Truck Code', type: 'text', dataType: 'string' }
        ],
        data: []

    }
}

function getVesselModel() {
    return {
        title: "Vessel",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus" },
            { id: 'edit', text: "EDIT", name: "fa-pencil-alt" },
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
                { field: 'VesselName', title: 'Vessel Name' },
                { field: 'VesselFlag', title: 'Vessel Flag' },
                { field: 'DWT', title: 'DWT' },
                { field: 'MaxLoadingRate', title: 'Max Loading Rate' },
                { field: 'VesselLength', title: 'Length' },
                { field: 'CreatedOn', title: 'Created On', template: "#=convertToDateString(CreatedOn, 'dd MMM yyyy')#" },                
            ]
        },
        conditions: [
            { field: 'VesselName', title: 'Vessel Name', type: 'text', dataType: 'string' }
        ],
        data: []
    }
}

export default {
    getJettyModel, getAgentModel, getCarrierModel, getCompartmentModel, getCustomerModel, getDriverModel,
    getProductModel, getRFIDCardModel, getTankModel, getTruckModel, getVesselModel
} 