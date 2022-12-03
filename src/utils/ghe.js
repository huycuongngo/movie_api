let checkMaGhe = async (danh_sach_ghe, model) => {
  const promises = danh_sach_ghe.map(async ma_ghe => {
    let result = await model.Ghe.findByPk(ma_ghe)
    return result
  })
  console.log(promises)
  const results = await Promise.all(promises)
  console.log(results)
  for (let i = 0; i < results.length; i++) {
    if (results[i] === null) {

    } 
  }
}

module.exports = {
  checkMaGhe,
}
