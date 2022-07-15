<template>
  <div  class="mpm-container" style="width: 100%;height: 100%;overflow:hidden; -webkit-overflow-scrolling:touch;">
    <el-tabs v-model="currentView" @tab-click="handleClick">
      <el-tab-pane v-for="item in views" :label="item.label" :name="item.name" :key="item.name">
        <!-- {{ item.component }} -->
        <component :is="currentView" allStaf="allStaf"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import {
//   Tab, TabItem
// } from 'vux'
import KpzlTab from '@/views/KpzlTab.vue'
import DHTab from '@/views/DHTab.vue'
import SendTab from '@/views/SendTab.vue'
import DkTab from '@/views/DkTab.vue'
import JHTab from '@/views/JHTab.vue'
import JGTab from '@/views/JGTab.vue'
import ZHSSTab from '@/views/ZHSSTab.vue'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      currentView: 'ZHSSTab',
      views: [{
        label: '发货组',
        name: 'SendTab'

      }, {
        label: '开票与资料组',
        name: 'KpzlTab'
      }, {
        label: '订货组',
        name: 'DHTab'

      }, {
        label: '打款组',
        name: 'DkTab'

      }, {
        label: '进货组',
        name: 'JHTab'

      }, {
        label: '价格组',
        name: 'JGTab'

      }, {
        label: '综合搜索',
        name: 'ZHSSTab'
      }]
    }
  },
  components: {
    // Tab,
    // TabItem,
    KpzlTab,
    DHTab,
    SendTab,
    DkTab,
    JHTab,
    JGTab,
    ZHSSTab
  },
  created () {
    this.handleQueryAllStaf()
  },
  methods: {
    ...mapActions({
      handleQueryAllStaf: 'handleQueryAllStaf'
    }),
    handleClick (event) {
      console.log(event.index, 'index')
      this.currentView = this.views[event.index].name
    }
  }
}

/* export default {
  data () {
    return {
      list: ['发货组', '开票和资料组', '订货组', '打款组', '进货组', '价格组', '综合搜索'],
      tabD: 0,
      // tab标签div长度
      tabWidth: document.body.clientWidth
    }
  }, */

//   mounted () {
//     setTimeout(() => {
//       this.$refs.tabBox.$children[0].onItemClick()
//     }, 200)
//     this.setTabWidth()
//   },
//   methods: {
//     setTabWidth () {
//       // 页面完成刷新之后
//       this.$nextTick(() => {
//         var realW = 0; var offW = 0
//         // realW为每一个tab-item的长度总和,因为tab-item的父级为flex布局,而tab-item的flex: none，所以初始化的时候，tab-item会根据自己的字体长度，自动扩张宽度。
//         for (let i = 0; i < this.$refs.tabBox.$children.length; i++) {
//           realW += this.$refs.tabBox.$children[i].$el.offsetWidth
//         }
//         // 同样是计算初始化的时候，每一个tab-item的总宽度，但当tab-item总长度大于tab的总长度时，立马退出程序
//         for (let i = 0; i < this.$refs.tabBox.$children.length; i++) {
//           offW += this.$refs.tabBox.$children[i].$el.offsetWidth
//           if (offW > (document.body.clientWidth)) break
//         }
//         // 假如tab-item的总宽度小于显示tabwidth，则评分tab的剩余空间，加到每一个tab-item中
//         if (offW < (document.body.clientWidth)) {
//           var offD = (document.body.clientWidth) - offW
//           for (let i = 0; i < this.$refs.tabBox.$children.length; i++) {
//             this.$refs.tabBox.$children[i].$el.style.width = (this.$refs.tabBox.$children[i].$el.clientWidth + offD) / this.$refs.tabBox.$children.length + 'px'
//           }
//         } else {
//           this.tabWidth = realW
//         }
//       })
//     },
//     getBarWidth () {
//       // 函数控制tab-bar的宽度,如果tab标签页数量为1，则隐藏tab-bar
//       if (this.list && this.list.length === 1) {
//         return '0px'
//       }
//       return '30px'
//     },
//     onItemClick (keyword, index) {
//       let barLeft = 0
//       document.getElementsByClassName('vux-tab-ink-bar')[0].style.right = '100%'
//       for (let i = 0; i < this.list.length; i++) {
//         if (document.getElementsByClassName('vux-tab-item')[i].innerText === keyword) {
//           barLeft += document.getElementsByClassName('vux-tab-item')[i].offsetWidth / 2
//           // 为什么是15？因为底部bar长度为30px，这样做可以让bar的中心对齐tab-item的中心
//           barLeft -= 15
//           break
//         }
//         barLeft += document.getElementsByClassName('vux-tab-item')[i].offsetWidth
//       }
//       document.getElementsByClassName('vux-tab-ink-bar')[0].style.left = (barLeft + 'px')
//       // $('#sendTab').css('display: block')
//     }
//
//   }
// }

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
