<template>
  <div>
    <el-button @click="newRow()" style="margin-top: 10px;margin-left: 20px">新增</el-button>
    <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible1" :modal="false">
      <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择类别">
            <el-option label="费用" value="费用"></el-option>
            <el-option label="科室" value="科室"></el-option>
            <el-option label="耗材" value="耗材"></el-option>
            <el-option label="员工类型" value="员工类型"></el-option>
            <el-option label="员工工资" value="员工工资"></el-option>
            <el-option label="角色" value="角色"></el-option>
            <el-option label="设备" value="设备"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="取值" prop="val">
          <el-input v-model="form.val"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="newData">确 定</el-button>
      </div>
    </el-dialog>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="100%"
        stripe>
        <el-table-column
          fixed
          prop="number"
          label="序号"
          :span="4"
          >
        </el-table-column>
        <el-table-column
          prop="code"
          label="编码"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="val"
          label="取值"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          :span="4"
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
            <el-button type="text" @click="updateRow(scope.$index, tableData)">修改</el-button>
            <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible" :modal="false">
              <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="编码" prop="code">
                  <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="type">
                  <el-select v-model="form.type" placeholder="请选择类别">
                    <el-option label="费用" value="费用"></el-option>
                    <el-option label="科室" value="科室"></el-option>
                    <el-option label="耗材" value="耗材"></el-option>
                    <el-option label="员工类型" value="员工类型"></el-option>
                    <el-option label="员工工资" value="员工工资"></el-option>
                    <el-option label="角色" value="角色"></el-option>
                    <el-option label="设备" value="设备"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="取值" prop="val">
                  <el-input v-model="form.val"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUpdate">确 定</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {getToken} from '@/utils/auth'
  export default {
    data() {
      return {
        tableData: [],
        centerDialogVisible:false,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        form: {
          code: '',
          type: '',
          description: '',
          val: ''
        },
        code:''
      }
    },
    mounted(){
      //发起请求获取系统参数
      this.$http({
        url:"/api/admin/sysparam",
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
        this.code = rows[index].code
      },
      //用户确认删除
      confirmDelete(){
        this.centerDialogVisible = false
        this.$http({
          url:'/api/admin/sysparam/'+this.code,
          method:'delete',
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
          alert('删除成功')
        })
      },
      //用户点击修改
      updateRow(index,rows){
        this.dialogFormVisible = true
        this.form.code = rows[index].code
        this.form.type = rows[index].type
        this.form.description = rows[index].description
        this.form.val = rows[index].val
        this.code = rows[index].code
      },
      //点击确认修改(参数错误)
      confirmUpdate(){
        let code = this.form.code
        let type = this.form.type
        let description = this.form.description
        let val = this.form.val
        let dataForm = this.$qs.stringify({
          code:code,
          type:type,
          val:val,
          description:description
        })
        this.$http({
          url:'/api/admin/sysparam',
          method:'put',
          data:dataForm,
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).then(res=>{
          this.dialogFormVisible = false
        })
      },
      //用户点击新增（记录已存在）
      newRow(){
        this.dialogFormVisible1 = true
        this.form.code = ''
        this.form.type = ''
        this.form.description = ''
        this.form.val = ''
      },
      //用户确认新增
      newData(){
        this.dialogFormVisible1 = false
        let code = this.form.code
        let type = this.form.type
        let description = this.form.description
        let val = this.form.val
        let dataForm = this.$qs.stringify({
          type:type,
          val:val,
          code:code,
          description:description,
        })
        this.$http({
          url:'/api/admin/sysparam',
          method:'post',
          data:dataForm,
          headers:{
            uid:'admin',
            token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
          }
        }).then(res=>{
          this.dialogFormVisible1 = false
          alert("添加成功")
        })
      },
    },

  }
</script>

<style scoped>

</style>

