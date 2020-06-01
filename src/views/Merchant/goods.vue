<template>
   <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm"  @keyup.enter.native="dataFormSubmit()" >
    <el-form-item label="应用名称：" prop="name" label-width="100px">
        {{dataForm.name}}
    </el-form-item>
        <table border="0"  style="width:100%" >
				<thead>
					<tr>
						<th>商品名称</th>
            <th>金额</th>
						<th>描述</th>
					</tr>
				</thead>
				<tbody>
					 <tr
            v-for="(item,index) in dataForm.merchantCommodities"
            :key="item.key"
          >
            <td>
              <el-form-item
                style="margin:0;"
                :prop="'merchantCommodities.'+index+'.name'"
                :rules="[{required:true,message:'请输入商品名称',trigger:'blur'},{min:1,max:30,message:'长度在1到30之间'}]"
              >
                <el-input
                  style="margin:0;"
                  v-model="item.name"
                  placeholder="商品名称"
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                style="margin:0;"
                :prop="'merchantCommodities.'+index+'.money'"
                :rules="[
              {required:true,message:'请输入金额'},
              { type: 'number', message: '金额必须为数字值且长度在1到6位'}
              ]"
              >
                <el-input
                  style="margin:0;"
                  v-model.number="item.money"
                  placeholder="金额"
                  :minlength="1"
                  :maxlength="6"
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                style="margin:0;"
                :prop="'merchantCommodities.'+index+'.mdesc'"
                :rules="[{message:'请输入描述',trigger:'blur'},{min:1,max:1000,message:'长度在1到1000之间'}]"
              >
                <el-input
                  style="margin:0;"
                  v-model="item.mdesc"
                  placeholder="描述"
                ></el-input>
              </el-form-item>
            </td>
            <i
              @click="addDomain"
              class="el-icon-circle-plus re r"
            ></i>
            <i
              v-if="index !== 0"
              @click.prevent="removeDomain(item)"
              class="el-icon-remove re"
            ></i>
          </tr>
				</tbody>
			</table>
 </el-form>	
  <div style="margin-top: 20px;text-align: center;">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        name: '',
        merchantCommodities: [{name: '', mdesc: '', money: ''}]
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
          url: this.$http.adornUrl('/m/merchant/' + id),
          method: 'get'
        })
          .then(res => {
            this.$set(this, 'dataForm', res.data.res.data)
            if (this.dataForm.merchantCommodities.length === 0) {
              this.dataForm.merchantCommodities.push({
                name: '',
                mdesc: '',
                money: ''
              })
            }
          })
      }
    },
    // 移除一列
    removeDomain (item) {
      var index = this.dataForm.merchantCommodities.indexOf(item)
      if (index !== -1) {
        this.dataForm.merchantCommodities.splice(index, 1)
      }
    },
    // 新增一列
    addDomain () {
      this.dataForm.merchantCommodities.push({
        name: '',
        mdesc: '',
        money: ''
      })
    },
      // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/merchantCommodity/addOrUpdate`),
            method: 'post',
            data: JSON.stringify({
              'merchantId': this.dataForm.id,
              'commodities': this.dataForm.merchantCommodities
            })
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
    }
  }
}
</script>

<style scoped>
td{
  width: 29%;
}
.re{
  color: #d03f3e;
  font-size: 28px;
  margin-left: 10px;
  margin-top: 14px;
}
.r{
  color: #17b3a3;
}
</style>

