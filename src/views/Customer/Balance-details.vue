<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" >
      <el-form-item label="商户编码">
        <el-input v-model="dataForm.accNo"  :maxlength="30" placeholder="商户编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="dataForm.accName"  :maxlength="30" placeholder="账户号" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付渠道" prop="payCompany">
         <el-select v-model="dataForm.payCompany" placeholder="支付渠道">
           <el-option v-for='item in merchantList' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易日期">
       <el-date-picker
      v-model="dataForm.time"
      :default-value="this.TimeSpace"
      type="daterange"
      minView="month"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="getDataList()">查询</el-button>
        <el-button type="primary" plain @click="rest(dataForm)">重置</el-button>
        <a :href="downloadSrc ? downloadSrc : '#'" class="btnA">导出</a>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="accNo"
        header-align="center"
        align="center"
        label="商户编码">
      </el-table-column>
      <el-table-column
        prop="accName"
        header-align="center"
        align="center"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="voucher"
        header-align="center"
        align="center"
        width="200"
        label="凭证号">
      </el-table-column>
      <el-table-column
        prop="happenBal"
        header-align="center"
        align="center"
        label="发生额度">
        <template slot-scope="scope">
          {{scope.row.happenBal / 100}}
        </template>
      </el-table-column>
      <el-table-column
        prop="payCompany"
        header-align="center"
        align="center"
        width="120"
        label="支付渠道">
      </el-table-column>
      <el-table-column
        prop="transactionType"
        header-align="center"
        align="center"
        label="交易类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.transactionType === '1'" size="small" >收款</el-tag>
          <el-tag v-if="scope.row.transactionType === '2'" size="small" >提现</el-tag>
          <el-tag v-if="scope.row.transactionType === '3'" size="small">代付</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="changeQbal"
        header-align="center"
        align="center"
        width="120"
        label="变更前余额">
         <template slot-scope="scope">
          {{scope.row.changeQbal / 100}}
        </template>
      </el-table-column>
      <el-table-column
        prop="changeHbal"
        header-align="center"
        align="center"
        width="120"
        label="变更后余额">
        <template slot-scope="scope">
          {{scope.row.changeHbal / 100}}
        </template>
      </el-table-column>
      <el-table-column
        prop="waterNo"
        width="200"
        header-align="center"
        align="center"
        label="交易流水">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="交易时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
         label="备注"
        :show-overflow-tooltip='true'
       >
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
import Vue from 'vue'
export default {
  data () {
    var showDate = new Date()
    let seperator = '-'
    let year = showDate.getFullYear()
    let month = showDate.getMonth() + 1
    // eslint-disable-next-line no-unused-vars
    let day = showDate.getDate()
    var strDate = showDate.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    let currentdate = year + seperator + month + seperator + strDate
    let _minTime = null
    let _maxTime = null
    return {
      TimeSpace: [currentdate, currentdate],
      id: '',
      dataForm: {
        accNo: '',
        accName: '',
        payCompany: '',
        time: '',
        id: ''
      },
      accessPlatformId: '',
      dataList: [],
      dataList1: [],
      merchantList: [],
      PAY_COMPANY: ['PAY_COMPANY'],
      downloadSrc: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      firstTime: true,
      dataListLoading: false,
      addwalletVisible: false,
      dataListSelections: [],
      isActive: false,
      dealDisabledDate: '',
      pickerOptions: {
        onPick (time) {
                  // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = 6 * 24 * 60 * 60 * 1000 // 6天
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
                     // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate (time) {
             // onPick后触发
             // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime
          }
        }
      }
    }
  },
  activated () {
    this.dataForm.time = this.TimeSpace
      // 支付公司
    this.$http({
      url: this.$http.adornUrl('/m/dictionary/configKeys'),
      method: 'post',
      data: JSON.stringify(this.PAY_COMPANY)
    }).then(({ data }) => {
      this.$set(this, 'merchantList', data.res.data)
    })
  },
  methods: {
    dealDisabledDate (time) {
            // 一天的毫秒数 = 8.64e7  判断时在return处可进行加减
      let curDate = (new Date()).getTime()
      let day = 30 * 24 * 3600 * 1000
      let dateRegion = curDate - day
      return time.getTime() > Date.now() || time.getTime() < dateRegion
    },
      // 获取数据列表
    getDataList () {
      this.dataListLoading = true

      this.$http({
        url: this.$http.adornUrl('/m/balanceDetail/page'),
        method: 'post',
        params: this.$http.adornParams({
          'currentPage': this.pageIndex,
          'pageSize': this.pageSize
        }),
        data: JSON.stringify({
          accNo: this.dataForm.accNo,
          payCompany: this.dataForm.payCompany,
          accName: this.dataForm.accName,
          startTimeStr: this.dataForm.time[0],
          endTimeStr: this.dataForm.time[1]
        })
      }).then(({data}) => {
        if (data && data.code === '200') {
          this.dataList = data.res.data.records
          this.totalPage = data.res.data.total
          this.startTimeStr2 = this.dataForm.time[0]
          this.endTimeStr2 = this.dataForm.time[1]
          this.downloadSrc = 'http://pay-web-test.rrhbull.cn/m/balanceDetail/export?token=' + Vue.cookie.get('token') + '&accNo=' + this.dataForm.accNo + '&accName=' + this.dataForm.accName + '&payCompany=' + this.dataForm.payCompany + '&startTimeStr=' + this.dataForm.time[0] + '&endTimeStr=' + this.dataForm.time[1]
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
    rest (dataForm) {
      this.dataForm.time = ''
      this.dataForm.accNo = ''
      this.dataForm.accName = ''
      this.dataForm.payCompany = ''
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
    .btnA{
    padding: 0px 20px;
    border-radius: 4px;
    background: #17B3A3;
    display: inline-block;
    color: #fff;
    cursor: pointer;
    text-decoration: none
}
.btnA:hover,.btnA:link {
  text-decoration: none;
  color: #fff;
}
  </style> 