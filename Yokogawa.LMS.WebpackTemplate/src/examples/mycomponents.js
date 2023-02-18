import $ from 'jquery';
import ReactPageExample from "./reactpageexample";

var list= eworkspace.framework.List.extend({
    _loadTemplate: function (callback, isReplace) {
        var self = this;
        this._super(function () {
            var curPage = $("#" + self.Id);
            var title = curPage.find('h3');
            title.html(self.model.title);

            if (self.model.toolBarItems != null) {
                var toolbar = $("#" + self.Id).find('.toolbar');
                if (toolbar.length)
                    toolbar.kendoToolBar({
                        items: self.model.toolBarItems
                    });
            }
            var itemIndex = 0
            if (self.model.toolBarItems != null)
                self.model.toolBarItems.forEach(function (item) {
                    var toolbar = $('#' + self.Id).find('.toolbar');
                    if (item.template != null) {
                        var button = toolbar.find('[data-uid]:eq(' + itemIndex + ')');
                        button.click(item.click);
                    }

                    itemIndex++;
                })

            $('#' + self.Id).css('margin-top', 5);
            if ($.isFunction(callback))
                callback(self);
        }, isReplace);
    },
    onToolBarItemClick: function (index, handler) {
        var i = 0;
        var self = this;
        this.model.toolBarItems.forEach(function (item) {
            if (index === i) {
                if ($.isFunction(handler))
                    item.click = handler;
                return false;
            }
            i++;
        })
    }

});

export default {list,ReactPageExample }