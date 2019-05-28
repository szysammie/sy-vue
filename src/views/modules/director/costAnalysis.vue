<template>
    <div>
      <!--搜索-->
      <el-row>
        <el-form ref="form" :model="search" label-width="80px" class="demo-ruleForm">
          <el-col :span="6">
            <el-form-item label="合同名称">
              <el-col :span="20">
                <el-input v-model="search.contractName" ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary"  @click="searchCon" style="margin-left: 10px">查 询</el-button>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item>
              <el-button type="success" @click="analysisAll">整体分析</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!--表格-->
      <el-table
        :data="tableData"
        size="mini"
        show-summary
        style="width: 100%">
        <el-table-column
          fixed
          prop="number"
          label="序号"
          align="center"
          :span="1"/>
        <el-table-column
          prop="contractName"
          label="合同名称"
          align="center"
          :span="2"/>
        <el-table-column
          prop="salary"
          label="工资(万元)"
          align="center"
          :span="2"/>
        <el-table-column
          prop="travelPay"
          label="差旅费(万元)"
          align="center"
          :span="2"/>
        <el-table-column
          prop="carsPay"
          label="车辆费(万元)"
          align="center"
          :span="2"/>
        <el-table-column
          prop="equipPay"
          align="center"
          label="设备费(万元)"
          :span="2"/>
        <el-table-column
          prop="materialPay"
          align="center"
          label="材料费(万元)"
          :span="2"/>
        <el-table-column
          prop="assistPay"
          align="center"
          label="外协费(万元)"
          :span="2"/>
        <el-table-column
          prop="managePay"
          align="center"
          label="管理费(万元)"
          :span="2"/>
        <el-table-column
          prop="otherPay"
          align="center"
          label="其他(万元)"
          :span="2"/>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="analysis(scope.row)">分析</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--弹窗，整体分析-->
      <el-dialog
        title="整体分析"
        :visible.sync="dialogVisible"
        width="100%"
        >
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="form.beginDateString"
                  size="mini"
                  type="date"
                  value-format="yyyy-M-d"
                  format="yyyy-M-d"
                  style="width: 100%"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="form.endDateString"
                  size="mini"
                  type="date"
                  value-format="yyyy-M-d"
                  format="yyyy-M-d"
                  style="width: 100%"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-button style="float: right" type="primary" @click="searchAll">分析</el-button>
            </el-form>
          </el-col>
          <el-col :span="10">
            <el-card>
              <div ref="cb_Box" class="chart-box" style="height: 600px"></div>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card>
              <div ref="lr_Box" class="chart-box" style="height: 600px"></div>
            </el-card>
          </el-col>

        </el-row>
      </el-dialog>
      <!--弹窗,单个分析-->
      <el-dialog
        title="成本分析可视化展示"
        :visible.sync="Visible"
        width="70%"
        >

        <el-row :gutter="24">
          <el-col :span="6">
            <el-form ref="form" :model="form" label-width="120px">
              <el-tag>报审序号  : {{temp.reportNum}}</el-tag>

              <p>合同名称  : {{temp.contractName}}</p>
              <p>合同相对人  : {{temp.contractPerson}}</p>
              <p>合同金额(万元)  : {{temp.contractAmount}}</p>
              <p>累计工作量(万元)  : {{temp.workLoad}}</p>
              <p>开始日期  : {{temp.beginDateString}}</p>
              <p>结束日期  : {{temp.endDateString}}</p>
              <p>工资(万元)  :  {{temp.salary}}</p>
              <p>差旅费(万元)  :  {{temp.travelPay}}</p>
              <p>车辆费用(万元)  : {{temp.carsPay}}</p>
              <p>设备费用(万元)  : {{temp.equipPay}}</p>
              <p>耗材费用(万元)  : {{temp.materialPay}}</p>
              <p>外协费用(万元)  : {{temp.assistPay}}</p>
              <p>管理费用(万元)  : {{temp.managePay}}</p>
              <p>其他(万元)  : {{temp.otherPay}}</p>
              <el-tag type="warning">利润(万元)  : {{temp.profit}}</el-tag>
              <p>备注  : {{temp.notes}}</p>
            </el-form>
          </el-col>
          <el-col :span="18">
            <el-card>
              <div ref="gccb_Box" class="chart-box" style="height: 600px"></div>
            </el-card>
          </el-col>
        </el-row>

      </el-dialog>
    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
      data(){
        return{
          search:{
            contractName:'',
          },
          tableData:[],
          dialogVisible:false,
          form:{
            beginDateString:'',
            endDateString:'',
          },
          lrBox: null,
          cbBox: null,
          gccbBox:null,
          name:[],
          amount:[],//成本
          profit:[],//利润
          Visible:false,
          temp:{},
          oneData:[],
          oneName:[]
        }
      },
      methods:{
        //搜索
        searchCon(){
          this.$http({
            url:this.$http.adornUrl('director/analysis/search'),
            method:'post',
            data:{
              'name': this.search.contractName
            }
          }).then(({data})=>{
              if (data&&data.status==200){
                this.tableData = data.data
                this.$message.success("查询成功")
                for (let i = 0; i < this.tableData.length; i++) {
                  this.tableData[i].number = i+1
                }
              } else {
                this.$message.error(data.msg)
              }
          })
        },
        //获取数据源
        getCon(){
            this.$http({
              url:this.$http.adornUrl('director/analysis'),
              method:'get'
            }).then(({data})=>{
              if (data&&data.status==200){
                this.tableData = data.data
                for (let i = 0; i <this.tableData.length ; i++) {
                  this.tableData[i].number = i+1
                }
              }else {
                this.$message.error(data.msg)
              }
            })
        },
        //整体分析
        analysisAll(){
          this.dialogVisible = true
          this.getEachartsData()
        },
        searchAll(){
          this.getEachartsData()
        },
        //初始化成本
        initcbBox(){
          var option = {
            title:{text:'成本统计(按工程)'},
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : this.name,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'成本',
                type:'bar',
                barWidth: '60%',
                data:this.amount
              }
            ]
          };
          let bar = this.$refs.cb_Box
          this.cbBox = echarts.init(bar)
          this.cbBox.setOption(option)
          window.addEventListener('resize', () => {
            this.cbBox.resize()
          })
        },
        //初始化利润
        initlrBox(){
          var option = {
            title:{text:'利润统计(按工程)'},
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : this.name,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'利润',
                type:'bar',
                barWidth: '60%',
                data:this.profit
              }
            ]
          };
          let bar = this.$refs.lr_Box
          this.lrBox = echarts.init(bar)
          this.lrBox.setOption(option)
          window.addEventListener('resize', () => {
            this.lrBox.resize()
          })
        },
        //初始化单个成本
        initgccbBox(){
          var option = {
            title : {
              text: '工程成本组成',

              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: this.oneName
            },
            series : [
              {
                name: '成本',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:this.oneData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          let bar = this.$refs.gccb_Box
          this.gccbBox = echarts.init(bar)
          this.gccbBox.setOption(option)
          window.addEventListener('resize', () => {
            this.gccbBox.resize()
          })
        },
        getEachartsData(){
          this.$http({
            url:this.$http.adornUrl('director/analysis/all'),
            method: 'post',
            data:{
              'beginDateString':this.form.beginDateString,
              'endDateString':this.form.endDateString,
            }
          }).then(({data})=>{
              if(data&&data.status==200){
                this.name = data.data.name
                this.amount = data.data.amount
                this.profit = data.data.profit
                this.$nextTick(function () {
                  this.initcbBox()
                  this.initlrBox()
                });
              }else{
                this.$message.error(data.msg)
              }
          })
        },
        //单个分析
        analysis(temp){
          this.Visible = true
          this.temp  = {...temp}
          this.getSignData(this.temp.reportNum)
        },
        //获取单个分析数据
        getSignData(reportNum){
          this.$http({
            url:this.$http.adornUrl('director/analysis/one'),
            method:'post',
            data:{
              'reportNum':reportNum
            }
          }).then(({data})=>{
            if (data&&data.status==200){
              this.oneData = data.data

              this.initgccbBox()
            } else{
              this.$message.error(data.msg)
            }
          })
        }
      },
      mounted(){
          this.getCon()
      },
      activated () {
        // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
        if (this.lrBox) {
          this.lrBox.resize()
        }
        if (this.cb) {
          this.cbBox.resize()
        }
      }
    }
</script>

<style>

</style>
