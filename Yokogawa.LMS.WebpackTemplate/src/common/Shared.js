var isDeLanague = false;
function StringBuilder() {
    this._buffers = [];
    this._length = 0;
    this._splitChar = arguments.length > 0 ? arguments[arguments.length - 1] : '';

    if (arguments.length > 0) {
        for (var i = 0, iLen = arguments.length - 1; i < iLen; i++) {
            this.Append(arguments[i]);
        }
    }
}

Array.prototype.oldPush = Array.prototype.push;

Array.prototype.pushSet = function (obj) {
    var whetherRepeat = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            whetherRepeat = true;
            break;
        }
    }
    if (!whetherRepeat) {
        this.oldPush(obj);
    }
    return whetherRepeat;
}

Array.prototype.pushSetObj = function (obj) {
    var whetherRepeat = false;
    //alert(obj.name);
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == obj.name) {
            whetherRepeat = true;
            break;
        }
    }
    if (!whetherRepeat) {
        this.oldPush(obj);
    }
    return whetherRepeat;
}

StringBuilder.prototype.Append = function (str) {
    str = "" + str;
    this._length += str.length;
    this._buffers[this._buffers.length] = str;
}

StringBuilder.prototype.Add = StringBuilder.prototype.append;
StringBuilder.prototype.AppendFormat = function () {
    if (arguments.length > 1) {
        var TString = arguments[0];
        if (arguments[1] instanceof Array) {
            for (var i = 0, iLen = arguments[1].length; i < iLen; i++) {
                var jIndex = i;
                var re = eval("/\\{" + jIndex + "\\}/g;");
                TString = TString.replace(re, arguments[1][i]);
            }
        }
        else {
            for (var i = 1, iLen = arguments.length; i < iLen; i++) {
                var jIndex = i - 1;
                var re = eval("/\\{" + jIndex + "\\}/g;");
                TString = TString.replace(re, arguments[i]);
            }
        }
        this.Append(TString);
    }
    else if (arguments.length == 1) {
        this.Append(arguments[0]);
    }
}
StringBuilder.prototype.Length = function () {
    if (this._splitChar.length > 0 && (!this.IsEmpty())) {
        return this._length + (this._splitChar.length * (this._buffers.length - 1));
    }
    else {
        return this._length;
    }
}
StringBuilder.prototype.IsEmpty = function () {
    return this._buffers.length <= 0;
}
StringBuilder.prototype.Clear = function () {
    this._buffers = [];
    this._length = 0;
}
StringBuilder.prototype.ToString = function () {
    if (arguments.length == 1) {
        return this._buffers.join(arguments[1]);
    }
    else {
        return this._buffers.join(this._splitChar);
    }
}

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
String.prototype.gblen = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}

String.prototype.gbtrim = function (len, s) {
    var str = '';
    var sp = s || '';
    var len2 = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len2 += 2;
        } else {
            len2++;
        }
    }
    if (len2 <= len) {
        return this;
    }
    len2 = 0;
    len = (len > sp.length) ? len - sp.length : len;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len2 += 2;
        } else {
            len2++;
        }
        if (len2 > len) {
            str += sp;
            break;
        }
        str += this.charAt(i);
    }
    return str;
}

function stringContentCheck(value, param) {
    var length = value.gblen();

    return (length >= param[0] && length <= param[1]);
}

function StringCombine(element) {
    var stringTemp = "";
    var strIndex = 0;
    $(element).each(function () {
        if (strIndex > 0) {
            if ($(this).val() != "") {
                stringTemp += ",";
            }
        }
        stringTemp += $(this).val();
        ++strIndex;
    });
    return stringTemp;
}

function checkNameInput(obj) {
    var val = obj.value;
    var reg = new RegExp("[`~^|\\[\\]<>/~！￥（）|【】‘；：'。，、？]");
    var rs = "";
    if (reg.exec(val)) {
        for (var i = 0, l = val.length; i < val.length; i++) {
            rs = rs + val.substr(i, 1).replace(reg, '');
        }
        obj.value = rs;
        return false;
    }
    return true;
}
function checkNameInput2(obj) {
    var val = obj.value;
    var reg = new RegExp("[`~^|\\[\\]<>/~！￥（）|【】‘；：'。，、？\"]");
    var rs = "";
    if (reg.exec(val)) {
        for (var i = 0, l = val.length; i < val.length; i++) {
            rs = rs + val.substr(i, 1).replace(reg, '');
        }
        obj.value = rs;
        return false;
    }
    return true;
}

