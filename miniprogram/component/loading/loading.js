var i = require("../../utils/util");

module.exports = {
    loading: function() {
        var t = (0, i.getCurrentPage)(), a = {
            _loading_: {
                is_hide: !0
            },
            _loading_more_: {
                is_hide: !0
            }
        }, e = {
            showLoading: function(i) {
                this.setData({
                    "_loading_.is_hide": !i
                });
            },
            showLoadingMore: function(i) {
                this.setData({
                    "_loading_more_.is_hide": !i
                });
            },
            isLoading: function() {
                return !this.data._loading_.is_hide;
            }
        };
        Object.assign(t, e), t.setData(a);
    }
};