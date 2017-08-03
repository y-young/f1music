<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>文件</el-breadcrumb-item>
        <el-breadcrumb-item>Files</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>文件</h3>
            <el-table :data="files" @expand="expand" @selection-change="handleSelectionChange" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column prop="id" label="#" width="40px"></el-table-column>
                <el-table-column prop="md5" label="MD5"></el-table-column>
                <el-table-column prop="uploader" label="上传者"></el-table-column>
                <el-table-column prop="time" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="上传者">
                                <span>{{props.row.uploader}}</span>
                            </el-form-item>
                            <el-form-item label="时间">
                                <span>{{props.row.time}}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.url"></i><YPlayer :src="props.row.url" :detail="false" v-if="props.row.url"></YPlayer></span>
                            </el-form-item>
                            <el-form-item label="操作">
                                <span><el-button @click="edit">查看/编辑</el-button><el-button type="danger" @click="trash(props.row.id, props.row.$index)" :loading="btnLoading">删除</el-button></span>
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
                tableLoading: false,
                btnLoading: false,
                error: false,
                files: '',
                mp3: '',
                fileList: [],
                filters: [
                    { text: '6:30', value: 1 },
                    { text: '7:00', value: 2 },
                    { text: '13:45', value: 3 },
                    { text: '18:40', value: 4 },
                    { text: '21:35', value: 5 },
                    { text: '22:30', value: 6 }
                ],
                selected: []
            }
        },
        methods: {
            expand: function(row, expanded) {
                return row;
            },
            filterPlaytime(value, row) {
                return row.playtime === value;
            },
            edit(id) {
                this.$router.push('/Manage/Edit' + id);
            },
            trash(id, index) {
                axios.post('/Manage/File/Trash',{
                    id: [id]
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.songs.splice(index + 1, 1);
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
            }
        },
        created() {
            this.tableLoading = true
            axios.get('/Manage/Files')
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
        },
        components: {
            YPlayer
        }
    }
</script>