function checkJKHInput(obj) {
    var val = obj.value;
    var reg = new RegExp("[<>^~]");
    var rs = "";

    if (reg.exec(val)) {
        for (var i = 0, l = val.length; i < val.length; i++) {
            rs = rs + val.substr(i, 1).replace(reg, '');
        }
        obj.value = rs;
        return false;
    }
    return true;


}

function textCounter(field, maxlimit) {
    if (field.value.length > maxlimit)
        field.value = field.value.substring(0, maxlimit);
}

function textCounterPaster(field, maxlimit) {
    var tempValue = window.clipboardData.getData("Text");

    if (tempValue.length > maxlimit) {
        tempValue = tempValue.substr(0, maxlimit);

        field.value = tempValue;
        window.clipboardData.setData("Text", tempValue);
    }
    window.event.returnValue = true;
}

function dateTimeContentCheck(value) {
    //var isDateTime = /^\d{1,2}\/\d{1,2}\/\d{4}[T ]\d{1,2}\:\d{1,2}$/.test(value);
    var result = value.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);
    if (result == null) return false;

    var d = new Date(result[4], result[3] - 1, result[1], result[5], result[6]);

    if (d.getFullYear() != result[4]) return false;
    if (d.getMonth() != result[3] - 1) return false;
    if (d.getDate() != result[1]) return false;
    if (d.getHours() != result[5]) return false;
    if (d.getMinutes() != result[6]) return false;
    //if (d.getSeconds() != r[6]) return false;
    return true;
}

function dateContentCheck(value) {
    //var isDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value);
    //return isDate;
    var result = value.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);
    if (result == null) return false;

    var d = new Date(result[4], result[3] - 1, result[1]);

    if (d.getFullYear() != result[4]) return false;
    if (d.getMonth() != result[3] - 1) return false;
    if (d.getDate() != result[1]) return false;
    return true;
}

function ComAjax(url, datas, callback) {
    jQuery.ajax({
        type: "post",
        data: datas,
        url: url,
        success: function (data) {
            if (data == "OK") {
                if (callback != null && typeof (callback) != "undefined") {
                    eval(callback + "()");
                }
                //SaveInfo(true, SaveMsg);
            } else {
                //SaveInfo(false, SaveMsg)
            }
        }
    });
}

