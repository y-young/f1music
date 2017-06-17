/**
 * Music Vote
 */
(function () {
    new Vue({
        el: ".vote-main",
        data: {
            files: "",
            errorMsg: "",
            loading: false,
            id: "",
            file: "",
            vote: "",
            type,
            list: 'http://localhost:8004/List/1'
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
alert(this.type)
                            if(res.data.error == '0') {
                                this.files = res.data.files
                                this.loading = false
                            } else {
                            this.errorMsg = res.data.msg
                            this.loading = false
                            }
                    },function (res) {
                      alert('Error: '.res.status)
                     }
                )
            }

        }
    })
})();
