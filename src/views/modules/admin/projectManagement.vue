<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="6">
          <el-form-item label="类别" prop="department">
            <el-select v-model="searchForm.department" placeholder="科室">
              <el-option label="容器室" value="1"/>
              <el-option label="管道室" value="2"/>
              <el-option label="产品室" value="3"/>
              <el-option label="材料室" value="4"/>
              <el-option label="石油装备检测评价室" value="5"/>
              <el-option label="阀门室" value="6"/>
              <el-option label="技术室" value="7"/>
              <el-option label="综合办" value="8"/>
              <el-option label="生产办" value="9"/>
              <el-option label="新疆项目部" value="10"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="查询时间">
            <el-col :span="11">
              <el-form-item prop="beginDateString">
                <el-date-picker v-model="searchForm.beginDateString" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line">&nbsp&nbsp-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDateString">
                <el-date-picker v-model="searchForm.endDateString" placeholder="选择时间" value-format="yyyy-MM-dd"  style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="searchForm.contractName"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button @click="search">查找</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%; height: 100%;"
      stripe>
      <el-table-column
        :span="4"
        fixed
        prop="number"
        label="序号"
      />
      <el-table-column
        :span="4"
        prop="reportNum"
        label="审批序号"
      />
      <el-table-column
        :span="4"
        prop="contractName"
        label="合同名称"
      />
      <el-table-column
        :span="4"
        prop="contractPerson"
        label="合同相对人"
      />
      <el-table-column
        :span="4"
        fixed
        prop="departmentString"
        label="科室"
      />
      <el-table-column
        :span="4"
        prop="contractAmount"
        label="合同金额（元）"
      />
      <el-table-column
        :span="4"
        prop="manageCost"
        label="管理费（元）"
      />
      <el-table-column
        :span="4"
        prop="beginDateString"
        label="开始时间"
      />
      <el-table-column
        :span="4"
        prop="endDateString"
        label="结束时间"
      />
      <el-table-column
        :span="4"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="updateRow(scope.$index, tableData)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" :modal="false" top="4vh" title="数据字典记录" :append-to-body="true">
      <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报审序号" prop="reportNum">
          <el-input v-model="form.reportNum"/>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="form.contractName"/>
        </el-form-item>
        <el-form-item label="合同相对人" prop="contractPerson">
          <el-input v-model="form.contractPerson"/>
        </el-form-item>
        <el-form-item label="类别" prop="department">
          <el-select v-model="form.department" placeholder="科室">
            <el-option label="容器室" value="1"/>
            <el-option label="管道室" value="2"/>
            <el-option label="产品室" value="3"/>
            <el-option label="材料室" value="4"/>
            <el-option label="石油装备检测评价室" value="5"/>
            <el-option label="阀门室" value="6"/>
            <el-option label="技术室" value="7"/>
            <el-option label="综合办" value="8"/>
            <el-option label="生产办" value="9"/>
            <el-option label="新疆项目部" value="10"/>
          </el-select>
        </el-form-item>
        <el-form-item label="合同金额（元）" prop="contractAmount">
          <el-input v-model="form.contractAmount"/>
        </el-form-item>
        <el-form-item label="管理费（元）" prop="manageCost">
          <el-input v-model="form.manageCost" :disabled="true"/>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-form-item prop="beginDateString">
            <el-date-picker v-model="form.beginDateString" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"/>
          </el-form-item>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-form-item prop="endDateString">
            <el-date-picker v-model="form.endDateString" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"/>
          </el-form-item>
        </el-form-item>
        <el-form-item label="创建人" prop="creater">
          <el-input v-model="form.creater" :disabled="true"/>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        department: '',
        beginDateString: '',
        endDateString: '',
        contractName: ''
      },
      tableData: [],
      dialogFormVisible: false,
      form: {
        projectId:'',
        workLoad:'',
        reportNum: '',
        contractPerson: '',
        contractName: '',
        contractAmount: '',
        beginDateString: '',
        endDateString: '',
        manageCost: '',
        department: '',
        departmentString: '',
        creater: '',
        notes: ''
      }
    }
  },
  mounted() {
    this.getProject()
  },
  methods: {
    //获取所有项目
    getProject(){
      this.$http({
        url: this.$http.adornUrl('admin/project'),
        method: 'get'
      }).then(res => {
        this.tableData = res.data.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].number = i + 1
        }
      })
    },
    // 查询（查找返回的日期没做处理）
    search() {

      this.$http({
        url: this.$http.adornUrl('admin/project/search'),
        method: 'post',
        data: this.$http.adornData({
          'department':this.searchForm.department,
          'beginDateString':this.searchForm.beginDateString,
          'endDateString':this.searchForm.endDateString,
          'contractName':this.searchForm.contractName,
        })
      }).then(res => {
        this.tableData = res.data.data
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].number = i + 1
        }
      })
    },
    // 用户点击修改
    updateRow(index, rows) {
      this.dialogFormVisible = true
      this.form.reportNum = rows[index].reportNum
      this.form.projectId = rows[index].projectId
      this.form.workLoad = rows[index].workLoad
      this.form.contractAmount = rows[index].contractAmount
      this.form.contractPerson = rows[index].contractPerson
      this.form.contractName = rows[index].contractName
      this.form.beginDateString = rows[index].beginDateString
      this.form.endDateString = rows[index].endDateString
      this.form.manageCost = rows[index].manageCost
      this.form.department = rows[index].department
      this.form.creater = rows[index].creater
      this.form.notes = rows[index].notes
    },
    // 点击确认修改(没反应,没有返回)
    confirmUpdate() {
      this.$http({
        url:this.$http.adornUrl('admin/project'),
        method: 'put',
        data: this.$http.adornData({
          'notes':this.form.notes,
          'department':this.form.department,
          'endDateString':this.form.endDateString,
          'beginDateString':this.form.beginDateString,
          'contractName':this.form.contractName,
          'contractPerson':this.form.contractPerson,
          'contractAmount':this.form.contractAmount,
          'reportNum':this.form.reportNum,
          'code':this.form.code,
          'projectId':this.form.projectId,
          'workLoad':this.form.workLoad,
        })
      }).then(res => {
        if(res.data.status == '204'){
          this.dialogFormVisible = false
          alert('修改成功')
          this.getProject()
        }
      })
    }
  }

}
</script>

<style scoped>

</style>

