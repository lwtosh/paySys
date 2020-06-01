<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.context" placeholder="公告内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
       <el-date-picker
      v-model="dataForm.time"
      type="daterange"
      minView="month"
      :editable="false"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
       </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" plain>查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      ref='dataList'
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="context"
        header-align="center"
        align="center"
        label="公告内容"
        :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="stime"
        header-align="center"
        align="center"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="etime"
        header-align="center"
        align="center"
        label="结束日期">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="显示状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" >显示</el-tag>
          <el-tag v-if="scope.row.status === '2'" size="small" >不显示</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" v-if="scope.row.status !='1'" @click="showHandle(scope.row)">显示</el-button>
          <el-button type="text" size="small" v-if="scope.row.status !='2'" @click="showHandle(scope.row)">不显示</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './notice-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          context: '',
          time: ''
        },
        dataList: [],
        type: '',
        isShow: true,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/notice/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            context: this.dataForm.context,
            startTimeStr: this.dataForm.time[0],
            endTimeStr: this.dataForm.time[1]
          })
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.dataList = data.res.data.records
            this.totalPage = data.res.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      showHandle (row) {
        this.$http({
          // eslint-disable-next-line no-undef
          url: this.$http.adornUrl(`/m/notice/showOrHide/${row.id}/${row.status === '1' ? '2' : '1'}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // eslint-disable-next-line no-unneeded-ternary
                this.isShow = (this.isShow === false ? true : false)
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      // 删除
      deleteHandle (id) {
        var noticeIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/m/notice/delByIds'),
            method: 'delete',
            data: this.$http.adornData(noticeIds, false)
          }).then(({data}) => {
            if (data && data.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
