<template>
  <div class="chart">
    <ve-line 
    :data="chartData" 
    :legend-visible="false"
    height="220px"
    :colors="colors"
    class="ve-line-block"
    ></ve-line>
  </div>
</template>

<script>
  import VeLine from 'v-charts/lib/line.common'
  export default {
    name: 'Chart',
    components: { VeLine },
    props: {
      'cdata': {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        colors:['#D0B07A'],//
        chartData: {
          columns: ['date', 'PV'],
          rows: [
              { 'date': '10/01', 'PV': 10 },
              { 'date': '10/02', 'PV': 50 },
              { 'date': '10/03', 'PV': 70 },
              { 'date': '10/04', 'PV': 30 },
              { 'date': '10/05', 'PV': 800 },
              { 'date': '10/06', 'PV': 20 }
          ]
        }
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .chart{
    background-color: #F7F7F7;
    margin:20px;
    height: 160px;
    .ve-line-block{
      position: relative;
      top: -30px;
    }
  }
</style>