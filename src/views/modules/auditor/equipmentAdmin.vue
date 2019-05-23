<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-plus" style="margin-top: 10px;margin-left: 10px" @click="newEquip">新增</el-button>
          <el-dialog :visible.sync="newEquipDialog"  top="4vh" title="数据字典记录">
            <el-form ref="form" :model="form" label-width="140px" class="demo-ruleForm">
              <el-form-item label="出厂编号" prop="staffName">
                <el-input v-model="form.factoryNum"/>
              </el-form-item>
              <el-form-item label="设备名称" prop="staffType">
                <el-input v-model="form.equipName"/>
              </el-form-item>
              <el-form-item label="设备型号" prop="department">
                <el-input v-model="form.equipType"/>
              </el-form-item>
              <el-form-item label="设备原值（万元 ）" prop="notes">
                <el-input v-model="form.originalPrice"/>
              </el-form-item>
              <el-form-item label="月折旧（万元 ）" prop="notes">
                <el-input v-model="form.monthDepreciation"/>
              </el-form-item>
              <el-form-item label="备注" prop="notes">
                <el-input v-model="form.notes"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="newEquipDialog = false">取 消</el-button>
              <el-button type="primary" @click="confirmNewEquip">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="6" :offset="5" style="margin-top: 10px">
          <el-form-item label="设备名称：" prop="equipName">
            <el-input v-model="searchForm.equipName"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin-left: -70px;margin-top: 10px" @click="search">查找</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="file" icon="el-icon-upload el-icon-right" style="margin-left: -45px;margin-top: 10px" @click="fileUploadDialog = true">导入</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      >
      <el-table-column
        :span="4"
        prop="number"
        label="序号"
      align="center"/>
      <el-table-column
        :span="4"
        prop="factoryNum"
        label="出厂编号"
        align="center"
      />
      <el-table-column
        :span="4"
        prop="equipName"
        label="设备名称"
        align="center"/>
      <el-table-column
        :span="4"
        prop="equipType"
        label="附加资产描述"
        align="center"/>
      <el-table-column
        :span="4"
        prop="originalPrice"
        label="设备原值（万元）"
        align="center"/>
      <el-table-column
        :span="4"
        prop="monthDepreciation"
        label="月折旧（万元）"
        align="center"/>
      <el-table-column
        :span="4"
        prop="dayDepreciation"
        label="天折旧（万元）"
        align="center"/>
      <el-table-column
        :span="4"
        prop="notes"
        label="备注"
        align="center"/>
      <el-table-column
        width="200"
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click.native.prevent="deleteEquip(scope.$index, tableData)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateEquip(scope.$index, tableData)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--删除设备弹窗-->
    <el-dialog
      :visible.sync="deleteEquipDialog"

      title="提示"
      width="30%"
      center>
      <span>您是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteEquipDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteEquip">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改设备弹窗-->
    <el-dialog :visible.sync="updateEquipDialog"  top="4vh" title="数据字典记录">
      <el-form ref="form" :model="form" label-width="140px" class="demo-ruleForm">
        <el-form-item label="出厂编号" prop="staffName">
          <el-input v-model="form.factoryNum"/>
        </el-form-item>
        <el-form-item label="设备名称" prop="staffType">
          <el-input v-model="form.equipName"/>
        </el-form-item>
        <el-form-item label="设备型号" prop="department">
          <el-input v-model="form.equipType"/>
        </el-form-item>
        <el-form-item label="设备原值（万元 ）" prop="notes">
          <el-input v-model="form.originalPrice"/>
        </el-form-item>
        <el-form-item label="月折旧（万元 ）" prop="notes">
          <el-input v-model="form.monthDepreciation"/>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateEquipDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateEquip">确 定</el-button>
      </div>
    </el-dialog>
    <!--文件上传-->
    <el-dialog
      title="文件上传"
      :visible.sync="fileUploadDialog"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        action=""
        :before-upload="beforeUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        newEquipDialog:false, //新增设备弹窗
        fileUploadDialog:false, //文件上传弹窗
        deleteEquipDialog:false, //删除弹窗
        updateEquipDialog:false,
        tableData: [], //表单数据
        equipID:'', //设备ID
        form: { //表单数据
          dayDepreciation:'',
          equipName:'',
          equipType:'',
          factoryNum:'',
          monthDepreciation:'',
          notes:'',
          originalPrice:'',
        },
        searchForm: { //搜素表单
          equipName: ''
        },
      }
    },
    // 获取所有员工信息
    mounted() {
      this.getEquip()
    },
    methods: {
      //获取所有设备
      getEquip(){
        this.$http({
          url: this.$http.adornUrl('check/equipManage'),
          method: 'get',
        }).then(res => {
          this.tableData = res.data.data
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].number = i + 1
          }
        }).catch(()=>{
          alert('网络开小差了，请稍后再试')
        })
      },
      //点击新增设备按钮
      newEquip(){
        this.newEquipDialog = true
        this.form.equipName = ''
        this.form.equipType = ''
        this.form.factoryNum = ''
        this.form.monthDepreciation = ''
        this.form.notes = ''
        this.form.originalPrice = ''
      },
      //确认新增设备
      confirmNewEquip(){
        this.$http({
          url:this.$http.adornUrl('check/equipManage'),
          method:'post',
          data:this.$http.adornData({
            equipName:this.form.equipName,
            equipType:this.form.equipType,
            factoryNum:this.form.factoryNum,
            monthDepreciation:this.form.monthDepreciation,
            notes:this.form.notes,
            originalPrice:this.form.originalPrice,
          })
        }).then(res=>{
          if(res.data.status == '201'){
            alert(res.data.message)
            this.getEquip()
          }else{
            alert(res.data.msg)
          }
          this.newEquipDialog  = false
        })
      },
      //查找设备
      search(){
        this.$http({
          url:this.$http.adornUrl('check/equipManage/search'),
          method:'post',
          data:this.$http.adornData({
            name:this.searchForm.equipName
          })
        }).then(res=>{
          if(res.data.data.length>0){
            this.tableData = res.data.data
            for(let i = 0 ; i<this.tableData.length ;i++){
              this.tableData[i].number = i+1
              if(this.tableData[i].checkStatus == '0'){
                this.tableData[i].checkStatus = '未审核'
              }else if(this.tableData[i].checkStatus == '1'){
                this.tableData[i].checkStatus = '审核通过'
              }else{
                this.tableData[i].checkStatus = '审核未通过'
              }
            }
            alert('查询成功')
          }else if(res.data.data.length == 0){
            alert('未查询到')
            this.tableData = res.data.data
          }
        })
      },
      //删除设备
      deleteEquip(index,rows){
        this.deleteEquipDialog = true
        this.equipID = rows[index].equipID
      },
      //确认删除设备
      confirmDeleteEquip(){
        this.$http({
          url:this.$http.adornUrl('check/equipManage/'+this.equipID),
          method:'delete'
        }).then(res=>{
          if(res.data.status == '204'){
            alert(res.data.message)
            this.getEquip()
          }else{
            alert(res.data.message)
          }
          this.deleteEquipDialog = false
        })
      },
      // 点击修改按钮
      updateEquip(index,rows){
        this.updateEquipDialog = true
        this.form.equipName = rows[index].equipName
        this.form.equipType = rows[index].equipType
        this.form.factoryNum = rows[index].factoryNum
        this.form.monthDepreciation = rows[index].monthDepreciation
        this.form.notes = rows[index].notes
        this.form.originalPrice = rows[index].originalPrice
        this.equipID = rows[index].equipID
      },
      //确认修改设备
      confirmUpdateEquip(){
        this.$http({
          url:this.$http.adornUrl('check/equipManage'),
          method:'put',
          data:this.$http.adornData({
            equipName:this.form.equipName,
            equipType:this.form.equipType,
            factoryNum:this.form.factoryNum,
            monthDepreciation:this.form.monthDepreciation,
            notes:this.form.notes,
            originalPrice:this.form.originalPrice,
            equipID:this.equipID
          })
        }).then(res=>{
          if(res.data.status =='204'){
            this.getEquip()
            alert(res.data.message)
          }else{
            alert(res.data.msg)
          }
          this.updateEquipDialog = false
        })
      },
      //导入excle
      beforeUpload(file){
        let fd = new FormData()
        fd.append('file', file)
        this.$http({
          url:this.$http.adornUrl('check/equipManage/import'),
          method:'post',
          data:fd
        }).then(res=>{
          if(res.data.status == '201'){
            alert('上传成功')
            this.fileUploadDialog = false
            this.getEquip()
          }else{
            alert(res.data.msg)
          }
        })
        return false
      },
    }
  }
</script>

<style scoped>

</style>
