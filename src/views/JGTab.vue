<script>
import { editOrderOne, querySearch } from '@/api/index.js'
import { statusDict, ticketStatusDict } from '@/common/enum'
import dayjs from 'dayjs'

export default {
  name: 'JGTab',
  components: {
  },
  data () {
    return {
      colors: ['color:#67c23a;background-color:#f0f9eb', 'color:#909399;background-color:#f4f4f5', 'color:#e6a23c;background-color:#fdf6ec', 'color:#f56c6c;background-color:#fef0f0', 'color:#409EFF;background-color:#ecf5ff'],
      sumInAmount: '',
      colSpan4: 4,
      colSpan2: 2,
      colSpan6: 6,
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
      JGForm: {
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
    handleEdit (row) {
      row.showEdit = true
      // console.log(e, 'handleEdit')
    },
    handleBlur (callback, data) {
      console.log('回调参数' + callback)
      if (!callback) {
        console.log(data, 'handleBlur=====')
        // 调保存接口
        if (data.row.statusEdit) {
          this.doSaveEdit({ id: data.row.id, [data.type]: data.row.statusEdit.join(',') })
        }
      }
    },
    handleTextBlur (callback, data) {
      console.log('回调参数' + callback)
      if (callback) {
        console.log(data, 'handleBlur=====')
        // 调保存接口
        this.doSaveEdit({ id: data.row.id, [data.type]: data.row.text })
      }
    },
    doSaveEdit (data) {
      editOrderOne(data).then(res => {
        if (res.code === 0) {
          this.$message.success('编辑成功')
          this.handleSearch()
        }
      })
    },
    getStatusDict (keys, type) {
      console.log(keys, 'keys===')
      if (!keys && typeof keys !== 'string') return []
      const keyArr = keys.split(',')
      const data = this.$store.state[type].JG ? this.$store.state[type].JG.filter(item => {
        const key = String(item.key)
        if (keyArr.indexOf(key) > -1) return item
      }) : []
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
      const orderInfoVO = { 'orderTag': 'JG' }
      Object.keys(this.JGForm).forEach(key => {
        if (Array.isArray(this.JGForm[key])) {
          orderInfoVO[key] = this.JGForm[key].join(',')
        } else {
          orderInfoVO[key] = this.JGForm[key]
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
            if (response.data.content && response.data.content.length) {
              this.tableData.data = response.data.content.map(item => {
                item.showEdit = !item.status
                item.statusEdit = item.status ? item.status.split(',').map(item => parseInt(item)) : []
                return item
              })
            }
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
      return row.id
    },
    search () {
      // console.log(this.JGForm, 'this.JGForm')
      // console.log(this.$refs.JGForm, 'formName====')
      this.JGForm.createTimeBegin = this.createTime[0] ? dayjs(this.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''
      this.JGForm.createTimeEnd = this.createTime[1] ? dayjs(this.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      // console.log(this.JGForm.createTimeBegin, 'this.JGForm.createTimeBegin')
      this.handleSearch()
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    handleAdd () {
      this.$emit('handleAdd', 'JG', this.handleSearch)
    },
    chooseColor (key) {
      return this.colors[key]
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
      :model="JGForm"
      ref="JGForm"
      class="login-form"
    >
      <el-row>
        <el-col :span="colSpan4">
          <el-form-item label="创建人" prop="createByStr">
            <el-select
              v-model="JGForm.createByStr"
              multiple
              placeholder="创建人"
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
        <el-col :span="colSpan6">
          <el-form-item label="搜索框" prop="searchContent">
            <el-input
              style="width: 260px"
              v-model="JGForm.searchContent"
              @keyup.native.enter="search"
              autocomplete="off"
              placeholder="工单号、价格文本、备注"
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
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
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
            v-model="JGForm.statusStr"
            multiple
            placeholder="选择状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in this.$store.state.statusDictObj.JG"
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
    <el-row><el-col :span=6 ><el-button type="primary" @click="handleOptions">批量操作</el-button></el-col>
     <el-col :span=18 >
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
              <div style="padding-left: 20px;margin-left: 20px;" @click="$emit('handleAction',scope.row,'del', handleSearch)" class="el-icon-delete"></div></div>
            <div>对账备注：{{scope.row.accountRemark}}</div>
            <div>最后修改人：{{scope.row.updator}}</div>
            <div>最后修改时间：{{scope.row.updateTime}}</div>
        </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope" >
          <el-select
            v-if="scope.row.showEdit"
            style="width: 100%"
            v-model="scope.row.statusEdit"
            multiple
            placeholder="选择状态"
            clearable
            filterable
            @visible-change="handleBlur($event, {type: 'status', row: scope.row})"
            ref='statusRef'
          >
            <el-option
              v-for="item in $store.state.statusDictObj.JG || []"
              :key="item.key"
              :label="item.value"
              :value="item.key"
              :style=" chooseColor(item.key%5-1)"
            />
          </el-select>
          <div v-else v-for="item in getStatusDict(scope.row.status, 'statusDictObj')" :key="item.key" style="cursor: pointer" @click="handleEdit(scope.row)">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag v-if="item.key===5">{{item.value}}</el-tag>
            <el-tag type="success" v-if="item.key===6">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="价格"
      >
      <template slot-scope="scope">
        <el-input type="textarea" :rows="6" :class="scope.row.deleted === 1?'commonDelete':''" v-model="scope.row.content"  placeholder="请输入价格文本" @blur="handleTextBlur($event,{type: 'content', row:{'id':scope.row.id,'text':scope.row.content} })"/>
      </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
      >
        <template slot-scope="scope">
          <el-input type="textarea" :rows="6" v-model="scope.row.remark" placeholder="请输入备注"   @blur="handleTextBlur($event,{type: 'remark', row:{'id':scope.row.id,'text':scope.row.remark} })"/>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountRemark"
        label="对账备注"
      >
        <template slot-scope="scope">
          <el-input type="textarea" :rows="6" v-model="scope.row.accountRemark" placeholder="请输入对账备注"   @blur="handleTextBlur($event,{type: 'accountRemark', row:{'id':scope.row.id,'text':scope.row.accountRemark} })"/>
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

</style>
