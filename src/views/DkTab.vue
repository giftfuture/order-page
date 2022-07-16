<script>
import { querySearch } from '@/api/send/index'

export default {
  name: 'sendTab',
  components: {
  },
  data () {
    return {
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
      const keyArr = keys.split(',')
      const data = this.$store.state[type].DK ? this.$store.state[type].DK.filter(item => {
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
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    handleAdd () {
      this.$emit('handleAdd', 'FH', this.handleSearch)
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
      class="login-form"
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
              v-for="item in this.$store.state.statusDictObj.DK"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="colSpan4">
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
    <el-row>
      <el-button type="primary" @click="handleAdd">创建</el-button>
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
            <div :class="scope.row.deleted===1?'commonDelete':''">工单编号：{{scope.row.orderNo}}</div>
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
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="打款"
      >
      <template slot-scope="scope">
        <div :class="scope.row.deleted===1?'commonDelete':''">{{scope.row.sendContent}}</div>
      </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="输入金额"
      />
       <el-table-column
        :show-overflow-tooltip="true"
        prop="pics"
        label="附件"
      />
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$emit('handleAction',scope.row,'edit', handleSearch)">编辑</el-button>
          <el-button @click="$emit('handleAction',scope.row,'del', handleSearch)" type="text" size="small">删除</el-button>
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
