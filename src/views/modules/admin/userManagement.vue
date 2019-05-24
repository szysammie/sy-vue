<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      :border="true"
      stripe>
      <el-table-column
        fixed
        prop="number"
        label="序号"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="uid"
        label="用户名"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        width="120"
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
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="staffTypeString"
        label="员工类型"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="电话"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="isEquipChecker"
        label="设备审核员"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="isMaterialChecker"
        label="材料审核员"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, tableData)" ></el-button>
          <el-button type="primary" icon="el-icon-edit" @click.native.prevent="updateRow(scope.$index, tableData)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible"  :append-to-body="true">
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
          <el-button @click="reSetPsd()">重置用户密码</el-button>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :append-to-body="true">
      <span>您是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
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
        uid:'',
        index:''
      }
    },
    //获取所有用户
    mounted(){
        this.getUser()
    },
    methods: {
      //获取所有用户
      getUser(){
        this.$http({
          url:this.$http.adornUrl("admin/user"),
          method:'get'
        }).then(res=>{
          this.tableData = res.data.data
          for(let i=0;i<this.tableData.length;i++){
            this.tableData[i].number = i+1
            this.tableData[i].isEquipChecker == '0' ? this.tableData[i].isEquipChecker ='否':this.tableData[i].isEquipChecker = '是'
            this.tableData[i].isMaterialChecker == '0' ? this.tableData[i].isMaterialChecker ='否':this.tableData[i].isMaterialChecker = '是'
          }
        }).catch(()=>{
          alert('网络开小差了，请稍后再试')
        })
      },
      //用户点击删除
      deleteRow(index, rows) {
        this.centerDialogVisible = true
        this.uid = rows[index].uid
        this.index = index
      },
      //用户确认删除
      confirmDelete(){
        this.$http({
          url:this.$http.adornUrl('admin/user/'+this.uid),
          method:'delete'
        }).then(res=>{
          if(res.data.status=='204'){
            this.getUser()
            alert(res.data.message)
          }else{
            alert(res.data.msg)
          }
          this.centerDialogVisible = false
        }).catch(()=>{
          alert('网络开小差了，请稍后再试')
        })
      },
      //重置密码(500)
      reSetPsd(){
        this.$http({
          url:this.$http.adornUrl('admin/user/password/'+this.uid),
          method:'post'
        }).then(res=>{
            if(res.data.status == '204'){
              alert(res.data.message)
            }
            else {
              alert(res.data.msg)
            }
          this.dialogFormVisible = false
        }).catch(()=>{
          alert('网络开小差了，请稍后再试')
        })
      },
      //用户点击修改
      updateRow(index,rows){
        this.dialogFormVisible = true
        this.form.isEquipChecker = rows[index].isEquipChecker
        this.form.isMaterialChecker = rows[index].isMaterialChecker
        if(this.form.isEquipChecker=='否'){
          this.form.isEquipChecker = false
        }else{
          this.form.isEquipChecker = true
        }
        if(this.form.isMaterialChecker=='否'){
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
          url:this.$http.adornUrl('admin/user/'+isEquipChecker+'/'+isMaterialChecker+'/'+this.uid),
          method:'post',
        }).then(res=>{
          if(res.data.status =='200'){
            alert(res.data.message)
            this.getUser()
          }else{
            alert(res.data.msg)
          }
          this.dialogFormVisible = false
        }).catch(()=>{
          alert('网络开小差了，请稍后再试')
        })
      },
    },

  }
</script>

<style scoped>

</style>
