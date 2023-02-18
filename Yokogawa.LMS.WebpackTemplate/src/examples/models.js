const helloWord ={
                    title: 'TOM and Jerry',
                    gridOptions: {
                        dataSource: {
                            data: [],
                        },
                        height: 300,
                        selectable: false,
                        filterable: false,
                        scrollable: true,
                        sortable: true,
                        pageable: false,
                        columns: [
                             { field: "Id", title: 'ID' },
                             { field: "Name", title: 'Name' },
                        ]
                    }
                };

const hiWord ={
                    title: 'May and Jean',
                    gridOptions: {
                        dataSource: {
                            data: [],
                        },
                        height: 300,
                        selectable: false,
                        filterable: false,
                        scrollable: true,
                        sortable: true,
                        pageable: false,
                        columns: [
                             { field: "Id", title: 'ID' },
                             { field: "Name", title: 'Name' },
                        ]
                    }
};

const listmodel = {
    toolBarItems: [
        { template: "<button><span class='fa fa-plus'></span><span data-i18n='SELECT USERS'>SELECT USERS</span></button>" },
        { template: "<button><span class='fa fa-trash'></span><span data-i18n='REMOVE USER'>REMOVE USER</span></button>" },
        { template: "<button><span class='fa fa-trash'></span><span data-i18n='REMOVE ALL'>REMOVE ALL</span></button>" }
    ],
    title: "Assign To:",
    checkedIds: {},
    gridOptions: {
        dataSource: {
            data: [],
            pageSize: 5
        },
        height: 300,
        selectable: true,
        groupable: true,
        filterable: true,
        scrollable: true,
        sortable: true,
        pageable:true,
        columns: [          
            { field: "UserId", title: 'Id' },
            { field: "UserName", title: 'Name' }
        ]
    }
}

export default {helloWord,hiWord,listmodel}
