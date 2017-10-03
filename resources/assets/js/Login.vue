<template>
    <div class="app">
        <div style="width: 300px; margin: auto;">
            <div style="line-height: 36px; font-size: 20px; text-align: center; margin-bottom: 20px;"><b>登录</b></div>
            <div v-show="loginSuccess">
                <el-alert title="登录成功，正在跳转..." type="success"></el-alert><br>
            </div>
            <div v-show="errorMsg">
                <el-alert :title="errorMsg" type="error"></el-alert><br>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="stuId">
                    <el-input v-model="ruleForm.stuId" placeholder="学号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="校园网密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="login" style="width: 300px;">{{ loading ? "登录中" : "登录" }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

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
    var validatepass = (rule, value, callback) => {
        if (value == '') {
            callback(new Error('请输入密码'));
        } else if (value.length == '123456') {
            callback(new Error('为保证投票质量目前禁止使用校网初始密码登录,请更改密码'));
        } else {
            callback();
        }
    };
    export default {
        data() {
            return {
                ruleForm: {
                    stuId: '',
                    password: ''
                },
                loading: false,
                loginSuccess: false,
                errorMsg: '',
                rules: {
                    stuId: [
                        { validator: validatestuId, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatepass, trigger: 'blur'}
                    ]
                }
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
                        .then((res) => {
                            this.loading = false
                            if(res.data.error == '0') {
                                this.loginSuccess = true
                                location.href = "/"
                            } else {
                                this.errorMsg = res.data.msg
                            }
                        })
                        .catch((err) => {
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
    }
</script>

<style>
    canvas {
         position: absolute;
         top: 0;
         left: 0;
         z-index: -1;
         width: 100%;
         height: 100%;
         pointer-events: none;
    }
    .app {
         position: absolute;
         left: 0;
         width: 320px;
         text-align: center;
         top: 50%;
         left: 50%;
         margin-left: -160px;
         margin-top: -160px;
    }
</style>