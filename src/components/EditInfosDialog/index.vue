<template>
  <el-dialog
    :title="showEditInfo.title"
    :visible.sync="showEditInfo.isShow"
    width="40%"
    :before-close="handleClose">
    <el-form
      :rules="rules"
      :inline="true"
      :model="showEditInfo.form"
      ref="form"
      class="login-form"
      label-width="100px"
    >
      <el-row v-if="showEditInfo.content && showEditInfo.content.isShow">
        <el-form-item :label="showEditInfo.content.label" :prop="showEditInfo.content.key">
            <el-input
              v-model="showEditInfo.form[showEditInfo.content.key]"
              autocomplete="off"
              :placeholder="showEditInfo.content.placeholder"
            ></el-input
          ></el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.status && showEditInfo.status.isShow">
        <el-form-item label="状态" prop="status">
          <el-select
            style="width: 250px"
            v-model="showEditInfo.form.status"
            placeholder="选择状态"
            multiple
            clearable
            filterable
          >
            <el-option
              v-for="item in this.$store.state.statusDictObj[tabType]"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.ticketStatus && showEditInfo.ticketStatus.isShow">
       <el-form-item label="钱票状态" prop="ticketStatus">
          <el-select
            style="width: 250px"
            v-model="showEditInfo.form.ticketStatus"
            placeholder="选择钱票状态"
            multiple
            clearable
            filterable
          >
            <el-option
              v-for="item in this.$store.state.ticketStatusDictObj[tabType]"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option> </el-select
        ></el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.inAmount && showEditInfo.inAmount.isShow">
        <el-form-item label="输入金额" prop="inAmount">
            <el-input
              v-model="showEditInfo.form.inAmount"
              autocomplete="off"
              placeholder="请输入金额"
              type="number"
            ></el-input
          ></el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.arriveNotice && showEditInfo.arriveNotice.isShow">
        <el-form-item label="到货通知" prop="arriveNotice">
            <el-input
              v-model="showEditInfo.form.arriveNotice"
              autocomplete="off"
              placeholder="请输入到货通知"
            ></el-input
          ></el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.pics && showEditInfo.pics.isShow">
        <el-form-item :label="showEditInfo.pics.label" prop="pics">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>
      </el-row>
      <el-row v-if="showEditInfo.remark && showEditInfo.remark.isShow">
        <el-form-item label="备注" prop="remark">
            <el-input
              v-model="showEditInfo.form.remark"
              autocomplete="off"
              placeholder="请输入备注"
            ></el-input
          ></el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click=doSure>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { baseUrl } from '@/utils/request'
export default {
  props: {
    showEditInfo: {
      default: () => {
        return { isShow: false, title: '', form: { isShow: false }, inAmount: { isShow: false }, ticketStatus: { isShow: false }, status: { isShow: false }, arriveNotice: { isShow: false }, content: { isShow: false }, pics: { isShow: false }, remark: { isShow: false } }
      },
      type: Object
    },
    tabType: {
      default: () => 'FH',
      type: String
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: `${baseUrl(process.env.NODE_ENV)}/order/upload`,
      rules: {
        sendContent: [
          { required: true, message: '请输入发货文本', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文本', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择钱票状态', trigger: 'change' }
        ],
        ticketStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        inAmount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList, 'fileList')
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleClose () {
      this.$emit('handleEdit', { actionType: 0, tabType: this.tabType })
    },
    doSure () {
      this.$refs.form.validate((valid, errObj) => {
        console.log(valid, 'err====')
        if (valid) {
          this.$emit('handleEdit', { actionType: 1, type: this.tabType, form: this.showEditInfo.form })
        } else {

        }
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
