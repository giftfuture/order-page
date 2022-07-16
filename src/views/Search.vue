<template>
  <div  class="mpm-container" style="width: 100%;height: 100%;overflow:hidden; -webkit-overflow-scrolling:touch;">
    <el-tabs v-model="currentView" @tab-click="handleClick">
      <el-tab-pane v-for="item in views" :label="item.label" :name="item.name" :key="item.name">
        <KpzlTab v-if="item.type==='KP'" @handleOptions="handleOptions" />
        <DHTab v-if="item.type==='DH'" @handleOptions="handleOptions" />
        <ZHSSTab v-if="item.type==='ZH'" @handleOptions="handleOptions" />
        <SendTab v-if="item.type==='FH'" @handleOptions="handleOptions" />
        <DkTab v-if="item.type==='DK'" @handleOptions="handleOptions" />
        <JHTab v-if="item.type==='JH'" @handleOptions="handleOptions" />
        <JGTab v-if="item.type==='JG'" @handleOptions="handleOptions" />
      </el-tab-pane>
    </el-tabs>
    <EditDialog :showTypeObj="showTypeObj" :tabType="currentType" @handleClose="handleClose"  />
  </div>
</template>

<script>
import KpzlTab from '@/views/KpzlTab.vue'
import DHTab from '@/views/DHTab.vue'
import SendTab from '@/views/SendTab.vue'
import DkTab from '@/views/DkTab.vue'
import JHTab from '@/views/JHTab.vue'
import JGTab from '@/views/JGTab.vue'
import ZHSSTab from '@/views/ZHSSTab.vue'
import { mapActions } from 'vuex'
import EditDialog from '@/components/EditDialog'
import { editOrder } from '@/api/send'
export default {
  data () {
    return {
      options: [],
      callBack: null,
      showTypeObj: {
        title: '',
        isShow: false,
        status: true,
        ticketStatus: true
      },
      currentView: 'SendTab',
      currentType: 'FH',
      views: [{
        label: '发货组',
        name: 'SendTab',
        type: 'FH'
      }, {
        label: '开票与资料组',
        name: 'KpzlTab',
        type: 'KP'
      }, {
        label: '订货组',
        name: 'DHTab',
        type: 'DH'
      }, {
        label: '打款组',
        name: 'DkTab',
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
    EditDialog,
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
          message: '请先选择',
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
        editOrder(params).then(res => {
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
    }
  }
}

</script>

<style scoped lang="less">
/*改变原来tabBox的flex布局*/
.mpm-container .vux-tab .vux-tab-item {
  display: inline-block;
  width: auto;
  height: 100%;
  padding: 0 10px;
  flex: none;
  //background: transparent;
  background-color: #f2f4f5;
  overflow: hidden;
}
</style>
