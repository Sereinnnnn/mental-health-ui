<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
          text: '热门问卷测评量', // 设置图表标题文本
          left: 'center',          // 设置标题位置，可以是'left', 'center', 'right'
          top: 'top',              // 设置标题位置，可以是'top', 'middle', 'bottom'
          textStyle: {
            fontSize: 14,          // 设置标题字体大小
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['正念五因素量表', '社会支持评定量表', '日常生活能力评定量表', '职业价值测验'],
          textStyle: {
            fontSize: 10        // 调整字体大小
          },
        },
        calculable: true,
        series: [
          {
            name: '问卷测评总量',
            type: 'pie',
            roseType: 'radius',
            radius: [10, 40],  // 调整内半径和外半径以缩小饼图
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '社会支持评定量表' },
              { value: 240, name: '日常生活能力评定量表' },
              { value: 149, name: '正念五因素量表' },
              { value: 100, name: '职业价值测验' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