function ComAjaxJson(url, datas, callback) {
    jQuery.ajax({
        type: "post",
        data: datas,
        url: url,
        dataType: "json",
        success: function (data) {
            if (callback != null && typeof (callback) != "undefined") {
                callback(data);
            }
        }
    });
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
jQuery.jsparams = {
    input: function (Id) {
        return $("#" + Id).val();
    },
    inputSetValue: function (Id, Value) {
        return $("#" + Id).val(Value);
    },
    input_multiple: function (Id) {
        var inputList = $('input[id*=' + Id + ']');
        return StringCombine(inputList);
    },
    textarea: function (Id) {
        return $("#" + Id).val();
    },
    select: function (Id) {
        return $("#" + Id + "  option:selected").val();
    },
    select_multiple: function (Id) {
        var optionList = $("#" + Id + "  option:selected");
        return StringCombine(optionList);
    },
    check: function (Id) {
        return $("#" + Id).attr("checked") == "checked" ? true : false;
    },
    checkByName: function (Name) {
        var Ids = "";
        $("input[name='" + Name + "']").each(function (index, domEle) {
            if ($(this).attr("checked") == "checked") {
                Ids += $(domEle).val() + ",";
            }
        });
        return Ids;
    },
    checkAll: function (Name) {
        $("input[name='" + Name + "']").each(function (index, domEle) {
            $(domEle).attr('checked', true);
        });
    },
    checkAllByParms: function (Name, IsSelected) {
        $("input[name='" + Name + "']").each(function (index, domEle) {
            $(domEle).attr('checked', IsSelected);
        });
    },
    radio: function (name) {
        return $('input:radio[name=' + name + ']:checked').val();
    },
    radioIsChecked: function (name) {
        return $('input:radio[name=' + name + ']:checked');
    },
    getAttrValue: function (domEle, attrname) {
        return domEle.attr(attrname);
    }
};
//Check Input Start 
function checkNum(num) {//onkeyup = "value=value.replace(/[^\d]/g,'')"
    if (num != "") {
        var regex = /^[0-9]{1,20}$/;
        if (!regex.exec(num)) {
            return false;
        }
        return num.length <= 12;
    }
    return false;
}
function checkDecimal(num, canbeminus) {//浮点数 + 0） 
    if (num != "") {
        var regex = /^\d+(\.\d+)?$/;
        if (canbeminus != undefined && canbeminus) regex = /^(-?\d+)(\.\d+)?$/;
        if (!regex.exec(num)) return false;

        var pointIndex = num.indexOf(".");
        if (pointIndex > 0) {
            return num.substring(0, pointIndex).length <= 12;
        }
        return num.length <= 12;
    }
    return false;
}
function checkDecimal1Digit(num) {//非负浮点数后1位小数（正浮点数 + 0）
    if (num != "") {
        var regex = /^\d+(\.\d{0,1})?$/;
        if (!regex.exec(num)) return false;

        var pointIndex = num.indexOf(".");
        if (pointIndex > 0) {
            return num.substring(0, pointIndex).length <= 12;
        }
        return num.length <= 12;
    }
    return false;
}
function checkInteger(num) {//匹配整数 正+负+0
    if (num != "") {
        if (num == "0")
            return true;
        var regex = /^-?[1-9]\d*$/;
        if (!regex.exec(num)) {
            return false;
        }
        return num.length <= 12;
    }
    return false;
}
function checkNonNegativeInteger(num) {
    if (num != "") {
        if (num == "0")
            return true;
        var regex = /^[1-9]\d*$/;
        if (!regex.exec(num)) {
            return false;
        }
        return true;
    }
    return false;
}
function checkDate(date) {
    var result = date.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);

    if (result == null || result[4].length != 4 || result[3].length != 2 || result[1].length != 2)
        return false;
    var d = new Date(result[4], result[3] - 1, result[1]);
    return (d.getFullYear() == result[4] && (d.getMonth() + 1) == result[3] && d.getDate() == result[1]);
}
function checkDateTime(dateTime) {//eg:22/01/2014 00:00
    var dateList = dateTime.split(" ");
    if (dateList.length != 2) return false;
    var timeList = dateList[1].split(":");
    if (timeList.length != 2) return false;
    if (timeList[0].length != 2 || timeList[1].length != 2) return false;
    var result = dateList[0].match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);

    if (result == null || result[4].length != 4 || result[3].length != 2 || result[1].length != 2)
        return false;
    var d = new Date(result[4], result[3] - 1, result[1]);
    return (d.getFullYear() == result[4] && (d.getMonth() + 1) == result[3] && d.getDate() == result[1]);
}
function intcheckInteger(num) {
    var reg = "^[0-9]*[1-9][0-9]*$";
    if (!num.match(reg)) {
        return false;
    } else {
        return true;
    }
}
//Check Input End

//Rang is 0-100
function IntRangCheck(num) {
    var reg = /^(0|[1-9]\d?|100)$/;
    if (!num.match(reg)) {
        return false;
    } else {
        return true;
    }
}
//Control Input Start
function controlInputInteger(event, hasMinus) {
    var keyCode = event.keyCode || event.charCode;
    if (hasMinus != undefined && hasMinus && (keyCode == 173 || keyCode == 189))
        return true;
    if (keyCode == 32 || keyCode == 59 || keyCode == 61 || keyCode == 173 || keyCode >= 65 && keyCode <= 90 || keyCode >= 106 && keyCode <= 108 || keyCode >= 186 && keyCode <= 222)
        return false;
    return true;
}
function controlInputDecimal(event, hasMinus) {
    var keyCode = event.keyCode || event.charCode;
    if (hasMinus != undefined && hasMinus && (keyCode == 173 || keyCode == 189))
        return true;
    if (keyCode == 32 || keyCode == 59 || keyCode == 61 || keyCode == 173 || keyCode >= 65 && keyCode <= 90 || keyCode >= 106 && keyCode <= 108 || keyCode >= 186 && keyCode <= 189 || keyCode >= 191 && keyCode <= 222)
        return false;
    return true;
}
function controlInputDecimal2(event, ele, len) {
    var keyCode = event.keyCode || event.charCode;
    var curindex = getCursorIndex(ele);
    if (keyCode == 32 || keyCode == 59 || keyCode == 61 || keyCode == 173 || keyCode >= 65 && keyCode <= 90 || keyCode >= 106 && keyCode <= 108 || keyCode >= 186 && keyCode < 189 || keyCode >= 191 && keyCode <= 222)
        return false;
    if (keyCode == 189 && curindex != 0)
        return false;
    var value = $(ele).val();
    var index = value.indexOf('.');
    var vnum = value.slice(index + 1)
    if ((index >= 0 && keyCode == 190) || (index >= 0 && curindex >= index + 1 && vnum.length >= len && keyCode != 8))
        return false;
    return true;
}
function getCursorIndex(elem) {
    var cursurPosition = -1;
    if (elem.selectionStart != undefined) {//非IE浏览器
        cursurPosition = elem.selectionStart;
    } else {//IE
        var range = document.selection.createRange();
        range.moveStart("character", -elem.value.length);
        cursurPosition = range.text.length;
    }
    return cursurPosition;
}


