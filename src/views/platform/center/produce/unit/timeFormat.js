let timeFormat = {
  /* 查询时间-月份-处理 */
  timeSearchFormat: (value, type) => {
    if (type == 'month') {
      return `${value}-01`
    } else if (type == 'year') {
      return `${value}-01-01`
    } else if (type == 'date') {
      return value
    }
  },
  p: (s) => {
    return s < 10 ? "0" + s : s;
  },
  /* 折线图-X轴-处理 */
  chartXHandle: (value, type, list) => {
    //创建补0函数
    let XArray = []
    let p = (s) => {
      return s < 10 ? "0" + s : s;
    }
    if (type == 'month') {
      list.map((item, index) => {
        let xValue = `${value}-${p(index + 1)}`
        XArray.push(xValue)
      })
      return XArray
    } else if (type == 'year') {
        list.map((item, index) => {
            let xValue = `${value}-${p(index + 1)}`
            XArray.push(xValue)
          })
          return XArray
    } else if (type == 'date') {
        list.map((item, index) => {
            let xValue = `${p(index)}:00`
            XArray.push(xValue)
          })
          return XArray
    }
  },




}

export default timeFormat
