<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 2000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '热门问卷各天测评量', // 设置图表标题文本
          left: 'center',          // 设置标题位置，可以是'left', 'center', 'right'
          top: 'top',              // 设置标题位置，可以是'top', 'middle', 'bottom'
          textStyle: {
            fontSize: 14,          // 设置标题字体大小
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 40,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '社会支持评定量表',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [19,43,82,33,46,30,67],
          animationDuration
        }, {
          name: '日常生活能力评定量表',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [26,73,12,36,40,31,22],
          animationDuration
        }, {
          name: '正念五因素量表',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [12,41,22,10,19,33,12],
          animationDuration
        }]
      })
    }
  }
}
</script>
