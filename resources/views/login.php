<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link href="https://cdn.bootcss.com/element-ui/1.3.7/theme-default/index.css" rel="stylesheet">
    <style type="text/css">
    #particles {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: -1;
        background-color: #f7fafc;
    }
</style>
    <title>登录</title>
</head>
<body>
    <div id="app" style="position: absolute; width: 100%; top: 200px;">
        <div style="width: 300px; margin: auto;">
            <div style="line-height: 36px; font-size: 20px; text-align: center; margin-bottom: 20px;"><b>登录</b></div>
            <div v-show="loginSuccess"><el-alert title="登录成功，正在跳转..." type="success"></el-alert><br></div>
            <div v-show="errorMsg"><el-alert :title="errorMsg" type="error"></el-alert><br></div>
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
  <div id="particles"></div>
</body>
    <script src="https://cdn.bootcss.com/vue/2.4.1/vue.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/1.3.7/index.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.16.2/axios.min.js"></script>
    <script src="https://cdn.bootcss.com/particles.js/2.0.0/particles.min.js"></script>
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
                        { validator: validatestuId, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatepass, trigger: 'blur'}
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
        })
    </script>
    <script>
        particlesJS("particles", {
            "particles": {
                "number": {
                    "value": 20,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#eceeef"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.9,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.5,
                        "sync": false
                    }
                },
                "size": {
                    "value": 15,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 3,
                        "size_min": 10,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 300,
                    "color": "#eceeef",
                    "opacity": 0.8,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 800,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 800,
                        "size": 80,
                        "duration": 2,
                        "opacity": 0.8,
                        "speed": 2
                    },
                    "repulse": {
                        "distance": 400,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
</script>
</html>