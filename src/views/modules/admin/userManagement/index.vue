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
        prop="staffType"
        label="员工类型"
        :span="2"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        prop="isEquipChecker"
        label="设备审核员"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        prop="isMaterialChecker"
        label="材料审核员"
        :span="4"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        :span="8"
      >
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="deleteRow(scope.$index, tableData)"
          >删除</el-button>
          <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
            :modal="false">
            <span>您是否确认删除</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
              </span>
          </el-dialog>
          <el-button type="text" @click="updateRow(scope.$index, tableData)">用户管理</el-button>
          <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible" :modal="false">
            <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="权限设置">
                <el-checkbox-group v-model="form.isEquipChecker">
                  <el-checkbox label="设备审核" name="isEquipChecker"></el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="form.isMaterialChecker">
                  <el-checkbox label="材料审核" name="isMaterialChecker"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-col :span="4" :offset="10">
                <el-button @click="reSetPsd(scope.$index, tableData)">重置用户密码</el-button>
              </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
            </div>
          </el-dialog>
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
        centerDialogVisible:false,
        dialogFormVisible: false,
        form: {
          isEquipChecker: '',
          isMaterialChecker: '',
        },
        uid:''
      }
    },
    //获取所有用户
    mounted(){
        //获取所有用户(报500)
      this.$http({
        url:"/api/admin/user",
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
      //用户点击删除
      deleteRow(index, rows) {
        this.centerDialogVisible = true
        this.uid = rows[index].uid
      },
      //用户确认删除
      confirmDelete(){
        this.centerDialogVisible = false
        this.$http({
          url:'/api/admin/user/'+this.uid,
          method:'delete',
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
          alert('删除成功')
        })
      },
      //重置密码(500)
      reSetPsd(){
        this.$http({
          url:'/api/admin/user/password/'+this.uid,
          method:'post',
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
            alert('重置密码成功')
        })
      },
      //用户点击修改
      updateRow(index,rows){
        this.dialogFormVisible = true
        this.form.isEquipChecker = rows[index].isEquipChecker
        this.form.isMaterialChecker = rows[index].isMaterialChecker
        if(this.form.isEquipChecker=='0'){
          this.form.isEquipChecker = false
        }else{
          this.form.isEquipChecker = true
        }
        if(this.form.isMaterialChecker=='0'){
          this.form.isMaterialChecker = false
        }else{
          this.form.isMaterialChecker = true
        }
        this.uid = rows[index].uid
      },
      //用户确认修改(修改是post,404)
      confirmUpdate(){
        this.dialogFormVisible = false
        if(this.form.isEquipChecker== false){
          this.form.isEquipChecker = 0
        }else{
          this.form.isEquipChecker = 1
        }
        if(this.form.isMaterialChecker==false){
          this.form.isMaterialChecker = 0
        }else{
          this.form.isMaterialChecker = 1
        }
        let isEquipChecker = this.form.isEquipChecker
        let isMaterialChecker = this.form.isMaterialChecker
        this.$http({
          url:'/admin/user/'+isEquipChecker+'/'+isMaterialChecker+'/'+this.uid,
          method:'post',
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
          this.dialogFormVisible = false
        })
      },
    },

  }
</script>

<style scoped>

</style>
