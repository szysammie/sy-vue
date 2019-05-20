<template>
  <div>
    <el-button type="primary" @click="newContract">新增外协合同</el-button>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;height: 100%">
      <el-table-column
        prop="number"
        label="序号"
        fixed
        :span="1">
      </el-table-column>
      <el-table-column
        prop="reportNum"
        label="审批序号"
        :span="2"/>
      <el-table-column
        prop="contractName"
        :span="2"
        label="合同名称"/>
      <el-table-column
      prop="contractName"
      :span="2"
      label="外协合同名称"/>
      <el-table-column
        prop="signUnit"
        :span="2"
        label="签署单位"/>
      <el-table-column
        prop="signTimeString"
        :span="2"
        label="签署时间"/>
      <el-table-column
        prop="price"
        :span="2"
        label="金额(万元)"/>

      <el-table-column
        prop="creater"
        :span="2"
        label="创建人"/>
      <el-table-column
        prop="notes"
        :span="3"
        label="备注"/>
      <el-table-column
        :span="4"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteInfo(scope.row.assistContractID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗，修改数据-->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="40%"
     >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="外协合同名称">
          <el-input v-model="form.contractName"></el-input>
        </el-form-item>
        <el-form-item label="签署单位">
          <el-input v-model="form.signUnit"></el-input>
        </el-form-item>
        <el-form-item label="金额(万元)">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="签署时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间" :clearable="false" v-model="form.signTimeString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="创建人">
          <el-input v-model="form.creater" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.notes"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editInfo">确认修改</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--新增-->
    <el-dialog
      title="修改"
      :visible.sync="newDialogVisible"
      width="40%"
      :before-close="handleClose"
    >

      <el-form ref="form" :model="news" label-width="120px">
        <el-form-item label="审批序号">
          <el-select v-model="numberIndex" @change="change" placeholder="请选择">
            <el-option
              v-for="(item,index) in op"
              :key="index"
              :label="item.reportNum"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="txt" disabled></el-input>
        </el-form-item>
        <el-form-item label="外协合同名称">
          <el-input v-model="news.contractName"></el-input>
        </el-form-item>
        <el-form-item label="签署单位">
          <el-input v-model="news.signUnit"></el-input>
        </el-form-item>
        <el-form-item label="签署时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间" :clearable="false" v-model="news.signTimeString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="金额(万元)">
          <el-input v-model="news.price"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="news.creater" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="news.notes"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addContract">新增</el-button>
          <el-button @click="newDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          tableData:[],
          dialogVisible:false,
          newDialogVisible:false,
          form:{
            contractName:'',
            signUnit:'',
            signTimeString:new Date().toLocaleDateString().replace(/\//g, '-'),
            price:'',
            creater:'',
            notes:'',
            assistContractID:'',
            projectId:''
          },
          news:{
            contractName:'',
            signUnit:'',
            signTimeString:new Date().toLocaleDateString().replace(/\//g, '-'),
            price:'',
            creater:this.$cookie.get('uid'),
            notes:'',
            assistContractID:'',
            projectId:'',
          },
          options:[],
          op:[],
          txt:'',
          numberIndex:''
        }
      },
      mounted(){
        this.getContract()
      },
      methods:{
          edit(info){
            this.dialogVisible = true
            this.form = {...info}
          },
          editInfo(){
            this.$http({
              url:this.$http.adornUrl('director/assist'),
              method: 'put',
              data:{
                'assistContractID':this.form.assistContractID,
                'projectId':this.form.projectId,
                'contractName':this.form.contractName,
                'signUnit':this.form.signUnit,
                'price':this.form.price,
                'creater':this.$cookie.get('uid'),
                'notes':this.form.notes,
                'signTimeString':this.form.signTimeString
              }
            }).then(({data})=>{
              if (data&&data.status==204){
                this.$message.success('修改成功!')
                this.form = []
                this.dialogVisible =false
                this.getContract()
              }else {
                this.$message.error(data.message)
              }
            })
          },
          newContract(){
              this.newDialogVisible = true
              this.$http({
                url:this.$http.adornUrl('director/project'),
                method:'get'
              }).then(({data})=>{
                if (data&&data.status==200){
                  for (let i = 0; i < data.data.length; i++) {
                    this.op.push(data.data[i])
                  }
                }
              })
          },
          deleteInfo(id){
            this.$http({
              url: this.$http.adornUrl('director/assist/'+id),
              method: 'delete'
            }).then(({data})=>{
              if (data&&data.status==204){
                this.$message.success('删除成功!')
                this.getContract()
              }else {
                this.$message.error(data.message)
              }
            })
          },
          getContract(){
            this.$http({
              url:this.$http.adornUrl('director/assist'),
              method:'get'
            }).then(({data})=>{
              if(data&&data.status==200){
                this.tableData = data.data
                for (let i = 0; i < this.tableData.length; i++) {
                  this.tableData[i].number = i + 1
                }
              }else {
                this.$message.error(data.message)
              }
            })
          },
        handleClose(done){
            this.op = []
            done()
        },
        addContract(){
            this.$http({
              url:this.$http.adornUrl('director/assist'),
              method:'post',
              data:{
                'projectId':this.op[this.numberIndex].projectId,
                'contractName':this.news.contractName,
                'signUnit':this.news.signUnit,
                'price':this.news.price,
                'creater':this.$cookie.get('uid'),
                'notes':this.news.notes,
                'signTimeString':this.news.signTimeString
              }
            }).then(({data})=>{
                if (data&&data.status==201){
                  this.$message.success('新增成功')
                  this.newDialogVisible =false
                  this.news = {}
                  this.getContract()
                }else {
                  this.$message.error(data.message)
                }
            })
        },
        change(number){
            this.txt = this.op[number].contractName
        }
      }
    }
</script>

<style>

</style>
