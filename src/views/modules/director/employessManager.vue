<template>
  <div>
    <el-row>
      <el-form ref="form" :model="form" label-width="80px" class="demo-ruleForm">
        <el-col :span="4">
          <el-form-item label="项目名称">
          <el-col :span="24">
            <el-input v-model="form.contractName" ></el-input>
          </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="查询时间">
            <el-col :span="11">
              <el-date-picker
                v-model="form.beginDateString"
                type="date"
                value-format="yyyy-MM-dd"
                :clearable="false"
                style="width: 100%;"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="2" class="line">
              &nbsp;&nbsp;&nbsp;-
            </el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.endDateString"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width: 100%;"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="员工" >
            <el-col :span="24">
              <el-input v-model="form.staffName" ></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属小组">
            <el-col :span="18">
              <el-select v-model="form.groupNum" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-form-item>
              <el-button type="primary"  @click="getEm">查 询</el-button>
              </el-form-item>
            </el-col>

          </el-form-item>
        </el-col>
      </el-form>
    </el-row>



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
        label="差旅费(万元/天)"/>
        <el-table-column
        prop="amount"
        :span="2"
        label="差旅费总额(万元)"/>
        <el-table-column
          prop="dayPay"
          :span="2"
          label="工资(万元/天)"/>
        <el-table-column
        prop="pay"
        :span="2"
        label="工资总额(万元)"/>
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
          //搜索员工数据
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
          },
        getData(){
          this.$http({
            url:this.$http.adornUrl('director/travel'),
            method:'get',
          }).then(({data})=>{
            if(data&&data.status==200){
              this.eMData = data.data
              for (let i = 0; i < this.eMData.length; i++) {
                this.eMData[i].number = i+1
              }
            }
          })
        }
      },
      mounted(){
        this.getData()
      }
    }
</script>

<style scoped>
.di-input{
  width: 150px;
}
</style>
