<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="newRow()" style="margin-left: 20px;margin-bottom: 10px">新增</el-button>
    <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible1" >
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
        style="width: 100%;height: 100%"
        :border="true"
        stripe>
        <el-table-column
          fixed
          prop="number"
          align="center"
          label="序号"
          :span="4"
          >
        </el-table-column>
        <el-table-column
          prop="code"
          label="编码"
          align="center"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          align="center"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="val"
          label="取值"
          align="center"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          :span="4"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-delete"  @click.native.prevent="deleteRow(scope.$index, tableData)"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click="updateRow(scope.$index, tableData)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="数据字典记录" :visible.sync="dialogFormVisible"  :append-to-body="true">
      <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" :disabled="true"></el-input>
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
  </div>
</template>

<script>
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
      this.getSystemParam()
    },
    methods: {
      getSystemParam(){
        //发起请求获取系统参数
        this.$http({
          url:this.$http.adornUrl("admin/sysparam"),
          method:'get'
        }).then(res=>{
          this.tableData = res.data.data
          for(let i=0;i<this.tableData.length;i++){
            this.tableData[i].number = i+1
          }
        })
      },
      //用户点击删除
      deleteRow(index, rows) {
        this.centerDialogVisible = true
        this.code = rows[index].code
      },
      //用户确认删除
      confirmDelete(){
        this.$http({
          url:this.$http.adornUrl('admin/sysparam/'+this.code),
          method:'delete',
        }).then(res=>{
          if(res.data.status=='204'){
            this.getSystemParam()
            this.$message.success(res.data.message)
          }else{
            this.$message.warning(res.data.msg)
          }
          this.centerDialogVisible = false
        }).catch(()=>{
          this.$message.error('网络开小差了，请稍后再试')
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
        this.$http({
          url:this.$http.adornUrl('admin/sysparam'),
          method:'put',
          data:this.$http.adornData({
            code:this.form.code,
            type:this.form.type,
            val:this.form.val,
            description:this.form.description
          })
        }).then(res=>{
            if(res.data.status =='204'){
              this.$message.success(res.data.message)
              this.getSystemParam()
            }else{
              this.$message.warning(res.data.msg)
            }
          this.dialogFormVisible = false
        }).catch(()=>{
          this.$message.error('网络开小差了，请稍后再试')
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
        this.$http({
          url:this.$http.adornUrl('admin/sysparam'),
          method:'post',
          data:this.$http.adornData({
            type:this.form.type,
            val:this.form.val,
            code:this.form.code,
            description:this.form.description,
          })
        }).then(res=>{
          if(res.data.status == '201'){
            this.getSystemParam()
            this.$message.success(res.data.message)
          }
          else{
            this.$message.warning(res.data.msg)
          }
          this.dialogFormVisible1 = false
        }).catch(()=>{
          this.$message.error('网络开小差了，请稍后再试')
        })
      },
    },

  }
</script>

<style scoped>

</style>

