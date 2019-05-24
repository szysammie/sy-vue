<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="1000"
      stripe>
      <el-table-column
        fixed
        prop="number"
        label="序号"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="uid"
        label="用户名"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="140"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="departmentString"
        label="部门"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="roleString"
        label="角色"
        width="130"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="staffTypeString"
        label="员工类型"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
        width="130"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="140"
        align="center"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-col :span="6"><el-button type="primary" @click.native.prevent="examineUser(scope.$index, tableData,1)">通过</el-button></el-col>
          <el-col :span="6" style="margin-left: 40px"><el-button type="primary" @click.native.prevent="examineUser(scope.$index, tableData, 0)">拒绝</el-button></el-col>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
      }
    },
    //获取所有带审核的用户(500)
    mounted(){
      this.getUserAudit()
    },
    methods: {
      //获取所有待审核的用户
      getUserAudit(){
        this.$http({
          url:this.$http.adornUrl('admin/audit'),
          method:'get'
        }).then(res=>{
          this.tableData = res.data.data
          for(let i=0;i<this.tableData.length;i++){
            this.tableData[i].number = i+1
          }
        }).catch(()=>{
          this.$message.error('网络开小差了，请稍后再试')
        })
      },
      //用户审核
      examineUser(index, rows, status){
        this.$http({
          url:this.$http.adornUrl("admin/audit/"+rows[index].uid+'/'+status),
          method:'post',
        }).then(res=>{
          if(res.data.status == '200'){
            this.getUserAudit()
            this.$message.success(res.data.message)
          }
          else {
            this.$message.warning(res.data.msg)
          }
        }).catch(()=>{
          this.$message.error('网络开小差了，请稍后再试')
        })
      },

    },

  }
</script>

<style scoped>

</style>
