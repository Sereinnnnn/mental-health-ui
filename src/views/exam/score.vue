<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.examinationName" placeholder="考试名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-if="score_btn_export" class="filter-item" icon="el-icon-download" plain @click="handleExport">{{ $t('table.export') }}</el-button>
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
      <el-table-column :label="$t('table.examinationName')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examinationName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.score.userName')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.score.score')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.score.examTime')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total > 0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { fetchScoreList } from '@/api/exam/score'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  name: 'ScoreManagement',
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
        examinationName: undefined,
        sort: 'id',
        order: 'descending'
      },
      temp: {
        id: '',
        examinationName: ''
      },
      checkedKeys: [],
      score_btn_export: false,
      // 多选
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.score_btn_export = this.permissions['exam:score:export']
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
      fetchScoreList(this.listQuery).then(response => {
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
        examinationName: ''
      }
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
    }
  }
}
</script>
