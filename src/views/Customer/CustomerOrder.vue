<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm"  :rules="dataRule" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item label="商户名称">
      <el-select v-model="dataForm.id" :disabled='isActive' class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id">
          </el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="平台订单号" prop="orderNo">
        <el-input v-model="dataForm.orderNo"  :maxlength="30" placeholder="平台订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="客户订单号" prop="fourOrderNo">
        <el-input v-model="dataForm.fourOrderNo"  :maxlength="30" placeholder="客户订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
      <el-select  v-model="dataForm.status"  class="input-width" placeholder="全部" clearable>
        <el-option label="待支付" value="1"></el-option>
        <el-option label="支付成功" value="2"></el-option>
        <el-option label="支付失败" value="3"></el-option>
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
      v-loading="dataListLoading">
      <el-table-column
        prop="accessPlatformName"
        header-align="center"
        align="center"
        width="180"
        label="商户名称">
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
        width="200"
        prop="threeOrderNo"
        header-align="center"
        align="center"
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
        header-align="center"
        align="center"
        width="100"
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
         width="100"
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
  </div>
</template>

<script>
  export default {
    data () {
      var validateOrder = (rule, value, callback) => {
        let reg1 = /^\d{1,30}$/
        if (reg1.test(value)) {
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
          fourOrderNo: '',
          orderNo: '',
          status: '',
          time: '',
          id: ''
        },
        countOrderTotalFee: '',
        countOrder: '',
        accessPlatformId: '',
        dataList: [],
        dataList2: [],
        isActive: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        firstTime: true,
        dataListLoading: false,
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
    mounted () {
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
          url: this.$http.adornUrl('/m/user/meInfo'),
          method: 'get'
        }).then(({ data }) => {
          if (data.res.data.accessPlatformId !== '') {
          }
        })
        this.$http({
          url: this.$http.adornUrl('/m/order/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            'accessPlatformId': this.dataForm.id,
            'fourOrderNo': this.dataForm.fourOrderNo,
            'orderNo': this.dataForm.orderNo,
            'status': this.dataForm.status,
            'startTimeStr': this.dataForm.time[0],
            'endTimeStr': this.dataForm.time[1]
          })
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.dataList = data.res.data.records
            this.totalPage = data.res.data.total
            this.countOrder = data.res.countOrder
            this.countOrderTotalFee = data.res.countOrderTotalFee
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
      }
  
    }
  }
</script>
<style scoped>
</style>