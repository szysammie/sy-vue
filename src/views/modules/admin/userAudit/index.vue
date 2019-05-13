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
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="uid"
        label="用户名"
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="部门"
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="员工类型"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="电话"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        prop="isEquipChecker"
        label="邮箱"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        :span="8"
      >
        <template slot-scope="scope">
          <el-col :span="6"><el-button @click.native.prevent="examineUser(scope.$index, tableData,1)">通过</el-button></el-col>
          <el-col :span="6" style="margin-left: 40px"><el-button @click.native.prevent="examineUser(scope.$index, tableData, 0)">拒绝</el-button></el-col>
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
      this.$http({
        url:"/api/admin/audit",
        method:'get',
        headers:{
          uid:'admin',
          token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
        }
      }).then(res=>{
        this.tableData = res.data
        for(let i=0;i<this.tableData.length;i++){
          this.tableData[i].number = i+1
        }
      })
    },
    methods: {
      //用户审核
      examineUser(index, rows, status){
        this.$http({
          url:"/api/admin/audit/"+this.uid+'/'+status,
          method:'post',
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
          console.log(1)
        })
      },

    },

  }
</script>

<style scoped>

</style>
