<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>文件</el-breadcrumb-item>
        <el-breadcrumb-item>Files</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <el-table :data="files" @selection-change="handleSelectionChange" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column prop="id" label="#" width="40px"></el-table-column>
                <el-table-column prop="md5" label="MD5"></el-table-column>
                <el-table-column prop="time" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="时间">
                                <span>{{ props.row.time }}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.url"></i><audio :src="props.row.url" v-if="props.row.url" controls="controls"></audio></span>
                            </el-form-item>
                            <el-form-item label="操作">
                                <span v-if="type == 'trashed'">
                                    <el-button type="danger" @click="del(props.row.id, props.row)" :loading="btnLoading">彻底删除</el-button>
                                </span>
                                <span v-else>
                                    <el-button type="danger" @click="trash(props.row.id, props.row)" :loading="btnLoading">删除</el-button>
                                </span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button type="danger" @click="batchTrash" :loading="btnLoading">删除所选</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import YPlayer from '../YPlayer.vue';

    export default {
        data() {
            return {
                type: '',
                url: '/Manage/Files',
                tableLoading: false,
                btnLoading: false,
                error: false,
                files: '',
                mp3: '',
                fileList: [],
                selected: []
            }
        },
        created() {
            this.getFiles()
        },
        watch: {
            '$route': 'getFiles'
        },
        methods: {
            trash(id, row) {
                let index = this.songs.indexOf(row); //Ugly Solution
                this.btnLoading = true
                axios.post('/Manage/File/Trash',{
                    id: [id]
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.files.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
                    console.log(err);
                });
            },
            del(id, row) {
                let index = this.songs.indexOf(row); //Ugly Solution
                this.btnLoading = true
                axios.post('/Manage/File/Delete',{
                    id: [id]
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.files.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
                    console.log(err);
                });
            },
            batchTrash() {
                this.btnLoading = true
                axios.post('/Manage/File/Trash',{
                    id: this.selected
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        setTimeout("location.reload()", 1000);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
                    console.log(err);
                });
            },
            handleSelectionChange(val) {
                this.selected = val;
                this.selected = this.selected.map(function(song) {
                    return song.id;
                })
            },
            getFiles() {
                this.tableLoading = true
                this.type = this.$route.meta.type
                if(this.type == 'trashed')
                    this.url = '/Manage/Files/Trashed'
                else
                    this.url = '/Manage/Files'
                axios.get(this.url)
                .then((res) => {
                    this.tableLoading = false
                    if(res.data.error == 0) {
                        this.files = res.data.files
                    } else {
                        this.$message.error('获取数据失败');
                    }
                })
                .catch((err) => {
                    this.tableLoading = false
                    console.log(err);
                });
            }
        },
        components: {
            YPlayer
        }
    }
</script>
