<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <!-- 引入样式 -->
    <link href="https://cdn.bootcss.com/element-ui/1.3.7/theme-default/index.css" rel="stylesheet">
    <title>登录</title>
</head>
<body>
    <div id="app" style="position: absolute; width: 100%;">
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="6">
        <el-card class="box-card" style="box-shadow: 0 0 10px #cac6c6 vertical-align: middle; margin: 180px auto;">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;font-size: 20px;"><b>登录</b></span>
                <!-- <el-button style="float: right;" type="primary">操作按钮</el-button> -->
            </div>
            <div v-show="loginSuccess"><el-alert title="登录成功，正在跳转..." type="success"></el-alert><br></div>
            <div v-show="errorMsg"><el-alert :title="errorMsg" type="error"></el-alert><br></div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="80px">
                <el-form-item label="用户名:" prop="stuId">
                    <el-input v-model="ruleForm.stuId" placeholder="学号"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="校园网密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="" :loading="loading" @click="login">{{ loading ? "登录中" : "登录"}}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        </el-col>
    </el-row>

  </div>
</body>
    <script src="https://cdn.bootcss.com/vue/2.4.1/vue.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/1.3.7/index.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.16.2/axios.min.js"></script>
    <script>
        var validatestuId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入学号'));
            } else if (value.length != 11) {
                callback(new Error('长度应为11个字符'));
            } else {
                callback();
            }
        };
        new Vue({
            el: '#app',
            data: {
                ruleForm: {
                    stuId: '',
                    password: ''
                },
                loading: false,
                loginSuccess: false,
                errorMsg: '',
                rules: {
                    stuId: [
                        { validator: validatestuId, required: true, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            },
            methods: {
                login: function() {
                    this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                            this.loading = true
                            this.errorMsg = ""
                            axios.post('/Login',{
                                stuId: this.ruleForm.stuId,
                                password: this.ruleForm.password
                            })
                            .then((res)=>{
                                this.loading = false
                                if(res.data.error == '0') {
                                    this.loginSuccess = true
                                    location.href = "/"
                                } else {
                                    this.errorMsg = res.data.msg
                                }
                            })
                            .catch((err)=>{
                                this.loading = false
                                console.log(err);
                            });
                        } else {
                            this.errorMsg = "请修正所有错误后再提交"
                            return false;
                        }
                    });
                }
            }
        })
    </script>
</html>