function NumKey(obj) {
    var t = obj.value.replace(/[^\d]/g, '');
    if (obj.value != t)
        obj.value = t;
}

function NumKey_E(obj) {
    var t = obj.value.replace(/(^0+|[^\d/,]|[/.])/g, '');
    if (obj.value != t)
        obj.value = t;
}

function NumKey_BigWeight(obj, decimalNum) {
    var t;
    var reg;
    var result;
    if (isDeLanague == "True") {
        //t = obj.value.replace(/(^0+|[^\d/,])/g, '');
        t = obj.value.replace(/(^[/,]+|[^\d/,])/g, '');
        t = t.replace('/', '');
        reg = /[\,]/g;
        result = t.match(reg);
    } else {
        t = obj.value.replace(/(^[/.]+|[^\d/.])/g, '');
        t = t.replace('/', '');
        reg = /[\.]/g;
        result = t.match(reg);
    }
    if (result != null) {
        //找到出现第二个小数位符号,把第二个小数位去掉
        if (isDeLanague == "True") {
            if (result.length > 1) {
                //12345,6,99 >>12345,6+99=12345,699
                t = t.substring(0, t.lastIndexOf(",")) + t.substring(t.lastIndexOf(",") + 1, t.length);
            }
            //小数位限制
            if (decimalNum == 0)
                t = t.substring(0, t.indexOf(","));
            else
                t = t.substring(0, t.indexOf(",") + (decimalNum + 1));
        }
        else {
            if (result.length > 1) {
                //12345.6.99 >>12345.6+99=12345.699
                t = t.substring(0, t.lastIndexOf(".")) + t.substring(t.lastIndexOf(".") + 1, t.length);
            }
            //小数位限制
            if (decimalNum == 0)
                t = t.substring(0, t.indexOf("."));
            else
                t = t.substring(0, t.indexOf(".") + (decimalNum + 1));
        }
    }
    if (obj.value != t)
        obj.value = t;
}

function clearNoNum(event, obj, decimalNum) {
     
    event = window.event || event;
    if (event.keyCode == 37 | event.keyCode == 39) {
        return;
    }
    var t = obj.value.charAt(0);
    var reg;
    var result;
    if (isDeLanague == "True") {
         
        obj.value = obj.value.replace(/[^\d,]/g, "");
        
        obj.value = obj.value.replace(/^\,/g, "");
        
        obj.value = obj.value.replace(/\,{2,}/g, ",");
         
        obj.value = obj.value.replace(",", "$#$").replace(/\,/g, "").replace("$#$", ",");
        reg = /[\,]/g;
        result = obj.value.match(reg);
        if (result != null) {
           
            if (decimalNum == 0)
                obj.value = obj.value.substring(0, obj.value.indexOf(","));
            else
                obj.value = obj.value.substring(0, obj.value.indexOf(",") + (decimalNum + 1));
            //obj.value = obj.value.replace(/^(\-)*(\d+)\,(\d\d).*$/, '$1$2,$3');//只能输入两个小数 
        }

    }
    else {
        obj.value = obj.value.replace(/[^\d.]/g, "");
        obj.value = obj.value.replace(/^\./g, "");
        obj.value = obj.value.replace(/\.{2,}/g, ".");
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        reg = /[\.]/g;
        result = obj.value.match(reg);
        if (result != null) {
            
            if (decimalNum == 0)
                obj.value = obj.value.substring(0, obj.value.indexOf("."));
            else
                obj.value = obj.value.substring(0, obj.value.indexOf(".") + (decimalNum + 1));
            //obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数 
        }

    }

    if (t == '-') {
        obj.value = '-' + obj.value;
    }
}
function parseFloatValue(val) {

    var res = parseFloat(val);
    if (isNaN(res)) {
        return 0;
    }

    return res;
}

