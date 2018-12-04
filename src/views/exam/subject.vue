<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-button v-if="category_btn_add" icon="el-icon-check" plain @click="handlerAddSuper">添加顶级分类</el-button>
      <el-button v-if="category_btn_add" icon="el-icon-check" plain @click="handlerAdd">添加子分类</el-button>
      <el-button v-if="category_btn_del" icon="el-icon-delete" plain @click="handleDelete">{{ $t('table.del') }}</el-button>
      <el-button v-if="category_btn_import" icon="el-icon-upload2" plain @click="handleImport">{{ $t('table.import') }}</el-button>
      <el-button v-if="category_btn_export" icon="el-icon-download" plain @click="handleExport">{{ $t('table.export') }}</el-button>

      <el-row>
        <el-col :span="3" style ="margin-top:10px;">
          <el-tree
            :data="treeData"
            :filter-node-method="filterNode"
            :props="defaultProps"
            class="filter-tree"
            node-key="id"
            highlight-current
            accordion
            default-expand-all
            @node-click="getNodeData"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          />
        </el-col>
        <el-col :span="21" style="margin-top:10px;">
          <el-table
            v-loading="listLoading"
            :data="list"
            :default-sort="{ prop: 'id', order: 'descending' }"
            border
            highlight-current-row
            style="width: 100%;">
            <el-table-column type="selection" width="55"/>
            <el-table-column :label="$t('table.subjectName')" sortable prop="subject_name" property="subjectName" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.subjectName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.subject.type')" sortable prop="type" property="type" width="200">
              <template slot-scope="scope">
                <el-tag type="success">{{ scope.row.type | subjectTypeFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.subject.score')" sortable prop="score" property="score">
              <template slot-scope="scope">
                <span>{{ scope.row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.subject.level')" sortable prop="level" property="level">'
              <template slot-scope="scope">
                <el-rate v-model="scope.row.level" :max="4"/>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.actions')" class-name="status-col" width="300px">
              <template slot-scope="scope">
                <el-button v-if="exam_btn_subject" type="primary" size="mini" @click="handleUpdateSubject(scope.row)">{{ $t('table.edit') }}</el-button>
                <el-button v-if="exam_btn_subject" size="mini" type="danger" @click="handleDeleteSubject(scope.row)">{{ $t('table.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/exam/subjectCategory'
import { fetchSubjectList, addSubject, putSubject, delSubject, delAllSubject } from '@/api/exam/subject'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'SubjectManagement',
  components: {},
  data() {
    return {
      list: null,
      total: null,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['0', '1'],
      listLoading: true,
      listQuery: {
        name: undefined
      },
      treeData: [],
      oExpandedKey: {
      },
      oTreeNodeChildren: {
      },
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      labelPosition: 'right',
      form: {
        categoryName: undefined,
        categoryDesc: undefined,
        id: undefined,
        parentId: -1,
        sort: 30
      },
      currentId: '',
      // 表单校验规则
      rules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'change' }]
      },
      // 按钮权限
      category_btn_add: false,
      category_btn_edit: false,
      category_btn_del: false,
      category_btn_import: false,
      category_btn_export: false,
      // 导入窗口状态
      dialogImportVisible: false,
      // 导出窗口状态
      dialogExportVisible: false,
      // 选择的菜单
      multipleSelection: [],
      importUrl: '/exam/subjectCategory/import',
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  created() {
    this.getList()
    this.handleSubjectManagement()
    this.category_btn_add = this.permissions['exam:subject:category:add']
    this.category_btn_edit = this.permissions['exam:subject:category:edit']
    this.category_btn_del = this.permissions['exam:subject:category:del']
    this.category_btn_import = this.permissions['exam:exam:subject:import']
    this.category_btn_export = this.permissions['exam:exam:subject:export']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand(data) {
      const aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys() {
      const oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          const oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },
    getNodeData(data) {
      this.formStatus = 'update'
      getObj(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
      this.showElement = true
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
    handlerEdit() {
      if (this.form.id) {
        this.formStatus = 'update'
      }
    },
    handlerAddSuper() {
      this.resetForm()
      this.form.parentId = -1
      this.form.component = 'Layout'
      this.formStatus = 'create'
    },
    handlerAdd() {
      this.resetForm()
      this.formStatus = 'create'
    },
    handleDelete() {
      if (this.currentId === '') {
        this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    create() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            putObj(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addObj(this.form).then(() => {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
          this.getList()
        }
      })
    },
    onCancel() {
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        categoryName: undefined,
        categoryDesc: undefined,
        id: undefined,
        parentId: this.currentId,
        sort: 30
      }
    },
    // 加载题目
    handleSubjectManagement(row) {
      this.listLoading = true
      // 保存当前题目列表的考试ID
      if (row !== undefined) {
        this.listQuery.examinationId = row.id
      }
      fetchSubjectList(this.listQuery).then(response => {
        if (response.data.list.length > 0) {
          for (let i = 0; i < response.data.list.length; i++) {
            const subject = response.data.list[i]
            subject.type = parseInt(subject.type)
            subject.level = parseInt(subject.level)
            if (subject.type === 0) {
              subject.answer = parseInt(subject.answer)
            }
          }
        }
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
      this.dialogSubjectVisible = true
    },
    handleExport() {

    },
    handleImport() {

    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
