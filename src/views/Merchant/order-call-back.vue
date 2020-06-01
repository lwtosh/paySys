<template>
  <div class="mod-user">
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="json"
        header-align="center"
        align="center"
        label="请求代码"
        :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="回调地址">
      </el-table-column>
       <el-table-column
        prop="rjson"
        header-align="center"
        align="center"
        label="返回字符串">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="当前时间">
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
     </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        id: '',
        dataForm: {
          id: ''
        },
        dataList: [],
        PAY_COMPANY: ['PAY_COMPANY'],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || this.dataForm.id
        this.visible = true
  
        this.$http({
          url: this.$http.adornUrl('/m/orderNotify/order/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            orderId: this.dataForm.id
          })
        }).then(({ data }) => {
          if (data && data.code === '200') {
            this.dataList = data.res.data.records
            this.totalPage = data.res.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
            this.$message.error(data.message)
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.init()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.init()
      }
    }
  }
</script>
<style lang="css">
  .el-tooltip__popper{
    font-size: 14px; 
    max-width:50%;
    margin: auto;
    overflow: hidden;
    word-wrap:break-word;
    }  /*设置显示隐藏部分内容，按50%显示*/ 
  </style> 
