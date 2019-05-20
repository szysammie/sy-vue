<template>
  <div>
    <span>科室:</span>
    <el-select v-model="department" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span>项目名称:</span>
    <el-input style="width: 200px"  v-model="contractName"></el-input>
    <span>&nbsp;项目时间:</span>
    <el-date-picker
      v-model="beginDateString"
      type="date"
      :clearable="false"
      value-format="yyyy-MM-dd"
      format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
    <span>至</span>
    <el-date-picker
      v-model="endDateString"
      type="date"
      :clearable="false"
      value-format="yyyy-MM-dd"
      format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
    <span>员工:</span>
    <el-input style="width: 200px"  v-model="staffName"></el-input>

    <el-button type="primary" @click="search">查询</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="序号"
        prop="number">
      </el-table-column>
      <el-table-column
        label="项目名称"
        prop="contractName">
      </el-table-column>
      <el-table-column
        label="申请人"
        prop="creater">
      </el-table-column>
      <el-table-column
        label="人员"
        prop="staffName">
      </el-table-column>
      <el-table-column
        label="开始日期"
        prop="beginDateString">
      </el-table-column>
      <el-table-column
        label="结束日期"
        prop="endDateString">
      </el-table-column>
      <el-table-column
        label="差旅费(万元/天)"
        prop="unitPrice">
      </el-table-column>
      <el-table-column
        label="差旅费总额(万元)"
        prop="amount">
      </el-table-column>
      <el-table-column
        label="工资(万元/天)"
        prop="dayPay">
      </el-table-column>
      <el-table-column
        label="工资总额(万元)"
        prop="pay">
      </el-table-column>
      <el-table-column
        label="备注"
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
          department:'',
          beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
          endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
          staffName:'',
          contractName:''
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
              'department':this.department,
              'beginDateString':this.beginDateString,
              'endDateString':this.endDateString,
              'staffName':this.staffName,
              'contractName':this.contractName
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
