<template>
  <div>
    <el-row>
    <el-form ref="form" :model="search" label-width="80px" class="demo-ruleForm">
      <el-col :span="8">
        <el-form-item label="查询时间">
          <el-col :span="11">
              <el-date-picker
                v-model="search.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 100%;"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          </el-col>
          <el-col :span="2" class="line">
            &nbsp;&nbsp;&nbsp;-
          </el-col>
          <el-col :span="11">
              <el-date-picker
                v-model="search.endTime"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width: 100%;"
                placeholder="选择日期">
              </el-date-picker>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="合同名称">
          <el-col :span="20">
              <el-input v-model="search.contractName" placeholder="请输入合同名称" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="searchPoj" style="margin-left: 10px">查询</el-button>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
        <el-button type="success" @click="newVisible=true">新增工程</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    </el-row>

    <!--表格-->
    <el-table
    :data="project"
    stripe
    size="mini"
    style="width: 100%; height: 100%;">
    <el-table-column
      prop="number"
      label="序号"
      :span="1"
      fixed
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="reportNum"
      label="审批序号"
      :span="2"
      align="center"
    />

    <el-table-column
      prop="contractName"
      label="合同名称"
      :span="2"
      align="center"
    />

    <el-table-column
      prop="contractPerson"
      label="合同相对人"
      :span="1"
      align="center"
    />

    <el-table-column
      :span="2"
      prop="contractAmount"
      label="金额（万元）"
      align="center"
    />
    <el-table-column
      :span="1"
      prop="departmentString"
      label="所属科室"
      align="center"
    />
    <el-table-column
      :span="2"
      prop="workLoad"
      label="累计（万元）"
      align="center"
    />
    <el-table-column
      :span="4"
      prop="manageCost"
      label="管理费（万元）"
      align="center"
    />
    <el-table-column
      :span="1"
      prop="beginDateString"
      label="开始时间"
      align="center"
    />
    <el-table-column
      :span="1"
      prop="endDateString"
      label="结束时间"
      align="center"
    />
    <el-table-column
      :span="2"
      prop="creater"
      label="创建人"
      align="center"
    />
    <el-table-column
      :span="2"
      prop="notes"
      label="备注"
      align="center"
    />
    <el-table-column
      :span="2"
      label="操作"
      fixed="right"
      width="200"
    >
      <template slot-scope="scope">
        <el-button type="warning" size="small" @click="edit(scope.row)">修改</el-button>
        <el-button type="danger" size="small" @click="deletePoj(scope.row.projectId)">删除</el-button>
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

        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="审批序号">
            <el-input v-model="form.reportNum" placeholder="审批序号"  suffix-icon="el-icon-document"></el-input>
          </el-form-item>
          <el-form-item label="合同名称">
            <el-input v-model="form.contractName" placeholder="合同名称 " suffix-icon="el-icon-edit"></el-input>
          </el-form-item>
          <el-form-item label="合同相对人">
            <el-input v-model="form.contractPerson" placeholder="合同相对人 "></el-input>
          </el-form-item>
          <el-form-item label="所属科室">
            <el-input v-model="form.department" placeholder="所属科室 "  suffix-icon="el-icon-star-off" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同金额(万元)">
            <el-input v-model="form.contractAmount" placeholder="合同金额" suffix-icon="el-icon-news"></el-input>
          </el-form-item>
          <el-form-item label="累计价值(万元)">
            <el-input v-model="form.workLoad" placeholder="累计价值"  suffix-icon="el-icon-news"></el-input>
          </el-form-item>
          <el-form-item label="合同时间">
            <el-col :span="11">
              <el-date-picker
                v-model="form.beginDateString"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;至</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.endDateString"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.creater" placeholder="创建人 "  suffix-icon="el-icon-info" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.notes" placeholder="备注" type="textarea"></el-input>
          </el-form-item>

          <el-form-item>

              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="updatePoj">更 新</el-button>

          </el-form-item>

        </el-form>
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
        <el-form-item label="合同时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="合同开始时间"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd"
            :clearable="false" v-model="newP.beginDateString" style="width: 100%;">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="1">&nbsp;至</el-col>
          <el-col :span="11">
            <el-date-picker placeholder="合同结束时间"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :clearable="false" v-model="newP.endDateString" style="width: 100%;"></el-date-picker>
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
              search:{
                startTime:'',
                endTime:'',
                contractName:'',
              },

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
                beginDateString:'',
                endDateString:'',
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
                this.$message.error(data.msg)
              }
            })
          },
          //模糊查询工程
          searchPoj() {

            this.$http({
              url: this.$http.adornUrl('director/project/search'),
              method: 'post',
              data: this.$http.adornData({
                'beginDateString': this.search.startTime,
                'endDateString': this.search.endTime,
                'contractName': this.search.contractName
              })
            }).then(({data}) => {
              if (data && data.status === 200) {
                //更新数据
                this.project = data.data
                for (let i = 0; i < this.project.length; i++) {
                  this.project[i].number = i+1
                }
                this.$message.success("查询成功")
              } else {
                this.$message.error(data.msg)
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
                  this.$message.success('更新成功')
                }else {
                  this.$message.error(data.msg)
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
                }else{
                  this.$message.error(data.msg)
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
