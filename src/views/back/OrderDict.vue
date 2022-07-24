<template>
  <el-container class="index-box">
    <el-aside width="asideWidth">
      <div class="logo">
        <img v-show="!isCollapse" src="./../../assets/logo.png" alt="ELementUI" width="122" height="122">
      </div>
      <menus :isCollapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header>
        <headers/>
      </el-header>
      <el-main>
  <div class="user-box commonBody mpm-container" style="position: relative; overflow:hidden; -webkit-overflow-scrolling:touch;">
      <el-form
        :inline="true"
        :model="dictForm"
        ref="staffForm"
        class="login-form"
      >
        <el-form-item label="工单组名" prop="sortName"> <el-input
          v-model="dictForm.sortName"
          clearable
          size="small"
          placeholder="输入工单组名"
          style="width: 200px;"
          class="filter-item"
        /></el-form-item>
        <el-form-item label="工单组代码" prop="sortTag"> <el-input
          v-model="dictForm.sortTag"
          clearable
          size="small"
          placeholder="输入工单组代码"
          style="width: 200px;"
          class="filter-item"
        /></el-form-item>
        <el-button
          type="primary"
          @click="handleSearch"
          class="login-btn"
          v-loading="loading"
        >搜索</el-button
        >
      </el-form>
<!--    <el-main>
        <router-view v-if="isRouterAlive"/>
      </el-main>-->
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="tableData.data"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="工单组ID"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sortName" label="工单组名" ><template slot-scope="scope">{{scope.row.sortName}}</template></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sortTag" label="工单组代码" ><template slot-scope="scope">{{scope.row.sortTag}}</template></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="status" label="状态字典" ><template slot-scope="scope">{{scope.row.status}}</template></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="ticketStatus" label="钱票状态字典" ><template slot-scope="scope">{{scope.row.ticketStatus}}</template></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" width="100" label="备注">    <template slot-scope="scope">{{scope.row.remark}}</template></el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.deleted ? '删除':'启用'}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="创建日期" >    <template slot-scope="scope">{{scope.row.createTime}}</template></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="margin:auto;padding-bottom:20px;"
      v-if='tableData.total'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableData.currentPage"
      :page-sizes="[5,10, 20, 30, 40,50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"></el-pagination>
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="dictFormVisible" @close="resetForm('dictEditForm')">
      <el-form :model="dict" :rules="rules" ref="dictEditForm">
        <el-form-item label="工单组名" prop="sortName" label-width="80px">
          <el-input v-model="dict.sortName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工单组代码" prop="sortTag" label-width="80px">
          <el-input v-model="dict.sortTag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态字典" prop="status" label-width="80px">
          <el-input v-model="dict.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="钱票状态字典" prop="tikcetStatus" label-width="80px">
          <el-input v-model="dict.tikcetStatus" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="80px">
          <el-input v-model="dict.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dictFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitdict('dictEditForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menus from '@/components/menus/back-menus.vue'
import Headers from '@/components/header/back-header.vue'
import { getDicts } from '@/api/back/dict.js'

export default {
  components: {
    Menus, Headers
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      dictForm: {
        sortName: '',
        sortTag: '',
        status: '',
        ticketStatus: '',
        remark: ''
      },
      pageNo: 0,
      pageSize: 10,
      tableData: {
        currentPage: 1,
        total: 0,
        data: []
      },
      isRouterAlive: true,
      dict: {
        sortName: '',
        sortTag: '',
        status: '',
        ticketStatus: '',
        remark: ''
      },
      dictBackup: Object.assign({}, this.dict),
      multipleSelection: [],
      dictFormVisible: false,
      dialogTitle: '',
      rules: {
        sortName: [
          { required: true, message: '请输入工单组名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        sortTag: [
          { required: true, message: '请输入工单组代码', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      loading: false,
      showMsg: false
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
  created () {
    this.handleSearch()
  },
  mounted () {
    this.handleSearch()
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    handleSearch () {
      const dictParams = { }
      Object.keys(this.dictForm).forEach(key => {
        if (Array.isArray(this.dictForm[key])) {
          dictParams[key] = this.dictForm[key].join(',')
        } else {
          dictParams[key] = this.dictForm[key]
        }
      })
      const params = {
        dictParams,
        'pageRequest': { 'page': this.pageNo, 'size': this.pageSize }
      }
      getDicts(params)
        .then((response) => {
          console.log(response, '====')
          if (response.code === 0) {
            this.tableData.data = response.data.content
            this.tableData.total = response.data.content && (response.data.totalElements || 0)
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
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageNo = val - 1
      // console.log(`当前页: ${val}`)
    },
    selectChange (val) {
      this.multipleSelection = val
    },
    handleNodeClick (data) {
      console.log(data)
    },
    checkboxT (row, rowIndex) {
      return row.id
    },
    handleOptions () {
      this.$emit('handleOptions', { multipleSelection: this.multipleSelection, callBack: this.handleSearch })
    },
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.dict = Object.assign({}, row)
      this.dictVisible = true
    },
    submitdict (formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.role.id
          if (id) {
            // id非空-修改
            // this.users.splice(this.rowIndex, 1, this.user)
          } else {
            // id为空-新增
            this.role.id = this.tableData.length + 1
            // this.users.unshift(this.user)
          }
          this.dictFormVisible = false
          this.$message({
            type: 'success',
            message: id ? '修改成功！' : '新增成功！'
          })
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm(`确定删除用户 【${row.name}】 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.users.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    resetForm (formName) {
      this.$refs[formName].clearValidate()
    },
    mulDelete () {
      let len = this.multipleSelection.length
      if (len === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一项！'
        })
      } else {
        this.$confirm(`确定删除选中的 ${len} 个用户吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `成功删除了${len}条数据！`
          })
        }).catch(() => {
          console.log('取消删除')
        })
      }
    },
    handleAdd () {
      this.dialogTitle = '新增'
      this.dict = Object.assign({}, this.dictBackup)
      this.dictFormVisible = true
      this.$emit('handleAdd', 'DK', this.handleSearch)
    },
    isCollapse () {
      return this.$store.state.isCollapse
    },
    asideWidth () {
      return this.$store.state.isCollapse ? 'auto' : '200px'
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-box {
    width: 100%;
    .tool-box {
      padding: 10px 10px;
      border-bottom: 1px solid #eee;
    }
    .el-pagination {
      margin-top: 20px;
    }
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
</style>
