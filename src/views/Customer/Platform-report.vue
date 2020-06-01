<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item label="商户名称">
        <el-select v-model="dataForm.id" :disabled='isActive' class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList1"
            :key="item.id"
            :label="item.platformName"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="日期">
       <el-date-picker
      v-model="dataForm.time"
      type="daterange"
      minView="month"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="getDataList()">查询</el-button>
        <el-button type="primary" plain @click="rest(dataForm)">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="countBalance"
        header-align="center"
        align="center"
        label="订单总金额">
      </el-table-column>
      <el-table-column
        prop="chargeBalance"
        header-align="center"
        align="center"
        label="总手续费">
      </el-table-column>
      <el-table-column
        prop="settlementBalance"
        header-align="center"
        align="center"
        label="订单应结算金额">
      </el-table-column>
      <el-table-column
        prop="countSettlementBalance"
        header-align="center"
        align="center"
        label="订单可提现金额">
      </el-table-column>
      <el-table-column
        prop="alreadySettlementBalance"
        header-align="center"
        align="center"
        label="订单已结算金额">
      </el-table-column>
      
      <el-table-column
        prop="intransitBalance"
        header-align="center"
        align="center"
        label="在途金额">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="130"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addWallet(scope.row.id)">明细</el-button>
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
     <walletdetails v-if="addwalletVisible" ref="Walletdetails" @refreshDataList="getDataList"></walletdetails>
  </div>
</template>

<script>
 import Walletdetails from './Wallet-details'
 export default {
   data () {
     return {
       id: '',
       dataForm: {
         platformName: '',
         time: '',
         id: ''
       },
       accessPlatformId: '',
       dataList: [],
       dataList1: [],
       pageIndex: 1,
       pageSize: 10,
       totalPage: 0,
       firstTime: true,
       dataListLoading: false,
       addwalletVisible: false,
       dataListSelections: [],
       isActive: false
     }
   },
   components: {
     Walletdetails
   },
   activated () {
     this.getDataList()
   },
   computed: {
     startTimeStr2: {
       get () { return this.$store.state.user.startTime2 },
       set (val) { this.$store.commit('user/updatestartTimeStr2', val) }
     },
     endTimeStr2: {
       get () { return this.$store.state.user.endTime2 },
       set (val) { this.$store.commit('user/updateendTimeStr2', val) }
     }
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
           this.$set(this, 'dataList1', data.res.data)
           this.accessPlatformId1 = data.res.data.id
           for (var i = 0; i < this.dataList1.length; i++) {
             this.accessPlatformId1 = this.dataList1[i].id
             if (this.accessPlatformId !== '' && this.accessPlatformId === this.accessPlatformId1) {
               this.dataForm.platformName = this.dataList1[i].platformName
               this.dataForm.id = this.dataList1[i].id
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
         url: this.$http.adornUrl('/m/accessPlatform/walletPage'),
         method: 'post',
         params: this.$http.adornParams({
           'currentPage': this.pageIndex,
           'pageSize': this.pageSize
         }),
         data: JSON.stringify({
           accessPlatformId: this.dataForm.id,
           startTimeStr: this.dataForm.time[0],
           endTimeStr: this.dataForm.time[1]
         })
       }).then(({data}) => {
         if (data && data.code === '200') {
           this.dataList = data.res.data.records
           this.totalPage = data.res.data.total
           this.startTimeStr2 = this.dataForm.time[0]
           this.endTimeStr2 = this.dataForm.time[1]
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
     rest (dataForm) {
       this.dataForm.time = ''
     },
     addWallet (id) {
       this.addwalletVisible = true
       this.$nextTick(() => {
         this.$refs.Walletdetails.init(id)
       })
     }
   }
 }
</script>
<style scoped>

</style>