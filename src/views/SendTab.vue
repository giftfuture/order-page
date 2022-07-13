<script>
// import SelectChecked from '@/components/SelectChecked'
import axios from 'axios'
// import pagination from '@/components/crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  name: 'sendTab',
  components: {
    /* pagination, */
    DateRangePicker
  },
  data () {
    return {
      sendForm: {
        createBy: '',
        beginTime: '',
        endTime: '',
        sendContent: '',
        status: '',
        ticketStatus: '',
        remark: ''

      },
      SelectCheckedData: [],
      statusDict: [],
      ticketStatusDict: [],
      rules: {
        /* loginName: [
          { required: true, message: '登录名不可为空！ ', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '密码不可为空！ ', trigger: 'blur' }
        ] */
      },
      loading: false,
      showMsg: false
    }
  },
  // SelectCheckedData () {
  //   return {
  //
  //   }, defaultProps: {
  //     children: 'treeMenu',
  //       label: 'name'
  //   }
  // },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http.post('/order/list', this.sendForm).then((res) => {
            if (res.data.code === 0) {
              // 延迟两秒，演示登录按钮加载效果
              setTimeout(() => {
                this.loading = false
                // sessionStorage.setItem('staff', JSON.stringify(this.sendForm))
                this.$router.replace({ path: '/order/list' })
              }, 2000)
            } else {
              this.loading = false
              this.showMsg = true
            }
          })
        } else {
          console.log('search failed')
          return false
        }
      })
    }
  },
  created () {
    axios.post('/staf/queryAll')
      .then(response => {
        if (response.data.code === 0) {
          this.SelectCheckedData = response.data.data
          // console.log(this.SelectCheckedData)
        } else {
          this.$message.error(response.data.message)
        }
      })
      .catch(error => {
        console.log(error)
      })

    axios.get('/dict/loadBySort?sortTag=FH')
      .then(response => {
        if (response.data.code === 0) {
          this.statusDict = JSON.parse(response.data.data.statusDict)
          this.ticketStatusDict = JSON.parse(response.data.data.ticketStatusDict)
          // console.log(this.statusDict)
          // console.log(this.ticketStatusDict)
        } else {
          this.$message.error(response.data.message)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<template>
  <div class ="vux-tab-item">
    <!--用户数据-->
    <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
      <!--工具栏-->
      <div class="head-container">
    <el-form :model="sendForm" :rules="rules" ref="sendForm" class="login-form">
      <el-form-item label="创建人" prop="createBy">
        <!--    <SelectChecked :options="options" :data="SelectCheckedData" @change="changeValue()" @remove-tag="deleteValue" :props="defaultProps" @selectedVal="selectedVal" />-->
        <el-select  v-model="sendForm.createBy" multiple   placeholder="选择创建人" clearable filterable>
          <el-option v-for="item in SelectCheckedData" :key="item.id" :label="item.staffName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="createTime">
        <date-range-picker v-model="sendForm.createTime" class="date-item" />
      </el-form-item>
      <el-form-item label="搜索框" prop="sendContent">
      <el-input
                v-model="sendForm.sendContent"
                @keyup.native.enter="search('sendContent')"
                autocomplete="off"
                placeholder="工单号、发货文本、备注"
                prefix-icon="el-icon-goods">
        <i slot="suffix" class="el-input__icon el-icon-view btn-eye"></i>
      </el-input></el-form-item>
      <el-form-item label="状态" prop="status">
      <el-select  v-model="sendForm.status" multiple   placeholder="选择状态" clearable filterable>
        <el-option v-for="item in statusDict" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="钱票状态" prop="ticketStatus">
      <el-select  v-model="sendForm.ticketStatus" multiple  placeholder="选择钱票状态" clearable filterable>
        <el-option v-for="item in ticketStatusDict" :key="item.key" :label="item.value" :value="item.key"> </el-option>
      </el-select></el-form-item>
      <el-form-item label="备注" prop="remark">
      <el-input
                v-model="sendForm.remark"
                @keyup.native.enter="search('remark')"
                autocomplete="off"
                placeholder="备注"
                prefix-icon="el-icon-goods">
        <i slot="suffix" class="el-input__icon el-icon-view btn-eye"></i>
      </el-input></el-form-item>
      <el-form-item v-show="showMsg" style="margin-bottom:0;">
        <span class="text-danger">提示：搜索有异常，请重试！</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search('sendForm')" class="login-btn" v-loading="loading">搜索</el-button>
      </el-form-item>
    </el-form>
      </div></el-col>
  <!--表格渲染-->
 <el-table ref="table" v-loading="search.loading" :data="search.data" style="width: 100%;" @selection-change="search.selectionChangeHandler">
    <el-table-column :selectable="checkboxT" type="selection" width="55" />
    <el-table-column :show-overflow-tooltip="true" prop="username" label="工单号" />
    <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
    <el-table-column prop="gender" label="性别" />
    <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话" />
    <el-table-column :show-overflow-tooltip="true" width="135" prop="email" label="邮箱" />
    <el-table-column :show-overflow-tooltip="true" prop="dept" label="部门">
      <template slot-scope="scope">
        <div>{{ scope.row.dept.name }}</div>
      </template>
    </el-table-column>
    <el-table-column label="状态" align="center" prop="enabled">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.enabled"
          :disabled="user.id === scope.row.id"
          active-color="#409EFF"
          inactive-color="#F56C6C"
          @change="changeEnabled(scope.row, scope.row.enabled)"
        />
      </template>
    </el-table-column>
    <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="创建日期" />
    <el-table-column
      v-if="checkPer(['admin','user:edit','user:del'])"
      label="操作"
      width="115"
      align="center"
      fixed="right"
    >
      <template slot-scope="scope">
        <udOperation
          :data="scope.row"
          :permission="permission"
          :disabled-dle="scope.row.id === user.id"
        />
      </template>
    </el-table-column>
  </el-table>
  <pagination />
  <!--分页组件-->
  </div>
</template>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #20222A;
  .login-form {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #f5f5f5;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .btn-eye {
      cursor: pointer;
    }
    .text-danger {
      color: #F56C6C;
    }
    .login-btn {
      margin: 35px 0 10px 0;
      width: 100%;
    }
  }
}
</style>
