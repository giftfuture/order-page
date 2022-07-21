<script>
import { querySearch } from '@/api/index.js'
import dayjs from 'dayjs'

export default {
  name: 'DHTab',
  data () {
    return {
      showHistory: false,
      historyList: [],
      pastHistory: '',
      newArr: [],
      sumInAmount: '',
      colSpan5: 5,
      colSpan4: 4,
      colSpan3: 3,
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
      DHForm: {
        createByStr: '',
        createTimeBegin: '',
        createTimeEnd: '',
        searchContent: '',
        statusStr: '',
        ticketStatusStr: ''
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
    getStatusDict (keys, type) {
      if (!keys && typeof keys !== 'string') return []
      const keyArr = keys.split(',')
      const data = this.$store.state[type].DH ? this.$store.state[type].DH.filter(item => {
        const key = String(item.key)
        if (keyArr.indexOf(key) > -1) return item
      }) : []
      return data
    },
    handleSearch () {
      const orderInfoVO = { 'orderTag': 'DH' }
      Object.keys(this.DHForm).forEach(key => {
        if (Array.isArray(this.DHForm[key])) {
          orderInfoVO[key] = this.DHForm[key].join(',')
        } else {
          orderInfoVO[key] = this.DHForm[key]
        }
      })
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
      this.pastHistory = false // 每次点击搜索后历史记录就隐藏
      if (this.$refs.searchContent.value !== '') { // 判断输入框的值
        // 每次搜索的值push到新数组里
        this.newArr.push(this.$refs.searchContent.value)
        this.newArr = this.unique(this.newArr) // 调用unique方法去重
        this.list = []
        for (let i = this.newArr.length; i > 0; i--) { // 数组倒序  最新输入的排在最上面
          this.list.push(this.newArr[i - 1])
        }
        if (this.list.length > 10) { // 最多保存10条
          this.list = this.list.slice(0, 10)
        }
        localStorage.setItem('historyList', JSON.stringify(this.list)) // 存localStorage
        console.log(localStorage.getItem('historyList'))
      }
      // console.log(this.DHForm, 'this.DHForm')
      // console.log(this.$refs.DHForm, 'formName====')
      this.DHForm.createTimeBegin = this.createTime[0] ? dayjs(this.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''
      this.DHForm.createTimeEnd = this.createTime[1] ? dayjs(this.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      // console.log(this.DHForm.createTimeBegin, 'this.DHForm.createTimeBegin')
      this.handleSearch()
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    handleAdd () {
      this.$emit('handleAdd', 'DH', this.handleSearch)
    },
    // 去重方法封装
    unique (arr) {
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index
      })
    },
    // 点击文本框输入
    searchFocus () {
      console.log(localStorage.getItem('historyList'))
      if (localStorage.getItem('historyList')) { // historyList有值才执行接下来的操作
        let arrlist = JSON.parse(localStorage.getItem('historyList'))
        this.historyList = arrlist
        console.log(this.historyList)
        if (this.historyList.length > 0) {
          this.pastHistory = true // 有值显示历史记录
        }
      } else {
        this.pastHistory = false
      }
    },
    // 点击历史记录直接搜索
    clickHistory (item, index) {
      this.pastHistory = false
      // this.DHForm.searchContent = item
      this.$refs.searchContent.value = item
      // 接口前处理
      // this.filterData.productTitle = this.inputText
      // this.productList = []
      // this.getProductList() // 调用搜索接口
      let listIndex = index

      this.historyList.splice(0, 0, this.historyList[listIndex]) // 每次点击记录被点击的展示在最前面
      this.historyList = this.unique(this.historyList) // 去重
      localStorage.setItem('historyList', JSON.stringify(this.historyList)) // 新数组储存
    },
    // 点击删除记录
    deleteHis (index) {
      if (isNaN(index) || index >= this.historyList.length) {
        return false
      }
      this.historyList.splice(index, 1)
      localStorage.setItem('historyList', JSON.stringify(this.historyList)) // 保存删除后的新数组
      if (this.historyList.length === 0) {
        this.pastHistory = false
      }
    }
  },
  created () {
    this.handleSearch()
  }

}
</script>
<template>
  <div class="commonBody" @click="pastHistory = false"><!-- showHistory @click="handleCloseCity" @click="this.$refs.history.style.display = 'none'"-->
    <el-form
      :inline="true"
      :model="DHForm"
      ref="DHForm"
      class="login-form">
      <el-row>
        <el-col :span="colSpan3">
          <el-form-item label="创建人" prop="createByStr">
            <el-select
              v-model="DHForm.createByStr"
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
        <el-col :span="colSpan6">
          <el-form-item label="搜索框" prop="searchContent">
            <el-input
              style="width: 270px"
              v-model="DHForm.searchContent"
              @keyup.native.enter="search"
              @focus = "searchFocus"
              autocomplete="on"
              ref = "searchContent"
              placeholder="工单、文本、金额、到货、备注、对账备注"
              prefix-icon="el-icon-goods">
              <i
                slot="suffix"
                class="el-input__icon el-icon-view btn-eye"
              ></i> </el-input
          ></el-form-item>
          <div class="history" ref="history" v-if="pastHistory"  @click.stop="pastHistory=true"  >     <!-- @click.stop="pastHistory=true" showHistory  @click="handleDivClick" @click = "this.$refs.history.style.display = 'block'"历史记录默认不显示,有搜索记录才显示  style="display: inline;"-->
            <ul><li>
            <div class="hisText">历史记录</div>
            </li>
              <li v-for="(item,index) in historyList" :key="index">
                <span @click="clickHistory(item,index)">{{item}}</span>
                <img src="@/assets/delete.png" style="width:9px;height:9px;" alt @click="deleteHis(index)" />
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="colSpan5">
          <el-form-item label="日期">
            <el-date-picker
              style="width: 220px"
              v-model="createTime"
              type="datetime-range"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan3">
        <el-form-item label="状态" prop="statusStr">
          <el-select
            style="width: 80px"
            v-model="DHForm.statusStr"
            multiple
            placeholder="状态"
            clearable
            filterable>
            <el-option
              v-for="item in this.$store.state.statusDictObj.DH"
              :key="item.key"
              :label="item.value"
              :value="item.key" >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
        <el-form-item label="钱票状态" prop="ticketStatusStr">
          <el-select
            style="width: 120px"
            v-model="DHForm.ticketStatusStr"
            multiple
            placeholder="钱票状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in this.$store.state.ticketStatusDictObj.DH"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option> </el-select
        ></el-form-item>
        </el-col>
        <el-col :span="colSpan2">
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
    <el-row><el-col :span=6 ><el-button type="primary" @click="handleOptions">批量操作</el-button></el-col>
     <el-col :span=18>
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
    <el-row><el-col :span="24" style="align: middle;"><div style="align: middle;" v-if="this.sumInAmount">输入金额合计：{{this.sumInAmount}}</div></el-col></el-row>
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
              <div style="padding-left: 20px;margin-left: 20px;" @click="$emit('handleAction',scope.row,'del', handleSearch)" class="el-icon-delete"></div>
            </div>
            <div>对账备注：{{scope.row.accountRemark}}</div>
            <div>最后修改人：{{scope.row.updator}}</div>
            <div>最后修改时间：{{scope.row.updateTime}}</div>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.status, 'statusDictObj')" :key="item.key">
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
        prop="content"
        label="订货"
      >
      <template slot-scope="scope">
        <div :class="scope.row.deleted===1?'commonDelete':''">{{scope.row.content}}</div>
      </template>
      </el-table-column>
      <el-table-column label="钱票状态" align="center" prop="ticketStatus">
        <template slot-scope="scope">
          <div v-for="item in getStatusDict(scope.row.ticketStatus, 'ticketStatusDictObj')" :key="item.key">
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
        label="输入金额"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="arriveNotice"
        label="到货通知"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
      >
        <template slot-scope="scope">
          <div >{{scope.row.remark}}</div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountRemark"
        label="对账备注"
      >
        <template slot-scope="scope">
          <div >{{scope.row.accountRemark}}</div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pics"
        label="图片"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.imgList&&scope.row.imgList.length" type="text" size="small" @click="$emit('handleAction',scope.row.imgList, 'previewImage')">查看</el-button>
          <span  v-else>无图片</span>
        </template>
      </el-table-column>
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
.statusDict1 {
  color: red;
}
.history {
  position: absolute;
  margin-top: -22px;
  width: 150px;
  height: 240px;
  background-color: #ffffff;
  z-index: 999;
  border-radius: 4px;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  font-size: 13px;
  overflow: hidden;
  .field {
    width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 19.5px;
    padding-right: 10px;
    padding-bottom: 40px;
    .title {
      height: 40px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 40px;
    }
    .record-item {
      flex: 1;
      overflow-y: auto;
    }
  }
  .record {
    flex: 1;
    box-shadow: 0px 1px 2px 0px rgba(0, 20, 61, 0.1);
    display: flex;
    flex-direction: column;
    padding-left: 19.5px;
    padding-right: 10px;
    .title {
      height: 40px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 40px;
    }
    .record-item {
      flex: 1;
      overflow-y: auto;
    }
    .clearbtn {
      height: 40px;
      line-height: 40px;
    }
  }
}

</style>
