<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close = "close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="公告内容" prop="context">
        <el-input v-model="dataForm.context" placeholder="公告内容"></el-input>
      </el-form-item>
       <el-form-item label="开始时间" prop="stime">
          <el-date-picker v-model="dataForm.stime" type="datetime"  placeholder="开始时间" :picker-options="pickerOptions0"  value-format='yyyy-MM-dd HH:MM:ss'>
           </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="etime">
           <el-date-picker v-model="dataForm.etime" type="datetime" placeholder="结束时间"  :picker-options="pickerOptions1" value-format='yyyy-MM-dd HH:MM:ss'>
           </el-date-picker>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
          context: '',
          stime: '',
          etime: ''
        },
        pickerOptions0: {
          disabledDate: time => {
            let endDateVal = new Date(this.dataForm.etime).getTime()
            if (endDateVal) {
              return time.getTime() > endDateVal
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            let beginDateVal = new Date(this.dataForm.stime).getTime()
            if (beginDateVal) {
              return time.getTime() <= beginDateVal - 8.64e6
            }
          }
        },
        dataRule: {
          context: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          stime: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          etime: [
            { required: true, message: '必填', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        if (id) {
          this.$http({
            url: this.$http.adornUrl('/m/notice/info/' + id),
            method: 'get'
          })
          .then(res => {
            // conso
            this.$set(this, 'dataForm', res.data.res.data)
            console.log(this.dataForm)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/m/notice/aou${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
              method: this.dataForm.id ? 'put' : 'post',
              data: JSON.stringify(this.dataForm)
            }).then(({data}) => {
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
          context: '',
          stime: '',
          etime: ''
        })
      }
    }
  }
</script>
