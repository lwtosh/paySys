<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm"  :rules="dataRule"  ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
    <el-form-item label="商户名称">
      <el-select  v-model="dataForm.platformName" :disabled='isActive' class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id"
            >
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="应用名称">
          <el-select v-model="dataForm.name" class="input-width" placeholder="全部" clearable>
           <el-option v-for="item in dataList3"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="支付渠道" prop="payCompany">
         <el-select v-model="dataForm.payCompany" placeholder="支付渠道">
           <el-option v-for='item in merchantList' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台订单号" prop="orderNo" >
        <el-input v-model="dataForm.orderNo" :minlength="1" :maxlength="30" placeholder="平台订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="客户订单号" prop="fourOrderNo" >
        <el-input v-model="dataForm.fourOrderNo" :minlength="1" :maxlength="30" placeholder="客户订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
      <el-select  v-model="dataForm.status"  class="input-width" placeholder="全部" clearable>
        <el-option label="待支付" value="1"></el-option>
        <el-option label="支付成功" value="2"></el-option>
        <el-option label="支付失败" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="结算状态">
      <el-select  v-model="dataForm.settlementStatus"  class="input-width" placeholder="全部" clearable>
        <el-option label="未结算" value="1"></el-option>
        <el-option label="已结算" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="日期">
       <el-date-picker
      v-model="dataForm.time"
      type="daterange"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="getDataList()">查询</el-button>
        <el-button type="primary" plain @click="resetForm('dataForm')">重置</el-button>
        <el-button type="primary" plain @click="rewire(id)">手工重发</el-button>
      </el-form-item>
      <div>
       <el-form-item label="成功笔数">
        {{this.countOrder}}
      </el-form-item>
      <el-form-item label="成功金额">
        {{this.countOrderTotalFee}}元
      </el-form-item>
     </div>
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
        prop="accessPlatformName"
        header-align="center"
        align="center"
        width="180"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="payCompany"
        header-align="center"
        align="center"
        width="120"
        label="支付渠道">
      </el-table-column>
      <el-table-column
        prop="merchantName"
        header-align="center"
        align="center"
        width="180"
        label="应用名称">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        header-align="center"
        align="center"
        width="180"
        label="平台订单号">
      </el-table-column>
      <el-table-column
        prop="fourOrderNo"
        header-align="center"
        align="center"
        width="200"
        label="客户订单号"
        :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="threeOrderNo"
        header-align="center"
        align="center"
        width="200"
        label="支付订单号"
        :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column
        prop="strTotalFee"
        header-align="center"
        align="center"
        width="120"
        label="订单总金额">
      </el-table-column>
      <el-table-column
        prop="strActualFee"
        header-align="center"
        align="center"
        width="120"
        label="结算金额">
      </el-table-column>
      <el-table-column
        prop="strChargeFee"
        header-align="center"
        align="center"
        width="120"
        label="手续费">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="订单状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" >待支付</el-tag>
          <el-tag v-if="scope.row.status === '2'" size="small" >支付成功</el-tag>
          <el-tag v-if="scope.row.status === '3'" size="small" type="danger">支付失败</el-tag>
          <el-tag v-if="scope.row.status === '4'" size="small">订单关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="settlementStatus "
        header-align="center"
        align="center"
        width="120"
        label="结算状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.settlementStatus === '1'" size="small" >未结算</el-tag>
          <el-tag v-if="scope.row.settlementStatus === '2'" size="small" >部分结算</el-tag>
          <el-tag v-if="scope.row.settlementStatus === '3'" size="small" >已结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="settlementTime"
        header-align="center"
        align="center"
        width="180"
        label="结算时间">
      </el-table-column>
      <!-- <el-table-column
        prop="closeTime"
        header-align="center"
        align="center"
        width="180"
        label="订单关闭时间">
      </el-table-column> -->
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
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="handlePages(scope.row.id)">回调记录</el-button>
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
import AddOrUpdate from './order-call-back.vue'
export default {
  data () {
    var validateOrder = (rule, value, callback) => {
      let reg = /^[0-9]{1,30}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('必须为数字值且长度在1到30位'))
      }
    }
    return {
      id: '',
      idm: '',
      dataForm: {
        platformName: '',
        name: '',
        fourOrderNo: '',
        orderNo: '',
        status: '',
        payCompany: '',
        time: ''
      },
      accessPlatformId: '',
      accessPlatformId1: '',
      countOrderTotalFee: '',
      countOrder: '',
      dataList: [],
      dataList2: [],
      dataList3: [],
      merchantList: [],
      PAY_COMPANY: ['PAY_COMPANY'],
      isActive: false,
      firstTime: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataListSelections: [],
      dataRule: {
        orderNo: [
            {validator: validateOrder, trigger: 'blur'}
        ],
        fourOrderNo: [
            {validator: validateOrder, trigger: 'blur'}
        ]
      }
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
      // 支付公司
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.PAY_COMPANY)
      }).then(({ data }) => {
        this.$set(this, 'merchantList', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/user/meInfo'),
        method: 'get'
      }).then(({data}) => {
        this.accessPlatformId = data.res.data.accessPlatformId
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
              this.isActive = true
            } if (this.firstTime) {
              this.getDataList()
              this.firstTime = false
            }
          }
        })
      })
        // 应用平台下拉框
      this.$http({
        url: this.$http.adornUrl('/m/selectMerchants'),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList3', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/order/page'),
        method: 'post',
        params: this.$http.adornParams({
          'currentPage': this.pageIndex,
          'pageSize': this.pageSize
        }),
        data: JSON.stringify({
          'accessPlatformId': this.dataForm.platformName,
          'merchantId': this.dataForm.name,
          'fourOrderNo': this.dataForm.fourOrderNo,
          'orderNo': this.dataForm.orderNo,
          'status': this.dataForm.status,
          'settlementStatus': this.dataForm.settlementStatus,
          'payCompany': this.dataForm.payCompany,
          'startTimeStr': this.dataForm.time[0],
          'endTimeStr': this.dataForm.time[1]
        })
      }).then(({data}) => {
        if (data && data.code === '200') {
          this.dataList = data.res.data.records
          this.totalPage = data.res.data.total
          this.countOrder = data.res.countOrder
          this.countOrderTotalFee = data.res.countOrderTotalFee
          this.merchantList.forEach((item, index) => {
            this.dataList.forEach((n, m) => {
              if (item.keyName === n.payCompany) {
                this.$set(this.dataList[m], 'payCompany', item.value)
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
      // 重置
    resetForm (dataForm) {
      this.dataForm = Object.assign({}, dataForm)
    },
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 手工重发
    rewire (id) {
        // eslint-disable-next-line no-redeclare
      var id = id || this.dataListSelections.map(item => {
        return item.id
      })
      if (id !== '' && this.dataListSelections.length <= 0) {
        this.$message.error('请选择一个')
      } else if (id !== '' && this.dataListSelections.length > 1) {
        this.$message.error('只能选择一个')
      } else {
        this.$http({
          url: this.$http.adornUrl('/m/order/notify/' + id[0]),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }
    },
    // 回调记录
    handlePages (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
<style scoped>
</style>