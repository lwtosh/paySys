<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <div>
        <div class="box">
        <el-form-item
        label="账户类型"
        prop="accType"
        style="width:50%;">
      <el-select v-model="dataForm.accType" placeholder="账户类型">
           <el-option v-for='item in merchantList2' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item
        label="账户姓名"
        prop="bankName">
      <el-input v-model="dataForm.bankName" placeholder="账户姓名">
      </el-input>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="证件类型"
        prop="cardType"
        style="width:50%;">
       <el-select v-model="dataForm.cardType" placeholder="证件类型">
           <el-option v-for='item in merchantList3' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
       </el-form-item>
      <el-form-item
        label="证件号码"
        prop="cardNo" >
      <el-input :maxlength="18" v-model="dataForm.cardNo" placeholder="证件号码"> </el-input>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="银行卡类型"
        prop="bankType"
        style="width:50%;">
        <el-select v-model="dataForm.bankType" placeholder="证件类型">
           <el-option v-for='item in merchantList4' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡号"
        prop="bankNo">
        <el-input
          v-model="dataForm.bankNo"
          :maxlength="22"
          :step='4'
          placeholder="银行卡号">
        </el-input>
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item
        label="银行卡所在省"
        prop="province"
        style="width:50%;">
      <el-select @change="handleChange" v-model="dataForm.province" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList3" 
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡所在市"
        prop="urban"
        >
        <el-select v-model="dataForm.urban" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList4" 
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
      </el-select>
      </el-form-item>
      </div>
     <div class="box">
       <el-form-item
        label="开户行"
        prop="openingBank" 
        style="width:50%;">
        <el-select v-model="dataForm.openingBank" placeholder="证件类型">
           <el-option v-for='item in merchantList1' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
       <el-form-item
        label="开户行地址"
        prop="bankAddress">
        <el-input
          v-model="dataForm.bankAddress"
          placeholder="开户行地址"
          :maxlength="50"
        ></el-input>
      </el-form-item>
       </div>
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
    var validateNo = (rule, value, callback) => {
      let reg = /^[0-9]{5,22}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('卡号只能为正整数且长度在5到22之间'))
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
      isActive: false,
      firstTime: true,
      cashId: '',
      isActive2: false,
      dataForm: {
        id: '',
        accType: '',
        cardType: '',
        bankType: '',
        bankNo: '',
        bankName: '',
        province: '',
        openingBank: '',
        bankAddress: '',
        urban: '',
        cardNo: ''
      },
      dataRule: {
        accType: [
          { required: true, message: '请选择账户类型', trigger: 'blur' }
        ],
        cardNo: [
          { message: '证件号码不能为空', trigger: 'change' },
          {min: 18, max: 18, validator: validateCard}
        ],
        cardType: [
          { message: '请选择证件类型', trigger: 'change' }
        ],
        cashType: [
          { required: true, message: '请选择提现方式', trigger: 'blur' }
        ],
        bankType: [
          { required: true, message: '请选择银行类型', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' },
          {min: 5, max: 22, validator: validateNo}
        ],
        bankName: [
          { required: true, message: '账户名称不能为空', trigger: 'blur' }
        ],
        cashName: [
          { required: true, message: '收款名字不能为空', trigger: 'blur' }
        ],
        cashAccount: [
          { required: true, message: '提现账号不能为空', trigger: 'blur' }
        ],
        province: [
          { message: '请选择省份', trigger: 'change' }
        ],
        openingBank: [
          { message: '请选择开户行', trigger: 'change' }
        ],
        bankAddress: [
          { message: '请填写地址', trigger: 'change' },
          {min: 3, max: 50, message: '长度在3到50之间'}
        ],
        urban: [
          { message: '请选择市', trigger: 'change' }
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
        url: this.$http.adornUrl('/m/common/provincess'),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList3', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.BANK_NAME)
      }).then(({ data }) => {
        this.$set(this, 'merchantList1', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.ACC_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList2', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.CARD_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList3', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.BANK_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList4', data.res.data)
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformBank/info/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
          this.isActive2 = true
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
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatformBank/aou/${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
            method: this.dataForm.id ? 'put' : 'post',
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
    },
    close () {
      this.$set(this, 'dataForm', {
        id: '',
        accType: '',
        cardType: '',
        bankType: '',
        bankNo: '',
        bankName: '',
        province: '',
        openingBank: '',
        bankAddress: '',
        urban: '',
        cardNo: ''
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