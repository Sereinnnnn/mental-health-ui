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
            default-expand-all
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
                  <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入菜单名称"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="菜单标识" prop="permission">
                    <el-input v-model="form.permission" placeholder="请输入菜单标识"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="菜单URL" prop="url">
                    <el-input v-model="form.url" placeholder="请输入菜单URL"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="排序号" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入排序号"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图标" prop="icon">
                    <el-input v-model="form.icon" placeholder="请选择"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" class="filter-item" placeholder="请输入资源请求类型">
                      <el-option v-for="item in typeOptions" :key="item" :label="item | typeFilter" :value="item"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="组件名称" prop="component">
                    <el-input v-model="form.component" placeholder="请输入组件名称"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="组件地址" prop="component">
                    <el-input v-model="form.path" placeholder="组件地址"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('table.remark')">
                    <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark" type="textarea" placeholder="备注"/>
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
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/menu'
import { mapGetters } from 'vuex'
export default {
  name: 'MenuManagement',
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
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        permission: undefined,
        name: undefined,
        id: undefined,
        parentId: -1,
        url: undefined,
        icon: 'example',
        sort: 30,
        component: undefined,
        type: '0',
        path: undefined,
        remark: undefined
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        permission: [{ required: true, message: 'permission is required', trigger: 'change' }],
        url: [{ required: true, message: 'url is required', trigger: 'blur' }],
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
      // console.log(value);
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
      this.form = {
        permission: undefined,
        name: undefined,
        id: undefined,
        parentId: -1,
        url: undefined,
        icon: 'example',
        sort: 30,
        component: undefined,
        type: '0',
        path: undefined,
        remark: undefined
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
