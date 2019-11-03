/** @section @imports */
  import Str from './string.js';
  import Arr from './array.js';

/** @section @exports */
/** number functions */
export default class Num {
/** Возвращает случайное целое в диапазоне [min, max - 1] @static
  * @param {number} min нижняя граница промежутка
  * @param {number} max верхняя граница промежутка
  * @return {number} случайное число
  */
  static rand(min, max) {
    if (min == undefined) return Num.rand(2) == 1;
    if (max == undefined) return min > 0 ? Num.rand(0, min) : Num.rand(min, 0);
    return Math.floor(Math.random() * (max - min)) + min;
  }

/** Процент от числа @static
  * @param {number} count количество элементов @natural
  * @param {number} [from=100] количество элементов всего @natural
  * @param {number} [precision=2] желаемая точность (количество знаков после запятой)
  * @return {number} число заданной точности
  */
  static percent(count, from = 100, precision = 2) {
    const a = 10 ** (precision + 2);
    const b = 10 ** precision;
    return Math.round(count / from * a) / b;
  }

/** Округление числа до заданной точности @static
  * @param {number} num исходное число
  * @param {number} [precision=2] количество знаков после запятой
  * @return {number} число с округлением
  */
  static trunc(num, precision = 2) {
    const x = Math.pow(10, precision);
    return ~~(num * x) / x;
  }

/** Форматирование числа спереди @static
  * @param {number} value форматируемое число
  * @param {number} [length=2] желаемая длина строки
  * @param {string} [char='0'] символ-заполнитель
  * @return {string} форматированное число
  */
  static pad(value, length = 2, char = '0') {
    value = value.toString();
    return value.length >= length
      ? value
      : (Str.fill(length, char) + value).substr(-length);
  }

/** Сумма всех элементов массива @static
  * @param {array} array числовой массив
  * @return {number} сумма
  */
  static sum(array = []) {
    return array.reduce((value, current) => value + current, 0);
  }

/** Среднее от элементов массива @static
  * @param {array} array числовой массив
  * @return {number} среднее число
  */
  static mean(array = []) {
    return array.length === 0
      ? 0
      : Num.sum(array) / array.length;
  }

/** Персентиль от элементов массива (0..1) @static
  * @param {array} array числовой массив
  * @param {percent} percent срез
  * @return {number} персентиль числа
  */
  static percentile(array, percent) {
    if (percent <= 0 || percent >= 1 || array.length === 0) return 0;
    array = array.slice().sort((a, b) => a - b);
    const index = Math.floor(array.length * percent);
    return index > 0 && array.length % 2  === 0
      ? (array[index] + array[index - 1]) / 2
      : array[index];
  }

/** Квартиль от элементов массива (персентиль 0.25 * index) @static
  * @param {array} array числовой массив
  * @param {number} index номер среза (min = 1)
  * @return {number} квартиль массива по индексу
  */
  static quartile(array, index = 1) {
    return Num.percentile(array, 0.25 * index);
  }

/** Медиана от элементов массива (персентиль 0.5) @static
  * @param {array} array числовой массив
  * @return {number} медиана массива
  */
  static median(array = []) {
    return Num.percentile(array, 0.5);
  }

/** Моды от элементов массива @static
  * @param {array} array числовой массив
  * @return {array} {...number} числа моды массива
  */
  static mode(array = []) {
    const uniq = {};
    Arr.uniq(array).forEach(e => uniq[e] = 0);
    array.forEach(e => ++uniq[e]);
    const max = Math.max(...Object.values(uniq));
    const result = [];
    Object.keys(uniq).forEach(e => {
      if (uniq[e] === max) result.push(Number(e));
    });
    return result.length === array.length
      ? []
      : result;
  }

/** Фиксирование числа в диапазоне @static
  * @param {number} value число
  * @param {number} min миниимальное значение
  * @param {number} max максимальное значение
  * @return {number} число из диапазона
  */
  static clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(min, value), max);
  }
}
