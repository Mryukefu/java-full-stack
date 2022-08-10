<template>
    <div class="login_container">
        <div class="login_box">
            <el-form ref="form" :model="loginForm" label-width="80px" size="mini">
                <el-form-item label="用户名称">
                    <el-input v-model="loginForm.name" autocomplete="off" class="el-input-text"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input  type="password" v-model="loginForm.password" autocomplete="off" class="el-input-text"></el-input>
                </el-form-item>
                <el-form-item size="large" class="btns">
                    <el-button type="primary" @click="onSubmit">登入</el-button>
                    <el-button  type="primary" @click="onSubmit">注册</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    name: '',
                    password:''
                }
            };
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>

<style type="less" scoped>
 .login_container {
     background-color: #2b5b6b;
     height: 100%;
 }
 .login_box {
     width: 450px;
     height: 300px;
     background: #fff;
     border-radius: 3px;
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
 }
 .login_box > .el-form {
     margin: 80px 80px 80px 80px;
 }
 .el-input-text {
     width: 200px;
     height: 50px;
 }
 .btns {
     display: flex;
     justify-content: flex-end;
 }



</style>