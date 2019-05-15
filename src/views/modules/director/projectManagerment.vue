<template>
  <div>
    <span class="demonstration">查询工程:</span>
    <el-date-picker
      v-model="startTime"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <span class="demonstration">至</span>
    <el-date-picker
      v-model="endTime"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <span class="demonstration">&nbsp;合同名称</span>
    <el-input v-model="projectName" placeholder="请输入合同名称" clearable style="width: 200px"></el-input>
    <el-button type="primary" @click="searchPoj">查询</el-button>

    <!--表格-->
    <el-table
      :data="project"
      stripe
      style="width: 100%">
      <el-table-column
        prop="number"
        label="序号"
        :span="2"
        >
      </el-table-column>
      <el-table-column
        prop="reportNum"
        label="审批序号"
        :span="2"
        />

      <el-table-column
        prop="contractName"
        label="合同名称"
        :span="2"
      />

      <el-table-column
        prop="contractPerson"
        label="合同相对人"
        :span="2"
      />

      <el-table-column
        :span="2"
        prop="contractAmount"
        label="合同金额（万元）"
      />
      <el-table-column
        :span="2"
        prop="totalAmount"
        label="累计价值（万元）"
      />
      <el-table-column
        :span="2"
        prop="manageCost"
        label="管理费（元）"
      />
      <el-table-column
        :span="2"
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
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗，修改工程数据-->

  </div>
</template>

<script>
    export default {
        data(){
          return {
              startTime:'',
              endTime:'',
              projectName:'',
              project:[{
                number:'1',
                reportNum:'1',
                contractName:'11asd4',
                contractPerson:'asd',
                contractAmount:'22',
                totalAmount:'333',
                manageCost:'22',
                beginDateString:'1',
                endDateString:'1'
              }]
          }
        },
        methods:{
          //获取数据源
          getProject(){

          },
          //模糊查询工程
          searchPoj(){
            this.$http({
              url:'',
              method:'post',
              data:this.$http.adornData({
                'startTime':this.startTime,
                'endTime':this.endTime,
                'projectName':this.projectName
              })
            }).then(({res})=>{
              if (res && res.status === 200) {

              } else {
                this.$message.error(res.message)
              }
            })
          },
          // 编辑工程信息
          edit(info){
            console.log(info)
          }
        }

    }
</script>

<style>

</style>
