// let checkMaGhe = true
// for (let i = 0; i < danh_sach_ghe.length; ++i) {
//   let result = await model.Ghe.findByPk(danh_sach_ghe[i])
//   console.log(result)
//   console.log(checkMaGhe && result)
// }
// console.log("truoc if", checkMaGhe)
// if (checkMaGhe) {
//   res.send("oki purchase")
// } else {
//   failCode(res, "", "Mã ghế không tồn tại!")
// }



let checkMaGhe = async (danh_sach_ghe, model) => {
  let a = true;
  const promises = danh_sach_ghe.map(async ma_ghe => {
    let result = await model.Ghe.findByPk(ma_ghe)
    return result
  })

  const results = await Promise.all(promises)
  for (let i = 0; i < results.length; i++) {
    if (results[i] === null) {
      a = false
    } 
  }
  return a
}



// const mapLoop = async _ => {
//   console.log('Start')

//   const promises = fruitsToGet.map(async fruit => {
//     const numFruit = await getNumFruit(fruit)
//     return numFruit
//   })

//   const numFruits = await Promise.all(promises)
//   console.log(numFruits)

//   console.log('End')
// }

module.exports = {
  checkMaGhe,
}
