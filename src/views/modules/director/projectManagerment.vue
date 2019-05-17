<template>
  <div>
    <span class="demonstration">查询工程:</span>
    <el-date-picker
      v-model="startTime"
      type="date"
      value-format="yyyy-M-d"
      :clearable="false"
      format="yyyy-M-d"
      placeholder="选择日期">
    </el-date-picker>
    <span class="demonstration">至</span>
    <el-date-picker
      v-model="endTime"
      type="date"
      :clearable="false"
      value-format="yyyy-M-d"
      format="yyyy-M-d"
      placeholder="选择日期">
    </el-date-picker>
    <span class="demonstration">&nbsp;合同名称</span>
    <el-input v-model="contractName" placeholder="请输入合同名称" clearable style="width: 200px"></el-input>
    <el-button type="primary" @click="searchPoj">查询</el-button>
    <el-button type="success" @click="newVisible=true">新增工程</el-button>
    <!--表格-->
    <el-table
    :data="project"
    stripe
    style="width: 100%; height: 100%;">
    <el-table-column
      prop="number"
      label="序号"
      :span="1"
      fixed
    >
    </el-table-column>
    <el-table-column
      prop="reportNum"
      label="审批序号"
      :span="2"
    />

    <el-table-column
      prop="contractName"
      label="合同名称"
      :span="2"
    />

    <el-table-column
      prop="contractPerson"
      label="合同相对人"
      :span="1"
    />

    <el-table-column
      :span="2"
      prop="contractAmount"
      label="金额（万元）"
    />
    <el-table-column
      :span="1"
      prop="department"
      label="所属科室"
    />
    <el-table-column
      :span="2"
      prop="workLoad"
      label="累计（万元）"
    />
    <el-table-column
      :span="2"
      prop="manageCost"
      label="管理费（万元）"
    />
    <el-table-column
      :span="1"
      prop="beginDateString"
      label="开始时间"
    />
    <el-table-column
      :span="1"
      prop="endDateString"
      label="结束时间"
    />
    <el-table-column
      :span="2"
      prop="creater"
      label="创建人"
    />
    <el-table-column
      :span="2"
      prop="notes"
      label="备注"
    />
    <el-table-column
      :span="5"
      label="操作"
      fixed="right"
    >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
        <el-button type="text" size="small" @click="deletePoj(scope.row.projectId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <!--弹窗，修改工程数据-->
    <el-dialog
      title="修改工程"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!--表单-->
      <div class="form">
        <span>审批序号:</span>
        <el-input v-model="form.reportNum" placeholder="审批序号" style="width: 200px" suffix-icon="el-icon-document"></el-input>
        <span>合同名称:</span>
        <el-input v-model="form.contractName" placeholder="合同名称 " style="width: 200px" suffix-icon="el-icon-edit"></el-input>
        <span>合同相对人:</span>
        <el-input v-model="form.contractPerson" placeholder="合同相对人 " style="width: 200px"></el-input> <br/>
      </div>
      <div class="form">
        <span>所属科室:</span>
        <el-input v-model="form.department" placeholder="所属科室 " style="width: 200px" suffix-icon="el-icon-star-off" disabled></el-input>
        <span>合同金额(万元):</span>
        <el-input v-model="form.contractAmount" placeholder="合同金额" style="width: 200px" suffix-icon="el-icon-news"></el-input>
        <span>累计价值(万元):</span>
        <el-input v-model="form.workLoad" placeholder="累计价值" style="width: 200px" suffix-icon="el-icon-news"></el-input>
      </div>
      <div class="form">
        <span>管理费(万元):</span>
        <el-input v-model="form.manageCost" placeholder="管理费(万元) " style="width: 200px" suffix-icon="el-icon-menu" disabled></el-input>
        <span>合同开始时间:</span>
        <el-date-picker
          v-model="form.beginDateString"
          type="date"
          value-format="yyyy-M-d"
          format="yyyy-M-d"
          placeholder="选择日期">
        </el-date-picker>
        <span>合同结束时间:</span>
        <el-date-picker
          v-model="form.endDateString"
          type="date"
          value-format="yyyy-M-d"
          format="yyyy-M-d"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="form">
        <span>创建人:</span>
        <el-input v-model="form.creater" placeholder="创建人 " style="width: 200px" suffix-icon="el-icon-info" disabled></el-input>
        <span>备注:</span>
        <el-input v-model="form.notes" placeholder="备注" style="width: 400px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updatePoj">更 新</el-button>
  </span>
    </el-dialog>
    <!--弹窗，新增工程数据-->
    <el-dialog
      title="新增工程"
      :visible.sync="newVisible"
      width="50%"
      >
      <el-form ref="form" :model="newP" label-width="120px">
        <el-form-item label="审批序号">
          <el-input v-model="newP.reportNum"></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="newP.contractName"></el-input>
        </el-form-item>
        <el-form-item label="合同相对人">
          <el-input v-model="newP.contractPerson"></el-input>
        </el-form-item>
        <el-form-item label="合同金额(万元)">
          <el-input v-model="newP.contractAmount"></el-input>
        </el-form-item>
        <el-form-item label="累计价值(万元)">
          <el-input v-model="newP.workLoad"></el-input>
        </el-form-item>
        <el-form-item label="管理费(万元)">
          <el-input v-model="newP.manageCost"></el-input>
        </el-form-item>
        <el-form-item label="合同时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间" :clearable="false" v-model="newP.beginDateString" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">&nbsp;至</el-col>
          <el-col :span="11">
            <el-date-picker placeholder="合同结束时间" :clearable="false" v-model="newP.endDateString" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="newP.notes"></el-input>
        </el-form-item>
        <
        <el-form-item>
          <el-button type="primary" @click="newPoj">立即创建</el-button>
          <el-button @click="newVisible = false">取消</el-button>
        </el-form-item>
      </el-form>



    </el-dialog>
  </div>
