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
                  <el-option label="ERP" value="ERP"/>
                  <el-option label="非ERP" value="非ERP"/>
                  <el-option label="临时员工" value="临时员工"/>
                </el-select>
              </el-form-item>
              <el-form-item label="所属科室" prop="department">
                <el-select v-model="form.department" placeholder="科室">
                  <el-option label="容器室" value="容器室"/>
                  <el-option label="管道室" value="管道室"/>
                  <el-option label="产品室" value="产品室"/>
                  <el-option label="材料室" value="材料室"/>
                  <el-option label="石油装备检测评价价室" value="石油装备检测评价价室"/>
                  <el-option label="阀门室" value="阀门室"/>
                  <el-option label="技术室" value="技术室"/>
                  <el-option label="综合办" value="综合办"/>
                  <el-option label="生产办" value="生产办"/>
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
            <el-button type="file" style="margin-left: -45px;margin-top: 10px">导入员工信息(excle表)</el-button>
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
        prop="staffType"
        label="员工类型"/>
      <el-table-column
        :span="4"
        prop="department"
        label="所属科室"/>
      <el-table-column
        :span="4"
        prop="address"
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
          <el-button type="text" @click="updateRow(scope.$index, tableData)">修改</el-button>
          <el-dialog :visible.sync="dialogFormVisible" :modal="false" top="4vh" title="数据字典记录">
            <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="员工姓名" prop="staffName">
                <el-input v-model="form.staffName"/>
              </el-form-item>
              <el-form-item label="员工类型" prop="staffType">
                <el-select v-model="form.staffType" placeholder="科室">
                  <el-option label="ERP" value="ERP"/>
                  <el-option label="非ERP" value="非ERP"/>
                  <el-option label="临时员工" value="临时员工"/>
                </el-select>
              </el-form-item>
              <el-form-item label="所属科室" prop="department">
                <el-select v-model="form.department" placeholder="科室">
                  <el-option label="容器室" value="容器室"/>
                  <el-option label="管道室" value="管道室"/>
                  <el-option label="产品室" value="产品室"/>
                  <el-option label="材料室" value="材料室"/>
                  <el-option label="石油装备检测评价价室" value="石油装备检测评价价室"/>
                  <el-option label="阀门室" value="阀门室"/>
                  <el-option label="技术室" value="技术室"/>
                  <el-option label="综合办" value="综合办"/>
                  <el-option label="生产办" value="生产办"/>
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        centerDialogVisible: false,
        dialogFormVisible: false,
        dialogFormVisible1: false,
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
        }
      }
    },
    // 获取所有员工信息
    mounted() {
      this.$http({
        url: this.$http.adornUrl('admin/emp'),
        method: 'get',
      }).then(res => {
        this.tableData = res.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].number = i + 1
        }
      })
    },
    methods: {
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
          this.dialogFormVisible1 = false
          console.log(res)
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
          console.log(res)
        })
      },
      // 用户点击删除
      deleteRow(index, rows) {
        this.centerDialogVisible = true
        this.code = rows[index].code
      },
      // 用户确认删除
      confirmDelete() {
        this.centerDialogVisible = false
        this.$http({
          url: this.$http.adornUrl('admin/emp/' + this.code),
          method: 'delete'
        }).then(res => {
          alert('删除成功')
        })
      },
      // 用户点击修改
      updateRow(index, rows) {
        this.dialogFormVisible = true
        this.form.department = rows[index].department
        this.form.notes = rows[index].notes
        this.form.staffType = rows[index].staffType
        this.form.staffName = rows[index].staffName
      },
      // 点击确认修改
      confirmUpdate() {
        this.$http({
          url: this.$http.adornUrl('admin/emp' + this.id),
          method: 'put',
          data: this.$http.adornData({
            department: this.form.department,
            notes: this.form.notes,
            staffType: this.form.staffType,
            staffName: this.form.staffName
          })
        }).then(res => {
          this.dialogFormVisible = false
        })
      },
      // 导入excle表


      // 批量选择操作
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style scoped>

</style>
