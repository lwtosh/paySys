<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <div class="box">
        <el-form-item
        label="商户名称"
        style="width:50%;">
      {{this.dataForm.accessPlatformName}}
      </el-form-item>
      <el-form-item
        label="提现方式"
        style="width:50%;">
        <div v-if="this.dataForm.cashType === '1' ">银行卡</div>
        <div v-if="this.dataForm.cashType === '2' ">支付宝</div>
        <div v-if="this.dataForm.cashType === '3' ">微信</div>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
          label="收款名字"
          style="width:50%;" v-if="this.dataForm.cashType === '2' || this.dataForm.cashType === '3'">
          {{this.dataForm.cashName}}
         </el-form-item>
         <el-form-item
          label="支付宝账户"
          style="width:50%;" v-if="this.dataForm.cashType === '2'">
          {{this.dataForm.cashAccount}}
         </el-form-item>
         <el-form-item
          label="微信账户"
          style="width:50%;" v-if="this.dataForm.cashType === '3'">
          {{this.dataForm.cashAccount}}
         </el-form-item>
      </div>
        <div class="box">
        <el-form-item
        label="账户类型"
        prop="accType"
        style="width:50%;" v-if="this.dataForm.cashType === '1'">
      {{this.dataForm.accTypeName}}
      </el-form-item>
      <el-form-item
        label="账户姓名"
        prop="bankName" v-if="this.dataForm.cashType === '1'">
      {{this.dataForm.bankName}}
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="证件类型"
        prop="cardType"
        style="width:50%;" v-if="this.dataForm.cashType === '1'">
       {{this.dataForm.cardTypeName}}
       </el-form-item>
      <el-form-item
        label="证件号码"
        prop="cardNo" v-if="this.dataForm.cashType === '1'">
      {{this.dataForm.cardNo}}
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="银行卡类型"
        style="width:50%;" v-if="this.dataForm.cashType === '1'">
        {{this.dataForm.bankTypeName}}
      </el-form-item>
      <el-form-item
        label="银行卡号"
        prop="bankNo" v-if="this.dataForm.cashType === '1'">
        {{this.dataForm.bankNo}}
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item
        label="银行卡所在省"
        prop="province"
        style="width:50%; " v-if="this.dataForm.cashType === '1'">
      {{this.dataForm.provinceName}}
      </el-form-item>
      <el-form-item
        label="银行卡所在市"
        prop="urban" v-if="this.dataForm.cashType === '1'"
        >
        {{this.dataForm.urban}}
      </el-form-item>
      </div>
     <div class="box">
       <el-form-item
        label="开户行"
        prop="openingBank" 
        style="width:50%;" v-if="this.dataForm.cashType === '1'">
        {{this.dataForm.openingBankName}}
      </el-form-item>
       <el-form-item
        label="开户行地址"
        prop="bankAddress" v-if="this.dataForm.cashType === '1'">
        {{this.dataForm.bankAddress}}
      </el-form-item>
      </div>
      
      <div class="box">
      <el-form-item
        label="提现金额"
        prop="strWithdrawalFee">
        {{this.dataForm.strWithdrawalFee}}
      </el-form-item>
      <!-- <el-form-item
        label="手续费"
        prop="strChargeFee">
        {{this.dataForm.strChargeFee}}
      </el-form-item> -->
      </div>
      
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        accessPlatformName: '',
        accessPlatformId: '',
        accTypeName: '',
        balance: '',
        cardTypeName: '',
        bankTypeName: '',
        bankNo: '',
        bankName: '',
        provinceName: '',
        openingBankName: '',
        bankAddress: '',
        withdrawalFee: '',
        urbanName: '',
        capitalPassWord: '',
        cashAccount: '',
        strChargeFee: '',
        cashName: '',
        status: 1
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
          if (!res.data.res.data.ids) {
            this.$set(this.dataForm, 'ids', [])
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.visible = false
      this.$emit('refreshDataList')
    }
  }
}
</script>

<style>
.box{
  width: 100%;
  display: flex;
}
</style>

