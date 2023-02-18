MasteData = {};
Order = {};
Job = {};
VesselOrder = {};
MasteData.StatusColorList = [
    { StatusId: 1, StatusColor: '#428bca', StatusName: "Registered" },
    { StatusId: 2, StatusColor: '#eeac57', StatusName: "Planned" },
    { StatusId: 3, StatusColor: '#29ae9a', StatusName: "Alongside" },
    { StatusId: 4, StatusColor: '#777777', StatusName: "Departured" },
    { StatusId: 99, StatusColor: '#d75452', StatusName: "Cancelled" }
],

MasteData.UomList = [
    { value: 1, text: 'M³@15℃' },
    { value: 2, text: 'M³@Obs.Temp' },
    { value: 3, text: 'Litres@15℃' },
    { value: 4, text: 'Litres@Obs.Temp' },
    { value: 5, text: 'MT' },
    { value: 6, text: 'Long Tons' },
    { value: 7, text: 'US BBLs@60℉' }
],

MasteData.TankType = [
    { value: 0, text: 'Roof Tank' },
    { value: 1, text: 'Sphere Tank' }
],

MasteData.TankStatus = [
    { value: 1, text: 'Valid' },
    { value: 0, text: 'Invalid' }
],

MasteData.CardType = [
    { value: 0, text: 'User Card' },
    { value: 1, text: 'Company Card' },
    { value: 2, text: 'Credit Card' }
],

MasteData.CardStatus = [
    { value: 1, text: 'Valid' },
    { value: 0, text: 'Invalid' }
    ]

Order.OrderSourceType=[
    { value: 1, text: 'Valid' },
    { value: 2, text: 'Invalid' }

]
Order.OrderStatus = [
    { value: 1, text: 'Registered' },
    { value: 2, text: 'InProgress' },
    { value: 3, text: 'Completed' },
    { value: 9, text: 'Hold' },
    { value: 99, text: 'Cancelled' },
    { value: 101, text: 'PreDefined' }
]

Job.Uom = [
    { value: 1, text: 'Valid' },
    { value: 2, text: 'Invalid' }
]

VesselOrder.OrderStatus = [
    { value: 1, text: 'Registered' },
    { value: 2, text: 'InProgress' },
    { value: 3, text: 'Completed' },
    { value: 9, text: 'Hold' },
    { value: 99, text: 'Cancelled' },
    { value: 101, text: 'PreDefined' }
]
