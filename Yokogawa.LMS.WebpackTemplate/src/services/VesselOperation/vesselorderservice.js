import { AppConfig, eworkspace, utils } from '../../global'

function getWorkflowInfo(callback) {
    var json = [
        { type: 'image', point: [40, 10], size: [62, 62], url: "img/workflow/wf_pending.png", tip: { text: null }, content: { text: "Schedule", pos: [0, 0], from: 1 }, page: { url: "VesselOrder.ViewModel.VesselSchehduleList", Id: "scheduleList", params: [1] } },
        { type: 'linearrow', starIndex: 0, endIndex: 2, content: { text: "Add Order", index: 0, pos: [-57, 30] } },
        { type: 'image', point: [40, 160], size: [62, 62], url: "img/workflow//wf_info.png", tip: { text: null }, content: { text: ["New Order"], pos: [-10, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: "newOrderList", params: [1] } },
        { type: 'linearrow', starIndex: 2, endIndex: 4, content: { text: "Add B/L", index: 0, pos: [-50, 30] } },
        { type: 'image', point: [40, 310], size: [62, 62], url: "img/workflow/wf_request.png", tip: { text: null }, content: { text: ["Order with B/L"], pos: [-10, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: "orderWithBLList", params: [2] } },
        { type: 'linearrow', starIndex: 4, endIndex: 6, content: { text: "Add Jobs", index: 0, pos: [-50, 30] } },
        { type: 'image', point: [40, 464], size: [62, 62], url: "img/workflow/wf_info.png", tip: { text: null }, content: { text: ["Planned Order"], pos: [-10, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: 'plannedOrderList', params: [3] } },
        { type: 'linearrow', starIndex: 6, endIndex: 8, content: { text: "Execute", index: 0, pos: [-50, 30] } },
        { type: 'image', point: [40, 635], size: [62, 62], url: "img/workflow/wf_checksheet.png", tip: { text: null }, content: { text: "Active Orders", pos: [-10, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: 'activeOrderList', params: [4] } },
        { type: 'linearrow', starIndex: 8, endIndex: 10, content: { text: "Finish Jobs", index: 0, pos: [15, -15] } },
        { type: 'image', point: [202, 635], size: [62, 62], url: "img/workflow/wf_approved.png", tip: { text: null }, content: { text: "Batch End Orders", pos: [-10, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: 'batchEndOrderList', params: [5] } },
        { type: 'linearrow', starIndex: 10, endIndex: 12, content: { text: "Confirm BOL", index: 0, pos: [-42, -50] } },
        { type: 'image', point: [202, 464], size: [62, 62], url: "img/workflow/wf_info.png", tip: { text: null }, content: { text: "Pending Print", pos: [-10, 0], from: 3 }, page: { url: "VesselOrder.ViewModel.ShipmentDocumentList", Id: 'confirmBLList', params: [6] } },
        { type: 'linearrow', starIndex: 12, endIndex: 14, content: { text: "Depart", index: 0, pos: [-40, -50] } },
        { type: 'image', point: [202, 310], size: [62, 62], url: "img/workflow/wfp_finish.png", tip: { text: null }, content: { text: "Complete", pos: [-10, 0], from: 1 }, page: { url: "VesselOrder.ViewModel.VesselSchehduleList", Id: 'completeList', params: [8] } },
        { type: 'image', point: [202, 10], size: [62, 62], url: "img/workflow/wf_reject.png", tip: { text: null }, content: { text: ["Cancelled Schedule"], pos: [0, 0], from: 1 }, page: { url: "VesselOrder.ViewModel.VesselSchehduleList", Id: "rejectList", params: [9] } },
        { type: 'image', point: [202, 160], size: [62, 62], url: "img/workflow/wf_reject.png", tip: { text: null }, content: { text: ["Cancelled Order"], pos: [0, 0], from: 2 }, page: { url: "VesselOrder.ViewModel.VesselOrderList", Id: "cancelledOrderList", params: [99] } },
        { type: 'linearrow', points: [[40, 191], [20, 191], [20, 495], [40, 495]], content: { text: "Add Jobs", index: 3, pos: [-40, -200] }, stroke: { color: 'blue', width: 4 } },
        { type: 'linearrow', starIndex: 0, endIndex: 15, content: { text: "Cancel", index: 0, pos: [30, 5] }, stroke: { color: '#F9A73B', width: 4 } },
        { type: 'linearrow', starIndex: 2, endIndex: 16, content: { text: "Cancel", index: 0, pos: [30, 5] }, stroke: { color: '#F9A73B', width: 4 } },
        { type: 'linearrow', starIndex: 4, endIndex: 16, content: { text: "Cancel", index: 0, pos: [20, -80] }, stroke: { color: '#F9A73B', width: 4 } },
        { type: 'linearrow', starIndex: 6, endIndex: 16, content: { text: "Cancel", index: 0, pos: [10, -30] }, stroke: { color: '#F9A73B', width: 4 } },
    ];

    VesselOrder.Services.getStatusSummary(json, callback);
}

function getStatusSummary(workflowUIData, callback) {
    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/CustomerOrder/TotalSummaryStep',
        cache: false,
        success: function (summary) {
            var json = utils.cloneModel(workflowUIData);

            json.forEach(function (item) {

                if (item.tip) {
                    var flowStep = parseFloatValue(item.page.params[0]);
                    var fromTable = parseFloatValue(item.content.from);

                    var objTotalSummary = $.grep(summary, function (sitem) { return sitem.FlowStep === flowStep && sitem.FromTable === fromTable; })[0];

                    if (objTotalSummary != null) {
                        item.tip.text = objTotalSummary.TotalCount > 0 ? objTotalSummary.TotalCount.toString() : null;
                    }
                }

                //var statusId = item.statusId != null ? item.statusId.toString() : '';
                //if (summary[statusId] != null) {
                //    item.tip = item.tip == null ? { text: null } : item.tip;
                //    item.tip.text = summary[statusId].Total > 0 ? summary[statusId].Total.toString() : null;
                //}

                //if (item.page != null) {
                //    item.page.displayParams = [];
                //    item.page.displayParams.push(item.statusId);
                //    item.page.params = [];
                //    item.page.params.push(item.statusId); 
                //}

            });


            if ($.isFunction(callback)) callback(json);
        },
        error: function (xhr) {
            alert('Service Error(get workflow total summary):' + xhr.responseText);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    };
    eworkspace.Services.callApi(apiOption);
    //var json = utils.cloneModel(workflowUIData);
    //if ($.isFunction(callback)) callback(json);
};

export { getWorkflowInfo, getStatusSummary}
