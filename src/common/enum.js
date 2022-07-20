// 发货组状态
export const statusDict = {
  1: { key: 1, value: '已打单', className: 'statusDict1' },
  2: { key: 2, value: '待发', className: 'statusDict2' },
  3: { key: 3, value: '缺货', className: 'statusDict3' },
  4: { key: 4, value: '已作退货', className: 'statusDict4' },
  5: { key: 5, value: '已调', className: 'statusDict5' },
  6: { key: 6, value: '重新打速递单', className: 'statusDict6' }
}
// 发货组钱票状态
export const ticketStatusDict = {
  1: { key: 1, value: '欠款' },
  2: { key: 2, value: '欠票' },
  3: { key: 3, value: '只收了部分' },
  4: { key: 4, value: '只开了部分' }
}
export const sortList = [
  'FH',
  'KP',
  'DH',
  'DK',
  'JH',
  'JG'
]

export const orderSort = {
  'FH': {
    key: 'Fh',
    value: '发货组',
    editForm: {
      content: {
        isShow: true,
        label: '发货',
        key: 'sendContent',
        placeholder: '请输入发货文本',
        require: true
      },
      inAmount: {
        isShow: true,
        label: '输入金额',
        key: 'inAmount',
        require: true
      },
      remark: {
        isShow: true,
        label: '备注',
        key: 'remark',
        require: false
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      ticketStatus: {
        isShow: true,
        label: '发票和资料状态',
        key: 'ticketStatus',
        require: true
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'KP': {
    key: 'KP',
    value: '开票和资料组',
    editForm: {
      content: {
        isShow: true,
        label: '开票和资料',
        key: 'content',
        placeholder: '请输入开票和资料',
        require: true
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      ticketStatus: {
        isShow: false,
        label: '发票和资料状态',
        key: 'ticketStatus',
        require: true
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'DH': {
    key: 'DH',
    value: '订货组',
    editForm: {
      content: {
        isShow: true,
        label: '订货',
        key: 'content',
        placeholder: '请输入定货文本',
        require: true
      },
      inAmount: {
        isShow: true,
        label: '输入金额',
        key: 'inAmount',
        require: true
      },
      remark: {
        isShow: true,
        label: '备注',
        key: 'remark',
        require: false
      },
      arriveNotice: {
        isShow: true,
        label: '到货通知',
        key: 'arriveNotice',
        require: false
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      ticketStatus: {
        isShow: true,
        label: '发票和资料状态',
        key: 'ticketStatus',
        require: true
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'DK': {
    key: 'DK',
    value: '打款组',
    editForm: {
      content: {
        isShow: true,
        label: '打款',
        key: 'sendContent',
        placeholder: '请输入打款文本',
        require: true
      },
      inAmount: {
        isShow: true,
        label: '输入金额',
        key: 'inAmount',
        require: true
      },
      remark: {
        isShow: true,
        label: '备注',
        key: 'remark',
        require: false
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'JH': {
    key: 'JH',
    value: '进货组',
    editForm: {
      content: {
        isShow: true,
        label: '进货',
        key: 'content',
        placeholder: '请输入进货文本',
        require: true
      },
      remark: {
        isShow: true,
        label: '备注',
        key: 'remark',
        require: false
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'JG': {
    key: 'JG',
    value: '价格组',
    editForm: {
      content: {
        isShow: true,
        label: '价格',
        key: 'content',
        placeholder: '请输入价格文本',
        require: true
      },
      remark: {
        isShow: true,
        label: '备注',
        key: 'remark',
        require: false
      },
      status: {
        isShow: true,
        label: '状态',
        key: 'status'
      },
      pics: {
        isShow: true,
        label: '图片',
        key: 'pics',
        require: false,
        placeholder: '请输入图片'
      }
    }
  },
  'ZH': {
    key: 'ZH',
    value: '综合搜索组',
    editForm: {
      status: true,
      ticketStatus: false,
      sendContent: true,
      inAmount: true
    }
  }
}
