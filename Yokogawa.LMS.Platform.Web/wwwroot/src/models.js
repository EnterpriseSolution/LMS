define(function () {
    var models = {};
    models.UserList = {
        title: "Users",
        buttons: [
            { id: 'search', text: "ADVANCE SEARCH", name: "fa-search" },
            { id: 'new', text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainUser", Id: "maintainuser" } },
            { id: 'newaduser', text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainADUser", Id: "maintainaduser" }, visible: "false"},
            { id: 'edituser', text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainUser", Id: "maintainuser" } },
            { id: 'editaduser', text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainADUser", Id: "maintainaduser" }, visible: "false" },
            { id: 'delete', text: "DELETE", name: "fa-trash" }
        ],
        filters: [
            {
                id: 'userType',
                width: '20%',
                items: [{ text: 'Portal Users', value: 'eworkspace' },
                { text: 'Domain Users', value: 'ad' },
                ]
            }
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 580,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'Id', hidden:true},
                { field: "UserId", title: 'User Id' },
                { field: "DisplayName", title: 'Name' },
                { field: "Company", title: 'Company' },
                { field: "Email", title: 'Email' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' },
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#" },
                { field: "CreateBy", title: 'Create By' },
                { field: "DateModify", title: 'Date Modify', template: "#=convertToDateString(DateModify, 'dd MMM yyyy')#" },
                { field: "ModifyBy", title: 'Modify By' }*/
            ]
        },
        conditions: [
            { field: "UserId", title: 'User Id', type: 'text', dataType: 'string' },
            { field: "DisplayName", title: 'Name', type: 'text', dataType: 'string' },
            { field: "Company", title: 'Company', type: 'text', dataType: 'string' },
            { field: "LastModifiedOn", title: 'Date Modified', type: 'date', dataType: 'datetime' }
        ],
        data: []
    }

    models.MaintainUser = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "User",
        headers: [{ title: 'User Id', field: "UserId" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [{ text: 'Basic Information', page: { url: "eworkspace.ViewModel.UserDetails", Id: "userdetail" } },
        { text: 'Roles', page: { url: "eworkspace.ViewModel.AssignRoles", Id: 'userRole' } },
            { text: '2nd Factor Authentication', page: { url: "eworkspace.ViewModel.User2FASetting", Id: 'user2ndFA' }, dataSourceField: 'SFASettings' }],
        content: [
            {
                title: 'Summary',
                items: [
                    {
                        type: 'databind',
                        items: [
                            { title: 'User Id', field: "UserId" },
                            { title: 'Name', field: "DisplayName" },
                            { title: 'Email', field: "Email" },
                            { title: 'Company', field: "Company" },
                            //{ title: "Date Create", field: "DateCreate" }, { title: 'Create By', field: "CreateBy" },
                            //{ title: "Date Modify", field: "DateModify" }, { title: 'Modify By', field: "ModifyBy" }
                        ]
                    }
                ]
            }
        ]
    }

    models.MaintainADUser = {
        toolBarItems: [
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "AD User",
        headers: [{ title: 'User Id', field: "UserId" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [{ text: 'Basic Information', page: { url: "eworkspace.ViewModel.UserDetails", Id: "userdetail" } }, { text: 'Roles', page: { url: "eworkspace.ViewModel.AssignRoles", Id: 'userRole' } }, { text: '2nd Factor Authentication', page: { url: "eworkspace.ViewModel.User2FASetting", Id: 'user2ndFA' }, dataSourceField: 'User2FAList' }],
        content: [
            {
                title: 'Summary',
                items: [
                    {
                        type: 'databind',
                        items: [
                            { title: 'User Id', field: "UserId" },
                            { title: 'Name', field: "DisplayName" },
                            { title: 'Email', field: "Email" },
                            { title: 'Company', field: "Company" },
                            //{ title: "Date Create", field: "DateCreate" }, { title: 'Create By', field: "CreateBy" },
                            //{ title: "Date Modify", field: "DateModify" }, { title: 'Modify By', field: "ModifyBy" }
                        ]
                    }
                ]
            }
        ]
    }

    models.DashboardList = {
        title: "Dashboards",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainDashboard", Id: "maintainDb" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainDashboard", Id: "editDb" } },
            { text: "DELETE", name: "fa-trash" }
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 500,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Name", title: 'Name' },
                { field: "IsPublish", title: 'Publish?' },
                { field: "IsDefault", title: 'Default?' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#" },
                { field: "CreateBy", title: 'Create By' }*/
            ]
        },
        conditions: [
            {
                field: "ViewModelName", title: 'Class Name', type: 'text', dataType:"string" },
            { field: "Name", title: 'Description', type: 'text', dataType: "string"},
            { field: "IsPublish", title: 'Publish?', type: 'text', dataType: "string" }
        ],
        data: []
    }

    models.MaintainDashboard = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Dashboard",
        headers: [{ title: 'Name', field: "Name" }, { title: 'Publish?', field: "IsPublish" }, { title: "Last Modify On", field: "LastModifiedOn" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [
            { text: 'Configuration', page: { url: "eworkspace.ViewModel.DashboardDetails", Id: "dashboardetail" } },
            { text: 'Share to Roles', page: { url: "eworkspace.ViewModel.ShareDashboard", Id: 'shareDBtoRole' } },
            { text: 'Share to Users', page: { url: "eworkspace.ViewModel.ShareDashboardToUser", Id: 'shareDBtoUser' } },
        ],
        content: [
            {
                title: 'Summary',
                items: [
                    {
                        type: 'databind',
                        items: [
                            { title: 'Name', field: "Name" },
                            { title: 'Default?', field: "IsDefault" },
                            { title: 'Publish?', field: "IsPublish" },
                         ]
                    }
                ]
            }
        ]


    }

    models.AssignRoles = {
        title: "Assign To:",
        checkedIds: {},
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 5
            },
            height: 300,
            selectable: true,
            filterable: true,
            scrollable: true,
            //sortable: true,
            pageable: true,
            columns: [
                { field: 'Id', template: "<input type='checkbox' class='checkbox'  />", width: "80px", headerTemplate: '<input type="checkbox" name="check-all" />' },
                { field: "Name", title: 'Name' },
                { field: "Description", title: 'Description' }
            ]
        }
    }

    models.AssignUsersToRole = {
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
            pageable: true,
            columns: [
                { field: "UserId", title: 'Id' },
                { field: "DisplayName", title: 'Name' }
            ]
        }
    }

    models.Permission = {
        title: "Menus:",
        checkedIds: {},
        treeModel: {
            id: "Id",
            parentId: "ParentId"
        },
        gridOptions: {
            dataSource: {
                data: null,
            },
            //height: 300,
            scrollable: true,
            selectable: true,
            pageable: false,
            columns: [
                { template: "<input type='checkbox' class='checkbox' />", width: "80px", headerTemplate: '<input class="checkAll" type="checkbox" name"check-all" />' },
                { field: "Name", title: "Name", expandable: true },
                { field: "PageDescription", title: "Description" }
            ]
        }
    }

    models.ModulePermission = {
        title: "Resources",
        treeModel: {
            id: "Id"
        },
        gridOptions: {
            dataSource: {
                data: null,
                schema: {
                    model: { expanded :true}
                }
            },
            height: 260,
            scrollable: true,
            selectable: true,
            pageable: false,
            columns: [
                { field: "Name", title: "Resource Name", expandable: true },
                { field: "Description", title: "Description", width: "300px", headerAttributes: { style: "white-space: normal" } },
                { template: "<input type='checkbox' class='checkbox read'  />", width: "100px", headerTemplate: '<input class="checkAll read" type="checkbox"  /><span style="margin-left:5px">Read</span>' },
                { template: "<input type='checkbox' class='checkbox write' />", width: "100px", headerTemplate: '<input class="checkAll write" type="checkbox"  /><span style="margin-left:5px">Write</span>' },
                { field: "ResourceType", title: "Type", width: "20%" }
            ]
        }
    }

    models.MenuList = {
        title: "Menus",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainMenu", Id: "maintainmenu" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainMenu", Id: "maintainmenu" } },
            { text: "DELETE", name: "fa-trash" }
        ]
        ,
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'Id', hidden:true },
                { field: "Name", title: 'Name' },
                { field: "ParentName", title: 'Parent' },
                { field: "PageDescription", title: 'Page' },
                { field: "Widget", title: 'Widget' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#" },
                { field: "CreateBy", title: 'Create By' },
                { field: "DateModify", title: 'Date Modify', template: "#=convertToDateString(DateModify, 'dd MMM yyyy')#" },
                { field: "ModifyBy", title: 'Modify By' }*/
            ]
        },
        conditions: [
            { field: "Name", title: 'Name', type: 'text' },
            { field: "ParentName", title: 'Parent', type: 'text' },
            { field: "PageDescription", title: 'Page', type: 'text' }
        ],
        data: []
    }

    models.MaintainMenu = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Menu",
        headers: [{ title: 'Id', field: "Id" }, { title: 'Name', field: "Name" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: "Parent", field: "ParentName" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [{ text: 'Basic Information', page: { url: "eworkspace.ViewModel.MenuDetails", Id: "menudetail" } }, { text: 'Roles', page: { url: "eworkspace.ViewModel.AssignRolesToMenu", Id: 'menuRole' } }],
        content: [
            {
                title: 'Summary',
                items: [
                    {
                        type: 'databind',
                        items: [{ title: 'Name', field: "Name" }, { title: 'Icon', field: "Icon" },
                        { title: 'Page', field: "PageDescription" }, { title: 'Parent', field: "ParentName" },
                        { title: "Order Id", field: "OrderId" }]
                    }
                ]
            }
        ]
    }

    models.Contacts = {
        title: "Contact",
        gridOptions: {
            dataSource: {
                data: []
            },
            height: 350,
            scrollable: true,
            sortable: true,
            columns: [
                { field: "ContactName", title: 'Name' },
                { field: "ContactEmail", title: 'Email' },
                { field: "Mobile", title: 'Mobile' }
            ]
        }
    }

    models.ContactList = {
        title: "Contacts",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainContact", Id: "maintaincontact" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainContact", Id: "maintaincontact" } },
            { text: "DELETE", name: "fa-trash" }
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "ContactName", title: 'Name' },
                { field: "ContactEmail", title: 'Email' },
                { field: "Company", title: 'Company' },
                { field: "Mobile", title: 'Mobile' },
                { field: "Extension", title: 'Tel' }
            ]
        },
        conditions: [
            { field: "ContactName", title: 'Name', type: 'text' },
            { field: "ContactEmail", title: 'Email', type: 'text' },
            { field: "Company", title: 'Company', type: 'text' },
            { field: "Mobile", title: 'Mobile', type: 'text' },
            { field: "Extension", title: 'Tel', type: 'text' }
        ],
        data: []
    }

    models.MaintainContact = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" },
            { template: "<button><span class='fas fa-cloud'></span><span data-i18n='SELECT CONTACT'>SELECT CONTACT</span></button>" }
        ],
        title: "Contact",
        headers: [{ title: 'Name', field: "ContactName" }, { title: "Mobile", field: "Mobile" }, { title: 'Owner', field: "UserId" }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.ContactDetails", Id: "contactdetail" }
                    }
                ]
            }
        ]

    }

    models.RoleList = {
        title: "Roles",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainRole", Id: "maintainrole" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainRole", Id: "maintainrole" } },
            { text: "DELETE", name: "fa-trash" }
        ]
        ,
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'Id', hidden:true },
                { field: "Name", title: 'Name' },
                { field: "Description", title: 'Description' },
                { field: "LastModifiedOn", title: 'Date Modify', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
            ]
        },
        conditions: [
            { field: "Name", title: 'Name', type: 'text' },
            { field: "Description", title: 'Description', type: 'text' }
        ],
        data: []
    }

    models.MaintainRole = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Role",
        headers: [{ title: 'Id', field: "Id" }, { title: 'Role', field: "Name" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [{ text: 'Define Role', page: { url: "eworkspace.ViewModel.RoleDetails", Id: "roledetail" }  },
        { text: 'Assign Role', page: { url: "eworkspace.ViewModel.AssignRoleToUsers", Id: "assignRoleToUsers" } },
        { text: '2FA Settings', page: { url: "eworkspace.ViewModel.Assign2FAToRole", Id: "assign2FAToRole" } },
        { text: 'Widget Settings', page: { url: "eworkspace.ViewModel.MaintainWidgetSettings", Id: "widgetSettings" } },
        { text: 'Module Permissions', page: { url: "eworkspace.ViewModel.MaintainModulePermssions", Id: "permissionSettings" }, visible:false }
        ],
        content: [
            {
                title: 'Summary',
                items: [
                    {
                        type: 'databind',
                        items: [{ title: "Id", field: "Id" },
                        { title: 'Name', field: "Name" },
                        { title: 'Description', field: "Description" }]
                    }]
            }
        ]
    }

    models.ViewList = {
        title: "Views",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainView", Id: "newView" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainView", Id: "editView" } },
            { text: "DELETE", name: "fa-trash" },
            //{ text: "CUSTOMIZE", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainView", Id: "customizeView" } },
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Name", title: 'Class Name' },
                { field: "Description", title: 'Description' },
                { field: "Widget", title: 'Widget' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }

            ]
        },
        conditions: [
            { field: "Name", title: 'Class Name' },
            { field: "Description", title: 'Description' },
            { field: "Widget", title: 'Widget' }
        ],
        data: []
    }

    models.MaintainView = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "View",
        headers: [{ title: 'Widget', field: "Widget" }, { title: 'Type', field: 'ViewModelType' }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.ViewDetails", Id: "viewdetail" }
                    },
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.ModelForm", Id: "modeldetail" }
                    }
                ]
            }
        ]

    }
    models.PageList = {
        title: "Page",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainPage", Id: "maintainpage" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainPage", Id: "maintainpage" } },
            { text: "DELETE", name: "fa-trash" }
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'ID', hidden: true },
                { field: "Url", title: 'Page Url' },
                { field: "Description", title: 'Description' },
                { field: "WidgetName", title: 'Widget', width: '145px' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#", width: '145px' },
                { field: "DateModify", title: 'Date Modify', template: "#=convertToDateString(DateModify, 'dd MMM yyyy')#", width: '145px' }*/
            ]
        },
        conditions: [
            { field: "Url", title: 'Url', type: 'text' },
            { field: "Description", title: 'Description', type: 'text' }
        ],
        data: []
    }

    models.MaintainPage = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Page",
        headers: [{ title: "Id", field: "Id" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: 'Create By', field: "LastModifiedBy" }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.PageDetails", Id: "pagedetail" }
                    }
                ]
            }
        ]
    }

    models.WidgetList = {
        title: "Widgets",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainWidget", Id: "maintainwidget" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainWidget", Id: "maintainwidget" } },
            { text: "DELETE", name: "fa-trash" }
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'ID' },
                { field: "Name", title: 'Name' },
                { field: "InstanceName", title: 'Instance Name' },
                { field: "Description", title: 'Description' },
                { field: "ServiceUrl", title: 'Service Url' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#" },
                { field: "CreateBy", title: 'Create By' },
                { field: "DateModify", title: 'Date Modify', template: "#=convertToDateString(DateModify, 'dd MMM yyyy')#" },
                { field: "ModifyBy", title: 'Modify By' }*/
            ]
        },
        conditions: [
            { field: "Name", title: 'Name', type: 'text' },
            { field: "InstanceName", title: 'Instance Name', type: 'text' },
            { field: "Description", title: 'Description', type: 'text' }
        ],
        data: []
    }

    models.MaintainWidget = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Widget",
        headers: [{ title: "Widget", field: "Name" }, { title: "Date Last Modify", field: "LastModifiedOn" }, { title: 'Owner', field: "LastModifiedBy" }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.WidgetDetails", Id: "widgetdetail" }
                    },
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.ResourceFileDetails", Id: 'resoucedetail' }
                    }
                ],
                columnLength: 1
            }
        ]
    }

    models.ResourceDetails = {
        title: "Resource Files:",
        gridDataSourceField: "Resources",
        gridOptions: {
            dataSource: {
                data: []
            },
            height: 300,
            selectable: false,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: false,
            columns: [
                { field: "FileName", title: "File Name" },
                { field: "CreatedOn", title: "Date Upload", template: "#=convertToDateString(CreatedOn, 'dd MMM yyyy')#" },
                { field: "CreatedBy", title: "Upload by" },
                { field: "LastModifiedOn", title: "Date Modified", template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy')#" },
                { field: "LastModifiedBy", title: "Modify by" },
                { command: ["destroy"], title: "&nbsp;" }
            ],
            editable: "inline"
        }
    }

    models.Chart = {
        title: "",
        chartType: "",
        categoryField: "",
        data: [],
        filters: [],
        chartOptions: {
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "line"
            },
            valueAxis: {
                line: {
                    visible: false
                }
            },
            categoryAxis: {
                //field: "",
                crosshair: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                template: "#= series.name #: #= value #"
            }
        }
    }

    models.List = {
        title: "",
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
            columns: []
        }
    }

    models.LogList = {
        title: "Audit Trail",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" }
           /* { text: "DELETE", name: "fa-trash" }*/
        ],
        filters: [
            {
                id: 'module',
                width: '20%',
                items: [ { text: 'Platform', value: null }]
            }
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10,
                serverPaging: true,
                schema: {
                    data: 'Items',
                    total: 'RowCount'
                }
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { template: "<input type='checkbox' class='checkbox' />", width: "40px", headerTemplate: '<input type="checkbox" name"check-all"  class="checkAll"/>' },
                { field: "Id", title: 'Key',hidden:true },
                {
                    field: "Timestamp", title: 'Timestamp', width: '150px', template: "#=convertToDateString(Timestamp, 'dd MMM yyyy HH:mm:ss')#",
                    headerAttributes: { style: "white-space: normal" }
                },
                { field: "TableName", title: 'Module', width: '200px', template: "#=TableName.split('_')[0]#", headerAttributes: { style: "white-space: normal" } },
                { field: "Info", title: 'Description' },
                { field: "Action", title: 'Action', width: '150px' },
                { field: "UserName", title: 'User', width: '180px',headerAttributes: { style: "white-space: normal" } },
            ]
        },
        conditions: [
            { field: "TableName", title: 'Module', type: 'text', dataType: 'string' },
            { field: "Timestamp", title: 'Timestamp', type: 'date', dataType: 'datetime' },
            { field: "Info", title: 'Description', type: 'text', dataType: 'string' },
            {
                field: "Action", title: 'Action', type: 'listvalue', dataType: 'string',
                values: [
                    { name: 'Added', value: 'Added' },
                    { name: 'Modified', value: 'Modified' },
                    { name: 'Deleted', value: 'Deleted' },
                    { name: 'SoftDeleted', value: 'SoftDeleted' }
                ]
            }
        ],
        /*queries: [
            {
                name: 'default', editable: false, filters: [
                    { field: "TableName", value: "", operator: "==" },
                    {
                        joinoperator: 'Or', criterias: [
                            { field: "Timestamp", value: new Date(), operator: "==", joinoperator: "Or" },
                            { field: "Action", value: "Deleted", operator: "==", joinoperator: "And" }
                        ]
                    }
                   
                ], isDefault:true
            }
        ],*/
        data: []
    }

    models.WebsiteList = {
        title: "Websites",
        buttons: [
            { text: "ADVANCE SEARCH", name: "fa-search" },
            { text: "NEW", name: "fa-plus", page: { url: "eworkspace.ViewModel.MaintainWebsite", Id: "maintainwebsite" } },
            { text: "EDIT", name: "fa-pencil-alt", page: { url: "eworkspace.ViewModel.MaintainWebsite", Id: "maintainwebsite" } },
            { text: "DELETE", name: "fa-trash" }
        ],
        filters: [
        ],
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 10
            },
            height: 600,
            selectable: true,
            groupable: true,
            filterable: false,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Id", title: 'ID', hidden:true },
                { field: "Name", title: 'Name' },
                { field: "HomePage", title: 'Home Page' },
                { field: "LastModifiedOn", title: 'Date Modified', template: "#=convertToDateString(LastModifiedOn, 'dd MMM yyyy HH:mm:ss')#" },
                { field: "LastModifiedBy", title: 'Modify By' }
                /*{ field: "DateCreate", title: 'Date Create', template: "#=convertToDateString(DateCreate, 'dd MMM yyyy')#" },
                { field: "CreateBy", title: 'Create By' },
                { field: "DateModify", title: 'Date Modify', template: "#=convertToDateString(DateModify, 'dd MMM yyyy')#" },
                { field: "ModifyBy", title: 'Modify By' }*/
            ]
        },
        conditions: [
            { field: "Name", title: 'Name', type: 'text', dataType: 'string' },
            { field: "HomePage", title: 'Home Page', type: 'text', dataType: 'string' }
        ],
        data: []
    }

    models.MaintainWebsite = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-times'></span><span data-i18n='CLOSE'>CLOSE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" }
        ],
        title: "Website",
        headers: [{ title: "Id", field: "Id" }, { title: "Modified On", field: "LastModifiedOn" }, { title: 'Modified By', field: "LastModifiedByName" }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.WebsiteDetails", Id: "websitedetail" }
                    }
                ]
            }
        ]
    }

    models.AssignRoleToUserList = {
        title: "Search Results:",
        checkedIds: {},
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 5
            },
            height: 300,
            selectable: true,
            filterable: false,
            scrollable: true,
            sortable: false,
            pageable: true,
            columns: [
                { template: "<input type='checkbox' class='checkbox' />", width: "80px", headerTemplate: '<input type="checkbox" name"check-all" />' },
                { field: "UserId", title: 'Id' },
                { field: "UserName", title: 'Name' },
                { field: "Email", title: 'Email' },
                { field: "Company", title: 'Company' },
            ]
        }
    }

    models.MaintainWidgetSettings = {
        title: "Parameters:",
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 5
            },
            height: 300,
            selectable: true,
            filterable: true,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { field: "Name", title: 'Name' },
                { field: "Value", title: 'Value' }
            ]
        }
    }

    models.MaintainClient = {
        toolBarItems: [
            { template: "<button><span class='fa fa-plus'></span><span data-i18n='NEW'>NEW</span></button>" },
            { template: "<button><span class='fa fa-save'></span><span data-i18n='SAVE'>SAVE</span></button>" },
            { template: "<button><span class='fa fa-trash'></span><span data-i18n='DELETE'>DELETE</span></button>" },
            { template: "<button><span class='fas fa-file-export'></span><span data-i18n='EXPORT'>EXPORT</span></button>" },
        ],
        title: "Client",
        headers: [{ title: "Name", field: "Name" }, { title: "Last Modified On", field: "LastModifiedOn" }, { title: 'Last Modify By', field: "LastModifiedByName" }],
        data: null,
        navigation: [],
        content: [
            {
                title: '',
                items: [
                    {
                        type: 'page',
                        page: { url: "eworkspace.ViewModel.ClientDetails", Id: "clientdetail" }
                    }
                ],
                columnLength: 1
            }
        ]
    }

    models.ClientDetails = {
        title: '',
        gridDataSourceField: 'Clients',
        gridOptions: {
            dataSource: {
                data: [],
                pageSize: 5
            },
            height: 300,
            selectable: true,
            filterable: true,
            scrollable: true,
            sortable: true,
            pageable: true,
            columns: [
                { 'field': 'ClientId', 'title': 'Client Id' },
                { 'field': 'Name', 'title': 'Name' },
                { 'field': 'AllowOrignal', 'title': 'Domain' },
                { 'field': 'EnableSSO', 'title': 'SSO?' },
                { 'field': 'Enable2FA', 'title': 'MFA?' },
                { 'field': 'EnableRefreshToken', 'title': 'Refresh Token?' }
            ]
        }
    };

    return models;
})
