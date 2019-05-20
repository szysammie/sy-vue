<template>
    <div>
      <el-button @click="checkApproval" type="success">批量审批</el-button>
      <el-table
        :data="travel"
        stripe
        @select="approval"
        @select-all="approval"
        style="width: 100%; height: 100%;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="number"
          label="序号"
          :span="1"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="department"
          label="科室"
          :span="2"
        />

        <el-table-column
          prop="reportNum"
          label="审批序号"
          :span="2"
        />

        <el-table-column
          prop="contractName"
          label="合同名称"
          :span="4"
        />


        <el-table-column
          :span="1"
          prop="beginDateString"
          label="出差日期"
        />
        <el-table-column
          :span="1"
          prop="endDateString"
          label="结束时间"
        />
        <el-table-column
          :span="2"
          prop="staffName"
          label="出差人员"
        />
        <el-table-column
        :span="4"
        prop="dayPay"
        label="工资(万元/天)"
      />
        <el-table-column
          :span="2"
          prop="pay"
          label="工资(万元)"
        />
        <el-table-column
          :span="2"
          prop="unitPrice"
          label="差旅费(万元/天)"
        />
        <el-table-column
          :span="2"
          prop="amount"
          label="差旅费(万元)"
        />
        <el-table-column
          :span="2"
          prop="groupNum"
          label="所属小组"
        >

        </el-table-column>
        <el-table-column
          :span="2"
          prop="creater"
          label="申请人"
        />
        <el-table-column
          :span="2"
          prop="notes"
          label="备注"
        />
        <el-table-column
          :span="2"
          prop="auditPerson"
          label="审核人"
        />
        <el-table-column
          :span="2"
          prop="checkStatus"
          label="审核结果"
        />
        <el-table-column
          :span="2"
          prop="auditOpinion"
          label="审核意见"
        />
        <el-table-column
          :span="5"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="jugle(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--弹窗，确认审核-->
      <el-dialog
        title="审核"
        :visible.sync="dialogVisible"
        width="40%"
        >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="所属小组">
            <el-select v-model="form.groupNum" placeholder="请选择">
              <el-option
                v-for="item in group"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结果">
            <el-select v-model="form.checkStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="form.auditOpinion"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="comfirmApproval">确认审核</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--弹窗，批量审核确认-->
      <el-dialog
        title="审核"
        :visible.sync="checkDialogVisible"
        width="40%"
      >
        <el-form ref="form" :model="check" label-width="80px">
          <el-form-item label="所属小组">
            <el-select v-model="check.groupNum" placeholder="请选择">
              <el-option
                v-for="item in group"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结果">
            <el-select v-model="check.checkStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="check.auditOpinion"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="comfirmAll">确认审核所有</el-button>
            <el-button @click="checkDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
          return {
            travel:[],
            dialogVisible:false,
            form:{},
            options:[{
              value:1,
              label:'审核通过'
            },{
              value:2,
              label:'审核不通过'
            }
            ],
            group:[{
              value:1,
              label:'1组'
            },{
              value:2,
              label:'2组'
            },{
              value:3,
              label:'3组'
            }],
            rows:[],
            check:{},
            checkDialogVisible:false,
            travelapplies:[{
              travelId:'',
              staffID:'',
              checkStatus:'',
              auditOpinion:'',
              groupNum:''
            }]
          }
        },
        mounted(){
          this.getTravel()
        },
        methods:{
          //单个审核
          jugle(info){
            this.dialogVisible = true
            this.form = {...info}
            this.form.checkStatus = ''
          },
          //确定审核
          comfirmApproval(){
              this.travelapplies[0].travelId=this.form.travelId,
              this.travelapplies[0].staffID=this.form.staffID,
              this.travelapplies[0].checkStatus=this.form.checkStatus,
              this.travelapplies[0].auditOpinion=this.form.auditOpinion,
              this.travelapplies[0].groupNum=this.form.groupNum
            this.$http({
              url:this.$http.adornUrl('director/travel'),
              method:'post',
              data:{
                'travelapplies':this.travelapplies
              }
            }).then(({data})=>{
                if(data&&data.status==201){
                  this.$message.success('审核成功！')
                  this.dialogVisible = false
                  this.travelapplies = []
                  this.getTravel()
                }else{
                  this.$message.error(data.massage)
                }
            })
          },
          //获取数据源
          getTravel(){
              this.$http({
                url: this.$http.adornUrl('director/travel'),
                method: 'get'
              }).then(({data})=>{
                if(data&&data.status==200){
                  this.travel= data.data
                  for (let i = 0; i < this.travel.length; i++) {
                    this.travel[i].number = i + 1
                    if(this.travel[i].checkStatus==0){
                      this.travel[i].checkStatus = '待审核'
                    }
                  }
                }else {
                  this.$message.error(data.massage)
                }
              })
          },
          approval(rows){
            this.rows = rows
          },
          checkApproval(){
            if(this.rows.length==0){
              this.$message.error('请至少选择一个！')
              return ;
            }else {
              this.checkDialogVisible = true
            }
          },
          comfirmAll(){
            for (let i = 0; i < this.rows.length; i++) {
                this.rows[i].checkStatus=this.check.checkStatus,
                this.rows[i].auditOpinion=this.check.auditOpinion,
                this.rows[i].groupNum=this.check.groupNum
            }
            this.$http({
              url:this.$http.adornUrl('director/travel'),
              method:'post',
              data:{
                'travelapplies':this.rows
              }
            }).then(({data})=>{
              if(data&&data.status==201){
                this.$message.success('审核成功！')
                this.checkDialogVisible = false
                this.check= {}
                this.rows = []
                this.getTravel()
              }else {
                this.$message.error(data.massage)
              }
            })
          }
        }
    }
</script>

<style>

</style>
