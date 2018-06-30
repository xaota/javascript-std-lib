/** @section @imports */
  import Num from './number.js';

/** @section @exports */
/** array functions */
export default class Arr {
/** Случайный элемент массива @static
  * @param {array} array массив
  * @return {any} элемент массива
  */
  static rand(array = []) {
    return array[Arr.randIndex(array)];
  }

/** Индекс случайного элемента массива @static
  * @param {array} array массив
  * @return {number} индекс элемента массива
  */
  static randIndex(array = []) {
    return Num.rand(0, array.length);
  }

/** Уникальные элементы массива @static
  * @param {array} array исходный массив
  * @return {array} только уникальные элементы
  */
  static uniq(array = []) {
    return Array.from(new Set(array));
  }

/** Обертка для редуцирующей конкатенации @reduce @static
  * @param {static} handler? преобразование элемента при конкатенации
  * @return {array} list.concat(handler(item))
  */
  static concat(handler = item => item) {
    return (list, item) => list.concat(handler(item));
  }

/** Похожесть двух массивов @primitive @static
  * @param {array} A массив 1
  * @param {array} B массив 2
  * @return {boolean} массивы состоят из одинаковых эелементов
  */
  static similar(A = [], B = []) {
    B = B.slice();
    A.forEach(e => {
      const index = B.indexOf(e);
      if (index !== -1) B.splice(index, 1);
    });
    return B.length === 0;
  }

/** Наличие массива small в массиве large @static
  * @param {array} large большой массив
  * @param {array} small маленький массив
  * @return {boolean} флаг
  */
  static included(large = [], small = []) {
    if (large.length === 0 && small.length === 0) return true;
    if (large.length === 0) return false;
    if (small.length === 0) return true;
    return small.every(e => large.includes(e));
  }

/** Пересечение двух массивов @static
  * @param {array} A массив 1
  * @param {array} B массив 2
  * @return {array} общие элементы двух массивов
  */
  static intersect(A = [], B = []) {
    return A.filter(e => B.includes(e));
  }

/** Элементы массива не содержащиеся в другом массиве @static
  * @param {Array} A проверяемый массив
  * @param {Array} B проверяющиий массив
  * @return {Array} массив значений A, которые не содержатся в B
  */
  static difference(A = [], B = []) { // todo: l, r
    return A.filter(x => !B.includes(x));
  }

/** Симметрическая разность двух массивов @static
  * @param {Array} A массив
  * @param {Array} B массив
  * @return {Array} массив значений A, которые не содержатся в B и наоборот
  */
  static symmetricDifference(A = [], B = []) {
    const left  = Arr.difference(A, B);
    const right = Arr.difference(B, A);
    return Arr.uniq([...left, ...right]);
  }

/** Плоский список из списка списков @static
  * @param {array} array массив массивов
  * @return {array} итоговый "плоский" массив
  */
  static flatten(array = []) {
    return array.reduce((result, item) => result.concat(Array.isArray(item) ? Arr.flatten(item) : item), []);
  }

/** Масссив определенной длины с одинаковыми значениями @static
  * @param {number} length желаемая длина
  * @param {any} value желаемое значение
  * @return {Array} итоговый массив
  */
  static fill(length, value) {
    return Array.from({length}, typeof value === "function" ? value : (_, i) => value);
  }

/** Новый массив без одного элемента @static
  * @param {array} array исходный массив
  * @param {any} item исключаемый элемент
  * @return {array} массив без первого вхождения item
  */
  static without(array, item) {
    return (item = array.indexOf(item), item === -1)
      ? array.slice()
      : array
        .slice(0, item)
        .concat(array.slice(item + 1));
  }

/** Группировка элементов массива по другому массиву / groups @static
  * @param {array} array исходный массив
  * @param {array} groups список групп
  * @param {Function} iteratee соответствие элементов группе
  * @return {array} массив массивов по группам
  */
  static groups(array, groups, iteratee = (item, group) => item === group) {
    return groups.map(g => array.filter(i => iteratee(i, g)));
  }

/** Декартово произведение элементов массива массивов @static
  * @param {array} array исходный массив массивов
  * @return {array} массив всевозможных комбинаций
  */
  static cartesianProduct(array = []) {
    array.forEach((e, i) => { if (!Array.isArray(e)) array[i] = [e]; });
    return array
      .reduce((a, b) => a.map(x => b.map(y => x.concat(y))).reduce((r, e) => r.concat(e), []), [[]]);
  }

/** Массив из массивов элементов-объектов массива / concatMap @static
  * [...{field: {array}}, ...] -> {array of fileld's items}
  * @param {array} array исходный массив
  * @param {function} fn функция выбора массива из объекта
  * @return {array} итоговый массив
  */
  static concatMap(array, fn) {
    return [].concat(...array.map(fn));
  }
}