</template>

<script>
    export default {
        data(){
          return {
              startTime:new Date().toLocaleDateString().replace(/\//g, '-'),
              endTime:new Date().toLocaleDateString().replace(/\//g, '-'),
              contractName:'',
              project:[],
              dialogVisible:false,
              form:{
                reportNum:'',
                contractName:'',
                contractPerson:'',
                department:'',
                workLoad:'',
                contractAmount:'',
                manageCost:'',
                beginDateString:'',
                endDateString:'',
                creater:'',
                notes:'',
                projectId: ''
              },
              newVisible:false,
              newP:{
                reportNum:'',
                contractName:'',
                contractPerson:'',
                workLoad:'',
                contractAmount:'',
                manageCost:'',
                beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
                endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
                notes:''
              }
          }
        },
        methods: {
          //获取数据源
          getProject() {
            this.$http({
              // url: 'zr/getPoj',
              url: this.$http.adornUrl('director/project'),
              method: 'get',
              data: this.$http.adornData({})
            }).then(({data}) => {
              if (data && data.status === 200) {
                //更新数据
                this.project = data.data
                for (let i = 0; i < this.project.length; i++) {
                  this.project[i].number = i + 1
                }
              } else {
                this.$message.error(data.massage)
              }
            })
          },
          //模糊查询工程
          searchPoj() {
            if (this.startTime == null || this.endTime == null) {
              this.$http.error('开始或结束时间必填')
              return;
            }
            this.$http({
              url: this.$http.adornUrl('director/project/search'),
              method: 'post',
              data: this.$http.adornData({
                'beginDateString': this.startTime,
                'endDateString': this.endTime,
                'contractName': this.contractName
              })
            }).then(({data}) => {
              if (data && data.status === 200) {
                //更新数据
                this.project = data.data
              } else {
                this.$message.error(data.message)
              }
            })
          },
          // 编辑工程信息
          edit(info) {
            this.dialogVisible = true
            this.form = {...info} //es6语法 展开属性赋值

          },
          //更新工程数据
          updatePoj() {
            this.$confirm(`确定进行[更新]操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl('director/project'),
                method: 'put',
                data: this.$http.adornData({
                  'projectId': this.form.projectId,
                  'reportNum': this.form.reportNum,
                  'contractName': this.form.contractName,
                  'contractPerson': this.form.contractPerson,
                  'department': this.form.department,
                  'workLoad': this.form.workLoad,
                  'contractAmount': this.form.contractAmount,
                  'manageCost': this.form.manageCost,
                  'beginDateString': this.form.beginDateString,
                  'endDateString': this.form.endDateString,
                  'creater': this.form.creater,
                  'notes': this.form.notes,
                })
              }).then(({data}) => {
                if (data && data.status == 204) {
                  this.dialogVisible = false
                  this.getProject()
                }
              })
            }).catch(() => {
            })
          },
          deletePoj(projectId) {
            this.$http({
              url: this.$http.adornUrl('director/project/' + projectId),
              method: 'delete'
            }).then(({data}) => {
              if (data && data.status == 204) {
                this.$message.success('删除成功！')
                this.getProject()
              }
            })
          },
          newPoj() {
            this.$confirm(`确定进行[新增]操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url:this.$http.adornUrl('director/project'),
                method:'post',
                data:this.$http.adornData({
                  'reportNum':this.newP.reportNum,
                  'contractName':this.newP.contractName,
                  'contractPerson':this.newP.contractPerson,
                  'workLoad':this.newP.workLoad,
                  'contractAmount':this.newP.contractAmount,
                  'manageCost':this.newP.manageCost,
                  'beginDateString':this.newP.beginDateString,
                  'endDateString':this.newP.endDateString,
                  'notes':this.newP.notes,
                })
              }).then(({data}) =>{
                if(data && data.status==201){
                  this.$message.success('更新成功！')
                  this.newVisible = false
                  this.getProject()
                }
              })
            }).catch(() => {})
          }
        },
      mounted(){
          this.getProject()
      }

    }
</script>

<style scoped>
.form{
  margin-top: 15px;
}
</style>
