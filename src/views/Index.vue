<template>
  <el-container class="index-box">
<!--    <el-aside width="asideWidth">
      <div class="logo">
        <img v-show="!isCollapse" src="./../assets/logo.png" alt="ELementUI" width="122" height="122">
      </div>
      <menus :isCollapse="isCollapse"/>
    </el-aside>-->
    <el-container>
      <el-header>
        <Headers/>
      </el-header>
      <el-main>
<!--       <router-view v-if="isRouterAlive"/>-->
        <div  class="mpm-container" style="position: relative; width: 100%;height: 100%;overflow:hidden; -webkit-overflow-scrolling:touch;">
          <el-tabs v-model="currentView" @tab-click="handleClick" style="padding-bottom: 10px;">
            <el-tab-pane v-for="item in views" :label="item.label" :name="item.name" :key="item.name">
              <KpzlTab v-if="item.type==='KP'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <DHTab v-if="item.type==='DH'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <ZHSSTab v-if="item.type==='ZH'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <SendTab v-if="item.type==='FH'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <DkTab v-if="item.type==='DK'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <JHTab v-if="item.type==='JH'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
              <JGTab v-if="item.type==='JG'" @handleOptions="handleOptions" @handleAction="handleAction" @handleAdd="handleAdd" />
            </el-tab-pane>
          </el-tabs>
          <div class="addInput">
            <el-row>
              <el-col :span=10>
                <el-input ref="addInput" type="textarea" :rows="4"  v-focus autofocus v-if="addInput" v-model="addForm.content" placeholder="请输入工单文本" />
              </el-col><el-col :span=1.5>
              <el-button type="primary" style="margin-left: 5px;margin-right:5px;margin-top: 25px" @click="handleAddSure">保存</el-button>
            </el-col>
              <el-col :span=5>
                <el-input ref="addInput" type="textarea" :rows="4"  v-focus autofocus v-if="addInput" v-model="exchangeText" placeholder="请输入转换文本" />
              </el-col><el-col :span=2>
              <el-select v-model="exchangeType"
                         size="small"
                         placeholder="转换类型"
                         clearable
                         filterable
                         style="width:100px;padding-bottom: 10px;margin-left: 7px;margin-right:7px;">
                <el-option
                  v-for="item in this.$store.exchangeSort"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option> </el-select><br/>
              <el-button type="primary" size="small" style="margin-left: 25px;margin-right:25px;margin-bottom: 5px;"  @click="handleExchange">转换</el-button>
            </el-col><el-col :span=5>
              <el-input type="textarea" :rows="4" v-model="exchangResult" placeholder="转换结果" />
            </el-col>
            </el-row>
          </div>
          <EditDialog :showTypeObj="showTypeObj" :tabType="currentType" @handleClose="handleClose"  />
          <EditInfosDialog :showEditInfo="showEditInfo" :tabType="currentType" @handleEdit="handleEdit"  />
          <PreviewImage :imgViewerVisible="imgViewerVisible" :imgList="imgList"/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Headers from '@/components/header/header.vue'
import KpzlTab from '@/views/KPZLTab.vue'
import DHTab from '@/views/DHTab.vue'
import SendTab from '@/views/SendTab.vue'
import DkTab from '@/views/DKTab.vue'
import JHTab from '@/views/JHTab.vue'
import JGTab from '@/views/JGTab.vue'
import ZHSSTab from '@/views/ZHSSTab.vue'
import { mapActions } from 'vuex'
import EditDialog from '@/components/EditDialog'
import EditInfosDialog from '@/components/EditInfosDialog'
import { editListOrder, editOrder, delOrder, createOrder, exchangeFunc } from '@/api/index.js'
import { orderSort, sortList } from '@/common/enum'
import PreviewImage from '@/components/previewImage'

