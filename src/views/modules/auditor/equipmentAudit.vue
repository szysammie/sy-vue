<template>
  <div>
    <el-row>
        <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
          <el-col :span="8" :offset="6" style="margin-top: 10px">
            <el-form-item label="设备名称：" prop="equipName">
              <el-input v-model="searchForm.equipName"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" style="margin-left: -70px;margin-top: 10px" @click="search">查找</el-button>
            </el-form-item>
          </el-col>
        </el-form>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        fixed
        width="120"
        prop="number"
        label="序号"
        align="center"/>
      <el-table-column
        width="120"
        prop="checkStatus"
        label="审核结果"
        align="center"/>
      <el-table-column
        width="140"
        prop="groupNum"
        label="所属小组"
        align="center"/>
      <el-table-column
        width="140"
        prop="equipName"
        label="设备名称"
        align="center"/>
      <el-table-column
        width="140"
        prop="beginDateString"
        label="开始日期"
        align="center"/>
      <el-table-column
        width="140"
        prop="endDateString"
        label="结束日期"
        align="center"/>
      <el-table-column
        width="140"
        prop="originalPrice"
        label="设备原值（元）"
        align="center"/>
      <el-table-column
        width="140"
        prop="dayDepreciation"
        label="日折旧（元）"
        align="center"/>
      <el-table-column
        width="140"
        prop="totalPrice"
        label="费用（万元）"
        align="center"/>
      <el-table-column
        width="140"
        prop="creater"
        label="申请者"
        align="center"/>
      <el-table-column
        width="140"
        prop="notes"
        label="备注"
        align="center"/>
        <el-table-column
        width="140"
        prop="auditOpinion"
        label="审核意见"
        align="center"
        />
      <el-table-column
        width="140"
        prop="auditPerson"
        label="审核人"
        align="center"/>
      <el-table-column
        width="120"
        fixed = 'right'
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="examine(scope.$index, tableData)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="examineEquipDialog"

      title="提示"
      width="30%"
      center>
      <el-form :model="examineForm">
        <el-form-item label="审核结果" >
          <el-radio v-model="examineForm.checkStatus" label="1">通过</el-radio>
          <el-radio v-model="examineForm.checkStatus" label="2">拒绝</el-radio>
        </el-form-item>
        <el-form-item label="审核意见">
            <el-input v-model="examineForm.auditOpinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineEquipDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmExamine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        examineEquipDialog:false,
        tableData:[],
        searchForm:{
          searchName:''
        },
        examineForm:{
          equipAppID:'',
          checkStatus:'',
          auditOpinion:''
        }
      }
    },
    mounted(){
      this.getEquip()
    },
    methods:{
      getEquip(){
        this.$http({
          url:this.$http.adornUrl('check/equipCheck'),
          method:'get'
        }).then(res=>{
          this.tableData = res.data.data
          for(let i = 0;i<this.tableData.length;i++){
            this.tableData[i].number = i+1
            if(this.tableData[i].checkStatus == '0'){
              this.tableData[i].checkStatus = '未审核'
            }else if(this.tableData[i].checkStatus == '1'){
              this.tableData[i].checkStatus = '审核通过'
            }else{
              this.tableData[i].checkStatus = '审核未通过'
            }
          }
        })
      },
      search(){
        this.$http({
          url:this.$http.adornUrl('check/equipCheck/search'),
          method:'post',
          data:this.$http.adornData({
            name:this.searchForm.equipName
          })
        }).then(res=>{
          if(res.data.data.length>0){
            this.tableData = res.data.data
            for(let i = 0 ; i<this.tableData.length ;i++){
              this.tableData[i].number = i+1
              if(this.tableData[i].checkStatus == '0'){
                this.tableData[i].checkStatus = '未审核'
              }else if(this.tableData[i].checkStatus == '1'){
                this.tableData[i].checkStatus = '审核通过'
              }else{
                this.tableData[i].checkStatus = '审核未通过'
              }
            }
            this.$message.success('查询成功')
          }else if(res.data.data.length == 0){
            this.$message.warning('未查询到')
            this.tableData = res.data.data
          }
        })
      },
      //点击审核通过按钮
      examine(index,rows){
        this.examineEquipDialog = true
        this.examineForm.checkStatus = rows[index].checkStatus
        this.examineForm.auditOpinion = rows[index].auditOpinion
        this.examineForm.equipAppID = rows[index].equipAppID
      },
      //确认审核
      confirmExamine(){
        this.$http({
          url:this.$http.adornUrl('check/equipCheck'),
          method:'post',
          data:this.$http.adornData({
            checkStatus:this.examineForm.checkStatus,
            auditOpinion:this.examineForm.auditOpinion,
            equipAppID:this.examineForm.equipAppID,
          })
        }).then(res=>{
          if(res.data.status == '201'){
            this.$message.success(res.data.message)
            this.getEquip()
          }else{
            this.$message.warning(res.data.msg)
          }
          this.examineEquipDialog =false
        })
      }
    }
  }
</script>

<style scoped>

</style>
