/**
 * Admin List
 */
(function () {
    new Vue({
        el: ".table-main",
        data: {
            files: "",
            errorMsg: "",
            loading: false,
            id: "",
            file: "",
            title: "",
            original: "",
            list: 'http://localhost:8004/Manage/List'
        },
        created() {
            this.getlist();
        },
        methods: {
            getlist: function () {
                this.loading = true
                this.errorMsg = ""
                this.$http.get(
                    this.list).then(function (res) {
                            if(res.data.error == '0') {
                                this.files = res.data.files
                                this.loading = false
                            } else {
                            this.errorMsg = res.data.msg
                            this.loading = false
                            }
                    },function (res) {
                      alert(res.status)
                     }
                )
            }

        }
    })
})();
