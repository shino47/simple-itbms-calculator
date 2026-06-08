import Big from 'big.js';

export const generateId = () => crypto?.randomUUID?.() ?? Date.now().toString();

export const getValueFromNumpadDot = (currentAmount) => {
  if (Number(currentAmount) >= 1) {
    return Big(currentAmount).toString();
  }
  return Number(String(currentAmount).split('.')[1]) + '.';
};

export const getValueFromNumpadNumber = (currentAmount, number) => {
  let val = String(currentAmount);
  if (val.charAt(val.length - 1) == '.') {
    return val + String(number);
  }
  val = (val + String(number)).replace(/\./, '');
  let formated = '';
  for (var i = 0; i < val.length; i++) {
    let separator = i == 2 ? '.' : '';
    formated = val.substring(val.length - 1 - i, val.length - i) + separator + formated;
  }
  formated = formated.replace(/^0+/, '');
  if (formated.charAt(0) == '.') {
    formated = '0' + formated;
  }
  return formated;
};
