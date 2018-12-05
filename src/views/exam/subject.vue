<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5">
        <el-card class="tree-box-card" style="margin-right: 5px;">
          <div slot="header">
            <span>题目分类</span>
          </div>
          <el-row>
            <el-button v-if="subject_category_btn_add" icon="el-icon-plus" size="mini" plain @click="handleAddSuperCategory">主分类</el-button>
            <el-button v-if="subject_category_btn_add" icon="el-icon-plus" size="mini" plain @click="handleAddCategory">子分类</el-button>
            <el-button v-if="subject_category_btn_edit" icon="el-icon-edit" size="mini" plain @click="handleUpdateCategory">{{ $t('table.edit') }}</el-button>
            <el-button v-if="subject_category_btn_del" icon="el-icon-delete" size="mini" plain @click="handleDeleteCategory">{{ $t('table.del') }}</el-button>
          </el-row>
          <el-row>
            <div class="tree-container">
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
            </div>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>题目管理</span>
          </div>
          <div class="filter-container">
            <el-input v-model="listQuery.sbujectName" placeholder="题目名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button v-if="subject_category_btn_add" class="filter-item" style="margin-left: 10px;" icon="el-icon-check" plain @click="handleCreateSubject">{{ $t('table.add') }}</el-button>
            <el-button v-if="subject_category_btn_del" class="filter-item" icon="el-icon-delete" plain @click="handleDeletesSubject">{{ $t('table.del') }}</el-button>
          </div>
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
        </el-card>
      </el-col>
    </el-row>

    <!--题目分类信息表单-->
    <el-dialog :title="textMap[categormFormStatus]" :visible.sync="dialogCategoryFormVisible" width="30%" top="20vh">
      <el-form ref="dataCategoryForm" :rules="categoryRules" :model="tempCategory" :label-position="labelPosition" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.categoryName')" prop="categoryName">
              <el-input :placeholder="$t('table.categoryName')" v-model="tempCategory.categoryName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.categoryDesc')" prop="categoryDesc">
              <el-input :placeholder="$t('table.categoryDesc')" :autosize="{ minRows: 4, maxRows: 6}" v-model="tempCategory.categoryDesc" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategoryFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="categormFormStatus === 'create'" type="primary" @click="createCategory">{{ $t('table.save') }}</el-button>
        <el-button v-else type="primary" @click="updateCategory">{{ $t('table.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/exam/subjectCategory'
import { fetchSubjectList, addSubject, putSubject, delSubject, delAllSubject } from '@/api/exam/subject'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { checkMultipleSelect } from '@/utils/util'

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
        sbujectName: undefined
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
      categoryFormStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      category: undefined,
      tempCategory: {
        categoryName: undefined,
        categoryDesc: undefined,
        id: undefined,
        parentId: -1,
        sort: 30
      },
      // 题目临时信息
      tempSubject: {
        id: '',
        examinationId: '',
        subjectName: '',
        type: 0,
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        optionE: '',
        optionF: '',
        answer: '',
        score: '',
        analysis: '',
        level: 2
      },
      currentCategoryId: '',
      // 表单校验规则
      categoryRules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'change' }]
      },
      // 表单校验规则
      rules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'change' }]
      },
      // 按钮权限
      subject_category_btn_add: false,
      subject_category_btn_edit: false,
      subject_category_btn_del: false,
      subject_category_btn_import: false,
      subject_category_btn_export: false,
      // 分类窗口状态
      dialogCategoryFormVisible: false,
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
    this.subject_category_btn_add = this.permissions['exam:subject:category:add']
    this.subject_category_btn_edit = this.permissions['exam:subject:category:edit']
    this.subject_category_btn_del = this.permissions['exam:subject:category:del']
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
    // 点击分类
    getNodeData(data) {
      getObj(data.id).then(response => {
        this.category = response.data.data
      })
      this.currentCategoryId = data.id
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
    // 修改分类
    handleUpdateCategory() {
      this.tempCategory = Object.assign({}, this.category) // copy obj
      this.categormFormStatus = 'update'
      this.dialogCategoryFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataCategoryForm'].clearValidate()
      })
    },
    // 点击主分类按钮
    handleAddSuperCategory() {
      this.resetCategoryForm()
      this.tempCategory.parentId = -1
      this.categormFormStatus = 'create'
      this.dialogCategoryFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataCategoryForm'].clearValidate()
      })
    },
    // 点击子分类按钮
    handleAddCategory() {
      if (this.currentCategoryId === '') {
        this.$message({
          message: '请选择分类',
          type: 'warning'
        })
        return
      }
      this.resetCategoryForm()
      this.categormFormStatus = 'create'
      this.dialogCategoryFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataCategoryForm'].clearValidate()
      })
    },
    handleDeleteCategory() {
      if (this.currentCategoryId === '') {
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
    createCategory() {
      this.$refs['dataCategoryForm'].validate((valid) => {
        if (valid) {
          addObj(this.tempCategory).then(() => {
            this.dialogCategoryFormVisible = false
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
    // 更新分类
    updateCategory() {
      this.$refs['dataCategoryForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempCategory)
          putObj(tempData).then(() => {
            this.dialogCategoryFormVisible = false
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
    onCancel() {
      this.formStatus = ''
    },
    resetCategoryForm() {
      this.tempCategory = {
        categoryName: undefined,
        categoryDesc: undefined,
        id: undefined,
        parentId: this.currentCategoryId,
        sort: 30
      }
    },
    resetTempSubject() {
      this.tempSubject = {
        id: '',
        examinationId: '',
        subjectName: '',
        type: 0,
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        optionE: '',
        optionF: '',
        answer: '',
        score: '',
        analysis: '',
        level: 2
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
    },
    // 新建题目
    handleCreateSubject() {
      this.resetTempSubject()
      this.dialogStatus = 'create'
      this.dialogCategoryFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubjectForm'].clearValidate()
      })
    },
    // 批量删除
    handleDeletesSubject() {
      if (checkMultipleSelect(this.multipleSubjectSelection, this)) {
        let ids = ''
        for (let i = 0; i < this.multipleSubjectSelection.length; i++) {
          ids += this.multipleSubjectSelection[i].id + ','
        }
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAllSubject({ ids: ids }).then(() => {
            this.handleSubjectManagement()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    },
    handleExport() {

    },
    handleImport() {

    }
  }
}
</script>

<style scoped>
  .tree-container{
    padding-top: 10px;
  }
</style>
