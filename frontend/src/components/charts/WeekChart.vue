<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'WeekChart',
    components: { Bar },
    props: {
        data: {
            type: Object,
            default: () => ({
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Daily Sales',
                        backgroundColor: '#FFA726',
                        borderRadius: 4,
                        data: [12, 19, 3, 5, 2, 3, 10]
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
                  legend: { display: false }
              },
               scales: {
                  y: { display: false },
                  x: { grid: { display: false } }
              }
            }
        }
    }
}
</script>
