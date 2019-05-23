<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-plus" style="margin-top: 10px;margin-left: 10px" @click="newRow">新增</el-button>
          <el-dialog :visible.sync="dialogFormVisible1"  top="4vh" title="数据字典记录">
            <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="员工姓名" prop="staffName">
                <el-input v-model="form.staffName"/>
              </el-form-item>
              <el-form-item label="员工类型" prop="staffType">
                <el-select v-model="form.staffType" placeholder="类型">
                  <el-option label="ERP" value="1"/>
                  <el-option label="非ERP" value="2"/>
                  <el-option label="临时员工" value="3"/>
                </el-select>
              </el-form-item>
              <el-form-item label="所属科室" prop="department">
                <el-select v-model="form.department" placeholder="科室">
                  <el-option v-for="(department,index) in departments" :label="department.label" :key="index" :value="department.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="notes">
                <el-input v-model="form.notes"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible1 = false">取 消</el-button>
              <el-button type="primary" @click="confirmNew">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-delete" style="margin-left: 40px;margin-top:10px" @click="deleteAll">批量删除</el-button>
          <el-dialog
            title="批量删除"
            :visible.sync="deleteDialogAll"
            width="30%">
            <span>您是否确认删除</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteDialogAll = false">取 消</el-button>
              <el-button type="primary" @click="confirmDeleteAll">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
        <el-col :span="6" :offset="3" style="margin-top: 10px">
          <el-form-item label="员工姓名：" prop="staffName">
            <el-input v-model="searchForm.staffName"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" style="margin-left: -70px;margin-top: 10px" @click="search">查找</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="file" style="margin-left: -35px;margin-top: 10px" @click="fileUploadDialog = true">导入<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        :span="2"
        align="center"
        type="selection"/>
      <el-table-column
        :span="4"
        align="center"
        prop="staffName"
        label="员工姓名"/>
      <el-table-column
        :span="4"
        align="center"
        prop="staffTypeString"
        label="员工类型"/>
      <el-table-column
        :span="4"
        align="center"
        prop="departmentString"
        label="所属科室"/>
      <el-table-column
        :span="4"
        align="center"
        prop="notes"
        label="备注"/>
      <el-table-column
        width="180"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, tableData)"></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateRow(scope.$index, tableData)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="提示"
      width="30%"
      center>
      <span>您是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible"  top="4vh" title="数据字典记录">
      <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="员工姓名" prop="staffName">
          <el-input v-model="form.staffName"/>
        </el-form-item>
        <el-form-item label="员工类型" prop="staffType">
          <el-select v-model="form.staffType" placeholder="科室">
            <el-option label="ERP" value="1"/>
            <el-option label="非ERP" value="2"/>
            <el-option label="临时员工" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室" prop="department">
          <el-select v-model="form.department" placeholder="科室">
            <el-option v-for="(department,index) in departments" :label="department.label" :key="index" :value="department.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="文件上传"
      :visible.sync="fileUploadDialog"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        action=""
        :before-upload="beforeUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      departments:[],
      centerDialogVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      fileUploadDialog:false,
      deleteDialogAll:false,
      tableData: [],
      multipleSelection: [],
      form: {
        department: '',
        notes: '',
        staffType: '',
        staffName: ''
      },
      searchForm: {
        staffName: ''
      },
      staffID:[],
      code:''
    }
  },
  // 获取所有员工信息
  mounted() {
   this.getStaff()
    this.getDepartment()
  },
  methods: {
    //获取所有员工
    getStaff(){
      this.$http({
        url: this.$http.adornUrl('admin/emp'),
        method: 'get',
      }).then(res => {
        this.tableData = res.data.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].number = i + 1
        }
      }).catch(()=>{
        alert('网络开小差了，请稍后再试')
      })
    },
    // 用户点击新增
    newRow() {
      this.dialogFormVisible1 = true
      this.form.department = ''
      this.form.notes = ''
      this.form.staffType = ''
      this.form.staffName = ''
    },
    // 用户确认新增
    confirmNew() {
      this.dialogFormVisible1 = false
      this.$http({
        url: this.$http.adornUrl('admin/emp'),
        method: 'post',
        data: this.$http.adornData({
          'department':this.form.department,
          'notes':this.form.notes,
          'staffType':this.form.staffType,
          'staffName':this.form.staffName,
        })
      }).then(res => {
        if(res.data.status== '201'){
          this.getStaff()
          alert(res.data.message)
        }
        else{
          alert(res.data.msg)
        }
        this.dialogFormVisible1 = false
      }).catch(()=>{
        alert('网络开小差了，请稍后再试')
      })
    },
    // 查询
    search() {
      this.$http({
        url: this.$http.adornUrl('admin/emp/search'),
        method: 'post',
        data: this.$http.adornData({
          'staffName':this.searchForm.staffName
        })
      }).then(res => {
        if(res.data.data.length>0){
          this.tableData = res.data.data
          alert('查询成功')
        }else if(res.data.data.length == 0){
          alert('未查询到此人')
          this.tableData = res.data.data
        }
      })
    },
    // 用户点击删除
    deleteRow(index, rows) {
      this.centerDialogVisible = true
      this.code = rows[index].staffID
    },
    // 用户确认删除
    confirmDelete() {
      this.$http({
        url: this.$http.adornUrl('admin/emp/' + this.code),
        method: 'delete'
      }).then(res => {
        if(res.data.status=='204'){
          this.getStaff()
          alert(res.data.message)
        }else{
          alert(res.data.msg)
        }
        this.centerDialogVisible = false
      }).catch(()=>{
        alert('网络开小差了，请稍后再试')
      })
    },
    // 用户点击修改
    updateRow(index, rows) {
      this.dialogFormVisible = true
      this.form.department = rows[index].department
      this.form.notes = rows[index].notes
      this.form.staffType = rows[index].staffType
      this.form.staffName = rows[index].staffName
      this.code = rows[index].staffID
    },
    // 点击确认修改
    confirmUpdate() {
      this.$http({
        url: this.$http.adornUrl('admin/emp'),
        method: 'put',
        data: this.$http.adornData({
          staffID:this.code,
          department: this.form.department,
          notes: this.form.notes,
          staffType: this.form.staffType,
          staffName: this.form.staffName
        })
      }).then(res => {
        if(res.data.status=='204'){
          this.getStaff()
          alert(res.data.message)
        }else{
          alert(res.data.msg)
        }
        this.dialogFormVisible = false
      }).catch(()=>{
        alert('网络开小差了，请稍后再试')
      })
    },
    // 批量选择操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //点击批量删除
    deleteAll(){
      if(this.multipleSelection.length == '0'){
        alert('请选择您要删除的选项')
      }else{
        this.deleteDialogAll = true
        for(let i =0 ;i<this.multipleSelection.length;i++){
          this.staffID[i] = this.multipleSelection[i].staffID
        }
      }
    },
    //确认批量删除
    confirmDeleteAll(){
      this.$http({
        url:this.$http.adornUrl('admin/emp'),
        method:'delete',
        data:this.$http.adornData({
          ids:this.staffID
        })
      }).then(res=>{
        if(res.data.status == '204'){
          this.getStaff()
          alert(res.data.message)
        }else{
          alert(res.data.msg)
        }
        this.deleteDialogAll = false
      }).catch(()=>{
        alert('网络开小差了，请稍后再试')
      })
    },
    //导入excle
    beforeUpload(file){
      let fd = new FormData()
      fd.append('file', file)
      this.$http({
        url:this.$http.adornUrl('admin/emp/import'),
        method:'post',
        data:fd
      }).then(res=>{
        if(res.data.status == '201'){
          alert('上传成功')
          this.fileUploadDialog = false
          this.getStaff()
        }else{
          alert(res.data.msg)
        }
      })
      return false
    },
    //动态获取科室
    getDepartment(){
      this.$http({
        url:this.$http.adornUrl('department'),
        method:'get'
      }).then(res=>{
        this.departments = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
