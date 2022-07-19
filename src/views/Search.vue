<template>
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
        <el-col :span=21>
          <el-input ref="addInput" type="textarea" :rows="4"  v-focus autofocus v-if="addInput" v-model="addForm.content" placeholder="请输入工单文本" />
        </el-col>
        <el-col :span=2>
          <el-button type="primary" style="margin-left: 15px;margin-bottom: 15px" @click="handleAddSure">保存</el-button><br/>
          <el-button type="primary"  style="margin-left: 15px;" @click="cancleAdd">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <EditDialog :showTypeObj="showTypeObj" :tabType="currentType" @handleClose="handleClose"  />
    <EditInfosDialog :showEditInfo="showEditInfo" :tabType="currentType" @handleEdit="handleEdit"  />
    <PreviewImage :imgViewerVisible="imgViewerVisible" :imgList="imgList"/>
  </div>
</template>

<script>
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
import { editListOrder, editOrder, delOrder, createOrder } from '@/api/index.js'
import { orderSort, sortList } from '@/common/enum'
import PreviewImage from '@/components/previewImage'

export default {
  data () {
    return {
      imgViewerVisible: false,
      imgList: [],
      addInput: true,
      addForm: {
        isShow: false,
        addType: 'SendTab',
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
        type: 'ZH' // ??
      }]
    }
  },
  components: {
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
    this.handleQueryAllStaf()
    this.handleLoadBySort(this.currentType)
  },
  methods: {
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
</style>
