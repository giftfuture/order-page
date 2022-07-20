<script>
import { overallSearch, fetchAllSort } from '@/api/index.js'
import { statusDict, ticketStatusDict } from '@/common/enum'
import dayjs from 'dayjs'

export default {
  name: 'ZHSSTab',
  components: {
  },
  data () {
    return {
      sumInAmount: 0,
      orderSortSelect: [],
      colSpan7: 7,
      colSpan6: 6,
      colSpan5: 5,
      colSpan4: 4,
      colSpan3: 3,
      colSpan2: 2,
      statusDictSelect: Object.keys(statusDict).map(key => statusDict[key]),
      ticketStatusDictSelect: Object.keys(ticketStatusDict).map(key => ticketStatusDict[key]),
      pageNo: 0,
      pageSize: 10,
      tableData: {
        currentPage: 1,
        total: 0,
        data: []
      },
      createTime: '',
      ZHSSForm: {
        createByStr: '',
        createTimeBegin: '',
        createTimeEnd: '',
        dingRemark: '',
        dingStatus: '',
        dingTicketStatus: '',
        searchContent: '',
        sendRemark: '',
        sendStatus: '',
        sendTicketStatus: '',
        sortName: ''
      },
      loading: false,
      showMsg: false,
      multipleSelection: []
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
    // getOrderSort (keys) {
    //   const keyArr = keys ? keys.split(',') : []
    //   const data = keyArr.map(key => {
    //     return orderSort[key]
    //   })
    //   return data
    // },
    getStatusDict (keys, type, orderSort) {
      if (!keys && typeof keys !== 'string') return []
      const keyArr = keys.split(',')
      const data = this.$store.state[type][orderSort] ? this.$store.state[type][orderSort].filter(item => {
        const key = String(item.key)
        if (keyArr.indexOf(key) > -1) return item
      }) : []
      return data
    },
    handleSearch () {
      const orderInfoVO = { }
      Object.keys(this.ZHSSForm).forEach(key => {
        if (Array.isArray(this.ZHSSForm[key])) {
          orderInfoVO[key] = this.ZHSSForm[key].join(',')
        } else {
          orderInfoVO[key] = this.ZHSSForm[key]
        }
      })
      const params = {
        orderInfoVO,
        'pageRequest': { 'page': this.pageNo, 'size': this.pageSize }
      }
      overallSearch(params)
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
      this.sumInAmount = 0
      val.map((item) => this.sumInAmount += item.inAmount)
      this.multipleSelection = val
    },
    handleNodeClick (data) {
      console.log(data)
    },
    checkboxT (row, rowIndex) {
      // console.log(row, 'row====')
      // return row.id !== this.user.id
      // checkboxList()
      return row.id
    },
    search () {
      // console.log(this.ZHSSForm, 'this.ZHSSForm')
      // console.log(this.$refs.ZHSSForm, 'formName====')
      this.ZHSSForm.createTimeBegin = this.createTime[0] ? dayjs(this.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''
      this.ZHSSForm.createTimeEnd = this.createTime[1] ? dayjs(this.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      // console.log(this.ZHSSForm.createTimeBegin, 'this.ZHSSForm.createTimeBegin')
      this.handleSearch()
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    handleAdd () {
      this.$emit('handleAdd', 'FH', this.handleSearch)
    },
    defaultCheckStatus () {
      // 发货组状态默认全选
      this.ZHSSForm.sendStatus = []
      this.$store.state.statusDictObj.FH && this.$store.state.statusDictObj.FH.map((item) => {
        this.ZHSSForm.sendStatus.push(item.key)
      })
      // 发货组钱票状态默认全选
      this.ZHSSForm.sendTicketStatus = []
      this.$store.state.statusDictObj.FH && this.$store.state.ticketStatusDictObj.FH.map((item) => {
        this.ZHSSForm.sendTicketStatus.push(item.key)
      })
      // 订货组钱票状态默认全选
      this.ZHSSForm.dingStatus = []
      this.$store.state.statusDictObj.DH && this.$store.state.statusDictObj.DH.map((item) => {
        this.ZHSSForm.dingStatus.push(item.key)
      })
      // 订货组钱票状态默认全选
      this.ZHSSForm.dingTicketStatus = []
      this.$store.state.ticketStatusDictObj && Array.isArray(this.$store.state.ticketStatusDictObj.DH) && this.$store.state.ticketStatusDictObj.DH === 'array' && this.$store.state.ticketStatusDictObj.DH.map((item) => {
        this.ZHSSForm.dingTicketStatus.push(item.key)
      })
    }

  },
  created () {
    this.handleSearch()
    this.defaultCheckStatus()
    fetchAllSort().then(res => {
      if (res.code === 0) {
        this.orderSortSelect = res.data
        this.ZHSSForm.orderTag = []
        this.orderSortSelect.map((item) => {
          this.ZHSSForm.orderTag.push(item.sortTag)
        })
      }
    })
  }
}
</script>
<template>
  <div class="commonBody">
    <el-form
      :inline="true"
      :model="ZHSSForm"
      ref="ZHSSForm"
      class="login-form">
      <el-row>
        <el-col :span="colSpan3">
          <el-form-item label="创建人" prop="createByStr">
            <el-select
              v-model="ZHSSForm.createByStr"
              multiple
              placeholder="创建人"
              clearable
              filterable
              style="width: 90px"
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
        <el-col :span="colSpan7">
          <el-form-item label="搜索框" prop="searchContent">
            <el-input
              v-model="ZHSSForm.searchContent"
              @keyup.native.enter="search"
              autocomplete="off"
              placeholder="工单号、文本、金额、备注、对账备注"
              prefix-icon="el-icon-goods"
              style="width: 300px">
              <i
                slot="suffix"
                class="el-input__icon el-icon-view btn-eye"
              ></i> </el-input
          ></el-form-item>
        </el-col>
        <el-col :span="colSpan5">
          <el-form-item label="日期">
            <el-date-picker
              style="width: 225px"
              v-model="createTime"
              type="daterange"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
          <el-form-item label="订货组备注" prop="dingRemark">
            <el-input
              v-model="ZHSSForm.dingRemark"
              @keyup.native.enter="search"
              autocomplete="off"
              placeholder="订货组备注"
              style="width: 120px"
            >
            </el-input
            ></el-form-item>
        </el-col>
        <el-col :span="colSpan4">
          <el-form-item label="发货组备注" prop="sendRemark">
            <el-input
              v-model="ZHSSForm.sendRemark"
              @keyup.native.enter="search"
              autocomplete="off"
              style="width: 120px"
              placeholder="发货组备注">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="colSpan3">
          <el-form-item label="组别" prop="orderTag">
            <el-select
              v-model="ZHSSForm.orderTag"
              multiple
              placeholder="选择组别"
              clearable
              filterable
              size="small"
              value-key="sortTag"
              style="width: 110px"
            >
              <el-option
                v-for="item in orderSortSelect"
                :key="item.sortTag"
                :label="item.sortName"
                :value="item.sortTag"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
          <el-form-item label="发货组状态" prop="sendStatus">
            <el-select
              v-model="ZHSSForm.sendStatus"
              multiple
              size="small"
              placeholder="发货组状态"
              clearable
              filterable
              style="width:135px"
            >
              <el-option
                v-for="item in this.$store.state.statusDictObj.FH"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
        <el-form-item label="发货组钱票状态" prop="sendTicketStatus">
          <el-select
            v-model="ZHSSForm.sendTicketStatus"
            multiple
            placeholder="选择发货钱票状态"
            clearable
            size="small"
            filterable
            style="width:180px">
            <el-option
              v-for="item in this.$store.state.ticketStatusDictObj.FH"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option> </el-select></el-form-item>
        </el-col>

        <el-col :span="colSpan4">
        <el-form-item label="订货组状态" prop="dingStatus">
          <el-select
            v-model="ZHSSForm.dingStatus"
            multiple
            placeholder="选择订货组状态"
            clearable
            filterable
            size="small"
            style="width:180px;" class="selsectbox">
            <el-option
              v-for="item in this.$store.state.statusDictObj.DH"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
        <el-form-item label="订货组钱票状态" prop="dingTicketStatus">
          <el-select
            v-model="ZHSSForm.dingTicketStatus"
            multiple
            size="small"
            placeholder="选择订货组钱票状态"
            clearable
            filterable
            style="width:180px">
            <el-option
              v-for="item in this.$store.state.ticketStatusDictObj.DH"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option> </el-select></el-form-item>
        </el-col>

        <el-col :span="colSpan2" style="position:relative; bottom:-35px;float:bottom;">
        <el-form-item
         label=" ">
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
    <el-row><el-col :span=6 ><el-button type="primary" @click="handleOptions">批量操作</el-button></el-col>
      <el-col><span>{{this.sumInAmount}}</span></el-col><el-col>
    <el-pagination
      style="margin:auto;padding-bottom:20px;"
      v-if='tableData.total'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableData.currentPage"
      :page-sizes="[5,10, 20, 30, 40,50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total">
    </el-pagination></el-col></el-row>
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
            <div>工单编号：<router-link :to="`/operlog?id=${scope.row.id}`" target="_blank" ><span :class="scope.row.deleted===1?'commonDelete':''">{{scope.row.orderNo}}</span></router-link>
             <div style="padding-left: 20px;margin-left: 20px;" @click="$emit('handleAction',scope.row,'del', handleSearch)" class="el-icon-delete"></div></div>
            <div>对账备注：{{scope.row.accountRemark}}</div>
            <div>最后修改人：{{scope.row.updator}}</div>
            <div>最后修改时间：{{scope.row.updateTime}}</div>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="组别" align="center" prop="sortName">
        <template slot-scope="scope">
          <div>{{scope.row.sortName}}</div>
        </template>
      </el-table-column>
       <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="文本"
      >
      <template slot-scope="scope">
        <div :class="scope.row.deleted===1 && scope.row.orderTag=='FH'?'commonDelete':''">{{scope.row.sendContent}}</div>
        <div :class="scope.row.deleted===1 && scope.row.orderTag !=='FH'?'commonDelete':''">{{scope.row.content}}</div>
      </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="打款输入金额"
      />
      <el-table-column label="发货组状态" align="center" prop="status">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.status, 'statusDictObj', 'ZH')" :key="item.key">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="发货输入金额"
      />
      <el-table-column label="发货组钱票状态" align="center" prop="ticketStatus">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.ticketStatus, 'ticketStatusDictObj', 'ZH')" :key="item.key">
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
        prop="remark"
        label="发货组备注"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="开票输入金额"
      />
      <el-table-column label="订货组状态" align="center" prop="status">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.status, 'statusDictObj', 'ZH')" :key="item.key">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
            <el-tag v-if="item.key===6">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="订货输入金额"
      />
      <el-table-column label="订货组钱票状态" align="center" prop="ticketStatus">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.ticketStatus, 'ticketStatusDictObj', 'ZH')" :key="item.key">
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
        prop="remark"
        label="订货组备注"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pics"
        label="图片"
      />
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.deleted!==1">
            <el-button type="text" size="small" @click="$emit('handleAction',scope.row,'edit', handleSearch)">编辑</el-button>
          </div>
          <div v-if="scope.row.deleted===1">
            <el-button type="text" size="small" @click="$emit('handleAction',scope.row,'edit', handleSearch)">生成新的</el-button>
          </div>
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

/*/deep/   .el-select-dropdown__wrap .el-scrollbar__wrap{
  height:1200px;
  border-radius: 5px;
}*/
/*/deep/ .selsectbox .el-input--small input::-webkit-input-placeholder {
  font-size: 20px;
  font-weight: 550;
}*/
.statusDict1 {
  color: red;
}
</style>
