<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="1">
          <el-button style="margin-top: 10px;margin-left: 10px" @click="newRow">新增</el-button>
          <el-dialog :visible.sync="dialogFormVisible1" :modal="false" top="4vh" title="数据字典记录">
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
                  <el-option label="容器室" value="1"/>
                  <el-option label="管道室" value="2"/>
                  <el-option label="产品室" value="3"/>
                  <el-option label="材料室" value="4"/>
                  <el-option label="石油装备检测评价价室" value="5"/>
                  <el-option label="阀门室" value="6"/>
                  <el-option label="技术室" value="7"/>
                  <el-option label="综合办" value="8"/>
                  <el-option label="生产办" value="9"/>
                  <el-option label="新疆项目部" value="10"/>
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
          <el-button style="margin-left: 40px;margin-top:10px" @click="deleteAll">批量删除</el-button>
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
        <el-col :span="6" :offset="5" style="margin-top: 10px">
          <el-form-item label="员工姓名：" prop="staffName">
            <el-input v-model="searchForm.staffName"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button style="margin-left: -70px;margin-top: 10px" @click="search">查找</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="file" style="margin-left: -45px;margin-top: 10px" @click="fileUploadDialog = true">导入员工信息(excle表)</el-button>
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
        type="selection"/>
      <el-table-column
        :span="4"
        prop="staffName"
        label="员工姓名"/>
      <el-table-column
        :span="4"
        prop="staffTypeString"
        label="员工类型"/>
      <el-table-column
        :span="4"
        prop="departmentString"
        label="所属科室"/>
      <el-table-column
        :span="4"
        prop="notes"
        label="备注"/>
      <el-table-column
        :span="4"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >删除</el-button>
          <el-button type="text" @click="updateRow(scope.$index, tableData)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :modal="false"
      title="提示"
      width="30%"
      center>
      <span>您是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible" :modal="false" top="4vh" title="数据字典记录">
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
            <el-option label="容器室" value="1"/>
            <el-option label="管道室" value="2"/>
            <el-option label="产品室" value="3"/>
            <el-option label="材料室" value="4"/>
            <el-option label="石油装备检测评价价室" value="5"/>
            <el-option label="阀门室" value="6"/>
            <el-option label="技术室" value="7"/>
            <el-option label="综合办" value="8"/>
            <el-option label="生产办" value="9"/>
            <el-option label="新疆项目部" value="10"/>
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
        if(res.data.status){
          this.getStaff()
          alert("添加成功")
        }
        else{
          alert('网络开小差了,请稍后再试')
        }
        this.dialogFormVisible1 = false
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
          this.$http({
            url: this.$http.adornUrl('admin/emp'),
            method: 'get',
          }).then(res => {
            this.getStaff()
          })
          alert('删除成功')
        }else{
          alert('网络开小差了,请稍后再试')
        }
        this.centerDialogVisible = false
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
          this.dialogFormVisible = false
          this.getStaff()
          alert('修改成功')
        }
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
          this.deleteDialogAll = false
          this.getStaff()
          alert('删除成功')
        }else{
          alert('删除失败')
        }
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
          alert('网络开小差了，请稍后再试')
        }
      })
      return false
    }
  }
}
</script>

<style scoped>

</style>
