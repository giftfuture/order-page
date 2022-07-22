<script>
import { querySearch, editOrderOne } from '@/api/index.js'
import dayjs from 'dayjs'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module' // 引用
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize) // 注册

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'], // 清除文本格式-----['clean']
  ['image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
]

export default {
  name: 'sendTab',
  components: {
    quillEditor
  },
  data () {
    return {
      content: '请输入文本内容',
      colors: ['color:#67c23a;background-color:#f0f9eb', 'color:#909399;background-color:#f4f4f5', 'color:#e6a23c;background-color:#fdf6ec', 'color:#f56c6c;background-color:#fef0f0', 'color:#409EFF;background-color:#ecf5ff'],
      sendContent: '',
      sumInAmount: '',
      multipleSelection: [],
      colSpan5: 5,
      colSpan4: 4,
      colSpan3: 3,
      colSpan2: 2,
      colSpan6: 6,
      colSpan7: 7,
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
      showMsg: false,
      editorOption: {
        theme: 'snow',
        placeholder: '请输入正文',
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          //  富文本编辑器配置
          toolbar: {
            container: toolbarOptions
          }
        }
      }
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
    handleEdit (row) {
      row.showEdit = true
      // console.log(e, 'handleEdit')
    },
    handleTicketStatusEdit (row) {
      row.showTicketEdit = true
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
    handleTicketStatusBlur (callback, data) {
      console.log('回调参数' + callback)
      if (!callback) {
        console.log(data, 'handleBlur=====')
        // 调保存接口
        if (data.row.ticketStatusEdit) {
          this.doSaveEdit({ id: data.row.id, [data.type]: data.row.ticketStatusEdit.join(',') })
        }
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
            if (response.data.content && response.data.content.length) {
              this.tableData.data = response.data.content.map(item => {
                item.showEdit = !item.status
                item.showTicketEdit = !item.ticketStatus
                item.statusEdit = item.status ? item.status.split(',').map(item => parseInt(item)) : []
                item.ticketStatusEdit = item.ticketStatus ? item.ticketStatus.split(',').map(item => parseInt(item)) : []
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
    handleAdd () {
      this.$emit('handleAdd', 'FH', this.handleSearch)
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    checkboxT (row, rowIndex) {
      // console.log(row, 'row====')
      // return row.id !== this.user.id
      // checkboxList()
      return row.id
    },
    search () {
      // console.log(this.sendForm, 'this.sendForm')
      // console.log(this.$refs.sendForm, 'formName====')
      this.sendForm.createTimeBegin = this.createTime[0] ? dayjs(this.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''
      this.sendForm.createTimeEnd = this.createTime[1] ? dayjs(this.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      // console.log(this.sendForm.createTimeBegin, 'this.sendForm.createTimeBegin')
      this.handleSearch()
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
      :model="sendForm"
      ref="sendForm"
    >
      <el-row>
        <el-col :span="colSpan3">
          <el-form-item label="创建人" prop="createByStr">
            <el-select
              v-model="sendForm.createByStr"
              multiple
              placeholder="创建人"
              clearable
              filterable
              style="width: 100px;"
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
              style="width: 300px"
              v-model="sendForm.searchContent"
              @keyup.native.enter="search"
              autocomplete="off"
              placeholder="工单号、文本、金额、备注、对账备注"
              prefix-icon="el-icon-goods"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-view btn-eye"
              ></i> </el-input
          ></el-form-item>
        </el-col>
        <el-col :span="colSpan5">
          <el-form-item label="日期">
            <el-date-picker
              style="width: 230px"
              v-model="createTime"
              type="daterange"
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
            style="width: 110px"
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
              :value="item.key"/>
            </el-select></el-form-item>
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
    <el-row><el-col :span=6 ><el-button type="primary" @click="handleOptions">批量操作</el-button></el-col>
      <el-col :span=18 >
      <!-- <el-button type="primary" @click="handleAdd">+创建</el-button> -->
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
          <!-- <el-input ref="editInput" v-focus autofocus v-if="scope.row.isShowInput" v-model="scope.row.sendContent" placeholder="请输入发货文本" @blur="handleBlur('sendContent', scope.row)"/> -->
          <!-- <el-input v-if="scope.row.isShowInput" v-model="scope.row.accountRemark" placeholder="请输入对账备注" @blur="handleBlur('accountRemark', scope.row)"/> -->
          <div>
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
        <template slot-scope="scope">
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
              v-for="item in $store.state.statusDictObj.FH || []"
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
        prop="sendContent"
        label="发货"
      >
        <template slot-scope="scope">
          <quill-editor
            ref="sendContent"
            class="editor" :class="scope.row.deleted === 1?'commonDelete':''"
            v-model="scope.row.sendContent"
            :options="editorOption"
            placeholder="请输入发货文本"
            @blur="handleTextBlur($event,{type: 'sendContent', row:{'id':scope.row.id,'text':scope.row.sendContent} })"
          />
        </template>
<!--      <template slot-scope="scope">
        <div class="content">
          <vue-html5-editor :auto-height="true" :class="scope.row.deleted === 1?'commonDelete':''" v-model="scope.row.sendContent"  placeholder="请输入发货文本" @blur="handleTextBlur($event,{type: 'sendContent', row:{'id':scope.row.id,'text':scope.row.sendContent} })"></vue-html5-editor>-->
<!--         <el-input :class="scope.row.deleted === 1?'commonDelete':''" v-model="scope.row.sendContent"  placeholder="请输入发货文本" @blur="handleTextBlur($event,{type: 'sendContent', row:{'id':scope.row.id,'text':scope.row.sendContent} })"/>-->
<!--        </div></template>-->
      </el-table-column>
      <el-table-column label="钱票状态" align="center" prop="ticketStatusCol">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.showTicketEdit"
            style="width: 100%"
            v-model="scope.row.ticketStatusEdit"
            multiple
            placeholder="钱票状态"
            clearable
            filterable
            @visible-change="handleTicketStatusBlur($event, {type: 'ticketStatus', row: scope.row})"
            ref='ticketStatusRef'
          >
            <el-option
              v-for="item in $store.state.ticketStatusDictObj.FH || []"
              :key="item.key"
              :label="item.value"
              :value="item.key"
              :style=" chooseColor(item.key%5-1)"
            />
          </el-select>
          <div v-for="item in getStatusDict(scope.row.ticketStatus, 'ticketStatusDictObj')" :key="item.key" style="cursor: pointer" @click="handleTicketStatusEdit(scope.row)">
            <el-tag type="success" v-if="item.key===1" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="info" v-if="item.key===2" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="warning" v-if="item.key===3" style="margin-top:5px">{{item.value}}</el-tag>
            <el-tag type="danger" v-if="item.key===4" style="margin-top:5px">{{item.value}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="inAmount"
        label="输入金额"
      >
        <template slot-scope="scope">
           <el-input v-model="scope.row.inAmount" placeholder="请输入金额" type="number"  @blur="handleTextBlur($event,{type: 'inAmount', row:{'id':scope.row.id,'text':scope.row.inAmount} })"/>
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
            <el-button type="text" size="small" @click="$emit('handleAction',scope.row,'edit', handleSearch)">复制</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
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

.el-form-item{
  font-size: 12px !important;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体" !important;
}
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
.editor {
  line-height: normal !important;
  height: 100px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}

</style>
