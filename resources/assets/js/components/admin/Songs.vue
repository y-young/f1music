<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>曲目</el-breadcrumb-item>
        <el-breadcrumb-item>Songs</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <el-table :data="songs" @selection-change="handleSelectionChange" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column prop="id" label="#" width="55"></el-table-column>
                <el-table-column prop="playtime" label="时段" :filters="filters" :filter-method="filterPlaytime" filter-placement="bottom-end" width="70px"></el-table-column>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="reports_count" label="举报数" sortable></el-table-column>
                <el-table-column prop="created_at" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="时段">
                                <span>{{ props.row.playtime }}</span>
                            </el-form-item>
                            <el-form-item label="曲名">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="来源">
                                <span>{{ props.row.origin }}</span>
                            </el-form-item>
                            <el-form-item label="举报数">
                                <span>{{ props.row.reports_count }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.created_at }}</span>
                            </el-form-item>
                            <el-form-item label="最后更改时间">
                                <span>{{props.row.updated_at}}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.file.url"></i><YPlayer :src="props.row.file.url" :detail="false" v-if="props.row.file.url"></YPlayer></span>
                            </el-form-item>
                            <el-form-item label="操作">
                                <span>
                                    <el-button @click="edit(props.row.id)">查看/编辑</el-button>
                                    <span v-if="type == 'trashed'">
                                        <el-button @click="restore(props.row.id, props.row)" :loading="restoreLoading">Restore</el-button>
                                        <el-button type="danger" @click="del(props.row.id, props.row)" :loading="delLoading">彻底删除</el-button>
                                    </span>
                                    <span v-else>
                                        <el-button type="danger" @click="trash(props.row.id, props.row)" :loading="delLoading">删除</el-button>
                                    </span>
                                </span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button type="danger" @click="batchTrash" :loading="delLoading">删除所选</el-button>
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
                url: '/Manage/Songs',
                tableLoading: false,
                delLoading: false,
                restoreLoading: false,
                error: false,
                songs: null,
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
        created() {
            this.getSongs()
        },
        watch: {
            '$route': 'getSongs'
        },
        methods: {
            filterPlaytime(value, row) {
                return row.playtime === value;
            },
            edit(id) {
                this.$router.push('/Song/Edit/' + id);
            },
            trash(id, row) {
                let index = this.songs.indexOf(row); //Ugly Solution
                this.delLoading = true
                axios.post('/Manage/Song/Trash', {
                    id: [id]
                })
                .then((res) => {
                    this.delLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        console.log(index);
                        this.songs.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.delLoading = false
                    console.log(err);
                });
            },
            del(id, row) {
                let index = this.songs.indexOf(row); //Ugly Solution
                this.delLoading = true
                axios.post('/Manage/Song/Delete', {
                    id: [id]
                })
                .then((res) => {
                    this.delLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.songs.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.delLoading = false
                    console.log(err);
                });
            },
            batchTrash() {
                this.delLoading = true
                axios.post('/Manage/Song/Trash', {
                    id: this.selected
                })
                .then((res) => {
                    this.delLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        setTimeout("location.reload()", 1000);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.delLoading = false
                    console.log(err);
                });
            },
            restore(id, row) {
                let index = this.songs.indexOf(row); //Ugly Solution
                this.restoreLoading = true
                axios.post('/Manage/Song/Restore', {
                    id: [id]
                })
                .then((res) => {
                    this.restoreLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.songs.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.restoreLoading = false
                    console.log(err);
                });
            },
            handleSelectionChange(val) {
                this.selected = val;
                this.selected = this.selected.map(function(song) {
                    return song.id;
                })
            },
            getSongs() {
                this.tableLoading = true
                this.type = this.$route.meta.type
                if(this.type == 'trashed')
                    this.url = '/Manage/Songs/Trashed'
                else
                    this.url = '/Manage/Songs'
                axios.get(this.url)
                .then((res) => {
                    this.tableLoading = false
                    if(res.data.error == 0) {
                        this.songs = res.data.songs
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
