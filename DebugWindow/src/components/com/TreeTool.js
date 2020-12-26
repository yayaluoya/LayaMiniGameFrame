let _TreeTool = {
    //
    getDebugData() {
        //
        if (!window.opener) {
            window.opener = {};
        }
        if (!window.opener['$Debug']) {
            let _f_ = function () {
                this.c = 3;
                this.d = 4;
            }
            let _f = function () {
                this.a = 1;
                this.b = 2;
                _f.prototype.c = new _f_();
            }
            window.opener['$Debug'] = new _f();
            console.log(window.opener['$Debug']);
        }
        //
        return window.opener['$Debug'];
    },

    //过滤属性
    filterKey(_o) {
        if (typeof _o == "object") {
            for (let _i in _o) {
                let _j = _o;
                _o[_i] = _j[_i];
            }
        }
        return '';
    }
};
//
export default _TreeTool;