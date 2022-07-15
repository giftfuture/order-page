<script>
import { getOrderList, queryAllStaf } from '@/api/send/index'
const statusDict = {
  1: { key: 1, value: '已打单', className: 'statusDict1' },
  2: { key: 2, value: '待发', className: 'statusDict2' },
  3: { key: 3, value: '缺货', className: 'statusDict3' },
  4: { key: 4, value: '已作退货', className: 'statusDict4' },
  5: { key: 5, value: '已调', className: 'statusDict5' },
  6: { key: 6, value: '重新打速递单', className: 'statusDict6' }
}
const ticketStatusDict = {
  1: { key: 1, value: '欠款' },
  2: { key: 2, value: '欠票' },
  3: { key: 3, value: '只收了部分' },
  4: { key: 4, value: '只开了部分' }
}
export default {
  name: 'sendTab',
  components: {
  },
  data () {
    return {
      allStaf: [],
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
      selectCheckedData: [
      ],
      statusDict: [
        { key: 1, value: '已打单' },
        { key: 2, value: '待发' },
        { key: 3, value: '缺货' },
        { key: 4, value: '已作退货' },
        { key: 5, value: '已调' },
        { key: 6, value: '重新打速递单' }
      ],
      ticketStatusDict: [
        { key: 1, value: '欠款' },
        { key: 2, value: '欠票' },
        { key: 3, value: '只收了部分' },
        { key: 4, value: '预开' },
        { key: 5, value: '只开了部分' }
      ],
      loading: false,
      showMsg: false
    }
  },
  watch: {
    pageNo (val) {
      console.log(val)
      this.handleSearch()
    },
    pageSize (val) {
      console.log(val)
      this.handleSearch()
    }
  },
  methods: {
    handleQueryAllStaf () {
      queryAllStaf().then(res => {
        console.log(res, 'res')
        if (res.code === 0) {
          this.selectCheckedData = res.data
        }
      })
    },
    getStatusDict (keys) {
      console.log(keys, 'keys', statusDict)
      const keyArr = keys.split(',')
      const data = keyArr.map(key => {
        return statusDict[key]
      })
      console.log(data, 'data====')
      return data
    },
    getTicketStatusDict (keys) {
      console.log(keys, 'keys', statusDict)
      const keyArr = keys.split(',')
      const data = keyArr.map(key => {
        return ticketStatusDict[key]
      })
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
      const params = {
        orderInfoVO,
        'pageRequest': { 'page': this.pageNo, 'size': this.pageSize }
      }
      getOrderList(params)
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
    handleNodeClick (data) {
      console.log(data)
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
    }
  },
  created () {
    this.handleSearch()
    this.handleQueryAllStaf()
  }
}
</script>
<template>
  <div class="commonBody">
    <el-form
      :inline="true"
      :model="sendForm"
      ref="sendForm"
      class="login-form"
    >
      <el-row>
        <el-col span="4">
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
                v-for="item in selectCheckedData"
                :key="item.id"
                :label="item.staffName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="4">
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
        <el-col span="6">
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
        <el-col span="4">
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
              v-for="item in statusDict"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col span="4">
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
              v-for="item in ticketStatusDict"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option> </el-select
        ></el-form-item>
        </el-col>
        <el-col span="2">
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
      <el-button type="primary">+创建</el-button>
      <el-button type="primary">批量操作</el-button>
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
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column
        width="250px"
        prop="createBy"
        label="其他"
      >
        <template slot-scope="scope" style="width:300px">
          <div >
            <div>创建人：{{scope.row.creator}}</div>
            <div>日期：{{scope.row.createTime}}</div>
            <div>工单编号：{{scope.row.orderNo}}</div>
            <div>对账备注：{{scope.row.accountRemark}}</div>
            <div>最后修改人：{{scope.row.updator}}</div>
            <div>最后修改时间：{{scope.row.updateTime}}</div>
        </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="orderNo"
        label="工单号"
      /> -->
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="createBy"
        label="创建人"
      /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.status)" :key="item.key">
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
      />
      <el-table-column label="钱票状态" align="center" prop="ticketStatus">
        <template slot-scope="scope">
          <div v-for="item in getTicketStatusDict(scope.row.ticketStatus)" :key="item.key">
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
      />
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="accountRemark"
        label="备注"
      /> -->
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="updateTime"
        label="最后修改日期"
      /> -->
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="updator"
        label="最后修改人"
      /> -->
        <!-- :show-overflow-tooltip="true" -->
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
