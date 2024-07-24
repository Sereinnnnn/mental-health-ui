<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 3000

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
          text: '热门问卷雷达图', // 设置图表标题文本
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
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          startAngle: 45, // 旋转雷达图90度
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(114,174,215,.5)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '情感状态评估', max: 10 },
            { name: '心理健康评估', max: 10 },
            { name: '生活质量评估', max: 10 },
            { name: '社会功能评估', max: 10 },
            // { name: 'Development', max: 10 },
            // { name: 'Marketing', max: 10 }
          ],
          name: {
            textStyle: {
              color: '#565252' // 设置指示器名称的颜色
            }
          },
        },
        legend: {
          left: 'center',
          bottom: '20',
          data: ['正念五因素量表', '日常生活能力评定量表', '社会支持评定量表'],
          itemWidth: 10,        // 调整图例项的宽度
          itemHeight: 10,       // 调整图例项的高度
          textStyle: {
            fontSize: 10        // 调整字体大小
          },
          padding: [0, 0, 0, 5], // 调整图例的内边距
          itemGap: 10,          // 调整图例项之间的间距
          orient: 'horizontal',
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: [9, 7, 6, 5],
              name: '正念五因素量表'
            },
            {
              value: [5, 5, 9, 8],
              name: '日常生活能力评定量表'
            },
            {
              value: [6, 5, 7, 9],
              name: '社会支持评定量表'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
