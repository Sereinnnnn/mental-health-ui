<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-form">
          <svg-icon icon-class="form" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">问卷点击量</div>
          <count-to :start-val="0" :end-val="894" :duration="2200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-chart">
          <svg-icon icon-class="chart" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总用户数</div>
          <count-to :start-val="0" :end-val="1022" :duration="2400" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">在线用户数</div>
          <count-to :start-val="0" :end-val="850" :duration="2000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-tab">
          <svg-icon icon-class="tab" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">访客量</div>
          <count-to :start-val="0" :end-val="879" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getDashboard } from '@/api/admin/sys'
import { notifyFail, isNotEmpty } from '@/utils/util'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      onlineUserNumber: 0,
      examinationNumber: 0
    }
  },
  created() {
    // 获取首页数据
    this.getDashboardData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getDashboardData() {
      getDashboard().then(response => {
        if (isNotEmpty(response.data) && isNotEmpty(response.data.data)) {
          const data = response.data.data
          if (isNotEmpty(data.onlineUserNumber)) {
            this.onlineUserNumber = parseInt(data.onlineUserNumber)
          }
          if (isNotEmpty(data.examinationNumber)) {
            this.examinationNumber = parseInt(data.examinationNumber)
            // zzz:这样才和每日的假数据一样……
            this.examinationNumber = 894
          }
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #bd4343;
      }
      //.icon-people {
      //  background: #40c9c6;
      //}
      //.icon-message {
      //  background: #36a3f7;
      //}
      //.icon-money {
      //  background: #f4516c;
      //}
      //.icon-shoppingCard {
      //  background: #34bfa3
      //}
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-form {
      color: #36a3f7;
    }
    .icon-chart {
      color: #f4516c;
    }
    .icon-tab {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
