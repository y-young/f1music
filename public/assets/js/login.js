/**
 * Login
 */
(function () {
    new Vue({
        el: ".loginPage",
        data: {
            loginSuccess: false,
            errorMsg: "",
            loading: false,
            stuId: "",
            password: "",
            logintxt: "登录",
            login: 'http://localhost:8004/Login'
        },
        computed: {
            validate: function () {
                if(this.stuId.length <= 11)
                    this.errorMsg = "学号应为11位!"
            },
        },
        methods: {
            loginnew: function () {
                this.logintxt = "登录中..."
                this.loading = true
                this.errorMsg = ""
                var formData = new FormData();
                formData.append('stuId',this.stuId);
                formData.append('password', this.password);
                this.$http.post(
                    this.login,formData).then(function (res) {
                            if(res.data.error == '0') {
                                this.loginSuccess = true
                                this.loading = false
                                location.href = "/"
                            } else {
                            this.errorMsg = res.data.msg
                            this.loading = false
                            }
                    },function (res) {
                      alert(res.status)
                     }
                )
            },
            loginne: function () {
this.stuId = this.stuId.split('').reverse().join('')

}


        }
    })
})();
