<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">项目动态管理系统</h2>
          <p class="brand-info__intro"></p>
        </div>
        <div class="login-main">
          <div class="login-logo" style="margin-left:35%;margin-bottom: 10%">
            <img src="./../../assets/img/user-logo.png" width="65" height="65" >
          </div>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="login-btn-submit" style="margin-top: 6px" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
            <el-form-item>
              <el-col :span="4" :offset="18">
                <el-button  type="text" @click="toRegister()">立即注册</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        // captchaPath: ''
      }
    },
    created () {
      // this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('login'),
              method: 'post',
              data: this.$http.adornData({
                'uid': this.dataForm.userName,
                'password': this.dataForm.password,
              })
            }).then(({data}) => {
              if (data && data.status === 200) {
                this.$message.success("登陆成功")
                this.$cookie.set('token', data.data.token)
                this.$cookie.set('uid', this.dataForm.userName)
                this.$router.replace({ name: 'home' })
              } else {
                // this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //注册
      toRegister(){
        this.$router.replace({name:"register"})
      },
      // 获取验证码
      // getCaptcha () {
      //   this.dataForm.uuid = getUUID()
      //   this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      // }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      margin-left: 8%;
      top: 0;
      left: 0;
      z-index: -1;
      width: 50%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/logo.png);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
