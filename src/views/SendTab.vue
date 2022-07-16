<script>
import { querySearch } from '@/api/send/index'
import { createOrder } from '@/api/send'
export default {
  name: 'sendTab',
  components: {
  },
  data () {
    return {
      multipleSelection: [],
      colSpan4: 4,
      colSpan2: 2,
      colSpan6: 6,
      pageNo: 0,
      pageSize: 10,
      tableData: {
        currentPage: 1,
        total: 0,
        data: []
      },
      createTime: '',
      sendForm: {
        createByStr: '',
        createTimeBegin: '',
        createTimeEnd: '',
        searchContent: '',
        statusStr: '',
        ticketStatusStr: ''
      },
      loading: false,
      showMsg: false
    }
  },
  watch: {
    pageNo (val) {
      console.log(val, 'watch=====pageNo')
      this.handleSearch()
    },
    pageSize (val) {
      console.log(val, 'watch=====pageSize')
      this.handleSearch()
    }
  },
  methods: {
    getStatusDict (keys, type) {
      if (!keys && typeof keys === 'object') return []
      const keyArr = keys.split(',')
      const data = this.$store.state[type].FH ? this.$store.state[type].FH.filter(item => {
        const key = String(item.key)
        if (keyArr.indexOf(key) > -1) return item
      }) : []
      return data
    },
    handleSearch () {
      const orderInfoVO = {}
      Object.keys(this.sendForm).forEach(key => {
        if (Array.isArray(this.sendForm[key])) {
          orderInfoVO[key] = this.sendForm[key].join(',')
        } else {
          orderInfoVO[key] = this.sendForm[key]
        }
      })
      orderInfoVO.orderTag = 'FH'
      const params = {
        orderInfoVO,
        'pageRequest': { 'page': this.pageNo, 'size': this.pageSize }
      }
      querySearch(params)
        .then((response) => {
          console.log(response, '====')
          if (response.code === 0) {
            this.tableData.data = response.data.content ? response.data.content : []
            this.tableData.total = response.data && (response.data.totalElements || 0)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
      return params
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageNo = val - 1
      console.log(`当前页: ${val}`)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      // this.addForm = { id: null, isShowInput: true, status: [], statusStr: [], ticketStatusStr: [], ticketStatus: [] }
      this.tableData.data.push({ id: null, isShowInput: true })
      // this.$ref.editInput.focus()
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    checkboxT (row, rowIndex) {
      console.log(row, 'row====')
      // return row.id !== this.user.id
      // checkboxList()
      return row.id
    },
    search () {
      console.log(this.sendForm, 'this.sendForm')
      console.log(this.$refs.sendForm, 'formName====')
      this.sendForm.createTimeBegin = this.createTime[0]
      this.sendForm.createTimeEnd = this.createTime[1]
      this.handleSearch()
    },
    // 合并列
    arraySpanMethod ({ row, columnIndex }) {
      if (row.isShowInput) {
        if (columnIndex === 1) {
          return [1, 5]
        }
      }
    },
    // 创建方法
    handleBlur (key, row) {
      const params = {
        [key]: row[key],
        orderTag: 'FH'
      }
      if (row.id) {
        // 编辑
        params.id = row.id
      }
      createOrder(params).then(res => {
        console.log(res, 'createOrder')
        if (res.code === 0) {
          this.$message({
            message: '新建成功',
            type: 'success'
          })
          this.handleSearch()
        }
      })
    }
  },
  created () {
    this.handleSearch()
  }
}
</script>
<template>
  <div class="commonBody">
    <el-form
      :inline="true"
      :model="sendForm"
      ref="sendForm"
    >
      <el-row>
        <el-col :span="colSpan4">
          <el-form-item label="创建人" prop="createByStr">
            <el-select
              v-model="sendForm.createByStr"
              multiple
              placeholder="选择创建人"
              clearable
              filterable
              style="width: 140px"
            >
              <el-option
                v-for="item in $store.state.allStaf"
                :key="item.id"
                :label="item.staffName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
          <el-form-item label="搜索框" prop="searchContent">
            <el-input
              style="width: 140px"
              v-model="sendForm.searchContent"
              @keyup.native.enter="search"
              autocomplete="off"
              placeholder="工单号、发货文本、备注"
              prefix-icon="el-icon-goods"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-view btn-eye"
              ></i> </el-input
          ></el-form-item>
        </el-col>
        <el-col :span="colSpan6">
          <el-form-item label="日期">
            <el-date-picker
              style="width: 240px"
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
        <el-form-item label="状态" prop="statusStr">
          <el-select
            style="width: 140px"
            v-model="sendForm.statusStr"
            multiple
            placeholder="选择状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in $store.state.statusDictObj.FH"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
        <el-form-item label="钱票状态" prop="ticketStatusStr">
          <el-select
            style="width: 130px"
            v-model="sendForm.ticketStatusStr"
            multiple
            placeholder="选择钱票状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in $store.state.ticketStatusDictObj.FH"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option> </el-select
        ></el-form-item>
        </el-col>
        <el-col :span="colSpan2">
        <!-- <el-form-item v-show="showMsg" style="margin-bottom: 0">
          <span class="text-danger">提示：搜索有异常，请重试！</span>
        </el-form-item> -->
        <el-form-item
         label=" "
          style="width: 400px;text-aline:right;"
        >
          <el-button
            type="primary"
            @click="search"
            class="login-btn"
            v-loading="loading"
            >搜索</el-button
          >
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-button type="primary" @click="handleAdd">+创建</el-button>
      <el-button type="primary" @click="handleOptions">批量操作</el-button>
    </el-row>
    <el-pagination
      style="margin:auto;padding-bottom:20px;"
      v-if='tableData.total'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableData.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total">
    </el-pagination>
    <el-table
      height="150"
      ref="table"
      v-loading="loading"
      :data="tableData.data"
      style="width: 100%;overflow: scroll;"
      @selection-change="handleSelectionChange"
      :span-method="arraySpanMethod"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column
        width="250px"
        prop="createBy"
        label="其他"
      >
        <template slot-scope="scope" style="width:300px">
          <el-input ref="editInput" v-focus autofocus v-if="scope.row.isShowInput" v-model="scope.row.sendContent" placeholder="请输入发货文本" @blur="handleBlur('sendContent', scope.row)"/>
          <!-- <el-input v-if="scope.row.isShowInput" v-model="scope.row.accountRemark" placeholder="请输入对账备注" @blur="handleBlur('accountRemark', scope.row)"/> -->
          <div v-else>
            <div>创建人：{{scope.row.creator}}</div>
            <div>日期：{{scope.row.createTime}}</div>
            <div :class="scope.row.deleted===1?'commonDelete':''">工单编号：{{scope.row.orderNo}}</div>
            <div>对账备注：{{scope.row.accountRemark}}</div>
            <div>最后修改人：{{scope.row.updator}}</div>
            <div>最后修改时间：{{scope.row.updateTime}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope" v-if="!scope.row.isShowInput">
          <!-- <el-select
            v-if="scope.row.isShowInput"
            style="width: 140px"
            v-model="scope.row.status"
            multiple
            placeholder="选择状态"
            clearable
            filterable
            @blur="handleBlur('status', scope.row)"
          >
            <el-option
              v-for="item in $store.state.statusDictObj.FH"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select> -->
          <div v-for="item in getStatusDict(scope.row.status, 'statusDictObj')" :key="item.key">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendContent"
        label="发货"
      >
      <template slot-scope="scope">
        <!-- <el-input v-if="scope.row.isShowInput" v-model="scope.row.sendContent" placeholder="请输入发货文本" @blur="handleBlur('sendContent', scope.row)"/> -->
        <div :class="scope.row.deleted===1?'commonDelete':''">{{scope.row.sendContent}}</div>
      </template>
      </el-table-column>
      <el-table-column label="钱票状态" align="center" prop="ticketStatus">
        <template slot-scope="scope" v-if="!scope.row.isShowInput">
          <!-- <el-select
            v-if="scope.row.isShowInput"
            style="width: 130px"
            v-model="scope.row.ticketStatus"
            multiple
            placeholder="选择钱票状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in $store.state.ticketStatusDictObj.FH"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option> </el-select
          > -->
          <div v-for="item in getStatusDict(scope.row.ticketStatus, 'ticketStatusDictObj')" :key="item.key">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="日期"
      /> -->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="输入金额"
      >
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.row.isShowInput" v-model="scope.row.inAmount" placeholder="请输入金额" @blur="handleBlur('inAmount', scope.row)"/> -->
          <div >{{scope.row.inAmout}}</div>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
        <template slot-scope="scope">
          <!-- <div v-if="!scope.row.isShowInput"> -->
          <el-button type="text" size="small" @click="$emit('handleAction',scope.row,'edit', handleSearch)">编辑</el-button>
          <el-button @click="$emit('handleAction',scope.row,'del', handleSearch)" type="text" size="small">删除</el-button>
          <!-- <span v-else>--</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style>

.el-tabs {
      height: 100%;
    display: flex;
    flex-direction: column;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__content {
      flex: 1;
    }
</style>
<style lang="scss" scoped>
.commonBody {
  height: 100%;
  display: flex;
  flex-direction: column;
  &_title {
    font-size: 20px;
    font-weight: 600px;
  }
}
.statusDict1 {
  color: red;
}
// .commonBody{
//   :global {
//     .el-tabs {
//       height: 100%;
//     display: flex;
//     flex-direction: column;
//     }
//     .el-tab-pane {
//       height: 100%;
//     }
//     .el-tabs__content {
//       flex: 1;
//     }
//   }
// }

</style>
