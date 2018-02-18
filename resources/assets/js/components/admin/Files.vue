<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>文件</el-breadcrumb-item>
        <el-breadcrumb-item>Files</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
            <div style="font-size: 14px; color: #777">文件总数: {{ allCnt }} 个</div><br>
            <el-table :data="files" v-loading.body="tableLoading" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column prop="id" label="#" width="40px"></el-table-column>
                <el-table-column prop="md5" label="MD5"></el-table-column>
                <el-table-column prop="time" label="时间" sortable></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="时间">
                                <span>{{ props.row.time }}</span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!props.row.url"></i><audio :src="props.row.url" v-if="props.row.url" controls="controls"></audio></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableLoading: false,
                error: false,
                files: '',
                mp3: '',
                allCnt: 0,
                fileList: [],
            }
        },
        created() {
            this.getFiles()
        },
        watch: {
            '$route': 'getFiles',
            'files': function() {
                this.allCnt = this.files.length
            }
        },
        methods: {
            getFiles() {
                this.tableLoading = true
                this.type = this.$route.meta.type
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
            }
        }
    }
</script>
