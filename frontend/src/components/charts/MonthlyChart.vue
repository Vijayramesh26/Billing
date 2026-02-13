<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
    name: 'MonthlyChart',
    components: { Line },
    props: {
        data: {
            type: Object,
            default: () => ({
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Monthly Revenue',
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                        borderColor: '#1976D2',
                        pointBackgroundColor: '#1976D2',
                        fill: true,
                        tension: 0.4,
                        data: [4500, 5200, 4800, 6100]
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
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
              }
            }
        }
    }
}
</script>
