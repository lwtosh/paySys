/* eslint-disable no-unneeded-ternary */
<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="商户名称">
      <el-select v-model="dataForm.id" :disabled='isActive' class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id">
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审核状态">
      <el-select   v-model="dataForm.status" class="input-width" placeholder="全部" clearable>
        <el-option label="待审核" value="1"></el-option>
        <el-option label="通过" value="2"></el-option>
        <el-option label="未通过" value="3"></el-option>
      </el-select>
    </el-form-item>
      <el-form-item>
         <el-button type="primary" plain @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">提现</el-button>
        <el-button type="primary" @click="UpdateHandle()">复制-提现</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      highlight-current-row
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
        <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="accessPlatformName"
        header-align="center"
        align="center"
        width="150"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="cashType"
        header-align="center"
        align="center"
        width="150"
        label="提现方式">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.cashType === '1'" size="small">银行卡</el-tag>
          <el-tag v-if="scope.row.cashType === '2'" size="small">支付宝</el-tag>
          <el-tag v-if="scope.row.cashType === '3'" size="small">微信</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="cashName"
        header-align="center"
        width="150"
        align="center"
        label="收款名字">
      </el-table-column>
      <el-table-column
        prop="cashAccount"
        header-align="center"
        width="180"
        align="center"
        label="提现账号">
      </el-table-column>
      <el-table-column
        prop="bankName"
        header-align="center"
        align="center"
        width="150"
        label="账户姓名">
      </el-table-column>
      
      <el-table-column
        prop="bankTypeName"
        header-align="center"
        align="center"
        width="150"
        label="银行卡类型">
      </el-table-column>
      
      <el-table-column
        prop="bankNo"
        header-align="center"
        align="center"
        width="180"
        label="银行卡号">
      </el-table-column>
      <el-table-column
        prop="strOldFee"
        header-align="center"
        align="center"
        width="180"
        label="变动前余额">
      </el-table-column>
      <el-table-column
        prop="strNewFee"
        header-align="center"
        align="center"
        width="180"
        label="变动后余额">
      </el-table-column>
      <el-table-column
        width="150"
        prop="strWithdrawalFee"
        header-align="center"
        align="center"
        label="提现金额">
      </el-table-column>
      <el-table-column
        width="150"
        prop="strChargeFee"
        header-align="center"
        align="center"
        label="手续费">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="审核状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" type="success" >待审核</el-tag>
          <el-tag v-if="scope.row.status === '2'" size="small" >通过</el-tag>
          <el-tag v-if="scope.row.status === '3'" size="small" type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="payStatus"
        header-align="center"
        align="center"
        width="120"
        label="支付状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.payStatus === '1'" size="small" type="success">未支付</el-tag>
          <el-tag v-if="scope.row.payStatus === '2'" size="small" >已支付</el-tag>
          <el-tag v-if="scope.row.payStatus === '3'" size="small" type="danger"> 支付失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="auditorName"
        header-align="center"
        align="center"
        label="审核人">
      </el-table-column>
      <el-table-column
        prop="auditorTime"
        header-align="center"
        align="center"
        width="180"
        label="审核时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="220"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== '2' && scope.row.status !== '3' && isShow" type="text" size="small" @click="addAudit(scope.row.id)">审核</el-button>
          <el-button type="text" size="small" @click="addCheck(scope.row.id)">查看</el-button>
          <el-button v-if="scope.row.status !== '2' && scope.row.status !== '3' " type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="scope.row.status === '2' && !falg" type="text" size="small" @click="addpay(scope.row.id)">支付成功</el-button>
          <el-button v-if="scope.row.status === '2' && !falg" type="text" size="small" @click="addpay02(scope.row.id)">支付失败</el-button>
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
    <audit v-if="auditVisible" ref="Audit" @refreshDataList="getDataList"></audit>
    <check v-if="checkVisible" ref="check" @refreshDataList="getDataList"></check>
    <Update v-if="UpdateVisible" ref="Update" @refreshDataList="getDataList"></Update>
  </div>
</template>

<script>
  import AddOrUpdate from './cash-add-or-updata'
  import Update from './cash-updata'
  import Audit from './cash-audit'
  import check from './cash-check'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          status: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        accessPlatformId: '',
        totalPage: 0,
        dataList2: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        auditVisible: false,
        checkVisible: false,
        isActive: false,
        falg: false,
        isShow: false,
        UpdateVisible: false,
        firstTime: true
      }
    },
    components: {
      AddOrUpdate,
      Audit,
      check,
      Update
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/user/meInfo'),
          method: 'get'
        }).then(({data}) => {
          this.accessPlatformId = data.res.data.accessPlatformId
          if (data.res.data.accessPlatformId === '' || data.res.data.accessPlatformId == null) {
            this.isShow = true
          }
          this.$http({
            url: this.$http.adornUrl('/m/selectAccessPlatforms'),
            method: 'get'
          }).then(({data}) => {
            this.$set(this, 'dataList2', data.res.data)
            this.accessPlatformId1 = data.res.data.id
            for (var i = 0; i < this.dataList2.length; i++) {
              this.accessPlatformId1 = this.dataList2[i].id
              if (this.accessPlatformId !== '' && this.accessPlatformId === this.accessPlatformId1) {
                this.dataForm.platformName = this.dataList2[i].platformName
                this.dataForm.id = this.dataList2[i].id
                this.isActive = true
              }
              if (this.firstTime) {
                this.getDataList()
                this.firstTime = false
              }
            }
          })
        })
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            'accessPlatformId': this.dataForm.id,
            'status': this.dataForm.status
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
      // 提现 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 复制-提现
      UpdateHandle (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length <= 0) {
          this.$message.error('请选择一个')
          this.UpdateVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.UpdateVisible = false
        } else {
          this.UpdateVisible = true
          this.$nextTick(() => {
            this.$refs.Update.init(id[0])
          })
        }
      },
      // 审查
      addAudit (id) {
        this.auditVisible = true
        this.$nextTick(() => {
          this.$refs.Audit.init(id)
        })
      },
      // 查看
      addCheck (id) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id)
        })
      },
      addpay (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/cashPay/' + id + '/1'),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.falg = true
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      addpay02 (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/cashPay/' + id + '/2'),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.falg = true
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
            url: this.$http.adornUrl('/m/dictionary/delByIds'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
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