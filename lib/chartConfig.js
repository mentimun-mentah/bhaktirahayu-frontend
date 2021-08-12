export const antigenGenoseOption = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
      tools: { download: false }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      endingShape: 'rounded',
      borderRadius: 5,
      dataLabels: { position: 'top' },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ["#304758"]
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  colors: ['#47e395', '#E91E63'],
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
    tooltip: { enabled: true, }
  },
  yaxis: { show: false, },
  fill: { opacity: 1 },
  tooltip: { enabled: false, },
}
