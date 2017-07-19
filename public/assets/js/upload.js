/**
 * Upload
 */
var component = Vue.extend({
        data() {
            return {
                loading: false,
                ruleForm: {
                    time: '',
                    name: '',
                    source: '',
                    file: ''
                },
                rules: {
                    time: [
                        { required: true, message: '请选择时段', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '请输入曲名', trigger: 'blur'}
                    ],
                    file: [
                        { required: true, message: '请上传文件', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            onSuccess: function(response, file, fileList) {
                this.$message.success('上传成功!');
                alert(response);
            },
            beforeUpload(file) {
                const tooBig = file.size / 1024 / 1024 > 20;
                const tooSmall = file.size / 1024 / 1024 < 1;

                if (tooBig) {
                    this.$message.error('上传歌曲大小不能超过 20MB!');
                }
                if (tooSmall) {
                    this.$message.error('为保证音乐质量，请上传一个至少 1MB的文件!');
                }
                return !tooBig && !tooSmall;
            },
            submit: function() {
                alert("success");
            }
        },
        mixins: [main]
    })
    var page = new component();
    page.$mount('.app');