<template>
  <div>
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
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="开始日期"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="结束日期"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="差旅费(元/天)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="差旅费总额(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="工资(元/天)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="工资总额(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="备注"
        prop="contractAmount">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          tableData:[]
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
        }
      },
      mounted(){
        this.getEm()
      }
    }
</script>

<style>

</style>
