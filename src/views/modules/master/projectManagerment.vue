<template>
  <div>

    <span>科室:</span>
    <el-select v-model="department" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span>&nbsp;项目时间:</span>
    <el-date-picker
      v-model="beginDateString"
      type="date"
      :clearable="false"
      placeholder="选择日期">
    </el-date-picker>
    <span>至</span>
    <el-date-picker
      v-model="endDateString"
      type="date"
      :clearable="false"
      placeholder="选择日期">
    </el-date-picker>
    <span>合同名称:</span>
    <el-input style="width: 200px"  v-model="contractName"></el-input>
    <el-button type="primary" @click="search">查询</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        prop="number">
      </el-table-column>
      <el-table-column
        label="合同名称"
        prop="contractName">
      </el-table-column>
      <el-table-column
        label="合同金额"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="工资(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="差旅费(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="车辆费用(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
      label="设备费用(元)"
      prop="contractAmount">
    </el-table-column>
      <el-table-column
        label="耗材费用(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
        label="外协费用(元)"
        prop="contractAmount">
      </el-table-column>
      <el-table-column
      label="管理费(元)"
      prop="contractAmount">
    </el-table-column>
      <el-table-column
        label="利润(元)"
        prop="contractAmount">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        tableData: [],
        department:'',
        options:[],
        beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
        endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
        contractName:''
      }
    },
    methods:{
        getPoj(){
          this.$http({
            url:this.$http.adornUrl('/master/project'),
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
            url: this.$http.adornUrl('/master/project'),
            method: 'post',
            data:{
              
            }
          }).then(({data})=>{

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
</style>
