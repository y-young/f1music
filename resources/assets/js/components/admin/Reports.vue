<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>举报</el-breadcrumb-item>
        <el-breadcrumb-item>Reports</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <el-table :data="reports" @expand="expand" @selection-change="handleSelectionChange" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column prop="id" label="#" width="40px"></el-table-column>
                <el-table-column prop="song.name" label="曲目"></el-table-column>
                <el-table-column prop="reason" label="原因"></el-table-column>
                <el-table-column prop="reporter" label="举报者"></el-table-column>
                <el-table-column prop="time" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="曲目ID">
                                <span>{{ props.row.song_id }}</span>
                            </el-form-item>
                            <el-form-item label="原因">
                                <span>{{ props.row.reason }}</span>
                            </el-form-item>
                            <el-form-item label="举报者">
                                <span>{{ props.row.reporter }}</span>
                            </el-form-item>
                            <el-form-item label="时间">
                                <span>{{ props.row.time }}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.song.url"></i><YPlayer :src="props.row.song.url" :detail="false" v-if="props.row.song.url"></YPlayer></span>
                            </el-form-item>
                            <el-form-item label="操作">
                                <span><el-button type="danger" @click="del(props.row.id, props.row.$index)" :loading="btnLoading">删除</el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button type="danger" @click="batchDelete" :loading="btnLoading">删除所选</el-button>
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
                reports: '',
                mp3: '',
                selected: []
            }
        },
        created() {
            this.getReports()
        },
        methods: {
            expand: function(row, expanded) {
                return row;
            },
            del(id, index) {
                console.log(index);
                axios.post('/Manage/Report/Delete',{
                    id: [id]
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.reports.splice(index + 1, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
                    console.log(err);
                });
            },
            batchDelete() {
                axios.post('/Manage/Report/Delete',{
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
            getReports() {
                this.tableLoading = true
                axios.get('/Manage/Reports')
                .then((res) => {
                    this.tableLoading = false
                    if(res.data.error == 0) {
                        this.reports = res.data.reports
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