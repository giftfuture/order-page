<template>
  <div>
    <el-table border :data="transData">

      <el-table-column>
        <template slot-scope="scope">
          <el-form>
            <el-row><el-col :span="colSpan5">{{scope.row[0]}}</el-col><el-col :span="colSpan5">{{scope.row[1]}}</el-col><el-col :span="colSpan5">{{scope.row[2]}}</el-col></el-row>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { operLog } from '@/api/index'

export default {
  name: 'TransverseTable',
  data () {
    return {
      colSpan15: 15,
      colSpan5: 5,
      colSpan4: 4,
      colSpan6: 6,
      orderNo: '',
      tableData: [],
      originTitle: [], // '工单号', '状态', '文本', '钱票状态', '输入金额', '到货通知', '备注', '对账备注', '图片'
      transTitle: ['', '更新前', '更新后'],
      transData: []
    }
  },
  methods: {
    loadLogs () {
      const params = 1
      operLog(params)
        .then((response) => {
          if (response.code === 0) {
            this.orderNo = response.data[0].orderNo
            this.tableData = response.data ? response.data : []
            // 数组按矩阵思路, 变成转置矩阵
            this.tableData.map((row, index) => {
              if (index === 0) {
                this.originTitle.push('工单编号:' + row.orderNo)
                this.transData.push(['工单编号:' + row.orderNo, '更新前', '更新后'])
              }
              if (row.preStatus || row.status) {
                this.originTitle.push('状态')
                this.transData.push(['状态', row.preStatus, row.status])
              }
              if (row.preContent || row.content) {
                this.originTitle.push('文本')
                this.transData.push(['文本', row.preContent, row.content])
              }
              if (row.preTicketStatus || row.ticketStatus) {
                this.originTitle.push('钱票状态')
                this.transData.push(['钱票状态', row.preTicketStatus, row.ticketStatus])
              }
              if (row.preInAmount || row.inAmount) {
                this.originTitle.push('输入金额')
                this.transData.push(['输入金额', row.preInAmount, row.inAmount])
              }
              if (row.preArriveNotice || row.arriveNotice) {
                this.originTitle.push('到货通知')
                this.transData.push(['到货通知', row.preArriveNotice, row.arriveNotice])
              }
              if (row.preRemark || row.remark) {
                this.originTitle.push('备注')
                this.transData.push(['备注', row.preRemark, row.remark])
              }
              if (row.preAccountRemark || row.accountRemark) {
                this.originTitle.push('对账备注')
                this.transData.push(['对账备注', row.preAccountRemark, row.accountRemark])
              }
              if (row.preAttach || row.attach) {
                this.originTitle.push('图片')
                this.transData.push(['图片', row.preAttach, row.attach])
              }
              this.originTitle.push('')
              this.transData.push([' ', '', ''])
            })
            console.log(this.transData)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 自定义列背景色
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 修改每行第一个单元格的背景色
        return 'background:#f3f6fc;'
      } else {
        return 'background:#ffffff;'
      }
    }
  },
  created () {
    this.loadLogs()
  }
}
</script>
<style scoped>

</style>
