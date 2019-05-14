<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="6">
          <el-form-item label="类别" prop="department">
            <el-select v-model="searchForm.department" placeholder="科室">
              <el-option label="容器室" value="容器室"/>
              <el-option label="管道室" value="管道室"/>
              <el-option label="产品室" value="产品室"/>
              <el-option label="材料室" value="材料室"/>
              <el-option label="石油...价室" value="石油...价室"/>
              <el-option label="阀门室" value="阀门室"/>
              <el-option label="技术室" value="技术室"/>
              <el-option label="综合办" value="综合办"/>
              <el-option label="生产办" value="生产办"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="查询时间">
            <el-col :span="11">
              <el-form-item prop="beginDateString">
                <el-date-picker v-model="searchForm.beginDateString" type="date" placeholder="选择日期" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line">&nbsp&nbsp-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDateString">
                <el-date-picker v-model="searchForm.endDateString" placeholder="选择时间" style="width: 100%;"/>
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
      style="width: 100%"
      max-height="1000"
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
          <el-dialog :visible.sync="dialogFormVisible" :modal="false" top="4vh" title="数据字典记录">
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
                  <el-option label="容器室" value="容器室"/>
                  <el-option label="管道室" value="管道室"/>
                  <el-option label="产品室" value="产品室"/>
                  <el-option label="材料室" value="材料室"/>
                  <el-option label="石油...价室" value="石油...价室"/>
                  <el-option label="阀门室" value="阀门室"/>
                  <el-option label="技术室" value="技术室"/>
                  <el-option label="综合办" value="综合办"/>
                  <el-option label="生产办" value="生产办"/>
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
                  <el-date-picker v-model="form.beginDateString" type="date" placeholder="选择日期"/>
                </el-form-item>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-form-item prop="endDateString">
                  <el-date-picker v-model="form.endDateString" type="date" placeholder="选择日期"/>
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
        </template>
      </el-table-column>
    </el-table>
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
        reportNum: '',
        contractPerson: '',
        contractName: '',
        contractAmount: '',
        beginDateString: '',
        endDateString: '',
        manageCost: '',
        department: '',
        creater: '',
        notes: ''
      }
    }
  },
  mounted() {
    // 获取所有项目
    this.$http({
      url: '/api/admin/project',
      // url:this.$http.adornUrl('/admin/project')
      method: 'get',
      headers: {
        uid: 'admin',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
      }
    }).then(res => {
      this.tableData = res.data
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].number = i + 1
      }
    })
  },
  methods: {
    // 查询(报错时间格式没处理,400，应该是时间没处理)
    search() {
      const department = this.searchForm.department
      const beginDateString = new Date(this.searchForm.beginDateString).getFullYear() + '-' + new Date(this.searchForm.beginDateString).getMonth() + '-' + new Date(this.searchForm.beginDateString).getDay()
      const endDateString = new Date(this.searchForm.endDateString).getFullYear() + '-' + new Date(this.searchForm.endDateString).getMonth() + '-' + new Date(this.searchForm.endDateString).getDay()
      const contractName = this.searchForm.contractName
      const dataForm = this.$qs.stringify({
        department: department,
        beginDateString: beginDateString,
        endDateString: endDateString,
        contractName: contractName
      })
      this.$http({
        url: '/api/admin/project/search',
        method: 'post',
        data: dataForm,
        headers: {
          uid: 'admin',
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
        }
      }).then(res => {
        console.log(res)
      })
    },
    // 用户点击修改
    updateRow(index, rows) {
      this.dialogFormVisible = true
      this.form.reportNum = rows[index].reportNum
      this.form.contractAmount = rows[index].contractAmount
      this.form.contractPerson = rows[index].contractPerson
      this.form.contractName = rows[index].contractName
      this.form.beginDateStringString = rows[index].beginDateString
      this.form.endDateString = rows[index].endDateString
      this.form.manageCost = rows[index].manageCost
      this.form.department = rows[index].department
      this.form.creater = rows[index].creater
      this.form.notes = rows[index].notes
    },
    // 点击确认修改(没反应,没有返回)
    confirmUpdate() {
      const code = this.form.code
      const reportNum = this.form.reportNum
      const contractAmount = this.form.contractAmount
      const contractPerson = this.form.contractPerson
      const contractName = this.form.contractName
      const beginDateString = this.form.beginDateString
      const endDateString = this.form.endDateString
      const department = this.form.department
      const creater = this.form.creater
      const notes = this.form.notes
      const dataForm = this.$qs.stringify({
        notes: notes,
        creater: creater,
        department: department,
        endDateString: endDateString,
        beginDateString: beginDateString,
        contractName: contractName,
        contractPerson: contractPerson,
        contractAmount: contractAmount,
        reportNum: reportNum,
        code: code
      })
      this.$http({
        url: '/api/admin/project',
        method: 'put',
        data: dataForm,
        headers: {
          uid: 'admin',
          token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhZG1pbiIsImlhdCI6MTU1NzcyNTE3Nywicm9sZXMiOiIwIiwiZXhwIjoxNTU3ODExNTc3fQ.XQw0vr0eQ8L0pWlj9oWGsM4Isedev05-1t-lm3ujx6M'
        }
      }).then(res => {
        this.dialogFormVisible = false
      })
    }
  }

}
</script>

<style scoped>

</style>

