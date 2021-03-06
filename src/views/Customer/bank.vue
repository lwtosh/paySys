<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.bankName" placeholder="银行卡姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" plain>查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
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
        prop="bankName"
        header-align="center"
        align="center"
        label="银行卡姓名">
      </el-table-column>
      <el-table-column
        prop="bankNo"
        header-align="center"
        align="center"
        label="银行卡号">
      </el-table-column>
      <el-table-column
        prop="bankType"
        header-align="center"
        align="center"
        label="银行卡类型">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        header-align="center"
        align="center"
        label="证件号码">
      </el-table-column>
      <!-- <el-table-column
        prop="openingBank"
        header-align="center"
        align="center"
        label="开户行">
      </el-table-column>
      <el-table-column
        prop="province"
        header-align="center"
        align="center"
        label="省">
      </el-table-column>
      <el-table-column
        prop="urban"
        header-align="center"
        align="center"
        label="市">
      </el-table-column>
      <el-table-column
        prop="bankAddress"
        header-align="center"
        align="center"
        label="开户行地址">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="addCheck(scope.row.id)">查看</el-button>
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
    <check v-if="checkVisible" ref="check" @refreshDataList="getDataList"></check>
  </div>
</template>

<script>
  import AddOrUpdate from './bank-add-or-update'
  import check from './bank-check'
  export default {
    data () {
      return {
        dataForm: {
          bankName: ''
        },
        dataList: [],
        BANK_TYPE: ['BANK_TYPE'],
        merchantList2: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        checkVisible: false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      check
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/dictionary/configKeys'),
          method: 'post',
          data: JSON.stringify(this.BANK_TYPE)
        }).then(({ data }) => {
          this.$set(this, 'merchantList2', data.res.data)
        })
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformBank/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({accessPlatformBank: this.dataForm.bankName})
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.dataList = data.res.data.records
            this.totalPage = data.res.data.total
            this.merchantList2.forEach((item, index) => {
              this.dataList.forEach((n, m) => {
                if (item.bankType === n.keyName) {
                  this.$set(this.dataList[m], 'bankType', item.value)
                }
              })
            })
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
       // 查看
      addCheck (id) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var accessPlatformBankIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/m/accessPlatformBank/deleteBankIds/'),
            method: 'delete',
            data: this.$http.adornData(accessPlatformBankIds, false)
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
