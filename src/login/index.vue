<!--
 * @Author: xiejiarong
 * @Date: 2020-09-18 09:58:04
 * @LastEditTime: 2020-09-18 11:22:48
 * @LastEditors: Please set LastEditors
 * @Description: 登录界面
 * @FilePath: \odf-editor-sys-ui\src\login\index.vue
-->
<template>
<div id="main">
 <!--左侧wave图，在-1层-->
    <img src="static/img/wave.png" alt="" class="wave">
    <!--第0层的容器-->
    <div class="container-login">
        <!--左侧的图片，来自undraw.co-->
        <div class="img">
            <img src="static/img/img.svg" alt="img">
        </div>
        <!--右侧的登录区-->
        <div class="login-container">
            <form action="index.html">
                <!--用户头像示例-->
                <img class="avatar" src="static/img/avatar.svg" alt="avatar">
                <h2>Welcome</h2>
                <!--用户名-->
                <div class="input-div one">
                    <div class="i">
                        <!--使用官网建议的fas仅能显示方框，改成老版本的fa可以正常显示图标-->
                        <i class="fa fa-user"></i>
                    </div>
                    <div>
                        <h5>Username</h5>
                        <input type="text" class="input">
                    </div>
                </div>
                <!--密码框-->
                <div class="input-div two">
                    <div class="i">
                        <i class="fa fa-lock"></i>
                    </div>
                    <div>
                        <h5>Password</h5>
                        <input type="password" class="input">
                    </div>
                </div>
                <!--忘记密码-->
                <a href="#">Forgot Password?</a>
                <!--提交按钮-->
                <input type="submit" class="btn" value="Login">
            </form>
        </div>
    </div>
</div>
    
</template>
<script>
export default {
    name:'login',
    mounted(){
        const inputs = document.querySelectorAll('.input');

function focusFunc(){
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

function blurFunc(){
    let parent = this.parentNode.parentNode;
    if (this.value === ""){
        parent.classList.remove('focus');
    }
}

inputs.forEach(input => {
    input.addEventListener('focus',focusFunc);
    input.addEventListener('blur',blurFunc);
});
    }
}
</script>
  <style lang="scss">
  @import "../components/flow/designer/style/login.scss";
  </style>  
