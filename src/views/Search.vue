<template>
<!--  <div class="mpm-container">
    <div style="width: 100%;overflow:inherit; -webkit-overflow-scrolling:touch;">
      <tab ref="tabBox" bar-active-color="#149c81" active-color="#149c81" :line-width="4" :custom-bar-width="getBarWidth" v-model="tabD" :style="{width: tabWidth + 'px'}">
        <tab-item v-for="(item,index) in list" :key="index" @on-item-click="onItemClick(item, index)">{{item}}
        </tab-item>
      </tab>
    </div>
  </div>-->
  <div  class="mpm-container" style="width: 100%;overflow:inherit; -webkit-overflow-scrolling:touch;">
    <tab class ="vux-tab">
      <tab-item selected @on-item-click="onItemClick">发货组</tab-item>
      <tab-item @on-item-click="onItemClick">开票与资料组</tab-item>
      <tab-item @on-item-click="onItemClick">订货组</tab-item>
      <tab-item @on-item-click="onItemClick">打款组</tab-item>
      <tab-item @on-item-click="onItemClick">进货组</tab-item>
      <tab-item @on-item-click="onItemClick">价格组</tab-item>
      <tab-item @on-item-click="onItemClick">综合搜索</tab-item>
    </tab>
    <component :is="currentView"></component>
  </div>
</template>

<script>
import {
  Tab, TabItem
} from 'vux'
import SendTab from '@/views/SendTab.vue'
import KpzlTab from '@/views/KpzlTab.vue'
import DlTab from '@/views/DlTab.vue'
export default {
  data () {
    return {
      currentView: ''
    }
  },
  components: {
    Tab,
    TabItem,
    SendTab,
    KpzlTab,
    DlTab
  },
  mounted () {
    this.currentView = 'SendTab'
  },
  methods: {
    onItemClick (index) {
      if (index === 0) {
        // 发货Tab
        this.currentView = 'SendTab'
      }
      if (index === 1) {
        // 开票与资料Tab
        this.currentView = 'KpzlTab'
      }
      if (index === 2) {
        // 打款 Tab
        this.currentView = 'DlTab'
      }
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