export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      exchangeType: '',
      exchangeText: '',
      exchangResult: '',
      imgViewerVisible: false,
      imgList: [],
      addInput: true,
      addForm: {
        isShow: false,
        addType: '',
        content: '',
        callBack: null
      },
      options: [],
      callBack: null,
      showTypeObj: {
        title: '批量操作',
        isShow: false,
        status: true,
        ticketStatus: true
      },
      showEditInfo: {
        title: '编辑',
        isShow: false
      },
      currentView: 'SendTab',
      currentType: 'FH',
      views: [{
        label: '发货组',
        name: 'SendTab',
        type: 'FH'
      }, {
        label: '开票与资料组',
        name: 'KPZLTab',
        type: 'KP'
      }, {
        label: '订货组',
        name: 'DHTab',
        type: 'DH'
      }, {
        label: '打款组',
        name: 'DKTab',
        type: 'DK'

      }, {
        label: '进货组',
        name: 'JHTab',
        type: 'JH'

      }, {
        label: '价格组',
        name: 'JGTab',
        type: 'JG'
      }, {
        label: '综合搜索',
        name: 'ZHSSTab',
        type: 'ZH'
      }]

    }
  },
  components: {
    Headers,
    PreviewImage,
    EditDialog,
    EditInfosDialog,
    KpzlTab,
    DHTab,
    SendTab,
    DkTab,
    JHTab,
    JGTab,
    ZHSSTab
  },
  watch: {
    currentType (val) {
      this.addForm.addType = val
      if (val === 'ZH') {
        this.handleLoadBySort('DH')
        this.handleLoadBySort('FH')
        return
      }
      this.handleLoadBySort(val)
    }

  },
  created () {
    this.handleLoadBySort('SJJH')
    this.handleQueryAllStaf()
    this.handleLoadBySort(this.currentType)
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
    asideWidth () {
      return this.$store.state.isCollapse ? 'auto' : '200px'
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    ...mapActions({
      handleQueryAllStaf: 'handleQueryAllStaf',
      handleLoadBySort: 'handleLoadBySort'
    }),
    handleClick (event) {
      console.log(event.index, 'index')
      this.currentView = this.views[event.index].name
      this.currentType = this.views[event.index].type
    },
    // 批量操作
    handleOptions  (data) {
      console.log(data, 'handleOptions')
      if (!data || !data.multipleSelection.length) {
        this.$message({
          message: '请先选择工单',
          type: 'warning'
        })
        return
      }
      this.options = data.multipleSelection || []
      this.callBack = data.callBack
      this.showTypeObj = {
        title: '批量操作',
        isShow: true,
        status: true,
        ticketStatus: true
      }
    },
    // 关闭弹窗或者确定批量操作
    handleClose (data) {
      console.log(data, this.options, 'handleClose')
      if (data.actionType === 0) {
        this.showTypeObj.isShow = false
      } else {
        // 发送修改接口
        const params = {
          idList: this.options.map(item => item.id).join(','),
          status: data.form.statusStr.join(','),
          ticketStatus: data.form.ticketStatusStr.join(',')
        }
        editListOrder(params).then(res => {
          console.log(res, 'editOrder')
          if (res.code === 0) {
            this.showTypeObj.isShow = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.callBack && this.callBack()
          }
        })
        console.log(params)
      }
    },
    handleExchange () {
      const params = {}
      params.text = this.exchangeText
      params.type = this.exchangeType
      if (!params.text || params.text.trim().length === 0) {
        this.$message({
          message: '请输入有效文本！',
          type: 'fail'
        })
        return
      }
      // console.log(this.$store.exchangeSort.keys())
      // if (this.$store.exchangeSort.keys()(params.type) <= -1) {
      //   this.$message({
      //     message: '文本转换类型无效！',
      //     type: 'fail'
      //   })
      //   return
      // }
      exchangeFunc(params).then(res => {
        console.log(res, 'params')
        if (res.code === 0) {
          this.exchangResult = res.message
          this.$message({
            message: '文本类型转换成功！',
            type: 'success'
          })
        }
      })
    },
    // 新建
    handleAdd (addType, querySearchCallBack) {
      console.log(addType, querySearchCallBack, '====handleAdd')
      this.addForm.addType = addType
      this.addForm.isShow = true
      this.addForm.callBack = querySearchCallBack
      this.addForm.content = ''
    },
    // 创建方法
    handleAddSure () {
      // console.log('handleAddSure')
      const params = {}
      if (this.addForm.addType === 'FH') {
        params.sendContent = this.addForm.content
      } else {
        params.content = this.addForm.content
      }
      params.orderTag = this.addForm.addType
      if (sortList.indexOf(this.addForm.addType) <= -1) {
        console.log(this.addForm.addType)
        this.$message({
          message: '综合搜索无法创建工单！',
          type: 'fail'
        })
        return
      }
      createOrder(params).then(res => {
        console.log(res, 'createOrder')
        if (res.code === 0) {
          this.$message({
            message: '工单创建成功！',
            type: 'success'
          })
          this.addForm.callBack && this.addForm.callBack()
          this.addForm = {
            isShow: false,
            addType: '',
            content: '',
            callBack: null
          }
        }
      })
    },
    // 取消创建
    cancleAdd () {
      this.addForm = {
        isShow: false,
        addType: '',
        content: '',
        callBack: null
      }
    },
    // 单个删除或者编辑
    handleAction (data, actionType, callBack) {
      console.log(data, actionType, '====data, actionType')
      switch (actionType) {
        case 'previewImage':
          this.imgViewerVisible = true
          this.imgList = data || []
          break
        case 'del':
          this.$confirm('确认删除该工单吗？')
            .then(_ => {
              delOrder(data.id).then(res => {
                if (res.code === 0) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  callBack()
                }
              })
            })
            .catch(_ => {})
          break
        case 'edit':
          this.callBack = callBack
          this.showEditInfo = {
            isShow: true,
            title: '编辑',
            form: { ...data, status: data.status ? data.status.split(',').map(item => parseInt(item)) : [], ticketStatus: data.ticketStatus ? data.ticketStatus.split(',').map(item => parseInt(item)) : [] },
            ...orderSort[this.currentType].editForm
          }
          console.log(this.showEditInfo.form, '====showEditInfo')
          break
      }
    },
    // 单个编辑
    handleEdit (data) {
      console.log(data, this.options, this.showEditInfo, 'handleEdit')
      if (data.actionType === 0) {
        this.showEditInfo.isShow = false
      } else {
        // 发送修改接口
        const params = {
          id: data.form.id,
          status: data.form.status.join(',')
        }
        this.showEditInfo.ticketStatus && this.showEditInfo.ticketStatus.isShow && (params.ticketStatus = data.form.ticketStatus.join(','))
        const formModal = orderSort[this.currentType].editForm
        console.log(formModal, this.showEditInfo, 'this.showEditInfo====')
        Object.keys(formModal).forEach(key => {
          if (formModal[key] && formModal[key].isShow && !params[key]) {
            if (key === 'inAmount') {
              console.log('inAmount')
              params[formModal[key].key] = parseFloat(data.form[formModal[key].key])
            } else {
              params[formModal[key].key] = data.form[formModal[key].key]
            }
          }
        })
        editOrder(params).then(res => {
          console.log(res, 'editOrder')
          if (res.code === 0) {
            this.showEditInfo.isShow = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.callBack && this.callBack()
          }
        })
        console.log(params)
      }
    },
    calInAmount (data) {
      console.log(data, 'handleOptions')
      if (!data || !data.multipleSelection.length) {
        this.$message({
          message: '请先选择工单',
          type: 'warning'
        })
        return
      }
      this.options = data.multipleSelection || []
      this.callBack = data.callBack
      this.showTypeObj = {
        title: '批量操作',
        isShow: true,
        status: true,
        ticketStatus: true
      }
    }
  }
}

</script>
<style scoped lang="less">
.addInput {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}
.el-button{
  padding: 10px 20px !important;
}
/*改变原来tabBox的flex布局*/
.mpm-container .vux-tab .vux-tab-item {
  display: inline-block;
  width: auto;
  height: 100%;
  padding: 0 0px;
  flex: none;
  //background: transparent;
  background-color: #f2f4f5;
  overflow: hidden;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体";
}
.index-box {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  .el-container{
    height: 100%;
    .el-main {
      height: 100%;
    }
  }
  .el-aside {
    background-color: #20222A;
    height: 100vh;
    min-height: 100%;
    .logo {
      background-color: #20222A;
      color: rgba(255,255,255,.8);
      text-align: center;
      height: 60px;
      padding-top: 16px;
      font-size: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid gray;
    }
  }
  .el-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    line-height: 60px;
  }
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
