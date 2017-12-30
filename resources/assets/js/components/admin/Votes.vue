<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Votes</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <div style="font-size: 14px; color: #777">投票总数: {{ allCnt }} 票</div>
            <el-pagination @current-change="pageChange" :current-page="1" :page-size="100" layout="prev, pager, next" :total="allCnt" style="margin-bottom: 10px"></el-pagination>
            <el-table :data="votes" @expand="expand" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column prop="id" label="#" width="40px"></el-table-column>
                <el-table-column prop="song.name" label="曲目"></el-table-column>
                <el-table-column prop="vote" label="投票"></el-table-column>
                <el-table-column prop="voter" label="投票者"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
                <el-table-column prop="updated_at" label="最后更新时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="曲目ID">
                                <span>{{props.row.song_id}}</span>
                            </el-form-item>
                            <el-form-item label="投票">
                                <span>{{props.row.vote}}</span>
                            </el-form-item>
                            <el-form-item label="投票者">
                                <span>{{props.row.voter}}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{props.row.created_at}}</span>
                            </el-form-item>
                            <el-form-item label="最后更新时间">
                                <span>{{props.row.updated_at}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
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
                allCnt: 0,
                votes: [],
                data: []
            }
        },
        created() {
            this.getVotes()
        },
        watch: {
            'data': function() {
                this.allCnt = this.data.length
            }
        },
        methods: {
            pageChange: function(current) {
                this.tableLoading = true
                let first = 100 * (current - 1)
                let last = 100 * current
                this.votes = this.data.slice(first, last)
                this.tableLoading = false
            }, 
            getVotes() {
                this.tableLoading = true
                axios.get('/Manage/Votes')
                .then((res) => {
                    this.tableLoading = false
                    if(res.data.error == 0) {
                        this.data = res.data.votes
                        this.votes = this.data.slice(0, 100)
                    } else {
                        this.$message.error('获取数据失败');
                    }
                })
                .catch((err) => {
                    this.tableLoading = false
                    console.log(err);
                });
            }
        }
    }
</script>
