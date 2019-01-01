<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.knowledgeName" placeholder="知识名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-check" plain @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" icon="el-icon-delete" plain @click="handleDeletes">{{ $t('table.del') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      :default-sort="{ prop: 'id', order: 'descending' }"
      border
      highlight-current-row
      style="width: 100%;"
      @row-dblclick="handleUpdate"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column :label="$t('table.knowledge.knowledgeName')" sortable prop="knowledge_name" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.knowledgeName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.knowledge.knowledgeDesc')" sortable prop="knowledge_desc" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.knowledgeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.knowledge.status')" sortable prop="status" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="status-col" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="10vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" :label-position="labelPosition" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.knowledge.knowledgeName')" prop="knowledgeName">
              <el-input v-model="temp.knowledgeName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.knowledge.status')" prop="status">
              <el-input v-model="temp.status"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.knowledge.knowledgeDesc')">
              <el-input :autosize="{ minRows: 3, maxRows: 5}" :placeholder="$t('table.knowledge.knowledgeDesc')" v-model="temp.knowledgeDesc" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchKnowledgeList, addObj, putObj, delObj, delAllObj } from '@/api/exam/knowledge'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { checkMultipleSelect } from '@/utils/util'

export default {
  name: 'KnowledgeManagement',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        sort: 'id',
        order: 'descending'
      },
      temp: {
        id: '',
        knowledgeName: '',
        knowledgeDesc: '',
        attachmentId: '',
        status: ''
      },
      checkedKeys: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        knowledgeName: [{ required: true, message: '请输入知识名称', trigger: 'change' }]
      },
      downloadLoading: false,
      labelPosition: 'right',
      // 多选
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchKnowledgeList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      putObj(row).then(() => {
        this.dialogFormVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sortChange(column, prop, order) {
      this.listQuery.sort = column.prop
      this.listQuery.order = column.order
      this.getList()
    },
    // 点击选中
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row, true)
    },
    resetTemp() {
      this.temp = {
        id: '',
        knowledgeName: '',
        knowledgeDesc: '',
        attachmentId: '',
        status: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addObj(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.status = parseInt(this.temp.status)
      this.temp.readonly = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          putObj(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    // 批量删除
    handleDeletes() {
      if (checkMultipleSelect(this.multipleSelection, this)) {
        let ids = ''
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids += this.multipleSelection[i].id + ','
        }
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAllObj({ ids: ids }).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    }
  }
}
</script>
