// 状态（发货状态）
export const statusDict = {
  1: { key: 1, value: '已打单', className: 'statusDict1' },
  2: { key: 2, value: '待发', className: 'statusDict2' },
  3: { key: 3, value: '缺货', className: 'statusDict3' },
  4: { key: 4, value: '已作退货', className: 'statusDict4' },
  5: { key: 5, value: '已调', className: 'statusDict5' },
  6: { key: 6, value: '重新打速递单', className: 'statusDict6' }
}
// 发票和资料状态
export const ticketStatusDict = {
  1: { key: 1, value: '欠款' },
  2: { key: 2, value: '欠票' },
  3: { key: 3, value: '只收了部分' },
  4: { key: 4, value: '只开了部分' }
}

export const orderSort = {
  'FH': {
    key: 'Fh',
    value: '发货组',
    editForm: {
      status: true,
      ticketStatus: true
    }
  },
  'KP': {
    key: 'KP',
    value: '开票和资料组',
    editForm: {
      status: true,
      ticketStatus: false
    }
  },
  'DH': {
    key: 'DH',
    value: '订货组',
    editForm: {
      status: true,
      ticketStatus: true
    }
  },
  'DK': {
    key: 'DK',
    value: '打款组',
    editForm: {
      status: true,
      ticketStatus: false
    }
  },
  'JH': {
    key: 'JH',
    value: '进货组',
    editForm: {
      status: true,
      ticketStatus: false
    }
  },
  'JG': {
    key: 'JG',
    value: '价格组',
    editForm: {
      status: true,
      ticketStatus: false
    }
  },
  'ZH': {
    key: 'ZH',
    value: '综合搜索组',
    editForm: {
      status: true,
      ticketStatus: false
    }
  }
}
