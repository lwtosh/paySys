<template>
  <el-dialog
    :title="'新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <div class="box">
        <el-form-item
        label="商户名称"
        style="width:50%;"
        prop="accessPlatformId">
      <el-select @change="handleChange2" :disabled='isActive' v-model="dataForm.accessPlatformName" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="提现方式" prop="cashType">
      <el-select  :disabled="isActive2" v-model="dataForm.cashType" class="input-width" placeholder="全部" clearable>
        <el-option label="银行卡" value="1"></el-option>
        <el-option label="支付宝" value="2"></el-option>
        <el-option label="微信" value="3"></el-option>
      </el-select>
    </el-form-item>
      </div>
      <div v-if="this.dataForm.cashType === '1'">
      <el-form-item
        label="我的银行卡"
        prop="cardType" style="width:100%;">
       <el-select v-model="dataForm.bankId" placeholder="银行卡">
           <el-option v-for='item in dataList3' :key="item.id" :label="item.bankName+'-'+item.bankNo" :value="item.id"></el-option>
         </el-select><br><span>如果没有银行卡请先去填写</span>
       </el-form-item>

      </div>

      <div class="box">
        <el-form-item
        label="收款姓名"
        prop="cashName"
        style="width:50%;" v-if="this.dataForm.cashType === '2' || this.dataForm.cashType === '3'">
        <el-input v-model="dataForm.cashName" placeholder="收款姓名"> </el-input>
       </el-form-item>
      <el-form-item
        label="支付宝账号"
        prop="cashAccount" v-if="this.dataForm.cashType === '2'">
      <el-input :maxlength="30" v-model="dataForm.cashAccount" placeholder="支付宝账号"> </el-input>
      </el-form-item>
       <el-form-item
        label="微信账号"
        prop="cashAccount" v-if="this.dataForm.cashType === '3'">
      <el-input :maxlength="30" v-model="dataForm.cashAccount" placeholder="微信账号"> </el-input>
      </el-form-item>
      </div>

      <el-form-item
        label="资金密码"
        prop="capitalPassWord"
        style="width:42%;" 
        >
        <el-input
          type="password"
          :maxlength="20"
          v-model="dataForm.capitalPassWord"
          placeholder="资金密码"
        ></el-input>
      </el-form-item>
      <div class="box">
        <el-form-item
        label="可提现额"
        prop="strBalance" style="width:50%;">{{this.strBalance || 0}}
      </el-form-item>
      <el-form-item
        label="提现金额"
        prop="withdrawalFee" :maxlength="6">
        <el-input
          v-model="dataForm.withdrawalFee"
          placeholder="提现金额"
        ></el-input>
      </el-form-item>
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
import { isMobile } from '@/utils/validate'
export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var validateFree = (rule, value, callback) => {
      let reg = /^[0-9]{1,6}$/
      if (reg.test(value) && value >= 10) {
        callback()
      } else {
        callback(new Error('金额只能为正整数且小于六位数'))
      }
    }
    var validateNo = (rule, value, callback) => {
      let reg = /^[0-9]{15,18}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('卡号只能为正整数且长度在15到18之间'))
      }
    }
    var validateCard = (rule, value, callback) => {
      let reg = /^[0-9]{18}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('证件号只能为正整数且长度在18位'))
      }
    }
    return {
      visible: false,
      dataList2: [],
      dataList3: [],
      dataList4: [],
      BANK_NAME: ['BANK_NAME'],
      ACC_TYPE: ['ACC_TYPE'],
      CARD_TYPE: ['CARD_TYPE'],
      BANK_TYPE: ['BANK_TYPE'],
      merchantList1: [],
      merchantList2: [],
      merchantList3: [],
      merchantList4: [],
      provincesId: [],
      strBalance: '',
      isActive: false,
      accessPlatformId: '',
      accessPlatformId1: '',
      firstTime: true,
      isActive2: false,
      cashId: '',
      dataForm: {
        id: '',
        accessCode: '',
        accType: '',
        cardType: '',
        platformName: '',
        withdrawalFee: '',
        accessPlatformId: '',
        urban: '',
        cardNo: '',
        capitalPassWord: ''
      },
      dataRule: {
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        accessPlatformId: [
          { required: true, message: '请选择平台名称', trigger: 'blur' }
        ],
        accType: [
          { required: true, message: '请选择账户类型', trigger: 'blur' }
        ],
        cardNo: [
          { message: '证件号码不能为空', trigger: 'blur' },
          {min: 18, max: 18, validator: validateCard}
        ],
        cardType: [
          { message: '请选择证件类型', trigger: 'blur' }
        ],
        bankType: [
          { required: true, message: '请选择银行类型', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' },
          {min: 15, max: 21, validator: validateNo}
        ],
        bankName: [
          { required: true, message: '账户名称不能为空', trigger: 'blur' }
        ],
        province: [
          { message: '请选择省份', trigger: 'blur' }
        ],
        openingBank: [
          { message: '请选择开户行', trigger: 'blur' }
        ],
        bankAddress: [
          { message: '请填写地址', trigger: 'blur' },
          {min: 3, max: 50, message: '长度在3到50之间'}
        ],
        withdrawalFee: [
          { required: true, message: '可提金额不能为空', trigger: 'blur' },
          {min: 1, max: 6, validator: validateFree}
        ],
        urban: [
          { message: '请选择市', trigger: 'blur' }
        ],
        capitalPassWord: [
          { required: true, message: '请填写资金密码', trigger: 'blur' },
          {min: 6, max: 20, message: '长度在6到20之间'}
        ]
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
              this.dataForm.platformName = this.dataList2[i].accessPlatformName
              this.dataForm.accessPlatformId = this.dataList2[i].id
              console.log(this.dataForm.accessPlatformId)
              this.isActive = true
            }
            if (this.firstTime) {
              this.init(id)
              this.handleChange2()
              this.firstTime = false
            }
          }
        })
      })
      this.$http({
        url: this.$http.adornUrl('/m/accessPlatformBank/meBanks'),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList3', data.res.data)
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
          this.isActive2 = true
          this.dataForm.withdrawalFee = ''
          if (!res.data.res.data.ids) {
            this.$set(this.dataForm, 'ids', [])
          }
        })
      }
    },
    handleChange (val) {
      this.provincesId = val
      this.$http({
        url: this.$http.adornUrl('/m/common/getcp/' + this.provincesId),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList4', data.res.data)
      })
    },
    handleChange2 (val) {
      this.dataList2.forEach(item => {
        if (item.id === this.dataForm.accessPlatformId) {
          this.strBalance = item.strBalance
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatformCash`),
            method: 'post',
            data: JSON.stringify(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
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