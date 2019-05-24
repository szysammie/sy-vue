<template>
  <div>
      <el-row>
        <el-form ref="form" :model="searchs" label-width="80px" class="demo-ruleForm">
        <el-col :span="4">
          <el-form-item label="科室">
          <el-col :span="24">

              <el-select v-model="searchs.department" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-col>
          </el-form-item>
        </el-col>
          <el-col :span="8">
            <el-form-item label="项目时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="searchs.beginDateString"
                  type="date"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  style="width: 100%"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
              <el-col :span="1" class="line">
                &nbsp;-
              </el-col>
              <el-col :span="11">
                <el-date-picker
                  v-model="searchs.endDateString"
                  type="date"
                  :clearable="false"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="合同名称">
            <el-col :span="24">
              <el-input  v-model="searchs.contractName" ></el-input>
            </el-col>
            </el-form-item>
          </el-col>

        </el-form>


        <el-col :span="3">
          <el-button type="primary" @click="search" style="margin-left: 10px">查询</el-button>
        </el-col>
      </el-row>



    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="报审序号">
              <span>{{ props.row.reportNum }}</span>
            </el-form-item>
            <el-form-item label="合同名称">
              <span>{{ props.row.contractName }}</span>
            </el-form-item>
            <el-form-item label="合同相对人">
              <span>{{ props.row.contractPerson }}</span>
            </el-form-item>
            <el-form-item label="科室">
              <span>{{ props.row.departmentString }}</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <span>{{ props.row.contractAmount }}</span>
            </el-form-item>
            <el-form-item label="开始日期">
              <span>{{ props.row.beginDateString }}</span>
            </el-form-item>
            <el-form-item label="结束日期">
              <span>{{ props.row.endDateString }}</span>
            </el-form-item>
            <el-form-item label="工资(万元)">
              <span>{{ props.row.pay }}</span>
            </el-form-item>
            <el-form-item label="差旅费(万元)">
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label="车辆费用(万元)">
            <span>{{ props.row.vehicleFee }}</span>
          </el-form-item>
            <el-form-item label="设备费用(万元)">
            <span>{{ props.row.equipFee }}</span>
          </el-form-item>
            <el-form-item label="耗材费用(万元)">
            <span>{{ props.row.materialFee }}</span>
          </el-form-item>
            <el-form-item label="外协费用(万元)">
              <span>{{ props.row.assistFee }}</span>
            </el-form-item>
            <el-form-item label="管理费(万元)">
              <span>{{ props.row.manageCost }}</span>
            </el-form-item>
            <el-form-item label="利润(万元)">
              <span>{{ props.row.profits }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        align="center"
        prop="number">
      </el-table-column>
      <el-table-column
        label="合同名称"
        align="center"
        prop="contractName">
      </el-table-column>
      <el-table-column
        align="center"
        label="合同金额(万元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="工资(万元)"
        align="center"
        prop="pay">
      </el-table-column>
      <el-table-column
        label="差旅费(万元)"
        align="center"
        prop="amount">
      </el-table-column>
      <el-table-column
        label="车辆费用(万元)"
        align="center"
        prop="vehicleFee">
      </el-table-column>
      <el-table-column
      label="设备费用(万元)"
      align="center"
      prop="equipFee">
    </el-table-column>
      <el-table-column
        label="耗材费用(万元)"
        align="center"
        prop="materialFee">
      </el-table-column>
      <el-table-column
        label="外协费用(万元)"
        align="center"
        prop="assistFee">
      </el-table-column>
      <el-table-column
        align="center"
      label="管理费(万元)"
      prop="manageCost">
    </el-table-column>
      <el-table-column
        align="center"
        label="利润(万元)"
        prop="profits">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        tableData: [],

        options:[],
        searchs:{
          beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
          endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
          contractName:'',
          department:'',
        }
      }
    },
    methods:{
        getPoj(){
                this.$http({
                  url:this.$http.adornUrl('master/project'),
                  method:'get'
          }).then(({data})=>{
              if(data&&data.status==200){
                this.tableData = data.data
                for (let i = 0; i <this.tableData.length ; i++) {
                  this.tableData[i].number = i+1

                }
              }
          })
        },
      //查询
      search(){
          this.$http({
            url: this.$http.adornUrl('master/project'),
            method: 'post',
            data:{
              'department':this.searchs.department,
              'beginDateString':this.searchs.beginDateString,
              'endDateString':this.searchs.endDateString,
              'contractName':this.searchs.contractName
            }
          }).then(({data})=>{
            if (data&&data.status==200){
              this.$message.success("查询成功")
              this.tableData = data.data
              for (let i = 0; i <this.tableData.length ; i++) {
                this.tableData[i].number = i+1

              }
            }else{
              this.$message.error(data.message)
            }


          })
      },
      // 查询科室
      getDep(){
          this.$http({
            url:this.$http.adornUrl('department'),
            method:'get'
          }).then(({data})=>{
            if(data&&data.status==200){
              this.options = data.data
            }else {
              this.$message.error(data.message)
            }
          })
      }
    },
    mounted(){
      this.getPoj()
      this.getDep()
    }
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .sz-input{
    width: 150px;
    margin-top: 15px;
  }
</style>
