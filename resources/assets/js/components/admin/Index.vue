<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>曲目</el-breadcrumb-item>
        <el-breadcrumb-item>Songs</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>曲目</h3>
            <el-table :data="songs" v-loading.body="formLoading" element-loading-text="加载中..." max-height="500"style="width: 100%" stripe>
                <el-table-column prop="id" label="ID" width="60px"></el-table-column>
                <el-table-column prop="playtime" label="时段" :filters="[{ text: '6:30', value: 1 }, { text: '7:00', value: 2 }]" :filter-method="filterPlaytime" :filter-placement="bottom-end"></el-table-column>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="origin" label="来源"></el-table-column>
                <el-table-column prop="uploader" label="上传者"></el-table-column>
                <el-table-column prop="time" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="时段" prop="time">
                                <span><el-select :value="props.row.playtime.toString()" placeholder="请选择时段">
                                    <el-option label="6:30" value="1"></el-option>
                                    <el-option label="7:00" value="2"></el-option>
                                    <el-option label="13:45" value="3"></el-option>
                                    <el-option label="18:40" value="4"></el-option>
                                    <el-option label="21:35" value="5"></el-option>
                                    <el-option label="22:30" value="6"></el-option>
                                </el-select></span>
                            </el-form-item>
                            <el-form-item label="曲名" prop="name">
                                <span><el-input v-model="props.row.name" placeholder="歌曲名称"></el-input></span>
                            </el-form-item>
                            <el-form-item label="来源" prop="origin">
                                <span><el-input :value="props.row.origin"></el-input></span>
                            </el-form-item>
                            <el-form-item label="上传者" prop="uploader">
                                <span>{{props.row.uploader}}</span>
                            </el-form-item>
                            <el-form-item label="时间" prop="time">
                                <span>{{props.row.time}}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.mp3"></i><YPlayer :src="props.row.mp3" :detail="false" v-if="props.row.mp3"></YPlayer></span>
                                <input type="hidden" v-model="uploadForm.url" :value="props.row.mp3">
                            </el-form-item>
                            <el-form-item label="保存">
                                <span><el-button type="primary" :loading="btnLoading">保存</el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script>
    import YPlayer from '../YPlayer.vue';

    export default {
        data() {
            return {
                formLoading: false,
                btnLoading: false,
                error: false,
                songs: null,
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
            filterPlaytime(value, row) {
                return row.playtime === value;
            }
        },
        created() {
            axios.get('/Manage/Songs')
            .then((res) => {
                console.log(res.data);
                if(res.data.error == 0) {
                    this.songs = res.data.songs
                } else {
                    this.$message.error('获取数据失败');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        components: {
            YPlayer
        }
    }
</script>