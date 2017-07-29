<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>上传</el-breadcrumb-item>
        <el-breadcrumb-item>Upload</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>上传</h3>
    <el-tabs active-name="netease">
        <el-tab-pane label="网易云音乐" name="netease">
            <el-input placeholder="搜索音乐" icon="search" v-model="keyword" :on-icon-click="search" @keyup.enter.native="search" style="margin-bottom: 10px;" required></el-input>
            <el-table :data="result" v-loading.body="formLoading" element-loading-text="加载中..." max-height="500" @expand="getMp3" style="width: 100%" stripe>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="artist" label="歌手"></el-table-column>
                <el-table-column prop="album" label="专辑"></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form :model="uploadForm" label-position="left" :rules="rules" ref="uploadForm" inline>
                            <el-form-item label="时段" prop="time">
                                <span><el-select v-model="uploadForm.time" placeholder="请选择时段">
                                    <el-option label="6:30" value="1"></el-option>
                                    <el-option label="7:00" value="2"></el-option>
                                    <el-option label="13:45" value="3"></el-option>
                                    <el-option label="18:40" value="4"></el-option>
                                    <el-option label="21:35" value="5"></el-option>
                                    <el-option label="22:30" value="6"></el-option>
                                </el-select></span>
                            </el-form-item>
                            <el-form-item label="曲名" prop="name">
                                <span><el-input v-model="uploadForm.name" placeholder="歌曲名称"></el-input></span>
                            </el-form-item>
                            <el-form-item label="来源" prop="origin">
                                <span><el-select v-model="uploadForm.origin" placeholder="请选择或输入来源" filterable allow-create>
                                    <el-option :label="props.row.artist.toString()" :value="props.row.artist.toString()"></el-option>
                                    <el-option :label="props.row.album" :value="props.row.album"></el-option>
                                </el-select></span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.mp3"></i><YPlayer :src="props.row.mp3" :detail="false" v-if="props.row.mp3"></YPlayer></span>
                                <input type="hidden" v-model="uploadForm.url" :value="props.row.mp3">
                            </el-form-item>
                            <el-form-item label="上传">
                                <span><el-button type="primary" :loading="btnLoading" @click="cloudUpload(props.row.mp3)">上传</el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="手动上传" name="manual">
            <!-- <el-steps :space="100" :active="0" finish-status="success">
                <el-step title="填写信息"></el-step>
                <el-step title="上传文件"></el-step>
                <el-step title="完成"></el-step>
            </el-steps> -->

            <el-form :model="uploadForm" label-position="left" :rules="rules" ref="uploadForm" label-width="80px" enctype="multipart/form-data">
                <el-form-item label="时段" prop="time">
                    <el-select v-model="uploadForm.time" placeholder="选择时段">
                        <el-option label="6:30" value="1"></el-option>
                        <el-option label="7:00" value="2"></el-option>
                        <el-option label="13:45" value="3"></el-option>
                        <el-option label="18:40" value="4"></el-option>
                        <el-option label="21:35" value="5"></el-option>
                        <el-option label="22:30" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="曲名" prop="name">
                    <el-input v-model="uploadForm.name" placeholder="歌曲名称"></el-input>
                </el-form-item>
                <el-form-item label="来源" prop="origin">
                    <el-input v-model="uploadForm.origin" placeholder="该曲目来自的专辑、音乐家或节目、游戏等，不是表示上传者，不明来源可以留空"></el-input>
                </el-form-item>
                <el-form-item label="上传文件" prop="file">
                    <el-upload v-model="uploadForm.file" accept="audio/mpeg" :data="uploadForm" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :file-list="fileList" drag action="/Upload">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传mp3文件，且大小不超过20MB</div>
                    </el-upload>
                </el-form-item><br>
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submit">{{ btnLoading ? "正在提交" : "提交" }}</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
    import YPlayer from './YPlayer.vue';

    export default {
        data() {
            return {
                formLoading: false,
                btnLoading: false,
                error: false,
                keyword: null,
                result: null,
                mp3: '',
                fileList: [],
                uploadForm: {
                    time: '',
                    name: '',
                    origin: '',
                    file: '',
                    url: ''
                },
                rules: {
                    time: [
                        { required: true, message: '请选择时段', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '请输入曲名', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            search: function() {
                if(this.keyword == null) {
                    this.$message.error('请输入搜索词');
                    return;
                }
                this.formLoading = true
                axios.post('/Music/Search',{
                    keyword: this.keyword
                })
                .then((res) => {
                    this.formLoading = false
                    if(res.data.length > 0) {
                        this.result = res.data
                    } else {
                        this.$message.error('发生了错误，请重试');
                    }
                })
                .catch((err) => {
                    this.formLoading = false
                    console.log(err);
                });
            },
            getMp3: function(row, expanded) {
                this.uploadForm.name = row.name
                console.log(row)
                axios.post('/Music/Mp3',{
                    id: row.id
                })
                .then((res) => {
                    console.log(res.data);
                    if(res.data.length > 0) {
                        this.$set(row, 'mp3', res.data) // !IMPORTANT
                    } else {
                        this.$message.error('暂时无法试听，请重试');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
                return row;
            },
            cloudUpload: function(url) {
                this.$refs.uploadForm.validate((valid) => {
                    if (!valid) {
                        this.$message.error("请修正所有错误后再上传");
                        this.error = true;
                    } else
                        this.error = false;
                });
                if(this.error) return;
                axios.post('/Upload',{
                    time: this.uploadForm.time,
                    name: this.uploadForm.name,
                    origin: this.uploadForm.origin,
                    url: url
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('上传成功!');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
                    console.log(err);
                });
            },
            onSuccess: function(response, file, fileList) {
                if(response) {
                    if(response.error == 0)
                        this.$message.success('上传成功!');
                    else {
                        this.$message.error(response.msg);
                        this.fileList = [];
                    }
                }
            },
            onError: function(err) {
                console.log('Error:'+err);
                this.$message.error(err);
            },
            beforeUpload(file) {
                this.$refs.uploadForm.validate((valid) => {
                    if (!valid) {
                        this.$message.error("请修正所有错误后再上传");
                        this.error = true;
                    } else
                        this.error = false;
                });
                if(this.error) return false;
                const isMp3 = file.type === 'audio/mpeg';
                const tooBig = file.size / 1024 / 1024 > 20;
                const tooSmall = file.size / 1024 / 1024 < 1;

                if(!isMp3) {
                    this.$message.error('只能上传mp3文件');
                }
                if (tooBig) {
                    this.$message.error('上传歌曲大小不能超过 20MB!');
                }
                if (tooSmall) {
                    this.$message.error('为保证音乐质量，请上传一个至少 1MB的文件!');
                }
                return !tooBig && !tooSmall && isMp3;
            },
            submit: function() {
                console.log(this.fileList);
            }
        },
        components: {
            YPlayer
        }
    }
</script>