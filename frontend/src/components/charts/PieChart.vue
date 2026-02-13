<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: 'PieChart',
    components: { Pie },
    props: {
        data: {
            type: Object,
            default: () => ({
                labels: ['Medicine', 'Supplements', 'Equipment', 'Cosmetics'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                        data: [40, 20, 80, 10]
                    }
                ]
            })
        }
    },
    computed: {
        chartData() { return this.data },
        chartOptions() {
            return {
              responsive: true,
              maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
              }
            }
        }
    }
}
</script>
