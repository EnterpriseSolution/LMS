import { AppConfig, eworkspace, utils } from '../../global'

function getRFIDCardList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/RFIDCard/rfidcards',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getRFIDCardDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/RFIDCard/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            if (json.ValidDate)
                json.ValidDate = new Date(json.ValidDate);

            json.CardTypeList = MasteData.CardType.map(function (cardtype) {
                return { text: cardtype.text, value: cardtype.value };
            });
            json.CardStatusList = MasteData.CardStatus.map(function (cardStatus) {
                return { text: cardStatus.text, value: cardStatus.value };
            });                

            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteRFIDCard(id, callback) {   
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/RFIDCard/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        }
    };

    eworkspace.Services.callApi(apiOption);
}


function saveRFIDCard(RFIDCard, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/RFIDCard/SaveRFIDCard',
        data: JSON.stringify(RFIDCard),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {            
            utils.showProcessbar(false);
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}

function checkCardExist(cardNo, callback) {
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/RFIDCard/Check/' + cardNo,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

export { getRFIDCardList, getRFIDCardDetails, saveRFIDCard, deleteRFIDCard, checkCardExist }