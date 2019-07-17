<template>
    <div>
      <el-row>
        <el-col :span="8" :offset="6" style="margin-top: 50px">
          <div class="login-logo" style="margin-left:35%;margin-bottom: 5%">
            <img src="./../../assets/img/user-logo.png" width="65" height="65" >
          </div>
          <div class="form">
            <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="uid">
                <el-input v-model="ruleForm.uid" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" show-password placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                <el-select v-model="ruleForm.role" placeholder="请选择用户类型" >
                  <el-option label="普通员工" value="1"></el-option>
                  <el-option label="系统管理员" value="0"></el-option>
                  <el-option label="室主任" value="2"></el-option>
                  <el-option label="所领导" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="科室" prop="department">
                <el-select v-model="ruleForm.department" placeholder="请选择科室" >
                  <el-option v-for="(department,index) in departments" :key=index :label=department.label :value=department.value ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="员工类型" prop="staffType">
                <el-select v-model="ruleForm.staffType" placeholder="请选择员工类型" >
                  <el-option label="ERP员工" value="1"></el-option>
                  <el-option label="非ERP员工" value="2"></el-option>
                  <el-option label="临时员工" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工作单位" prop="workUnit">
                <el-input v-model="ruleForm.workUnit" placeholder="请输入工作单位"></el-input>
              </el-form-item>
              <el-form-item>
                <el-col :span="2" >
                  <el-button type="primary" @click="submitForm('ruleForm')">立即注册</el-button>
                </el-col>
                <el-col :span="10" :offset="6">
                  <div>已有账号？请<el-button type="text" @click="toLogin">登陆</el-button></div>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default {
    data() {
      let phoneFormat = (rule,value,callback)=>{
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else if (!(/^1[34578]\d{9}$/.test(this.ruleForm.phone))) {
          callback(new Error('手机号码格式错误'));
        } else {
          callback();
        }
        };
        let uidFormat = (rule,value,callback)=>{
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (!(/^[0-9a-zA-Z]+$/.test(this.ruleForm.uid))) {
          callback(new Error('用户名只能为字母或数字'));
        } else {
          callback();
        }
      };
      return {
        departments:[],
        ruleForm: {
          uid:'',
          password:'',
          name:'',
          phone:'',
          role:'',
          department:'',
          staffType:'',
          workUnit:'',
        },
        rules: {
          uid: [
            {  validator: uidFormat, trigger: 'blur' }
          ],
          password: [
            { required:true,message:'请输入密码', trigger: 'blur' }
          ],
          name: [
            { required:true,message:'请输入真实姓名', trigger: 'blur' }
          ],
          role: [
            { required:true,message:'请选择角色', trigger: 'change' }
          ],
          department: [
            { required:true,message:'请选择科室', trigger: 'change' }
          ],
          staffType: [
            { required:true,message:'请选择员工类型', trigger: 'change' }
          ],
          phone: [
            { validator: phoneFormat, trigger: 'blur' }
          ],
        }
      };
    },
    mounted(){
      this.$http({
        url:this.$http.adornUrl('department'),
        method:'get'
      }).then(res=>{
        if(res.data.status == '200'){
          this.departments = res.data.data
        }else{
          alert('获取科室失败')
        }
      })
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http({
              url:this.$http.adornUrl('regist'),
              method:'post',
              data:this.$http.adornData(this.ruleForm)
            }).then(res=>{
              if(res.data.status == '200'){
                this.$message.success('注册成功')
                this.$router.replace({name:'login'})
              }else{
                this.$message.error(res.data.msg)
                return false;
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toLogin(){
        this.$router.replace({name:'login'})
      }
    }
  }
</script>

<style scoped>
  .form{
    margin-top: -8px;
  }
</style>