function DeGetDecimalValue(val) {
    if (isDeLanague == "True") {
        val = val.replace(".", "");
        val = val.replace(",", ".");
    }
    else {
        val = val.replace(",", "");
    }

    var res = parseFloat(val);
    if (isNaN(res)) {
        return 0;
    }

    return res;
}

//Compare Data Start or Date.prototype.compareTo()
//-1:t1<t2。 0:t1==t2。1:t1>t2。
function compareDate(t1, t2) {
    var resultStart = t1.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);
    var resultEnd = t2.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);

    var start = new Date(resultStart[4], resultStart[3] - 1, resultStart[1]);
    var end = new Date(resultEnd[4], resultEnd[3] - 1, resultEnd[1]);

    var start1 = new Date(resultStart[4], resultStart[3], resultStart[1]);
    var end1 = new Date(resultEnd[4], resultEnd[3], resultEnd[1]);

    if (start == end)
        return "0";
    else if (start > end)
        return "1";
    return "-1";
}
//checkForExample t1<=t2<=t3
function compareDatethree(t1, t2, t3) {
    var resultStart = t1.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);
    var resultMiddle = t2.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);
    var resultEnd = t3.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4})$/);

    var start = new Date(resultStart[4], resultStart[3] - 1, resultStart[1]);
    var middle = new Date(resultMiddle[4], resultMiddle[3] - 1, resultMiddle[1]);
    var end = new Date(resultEnd[4], resultEnd[3] - 1, resultEnd[1]);
    if (start <= middle && middle <= end)
        return true;
    else
        return false;
}
function compareDateTimethree(t1, t2, t3) {
    var resultStart = t1.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);
    var resultMiddle = t2.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);
    var resultEnd = t3.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);

    var start = new Date(resultStart[4], resultStart[3] - 1, resultStart[1], resultStart[5], resultStart[6]);
    var middle = new Date(resultMiddle[4], resultMiddle[3] - 1, resultMiddle[1], resultMiddle[5], resultMiddle[6]);
    var end = new Date(resultEnd[4], resultEnd[3] - 1, resultEnd[1], resultEnd[5], resultEnd[6]);
    if (start <= middle && middle <= end)
        return true;
    else
        return false;
}
function compareDateTime(t1, t2) {
    //var resultStart = t1.match(/^\d{1,2}\/\d{1,2}\/\d{4}[T ]\d{1,2}\:\d{1,2}$/);
    //var resultEnd = t2.match(/^\d{1,2}\/\d{1,2}\/\d{4}[T ]\d{1,2}\:\d{1,2}$/);

    var resultStart = t1.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);
    var resultEnd = t2.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);

    var start = new Date(resultStart[4], resultStart[3] - 1, resultStart[1], resultStart[5], resultStart[6]);
    var end = new Date(resultEnd[4], resultEnd[3] - 1, resultEnd[1], resultEnd[5], resultEnd[6]);
    if (start == end)
        return "0";
    else if (start > end)
        return "1";
    return "-1";
}
function compareDateTime1(t1, t2) {
    //var resultStart = t1.match(/^\d{1,2}\/\d{1,2}\/\d{4}[T ]\d{1,2}\:\d{1,2}$/);
    //var resultEnd = t2.match(/^\d{1,2}\/\d{1,2}\/\d{4}[T ]\d{1,2}\:\d{1,2}$/);

    var resultStart = t1.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);
    var resultEnd = t2.match(/^(\d{1,2})(\/|\/)(\d{1,2})\2(\d{1,4}) (\d{1,2}):(\d{1,2})$/);

    var start = new Date(resultStart[4], resultStart[3] - 1, resultStart[1], resultStart[5], resultStart[6]);
    var end = new Date(resultEnd[4], resultEnd[3] - 1, resultEnd[1], resultEnd[5], resultEnd[6]);
    if (start == end)
        return "0";
    else if (start >= end)
        return "1";
    return "-1";
}

export { StringBuilder }