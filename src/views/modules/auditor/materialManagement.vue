<template>
  <div>
    <el-row>
      <el-form ref="searchForm" :model="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-plus" style="margin-top: 10px;margin-left: 10px" @click="newMaterial">新增</el-button>
          <el-dialog :visible.sync="newMaterialDialog"  top="4vh" title="新增材料">
            <el-form ref="form" :model="form" label-width="140px" class="demo-ruleForm">
              <el-form-item label="材料名称" prop="materialName">
                <el-input v-model="form.materialName"/>
              </el-form-item>
              <el-form-item label="规格型号" prop="materialType">
                <el-input v-model="form.materialType"/>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-input v-model="form.brand"/>
              </el-form-item>
              <el-form-item label="计量单位" prop="unit">
                <el-input v-model="form.unit"/>
              </el-form-item>
              <el-form-item label="单价（万元 ）" prop="unitPrice">
                <el-input v-model="form.unitPrice"/>
              </el-form-item>
              <el-form-item label="数量" prop="count">
                <el-input v-model="form.count"/>
              </el-form-item>
              <el-form-item label="备注" prop="notes">
                <el-input v-model="form.notes"/>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="newMaterialDialog = false">取 消</el-button>
              <el-button type="primary" @click="confirmNewMaterial">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="6" :offset="5" style="margin-top: 10px">
          <el-form-item label="材料名称：" prop="materialName">
            <el-input v-model="searchForm.materialName"/>
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
        label="序号"/>
      <el-table-column
        :span="4"
        prop="materialName"
        label="材料名称"/>
      <el-table-column
        :span="4"
        prop="materialType"
        label="型号规格"/>
      <el-table-column
        :span="4"
        prop="brand"
        label="品牌"/>
      <el-table-column
        :span="4"
        prop="unit"
        label="计量单位"/>
      <el-table-column
        :span="4"
        prop="count"
        label="数量"/>
      <el-table-column
        :span="4"
        prop="unitPrice"
        label="单价（万元）"/>
      <el-table-column
        :span="4"
        prop="totalPrice"
        label="总价（万元）"/>
      <el-table-column
        :span="4"
        prop="notes"
        label="备注"/>
      <el-table-column
        width="200"
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click.native.prevent="deleteMaterial(scope.$index, tableData)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateMaterial(scope.$index, tableData)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--删除材料-->
    <el-dialog
      :visible.sync="deleteMaterialDialog"

      title="提示"
      width="30%"
      center>
      <span>您是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteMaterialDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteMaterial">确 定</el-button>
      </span>
    </el-dialog>
    <!--文件上传-->
    <el-dialog
      title="文件上传"
      :visible.sync="fileUploadDialog"
      width="30%">
      <el-upload
        style="width: 100%"
        class="upload-demo"
        drag
        action=""
        :before-upload="beforeUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>
    <!--修改材料-->
    <el-dialog :visible.sync="updateMaterialDialog"  top="4vh" title="修改材料">
      <el-form ref="form" :model="form" label-width="140px" class="demo-ruleForm">
        <el-form-item label="材料名称" prop="materialName">
          <el-input v-model="form.materialName"/>
        </el-form-item>
        <el-form-item label="规格型号" prop="materialType">
          <el-input v-model="form.materialType"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand"/>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model="form.unit"/>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count"/>
        </el-form-item>
        <el-form-item label="总价（万元 ）" prop="totalPrice">
          <el-input v-model="form.totalPrice"/>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMaterialDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateMaterial">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      newMaterialDialog:false, //新增材料弹窗
      fileUploadDialog:false, //文件上传弹窗
      deleteMaterialDialog:false,//删除材料弹窗
      updateMaterialDialog:false,//修改材料弹窗
      searchForm:{
        materialName:''
      },
      materialID:'',//材料的id
      form:{
        unitPrice:'',
        unit:'',
        totalPrice:'',
        notes:'',
        materialType:'',
        materialName:'',
        materialID:'',
        count:'',
        brand:'',
        status:'',
      },
      tableData:[]
    }
  },
  mounted() {
    this.getMaterial()
  },
  methods:{
    getMaterial(){
      this.$http({
        url:this.$http.adornUrl('check/materialManage'),
        method:'get',
      }).then(res=>{
        this.tableData = res.data.data
        for(let i = 0;i<this.tableData.length;i++){
          this.tableData[i].number = i+1
        }
      })
    },
    //点击修改按钮
    updateMaterial(index,rows){
      this.updateMaterialDialog  = true
      this.form.unitPrice = rows[index].unitPrice
      this.form.unit = rows[index].unit
      this.form.notes = rows[index].notes
      this.form.materialType = rows[index].materialType
      this.form.materialName = rows[index].materialName
      this.form.count = rows[index].count
      this.form.brand = rows[index].brand
      this.form.totalPrice = rows[index].totalPrice
      this.form.materialID = rows[index].materialID
    },
    //确认修改
    confirmUpdateMaterial(){
      this.$http({
        url:this.$http.adornUrl('check/materialManage'),
        method:'put',
        data:this.$http.adornData({
          unitPrice:this.form.unitPrice,
          unit:this.form.unit,
          notes:this.form.notes,
          materialType:this.form.materialType,
          materialName:this.form.materialName,
          count:this.form.count,
          totalPrice:this.form.totalPrice,
          brand:this.form.brand,
          materialID:this.form.materialID,
        })
      }).then(res=>{
        if(res.data.status =='204'){
          this.getMaterial()
          this.$message.success(res.data.message)
        }else{
          this.$message.warning(res.data.msg)
        }
        this.updateMaterialDialog = false
      })
    },
    //点击新增
    newMaterial(){
      this.newMaterialDialog = true
      this.form.unitPrice = ''
      this.form.unit = ''
      this.form.notes = ''
      this.form.materialType = ''
      this.form.materialName = ''
      this.form.count = ''
      this.form.brand = ''
    },
    //确认新增
    confirmNewMaterial(){
      this.$http({
        url:this.$http.adornUrl('check/materialManage'),
        method: 'post',
        data:this.$http.adornData({
          unitPrice:this.form.unitPrice,
          unit:this.form.unit,
          notes:this.form.notes,
          materialType:this.form.materialType,
          materialName:this.form.materialName,
          count:this.form.count,
          brand:this.form.brand,
        })
      }).then(res=>{
        if(res.data.status == '201'){
          this.$message.success(res.data.message)
          this.getMaterial()
        }else{
          this.$message.warning(res.data.msg)
        }
        this.newMaterialDialog = false
      })
    },
    search(){
      this.$http({
        url:this.$http.adornUrl('check/materialManage/search'),
        method:'post',
        data:this.$http.adornData({
          name:this.searchForm.materialName
        })
      }).then(res=>{
        if(res.data.data.length>0){
          this.tableData = res.data.data
          for(let i = 0 ; i<this.tableData.length ;i++){
            this.tableData[i].number = i+1
          }
          this.$message.success('查询成功')
        }else if(res.data.data.length == 0){
          this.$message.warning('未查询到')
          this.tableData = res.data.data
        }
      })
    },
    //点击删除按钮
    deleteMaterial(index,rows){
      this.deleteMaterialDialog = true
      this.materialID = rows[index].materialID
    },
    //确认删除材料
    confirmDeleteMaterial(){
      this.$http({
        url:this.$http.adornUrl('check/materialManage/'+this.materialID),
        method:'delete'
      }).then(res=>{
        if(res.data.status == '204'){
          this.$message.success(res.data.message)
          this.getMaterial()
        }else{
          this.$message.warning(res.data.message)
        }
        this.deleteMaterialDialog = false
      })
    },
    //文件导入
    beforeUpload(file){
      let fd = new FormData()
      fd.append('file', file)
      this.$http({
        url:this.$http.adornUrl('check/materialManage/import'),
        method:'post',
        data:fd
      }).then(res=>{
        if(res.data.status == '201'){
          this.$message.success('上传成功')
          this.fileUploadDialog = false
          this.getMaterial()
        }else{
          this.$message.warning(res.data.msg)
        }
      })
      return false
    },
  }
}
</script>

<style scoped>

</style>
