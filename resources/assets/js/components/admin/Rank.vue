<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票结果</el-breadcrumb-item>
        <el-breadcrumb-item>Rank</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <el-table :data="rank" @expand="expand" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column prop="id" label="#" width="55"></el-table-column>
                <el-table-column prop="playtime" label="时段" :filters="filters" :filter-method="filterPlaytime" filter-placement="bottom-end" width="70px"></el-table-column>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="score" label="得分" sortable></el-table-column>
                <el-table-column prop="sum" label="总分" sortable></el-table-column>
                <el-table-column prop="counts" label="投票人数" sortable></el-table-column>
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
                            <el-form-item label="得分">
                                <span>{{ props.row.score }}</span>
                            </el-form-item>
                            <el-form-item label="总分">
                                <span>{{ props.row.sum }}</span>
                            </el-form-item>
                            <el-form-item label="投票人数">
                                <span>{{ props.row.counts }}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><audio :src="props.row.url" v-if="props.row.url" controls="controls"></audio></span>
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
                type: '',
                url: '/Manage/Rank',
                tableLoading: false,
                btnLoading: false,
                error: false,
                rank: null,
                mp3: '',
                filters: [
                    { text: '6:30', value: '1' },
                    { text: '7:00', value: '2' },
                    { text: '13:45', value: '3' },
                    { text: '18:40', value: '4' },
                    { text: '21:35', value: '5' },
                    { text: '22:30', value: '6' }
                ]
            }
        },
        created() {
            this.getRank()
        },
        methods: {
            expand: function(row, expanded) {
                return row;
            },
            filterPlaytime(value, row) {
                return row.playtime === value;
            },
            getRank() {
                this.tableLoading = true
                axios.get(this.url)
                .then((res) => {
                    this.tableLoading = false
                    if(res.data.error == 0) {
                        this.rank = res.data.songs
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
