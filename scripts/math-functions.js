function getEstimatedPayment(salary, capacity) {
  return formatPrice(salary * Math.max(0.5, capacity));
}
function getAge(date) {
  const dateNow = new Date();
  let years = dateNow.getFullYear() - (new Date(date)).getFullYear();
  let m = dateNow.getMonth() - (new Date(date)).getMonth();
  if (m < 0 || (m === 0 && dateNow.getDate() < (new Date(date)).getDate())) {
    years--;
  }
  return years;
}
function formatPrice(number, symbol = '$') {
  return `${symbol} ` + Number(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export {getEstimatedPayment, getAge, formatPrice};