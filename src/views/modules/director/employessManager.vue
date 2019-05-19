<template>
  <div>
    <span>项目名称：</span>
    <el-input v-model="form.contractName" class="di-input"></el-input>
    <span>开始时间：</span>
    <el-date-picker type="date" placeholder="选择开始时间" class="di-input" v-model="form.beginDateString" :clearable="false"></el-date-picker>
    <span>结束时间：</span>
    <el-date-picker type="date" placeholder="选择结束时间" class="di-input" v-model="form.endDateString" :clearable="false"></el-date-picker>
    <span>员工：</span>
    <el-input v-model="form.staffName" class="di-input"></el-input>
    <span>所属小组：</span>
    <el-select v-model="form.groupNum" placeholder="请选择" class="di-input">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-left: 10px" @click="getEm">查 询</el-button>
    <!--列表-->
    <div>
      <el-table
        :data="eMData"
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
        style="width: 100%">
        <el-table-column
          prop="number"
          label="序号"
          :span="1">
        </el-table-column>
        <el-table-column
          prop="contractName"
          label="项目名称"
          :span="2"
          />
        <el-table-column
          prop="staffName"
          :span="2"
          label="出差人员"/>
        <el-table-column
          prop="beginDateString"
          :span="2"
          label="开始日期"/>
        <el-table-column
        prop="endDateString"
        :span="2"
        label="结束日期"/>
        <el-table-column
        prop="unitPrice"
        :span="2"
        label="差旅费(元/天)"/>
        <el-table-column
        prop="amount"
        :span="2"
        label="差旅费总额(元)"/>
        <el-table-column
          prop="dayPay"
          :span="2"
          label="工资(元/天)"/>
        <el-table-column
        prop="pay"
        :span="2"
        label="工资总额(元)"/>
        <el-table-column
          prop="creater"
          :span="2"
          label="申请人"/>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
          return{
            form:{
              contractName:'',
              beginDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
              endDateString:new Date().toLocaleDateString().replace(/\//g, '-'),
              staffName:'',
              groupNum:1
            },
            options:[{
              value:1,
              label:'1组'
            },
              {
                value:2,
                label:'2组'
              },
              {
                value:3,
                label:'3组'
              }
            ],
            eMData:[],
            loading:false
          }
        },
      methods:{
          //获取员工数据
          getEm(){
            this.loading = true
            this.$http({
              url:this.$http.adornUrl('director/travel/search'),
              method:'post',
              data:{
                'contractName':this.form.contractName,
                'beginDateString':this.form.beginDateString,
                'endDateString':this.form.endDateString,
                'staffName':this.form.staffName,
                'groupNum':this.form.groupNum
              }
            }).then(({data})=>{
                if(data&&data.status==200){
                  this.eMData = data.data
                  for (let i = 0; i < this.eMData.length; i++) {
                    this.eMData[i].number = i+1
                  }
                  this.loading = false
                }
            })
          }
      },
      mounted(){
        this.getEm()
      }
    }
</script>

<style scoped>
.di-input{
  width: 150px;
}
</style>
