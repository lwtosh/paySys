<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" ref="dataForm"  class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item label="" prop="accessCode">
        <el-input v-model="dataForm.accessCode" placeholder="商户编码" :maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" plain>查询</el-button>
        
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
       row-key="id"
        border
       style="width: 100%;"
       :tree-props="{children: 'accessPlatforms', hasChildren: 'hasChildren'}"> 
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column> -->
      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        width="180"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="accessCode"
        header-align="center"
        align="center"
        max-width="120"
        label="商户编码">
      </el-table-column>
      <el-table-column
        prop="strBalance"
        header-align="center"
        align="center"
        width="120"
        label="可提现金额">
      </el-table-column>
      <el-table-column
        prop="telphone"
        header-align="center"
        align="center"
        width="180"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
         width="180"
        label="签约开始日期">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="180"
        label="签约结束日期">
      </el-table-column>
      <el-table-column
        prop="licenseNo"
        header-align="center"
        align="center"
        width="180"
        label="营业执照号码">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="审核状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '2'" size="small">通过</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="success" size="small">待审核</el-tag>
          <el-tag v-if="scope.row.status === '3'" type="danger" size="small">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="220"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="addOrUpdateHandle(scope.row.id,1)">新增</el-button>
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id,2)">修改</el-button>
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
  import AddOrUpdate from './my-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          accessCode: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
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
          url: this.$http.adornUrl('/m/apClass/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            accessCode: this.dataForm.accessCode
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
      // 新增 / 修改
      addOrUpdateHandle (id, s) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, s)
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/m/resource/delByIds`),
            method: 'delete',
            data: JSON.stringify(ids, false)
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
<style>
el-table__expand-icon {
  display: inline-block !important;
}
.el-table td div {
  display: inline-block !important;
}
</style>
