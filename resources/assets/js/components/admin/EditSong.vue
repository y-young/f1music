<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>编辑曲目</el-breadcrumb-item>
        <el-breadcrumb-item>Edit</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
        <el-form :model="song" label-position="left" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="时段" prop="time">
                <el-select v-model="song.playtime" placeholder="选择时段">
                    <el-option label="6:30" value="1"></el-option>
                    <el-option label="7:00" value="2"></el-option>
                    <el-option label="13:45" value="3"></el-option>
                    <el-option label="18:40" value="4"></el-option>
                    <el-option label="21:35" value="5"></el-option>
                    <el-option label="22:30" value="6"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="曲名" prop="name">
                <el-input v-model="song.name" placeholder="歌曲名称"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="origin">
                <el-input v-model="song.origin" placeholder="该曲目来自的专辑、音乐家或节目、游戏等，不是表示上传者，不明来源可以留空"></el-input>
            </el-form-item>
            <el-form-item label="试听">
                <YPlayer :src="song.file.url" :detail="false"></YPlayer>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="submitLoading" @click="submit">提交</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="song.reports" @selection-change="handleSelectionChange" style="width: 100%" stripe>
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
                            <el-form-item label="操作">
                                <span><el-button type="danger" @click="del(props.row.id, props.row.$index)" :loading="delLoading">删除</el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button type="danger" @click="batchDelete" :loading="delLoading">删除所选</el-button>
            </div>
    </div>
    </div>
</template>

<script>
    import YPlayer from '../YPlayer.vue';

    export default {
        data() {
            return {
                id: null,
                song: null,
                submitLoading: false,
                delLoading: false,
                pageLoading: false,
                selected: [],
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
        created() {
            this.getSong()
        },
        watch: {
            '$route': 'getSong'
        },
        methods: {
            submit() {
                var error = false
                this.$refs.editForm.validate((valid) => {
                    if (!valid) {
                        this.$message.error({
                            showClose: true,
                            message: "请修正所有错误后再提交"
                        });
                        error = true
                    }
                });
                if(error) return;
                this.submitLoading = true
                axios.post('/Manage/Song/Edit',{
                    id: this.id,
                    playtime: this.song.playtime, // TODO
                    name: this.song.name,
                    origin: this.song.origin,
                })
                .then((res) => {
                    this.submitLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.submitLoading = false
                    console.log(err);
                });
            },
            del(id, index) {
                this.delLoading = true
                axios.post('/Manage/Report/Delete',{
                    id: [id]
                })
                .then((res) => {
                    this.delLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('操作成功!');
                        this.song.reports.splice(index + 1, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.delLoading = false
                    console.log(err);
                });
            },
            batchDelete() {
                this.delLoading = true
                axios.post('/Manage/Report/Delete', {
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
            handleSelectionChange(val) {
                this.selected = val;
                this.selected = this.selected.map(function(report) {
                    return report.id;
                })
            },
            getSong() {
                this.pageLoading = true
                this.id = this.$route.meta.id
                axios.post('/Manage/Song/View', {
                    id: this.id
                })
                .then((res) => {
                    this.pageLoading = false
                    if(res.data.error == 0) {
                        this.song = res.data.song
                    } else {
                        this.$message.error('获取数据失败');
                    }
                })
                .catch((err) => {
                    this.pageLoading = false
                    console.log(err);
                });
            }
        },
        components: {
            YPlayer
        }
    }
</script>
