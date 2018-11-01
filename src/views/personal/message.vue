<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" :offset="2" style="margin-top:10px;">
          <el-card class="box-card">
            <el-form ref="form" :rules="rules" :label-position="labelPosition" :model="userInfo" label-width="100px" style="width: 90%;">
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="账号：" prop="username">
                        <el-input :disabled="disabled" v-model="userInfo.username"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="姓名：" prop="name">
                        <el-input v-model="userInfo.name" placeholder="请输入姓名"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('table.sex')" prop="sex">
                        <el-radio-group v-model="userInfo.sex">
                          <el-radio :label="0">男</el-radio>
                          <el-radio :label="1">女</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('table.born')" prop="born">
                        <el-date-picker v-model="userInfo.born" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="出生日期"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('table.phone')" prop="phone">
                        <el-input v-model="userInfo.phone" placeholder="电话号码"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('table.email')" prop="email">
                        <el-input v-model="userInfo.email" placeholder="邮箱"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="uploadUrl"
                    :headers="headers"
                    :data="params"
                    class="avatar-uploader">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" :offset="8">
                  <el-form-item>
                    <el-button type="primary" @click="update">保存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { updateObjInfo } from '@/api/user'
import { mapState } from 'vuex'
import { ATTACHMENT_URL } from '@/config/attachment'
import { getToken } from '@/utils/auth'

export default {
  name: 'PersonalMessage',
  components: {},
  data() {
    return {
      uploadUrl: '/admin/attachment/upload',
      labelPosition: 'right',
      disabled: true,
      rules: {
        name: [{ required: true, message: '请输入账号', trigger: 'change' }],
        username: [{ required: true, message: '请输入姓名', trigger: 'change' }]
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      params: {
        busiType: '1'
      }
    }
  },
  created() {
    this.userInfo.sex = parseInt(this.userInfo.sex)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateObjInfo(this.userInfo).then(response => {
            if (response.data.data) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '修改失败',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.userInfo.avatar = ATTACHMENT_URL + '/download?id=' + res.data.id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateObjInfo(this.userInfo).then(response => {
            if (response.data.data) {
              this.$notify({
                title: '成功',
                message: '头像上传成功',
                type: 'success',
                duration: 2000
              })
            }
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '头像上传失败',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
