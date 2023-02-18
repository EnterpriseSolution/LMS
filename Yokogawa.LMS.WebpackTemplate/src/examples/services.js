import $ from 'jquery';

const list = [
      {id:1, title:'Tom'},
      {id:2, title:'Jerry'},
      {id:3, title:'John'},
      {id:4, title:'Jane'}
];

const users = [];
function getPanelData(callback){
   var json = {};
    json.diagram = [
               { type: 'image', point: [40, 10], size: [62, 62], url: "img/wf_request.png", tip: { text: null }, content: { text: "Request", pos: [0, 0] }, page: null, statusId: 1 },
               { type: 'linearrow', starIndex: 0, endIndex: 2, content: { text: "Submit", index: 0, pos: [5, 30] } },
               { type: 'image', point: [40, 177], size: [62, 62], url: "img/wf_pending.png", content: { text: ["Pending Dept Manager", "Approval"], pos: [-10, 0] }, page: null, statusId: 2 },
               { type: 'linearrow', starIndex: 2, endIndex: 4, content: { text: "Approve", index: 0, pos: [-50, 30] } },
               { type: 'image', point: [40, 344], size: [62, 62], url: "img/wf_pending.png", content: { text: ["Pending Finance", "Review"], pos: [-10, 0] }, page:null, statusId: 3 },
               { type: 'linearrow', starIndex: 4, endIndex: 6, content: { text: "Approve", index: 0, pos: [-50, 70] } },
               { type: 'image', point: [40, 581], size: [62, 62], url: "img/wf_pending.png", content: { text: ["Pending Finance Manager", "Approval"], pos: [-10, 0] }, page:null, statusId: 4 },
               { type: 'linearrow', starIndex: 6, endIndex: 8, content: { text: "Approve", index: 0, pos: [30, 0] } },
               { type: 'image', point: [202, 581], size: [62, 62], url: "img/wf_info.png", content: { text: "Pending YGS Entry", pos: [-10, 0] }, page: null, statusId: 5 },
               { type: 'linearrow', starIndex: 8, endIndex: 10, content: { text: "Complete", index: 0, pos: [5, -60] } },
               { type: 'image', point: [202, 408], size: [62, 62], url: "img/wfp_finish.png", content: { text: "Complete", pos: [-10, 0] }, page: null, statusId: 6 },
               { type: 'image', point: [202, 10], size: [62, 62], url: "img/wf_request.png", tip: { text: null }, content: { text: ["Rejected Requests"], pos: [0, 0] }, page: null, statusId: 7 },
               { type: 'linearrow', starIndex: 11, endIndex: 0, content: { text: "Save", index: 0, pos: [-60, 5] } },
               { type: 'linearrow', starIndex: 11, endIndex: 2, content: { text: "Submit", index: 0, pos: [-80, 30] } },
               { type: 'linearrow', points: [[40, 630], [10, 630], [10, 375], [40, 375]], content: { text: "Reject", index: 1, pos: [5, -60] }, stroke: { color: '#F9A73B', width: 4 } },
               { type: 'linearrow', points: [[102, 376], [242, 376], [242, 92]], content: { text: "Reject", index: 1, pos: [5, -60] }, stroke: { color: '#F9A73B', width: 4 } },
               { type: 'linearrow', points: [[102, 209], [222, 209], [222, 92]], content: { text: "Reject", index: 1, pos: [-40, -60] }, stroke: { color: '#F9A73B', width: 4 } },
               
        ];
        
getUsers(function(){
json.data=users[1];
callback(json);
})
        
}
function getUsers(callback){
    $.ajax({
        type: "GET",
        url: "users.json", // Using our resources.json file to serve results
        success: function(result) {
            result.users.forEach(function(item){
                users.push(item);
            })

            if ($.isFunction(callback))
                callback();
        },
        error: function (xhr) {
            alert('Service Error(get users):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    })
}

function getList(callback){
 if ($.isFunction(callback))
      callback(list)
}

function getListByCount(count=2,callback){
    var data= list.slice(0,count-1);
    if ($.isFunction(callback))
        callback(data)
}

function getDetails(callback){
  let id=1;
  let json= id==1?list[0]:(id==2?list[1]:[]);
  if ($.isFunction(callback))
      callback(json);
}

function getUserDetails(id,callback){
    
    let data = $.grep(users, function(user){
        return user.id == id;
    } )
    data = data.length>0?data[0]:users[0];

    if ($.isFunction(callback))
        callback(data);
}

function createNewUser(callback, failCallback){
    $.ajax({
        type: "GET",
        url: "users.json", // Using our resources.json file to serve results
        success: function(result) {
            console.info('retrieve users from api')
            if (users.length==0)
            result.users.forEach(function(item){
                item.CompanyList=result.CompanyList;
                users.push(item);
            })

            var data= {id:0,Name:'',Company:null,CompanyList:result.CompanyList}
            
            if ($.isFunction(callback))
                callback(data);
        },
        error: function (xhr) {
            alert('Service Error(get users):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    })

}

function saveUser(data,callback)
{
    let list = [];
    var newData = data;
    if (data.id==0)
    {
        newData = {id:users[users.length-1].id+1,Name:data.Name,Company:data.Company,CompanyList:data.CompanyList}
        users.push(newData);
    }else{
        let temp = $.grep(users,function(user){
            return user.id == data.id;
        });
        temp =temp.length>0?temp[0]:null;
        if (temp!=null)
        {
            temp.Name = data.Name;
            temp.Company =data.Company;
        }
    }

    if ($.isFunction(callback))
        callback(newData);
}

function deleteUser(id,callback)
{
    let data = $.grep(users, function(user){
        return user.id != id;
    } )
    users.length=0;
    data.forEach(function(item){
        users.push(item);
    })
    if ($.isFunction(callback))
        callback();
}

export default {getList,getListByCount, getDetails,getUserDetails,createNewUser,saveUser,deleteUser,getUsers,getPanelData}


