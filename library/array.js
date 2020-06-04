/** @section @imports */
  import Num from './number.js';
  import Obj from './object.js';

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

/** Массив с перемешанными элементами @static
  * @param {array} array массив
  * @return {array} новый массив
  */
  static shuffle(array) {
    const length = array.length;
    const result = array.slice(); // !
    for (let i = 0; i < length; ++i) {
      const index   = Num.rand(i, array.length);
      Arr.swap(result, i, index);
    }
    return result;
  }

/** Обмен местами двух элементов массива @static @void @mutable
  * @param {array} array массив
  * @param {number} a индекс первого элемента
  * @param {number} b индекс второго элемента
  */
  static swap(array, a, b) {
    const el = array[a];
    array[a] = array[b];
    array[b] = el;
    // return array
  }

/** Уникальные элементы массива @static
  * @param {array} array исходный массив
  * @return {array} только уникальные элементы
  */
  static uniq(array = []) {
    return Array.from(new Set(array));
  }

/** Уникальные элементы массива объектов (по полю) / uniqObjects [filter] @static
  * @param {array} array исходный массив
  * @param {string} path путь до поля в каждом элементе массива
  * @param {string} split разделитель вложенности ключей в пути
  * @sample ([{a: 1, b: 1}, {a: 2, b: 2}, {a: 1, b: 3}], 'a') -> [{a: 1, b: 1}, {a: 2, b:2}]
  * @return {array} только уникальные элементы (по значению этого поля)
  */
  static uniqObjects(array, path, split = '/') {
    const cache = array.map(item => Obj.get(item, path, split));
    return array.filter((e, index) => {
      const item = Obj.get(e, path, split);
      return cache.indexOf(item) === index;
    });
  }

/** Список элементов массива, удовлетворяющих условю
  * @param {array} array исходный массив
  * @param {Function} condition функция-условие
  * @return {array} массив индексов
  */
  static filterIndex(array, condition) {
    const result = [];
    for (let index = 0; index < array.length; ++index) if (condition(array[index], index, array)) result.push(index);
    return result;
  }

/** Обертка для редуцирующей конкатенации @reduce @static
  * @param {Function} handler? преобразование элемента при конкатенации
  * @return {Function} list.concat(handler(item)) -> {Array}
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

/** Масссив определенной длины с одинаковыми значениями @static
  * @param {number} length желаемая длина
  * @param {any} value желаемое значение
  * @return {Array} итоговый массив
  */
  static fill(length, value) {
    return Array.from({length}, typeof value === "function" ? value : (_, i) => value);
  }

/** Итерация по диапазону / range @static @generator
  * @param {number} from начальное значение
  * @param {number} to конечное значение
  * @param {number} [step=1] шаг
  * @yield {number} текущее значение интерации
  */
  static *range(from, to, step = 1){
    for (let val = from; val < to; val += step){
      yield val;
    }
  }

/** Новый массив без одного элемента @static
  * @param {array} array исходный массив
  * @param {any} item исключаемый элемент
  * @return {array} массив без первого вхождения item
  */
  static without(array, item) {
    return (item = array.indexOf(item), item === -1)
      ? array.slice()
      : Arr.withoutIndex(array, item);
  }

/** Новый массив без одного элемента по индексу @static
  * @param {array} array исходный массив
  * @param {number} index индекс исключаемого элемента
  * @return {array} массив без элемента с индексом index
  */
  static withoutIndex(array, index) {
    return array
      .slice(0, index)
      .concat(array.slice(index + 1));
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

/** Декартово произведение элементов массива массивов / cartesianProduct @static
  * @param {array} array исходный массив массивов
  * @return {array} массив всевозможных комбинаций
  */
  static cartesianProduct(array = []) {
    return Arr.condition(array.slice(), e => !Array.isArray(e), e => [e])
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

/** Применяет мутацию только для отобранных элементов / condition @static
  * @param {array}       array исходный массив
  * @param {function}   filter фильтрация элементов
  * @param {function} mutation мутация элементов
  * @return {array} итоговый массив
  */
  static condition(array, filter, mutation) {
    return array.map((e, i) => filter(e, i, array) ? mutation(e, i, array) : e);
  }

/** Группировка элементов массива по количеству / groupBy @static
  * @param {Array} array исходный массив
  * @return {Array} массив групп
  * @example [a,b,c,a,b,d,a] -> [[a,3], [b, 2], [c, 1], [d, 1]]
  */
  static groupBy(array) {
    const temp = {};
    array.forEach(e => {
      if (!(e in temp)) temp[e] = 0;
      ++temp[e];
    });
    return Object.entries(temp);
  }
}
