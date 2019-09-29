<template>
    <div class="login-container">
        <div class="login-form">
            <div class="logo-inner">
                <img src='../../assets/logo.png' alt="" class="App-logo" />
            </div>
            <a-input size="large"
                style='margin-bottom:25px'
                placeholder="请输入用户名"
                :value='account'
                @change="e => handleChange('account' , e)"
                >
                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
            <a-input
                    size="large"
                    style='margin-bottom: 25px '
                    type="password"
                    placeholder="请输入密码"
                    :value='password'
                    @change="e => handleChange('password' , e)"
            >
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
            <a-button style="width:100%" size="large" type="primary"
                    @click="handleSubmit">
                登录
            </a-button>
        </div>
    </div>
</template>

<script>
  import {mapState,mapGetters,mapMutations , mapActions} from 'vuex';
  /**
   上面大括弧里面的三个参数，便是一一对应着store.js中的state,getters,mutations ,action
   这三个参数必须规定这样写，写成其他的单词无效，切记
   毕竟是这三个属性的的辅助函数
   **/

  export default {
    name: "",
    data(){
      return {
        account: '',
        password: ''
      }
    },
    component: {
      //someComponent
    },
    methods:{
      handleChange (type,e){
        const { value } = e.target;
        this[type] = value;
      },
      handleSubmit(){
        let { account , password } = this.$data;
        if(!account){
          message.error("请输入用户名");
          return false
        }
        if(!password){
          message.error("请输入密码");
          return false
        }

        let params = {
          account , password
        };

        this.$store.dispatch("auth/login" , params)
      }
    }
  }
</script>

<style lang="less">
 @import "./index.less";
</style>