/**
 * Upload
 */
var component = Vue.extend({
        data() {
            return {
                formLoading: false,
                btnLoading: false,
                keyword: null,
                result: null,
                mp3: null,
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
            search: function() {
                console.log(this.keyword);
                if(this.keyword == null) {
                    this.$message.error('请输入搜索词');
                    return;
                }
                this.formLoading = true
                axios.post('/Music/Search',{
                    keyword: this.keyword
                })
                .then((res)=>{
                    this.formLoading = false
                    if(res.data.length > 0) {
                        this.result = res.data
                    } else {
                        this.$message.error('发生了错误，请重试');
                    }
                })
                .catch((err)=>{
                    this.formLoading = false
                    console.log(err);
                });
            },
            getMp3: function(row, expanded) {
                this.mp3 = null
                axios.post('/Music/Mp3',{
                    id: row.id
                })
                .then((res)=>{
                    console.log(res.data);
                    if(res.data.length > 0) {
                        this.mp3 = res.data
                    } else {
                        this.$message.error('暂时无法试听，请重试');
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            },
            cloudUpload: function() {

            },
            onSuccess: function(response, file, fileList) {
                if(response && response.length > 0) {
                    if(response.error == 0)
                        this.$message.success('上传成功!');
                    else
                        this.$message.error('上传失败');
                }
                console.log(response);
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