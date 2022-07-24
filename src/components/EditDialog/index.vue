<template>
  <el-dialog
    :title="showTypeObj.title"
    :visible.sync="showTypeObj.isShow"
    width="40%"
    :before-close="handleClose">
    <el-form
      :rules="rules"
      :inline="true"
      :model="form"
      ref="form"
      class="login-form"
      label-width="80px"
    >
      <el-row v-if="showTypeObj.status">
        <el-form-item label="状态" prop="statusStr">
          <el-select
            style="width: 250px"
            v-model="form.statusStr"
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
      <el-row v-if="showTypeObj.ticketStatus">
       <el-form-item label="钱票状态" prop="ticketStatusStr">
          <el-select
            style="width: 250px"
            v-model="form.ticketStatusStr"
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
        <el-table-column
          :show-overflow-tooltip="true"
          prop="accountRemark"
          label="对账备注"
        >
          <template slot-scope="scope">
            <el-input type="textarea" :rows="6" v-model="scope.row.accountRemark" placeholder="请输入对账备注"   @blur="handleTextBlur($event,{type: 'accountRemark', row:{'id':scope.row.id,'text':scope.row.accountRemark} })"/>
          </template>
        </el-table-column>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click=doSure>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showTypeObj: {
      default: () => {},
      type: Object
    },
    tabType: {
      default: () => 'FH',
      type: String
    }
  },
  data () {
    return {
      rules: {
        statusStr: [
          { required: true, message: '请选择钱票状态', trigger: 'change' }
        ],
        ticketStatusStr: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      form: {
        statusStr: '',
        ticketStatusStr: ''
      }
    }
  },
  watch: {
    'showTypeObj.isShow' (val) {
      console.log(val, 'eObj.isShow')
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose', { actionType: 0, tabType: this.tabType })
    },
    doSure () {
      this.$emit('handleClose', { actionType: 1, type: this.tabType, form: this.form })
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
