<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.examinationName')" v-model="listQuery.examinationName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-if="exam_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <!--考试列表-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column type="selection" width="55"/>
      <el-table-column :label="$t('table.examinationName')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examinationName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.type')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.course')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.course.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.startTime')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.endTime')" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.totalScore')" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.totalScore }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="status-col" width="300px">
        <template slot-scope="scope">
          <el-button v-if="exam_btn_edit" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="exam_btn_del" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <el-button v-if="exam_btn_subject" size="mini" @click="handleSubjectManagement(scope.row)">{{ $t('table.subjectManagement') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!--考试信息表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="10vh">
      <el-form ref="dataForm" :rules="rules" :model="temp" :label-position="labelPosition" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.examinationName')" prop="examinationName">
              <el-input v-model="temp.examinationName" :readonly="temp.readonly"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.totalScore')" prop="totalScore">
              <el-input v-model="temp.totalScore"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.college')" prop="collegeId">
              <el-input v-model="temp.collegeId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.major')" prop="majorId">
              <el-input v-model="temp.majorId"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.course')" prop="course.id">
              <el-input v-model="temp.course.courseName" @focus="selectCourse"/>
              <input v-model="temp.course.id" type="hidden">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.startTime')" prop="startTime">
              <el-date-picker v-model="temp.startTime" :placeholder="$t('table.startTime')" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.endTime')" prop="endTime">
              <el-date-picker v-model="temp.endTime" :placeholder="$t('table.endTime')" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.type')" prop="type">
              <el-radio-group v-model="temp.type">
                <el-radio :label="0">正式考试</el-radio>
                <el-radio :label="1">模拟考试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.status')">
              <el-radio-group v-model="temp.status">
                <el-radio :label="0">已发布</el-radio>
                <el-radio :label="1">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.attention')">
              <el-input :autosize="{ minRows: 3, maxRows: 5}" :placeholder="$t('table.attention')" v-model="temp.attention" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.remark')">
              <el-input :autosize="{ minRows: 3, maxRows: 5}" v-model="temp.remark" type="textarea" placeholder="备注"/>
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

    <!--课程选择弹窗-->
    <el-dialog :visible.sync="dialogCourseVisible" :title="$t('table.course')">
      <el-table v-loading="course.listLoading" :data="course.list" @row-dblclick="selectedCourse">
        <el-table-column :label="$t('table.courseName')" property="courseName" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.college')" property="college" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.college }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.major')" property="major">
          <template slot-scope="scope">
            <span>{{ scope.row.major }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.teacher')" property="teacher">'
          <template slot-scope="scope">
            <span>{{ scope.row.teacher }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--题目管理列表-->
    <el-dialog :visible.sync="dialogSubjectVisible" :title="$t('table.subjectManagement')" width="70%" top="10vh">
      <div class="filter-container">
        <el-input :placeholder="$t('table.subjectName')" v-model="subject.listQuery.subjectName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilterSubject"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterSubject">{{ $t('table.search') }}</el-button>
        <el-button v-if="exam_btn_subject" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateSubject">{{ $t('table.add') }}</el-button>
      </div>
      <el-table v-loading="subject.listLoading" :data="subject.list">
        <el-table-column :label="$t('table.subjectName')" property="subjectName" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.subjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.subject.type')" property="type" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.type | subjectTypeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.subject.score')" property="score">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.subject.level')" property="level">'
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
    </el-dialog>

    <!--题目信息表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogSubjectFormVisible" width="60%" top="10vh">
      <el-form ref="dataSubjectForm" :rules="subjectRules" :model="tempSubject" :label-position="labelPosition" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.subjectName')" prop="subjectName">
              <el-input v-model="tempSubject.subjectName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.subject.type')" prop="type">
              <el-select v-model="tempSubject.type" class="filter-item" placeholder="请选择题目类型" width="100%">
                <el-option v-for="item in subjectTypeData" :key="item.id" :label="item.subjectTypeName" :value="item.id">
                  <span style="float: left">{{ item.subjectTypeName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.subject.score')" prop="score">
              <el-input v-model="tempSubject.score"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.subject.level')" prop="level">
              <el-rate v-model="tempSubject.level" :max="4" :texts="['简单', '一般', '略难', '非常难']" show-text/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.subject.content')" prop="content">
              <el-input v-model="tempSubject.content"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.subject.answer')" prop="answer">
              <el-input v-model="tempSubject.answer"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.subject.analysis')" prop="analysis">
              <el-input v-model="tempSubject.analysis"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSubjectFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createSubjectData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateSubjectData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from '@/api/exam/exam'
import { fetchCourseList } from '@/api/exam/course'
import { fetchSubjectList, addSubject, putSubject, delSubject } from '@/api/exam/subject'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  name: 'ExamManagement',
  directives: {
    waves
  },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'warning'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      return status === '0' ? '已发布' : '未发布'
    },
    typeFilter(type) {
      return type === '0' ? '正式考试' : '模拟考试'
    },
    subjectTypeFilter(type) {
      const typeMap = {
        0: '选择题',
        1: '填空题',
        2: '判断题',
        3: '简答题'
      }
      return typeMap[type]
    }
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
        sort: '+id'
      },
      course: {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: '+id'
        },
        list: null,
        total: null,
        listLoading: true
      },
      subject: {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: '+id',
          examinationId: ''
        },
        list: null,
        total: null,
        listLoading: true,
        examinationId: ''
      },
      temp: {
        id: '',
        examinationName: '',
        type: 0,
        attention: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalScore: '',
        status: 0,
        avatar: '',
        collegeId: '',
        majorId: '',
        course: {
          id: '',
          courseName: ''
        },
        remark: ''
      },
      tempSubject: {
        id: '',
        examinationId: '',
        subjectName: '',
        type: 0,
        content: '',
        answer: '',
        score: '',
        analysis: '',
        level: 2
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        examinationName: [{ required: true, message: '请输入考试名称', trigger: 'change' }],
        collegeId: [{ required: true, message: '请输入考试所属学院', trigger: 'change' }],
        majorId: [{ required: true, message: '请输入考试所属专业', trigger: 'change' }],
        courseId: [{ required: true, message: '请输入考试所属课程', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        totalScore: [{ required: true, message: '请输入总分', trigger: 'change' }]
      },
      subjectRules: {},
      downloadLoading: false,
      labelPosition: 'right',
      exam_btn_add: false,
      exam_btn_edit: false,
      exam_btn_del: false,
      exam_btn_subject: false,
      dialogCourseVisible: false,
      courseData: [],
      dialogSubjectVisible: false,
      subjectData: [],
      dialogSubjectFormVisible: false,
      subjectTypeData: [
        { id: 0, subjectTypeName: '选择题' },
        { id: 1, subjectTypeName: '填空题' },
        { id: 2, subjectTypeName: '判断题' },
        { id: 3, subjectTypeName: '简答题' }
      ]
    }
  },
  created() {
    this.getList()
    this.exam_btn_add = this.permissions['exam:exam:add']
    this.exam_btn_edit = this.permissions['exam:exam:edit']
    this.exam_btn_del = this.permissions['exam:exam:del']
    this.exam_btn_subject = this.permissions['exam:exam:subject']
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
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
    resetTemp() {
      this.temp = {
        id: '',
        examinationName: '',
        type: 0,
        attention: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalScore: '',
        status: 0,
        avatar: '',
        collegeId: '',
        majorId: '',
        course: {
          id: '',
          courseName: ''
        },
        remark: ''
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
      this.temp.type = parseInt(this.temp.type)
      if (this.temp.course === null) {
        this.temp.course = {
          id: '',
          courseName: ''
        }
      }
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
    },
    // 选择课程
    selectCourse() {
      this.course.listLoading = true
      fetchCourseList(this.course.listQuery).then(response => {
        this.course.list = response.data.list
        this.course.total = response.data.total
        this.course.listLoading = false
      })
      this.dialogCourseVisible = true
    },
    // 双击选择课程
    selectedCourse(row) {
      this.temp.course.id = row.id
      this.temp.course.courseName = row.courseName
      this.dialogCourseVisible = false
    },
    // 加载题目
    handleSubjectManagement(row) {
      this.subject.listLoading = true
      // 保存当前题目列表的考试ID
      if (row !== undefined) {
        this.subject.examinationId = row.id
        this.subject.listQuery.examinationId = row.id
      }
      fetchSubjectList(this.subject.listQuery).then(response => {
        if (response.data.list.length > 0) {
          for (var i = 0; i < response.data.list.length; i++) {
            var subject = response.data.list[i]
            subject.type = parseInt(subject.type)
            subject.level = parseInt(subject.level)
          }
        }
        this.subject.list = response.data.list
        this.subject.total = response.data.total
        this.subject.listLoading = false
      })
      this.dialogSubjectVisible = true
    },
    handleFilterSubject() {
      this.subject.listQuery.pageNum = 1
      this.handleSubjectManagement()
    },
    // 新建题目
    handleCreateSubject() {
      this.resetTempSubject()
      this.dialogStatus = 'create'
      this.dialogSubjectFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubjectForm'].clearValidate()
      })
    },
    resetTempSubject() {
      this.tempSubject = {
        id: '',
        examinationId: '',
        subjectName: '',
        type: 0,
        content: '',
        answer: '',
        score: '',
        analysis: '',
        level: 2
      }
    },
    // 修改题目
    handleUpdateSubject(row) {
      this.tempSubject = Object.assign({}, row) // copy obj
      this.tempSubject.status = parseInt(status)
      this.tempSubject.type = parseInt(row.type)
      // 绑定考试ID
      this.tempSubject.examinationId = this.subject.examinationId
      this.dialogStatus = 'update'
      this.dialogSubjectFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataSubjectForm'].clearValidate()
      })
    },
    // 删除题目
    handleDeleteSubject(row) {
      delSubject(row.id).then(() => {
        this.dialogSubjectFormVisible = false
        this.handleSubjectManagement()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
      const index = this.subject.list.indexOf(row)
      this.subject.list.splice(index, 1)
    },
    // 保存题目
    createSubjectData() {
      this.$refs['dataSubjectForm'].validate((valid) => {
        if (valid) {
          // 绑定考试ID
          this.tempSubject.examinationId = this.subject.examinationId
          addSubject(this.tempSubject).then(() => {
            this.subject.list.unshift(this.tempSubject)
            this.dialogSubjectFormVisible = false
            this.handleSubjectManagement()
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
    // 更新题目
    updateSubjectData() {
      this.$refs['dataSubjectForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempSubject)
          putSubject(tempData).then(() => {
            for (const v of this.subject.list) {
              if (v.id === this.tempSubject.id) {
                const index = this.subject.list.indexOf(v)
                this.subject.list.splice(index, 1, this.tempSubject)
                break
              }
            }
            this.dialogSubjectFormVisible = false
            this.handleSubjectManagement()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
