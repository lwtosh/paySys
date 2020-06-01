<template>
<div class="cont">
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="login-main">
          <h3 class="login-title">支付管理系统</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input   prefix-icon="el-icon-user" v-model="dataForm.userName" placeholder="帐号" @blur="getCaptcha1">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input  prefix-icon="el-icon-lock" v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha" v-if="this.dataForm.userName && this.dataForm.password">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="this.captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
  import { getUUID } from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          accessPlatformId: '',
          captcha: ''
  
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' },
            {min: 4, max: 30, message: '长度在4到30位之间'}
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            {min: 6, max: 20, message: '长度在6到20位之间'}
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        uuid: '',
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha1()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/m/login'),
              method: 'post',
              type: 'success',
              data: this.$http.adornData({
                'userCode': this.dataForm.userName,
                'userPwd': this.dataForm.password,
                'verifyCode': this.dataForm.captcha
              })
            }).then(({data}) => {
              // console.log(data)
              if (data && data.code === '200') {
                this.$cookie.set('token', data.res.data.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.message)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha1 () {
        this.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/m/code?userCode=${this.dataForm.userName}&uuid=${this.uuid}`)
      },
      getCaptcha () {
        this.getCaptcha1()
      }
    }
  }
</script>

<style lang="scss">
.cont{
  width: 100%;
  height: 100%;
   
}
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(~@/assets/img/bg.png) no-repeat;
    background-size:100% 100%;
    overflow: hidden;
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
    }
    .brand-info {
      position: absolute;
      top: 25%;
      right: 51%;
      padding: 26px;
      height: 315px;
      text-align: center;
      width: 320px;
      background-image: linear-gradient(to top, #6a85b6 0%, #bac8e0 100%);
    }
    .brand-info__text {
     margin-top: 115px;
      font-size: 24px;
      font-weight:300;
      color: #243B60;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 25%;
      right: 40%;
      padding: 26px;
      width: 320px;
      border-radius: 15px;
      color: #333;
      background: #fff;
    }
    .login-title {
      font-size: 16px;
      text-align: center;
      margin-top: 0px;
      padding-bottom:20px; 
      margin-bottom: 40px;
      border-bottom: 1px solid #ccc;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 20px;
    }
  }
  .login-main .el-input__inner{
    // border: none;
    color: #27282b;
    border-radius: 5px;
    // background: #586B8D;
    border-bottom: 1px solid #053a70;
  }
  // #1F3F8D
 .login-main .el-button--primary{
  background:#053a70;
  border: 1px solid #053a70;
}
</style>
