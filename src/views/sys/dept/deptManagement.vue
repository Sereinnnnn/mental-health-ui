<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" icon="delete" @click="handleDelete">删除</el-button>
      </el-button-group>

      <el-row>
        <el-col :span="5" style ="margin-top:10px;">
          <el-tree
            :data="treeData"
            :default-expanded-keys="aExpandedKeys"
            :filter-node-method="filterNode"
            :props="defaultProps"
            class="filter-tree"
            node-key="id"
            default-expand-all="true"
            highlight-current
            @node-click="getNodeData"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          />
        </el-col>
        <el-col :span="19" style="margin-top:10px;">
          <el-card class="box-card">
            <el-form ref="form" :label-position="labelPosition" :model="form" label-width="80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="部门描述" prop="deptDesc">
                    <el-input v-model="form.deptDesc" placeholder="请输入部门描述"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="负责人" prop="deptLeader">
                    <el-input v-model="form.deptLeader" placeholder="请输入部门负责人"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序号" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入排序号"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('table.status')">
                    <el-radio-group v-model="form.status">
                      <el-radio :label="0">启用</el-radio>
                      <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="create">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/dept'
import { mapGetters } from 'vuex'
export default {
  name: 'DeptManagement',
  components: {},
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: '菜单',
        1: '按钮'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['0', '1'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      labelPosition: 'right',
      form: {
        id: undefined,
        parentId: -1,
        deptName: undefined,
        deptDesc: undefined,
        deptLeader: undefined,
        sort: 30,
        status: 0
      },
      currentId: -1,
      rules: {
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'change' }]
      }
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
        this.form.status = parseInt(this.form.status)
      })
      this.currentId = data.id
      this.showElement = true
    },
    handlerEdit() {
      if (this.form.id) {
        this.formStatus = 'update'
      }
    },
    handlerAdd() {
      this.resetForm()
      this.formStatus = 'create'
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
    },
    onCancel() {
      this.formStatus = ''
    },
    resetForm() {
      debugger
      let parentId
      if (this.form.id === undefined) {
        parentId = -1
      } else {
        parentId = this.form.id
      }
      this.form = {
        id: undefined,
        parentId: parentId,
        deptName: undefined,
        deptDesc: undefined,
        deptLeader: undefined,
        sort: 30,
        status: 0
      }
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
