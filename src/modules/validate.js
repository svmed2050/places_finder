// Валидация
const isLatitude = num => {
  if(isFinite(num) && Math.abs(num) <= 90 && num !== '') {
    return true
  }
  alert('Latitude must be a number between -90 and 90')
  return false
}

const isLongitude = num => {
  if(isFinite(num) && Math.abs(num) <= 180 && num !== '') {
    return true
  } 
  alert('Longitude must a number between -180 and 180')
  return false
}

export {isLatitude, isLongitude};