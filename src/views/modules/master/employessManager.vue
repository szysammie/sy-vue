<template>
  <div>
    <el-row>
      <el-form ref="form" :model="searchs" label-width="80px" class="demo-ruleForm">
        <el-col :span="4">
          <el-form-item label="科室">
            <el-select v-model="searchs.department" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目时间">
            <el-col :span="11">
              <el-date-picker
                v-model="searchs.beginDateString"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="1" class="line">
              &nbsp;-
            </el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="searchs.endDateString"
                type="date"
                :clearable="false"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="项目名称">
            <el-input   v-model="searchs.contractName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="员工">
            <el-input   v-model="searchs.staffName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="search" style="margin-left: 10px">查询</el-button>
        </el-col>
      </el-form>
    </el-row>



    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        prop="number">
      </el-table-column>
      <el-table-column
        label="项目名称"
        align="center"
        prop="contractName">
      </el-table-column>
      <el-table-column
        label="申请人"
        align="center"
        prop="creater">
      </el-table-column>
      <el-table-column
        label="人员"
        align="center"
        prop="staffName">
      </el-table-column>
      <el-table-column
        label="开始日期"
        align="center"
        prop="beginDateString">
      </el-table-column>
      <el-table-column
        label="结束日期"
        align="center"
        prop="endDateString">
      </el-table-column>
      <el-table-column
        label="差旅费(万元/天)"
        align="center"
        prop="unitPrice">
      </el-table-column>
      <el-table-column
        label="差旅费总额(万元)"
        align="center"
        prop="amount">
      </el-table-column>
      <el-table-column
        label="工资(万元/天)"
        align="center"
        prop="dayPay">
      </el-table-column>
      <el-table-column
        label="工资总额(万元)"
        align="center"
        prop="pay">
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="notes">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          tableData:[],
          options:[],
          searchs:{
            department:'',
            beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
            endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
            staffName:'',
            contractName:'',
          }
        }
      },
      methods:{
        getEm(){
          this.$http({
            url:this.$http.adornUrl('master/travel'),
            method:'get'
          }).then(({data})=>{
            if(data&&data.status==200){
              this.tableData = data.data
              for (let i = 0; i <this.tableData.length ; i++) {
                this.tableData[i].number = i+1

              }
            }else{
              this.$message.error(data.message)
            }
          })
        },
        getDep(){
          this.$http({
            url:this.$http.adornUrl('department'),
            method:'get'
          }).then(({data})=>{
            if(data&&data.status==200){
              this.options = data.data
            }else {
              this.$message.error(data.message)

            }
          })
        },
        search(){
          this.$http({
            url: this.$http.adornUrl('master/travel/search'),
            method: 'post',
            data:{
              'department':this.searchs.department,
              'beginDateString':this.searchs.beginDateString,
              'endDateString':this.searchs.endDateString,
              'staffName':this.searchs.staffName,
              'contractName':this.searchs.contractName
            }
          }).then(({data})=>{
            if (data&&data.status==200){
              this.$message.success("查询成功")
              this.tableData = data.data
              for (let i = 0; i <this.tableData.length ; i++) {
                this.tableData[i].number = i+1
              }
            }else{
              this.$message.error(data.message)
            }
          })
        }
      },
      mounted(){
        this.getEm()
        this.getDep()
      }
    }
</script>

<style>

</style>
