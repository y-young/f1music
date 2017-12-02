<template>
    <div>
        <div class="login">
            <div style="width: 300px; margin: auto;">
                <div style="font-size: 30px; text-align: center; margin-bottom: 20px;"><b>登录</b></div>
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
                        <el-button type="primary" :loading="loading" @click="login" @keyup.enter.native="login" style="width: 300px;">{{ loading ? "登录中" : "登录" }}</el-button>
                    </el-form-item>
                </el-form>
                <router-link to="/" style="font-size: 13px; color: #777;"><i class="el-icon-arrow-left"></i> 返回首页</router-link>
            </div>
        </div>
        <canvas width="1080" height="1608" id="curve"></canvas>
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
        mounted() {
            if(this.$route.meta.action == 'logout') {
                this.errorMsg = "正在登出..."
                location.href = '/Logout';
            }
            if(this.$route.query.redirect) {
                this.errorMsg = "您还未登录，请先登录"
            }
            this.drawCurve();
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
                                let redirect = this.$route.query.redirect

                                this.$router.push(redirect ? decodeURI(redirect) : '/')
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
            },
            getRedirect: function() {
                return ((new RegExp('[?|&]' + 'redirect=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[1] || '/');
            },
            drawCurve: function() {
                var c = document.getElementsByTagName('canvas')[0],
                x = c.getContext('2d'),
                pr = window.devicePixelRatio || 1,
                w = window.innerWidth,
                h = window.innerHeight,
                f = 90,
                q,
                m = Math,
                r = 0,
                u = m.PI*2,
                v = m.cos,
                z = m.random
                c.width = w*pr
                c.height = h*pr
                x.scale(pr, pr)
                x.globalAlpha = 0.6
                function i(){
                    x.clearRect(0,0,w,h)
                    q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
                    while(q[1].x<w+f) d(q[0], q[1])
                }
                function d(i,j){   
                    x.beginPath()
                    x.moveTo(i.x, i.y)
                    x.lineTo(j.x, j.y)
                    var k = j.x + (z()*2-0.25)*f,
                    n = y(j.y)
                    x.lineTo(k, n)
                    x.closePath()
                    r-=u/-50
                    x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
                    x.fill()
                    q[0] = q[1]
                    q[1] = {x:k,y:n}
                }
                function y(p){
                    var t = p + (z()*2-1.1)*f
                    return (t>h||t<0) ? y(p) : t
                }
                document.onclick = i
                //document.ontouchstart = i
                i()
            }
        }
    }

            /*document.addEventListener('touchmove', function (e) {
                e.preventDefault()
            })*/
            
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
    .login {
        padding-top: 15%;
        margin: auto;    
        //position: absolute;
        left: 0;
        width: 320px;
        text-align: center;
        //top: 50%;
        //left: 50%;
        //margin-left: -160px;
        //margin-top: -160px;
    }
</style>
