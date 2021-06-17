/** @section @imports */
  import Fn from './functions.js';

/** @section @exports */
/** object functions */
  export default class Obj {
  /** Получение значения по пути в объекте @static
    * @param {object} object исходный объект
    * @param {string} path путь
    * @param {string} split разделитель вложенности ключей в пути
    * @param {any} defaultValue значение по-умолчанию
    * @return {any} значение
    */
    static get(object, path, defaultValue = undefined, split = '/') {
      if (typeof path === 'string') path = path.split(split).filter(e => e);
      let root = object;
      for (const chunk of path) {
        root = root[chunk];
        if (!root) break;
      }
      return root || defaultValue;
    }

  /** Установка значения по пути в объекте @static
    * @param {object} object исходный объект
    * @param {string} path путь
    * @param {any} value устанавливаемое значение
    * @param {string} split разделитель вложенности ключей в пути
    * @return {any} установленное значение
    */
    static set(object, path, value, split = '/') {
      if (typeof path === 'string') path = path.split(split).filter(e => e);
      let root = object;
      for (let i = 0; i < path.length - 1; ++i) {
        const chunk = path[i];
        if (!(chunk in root)) root[chunk] = {};
        root = root[chunk];
      }
      root[path[path.length - 1]] = value;
      return value;
    }

  /** Список всех путей до значений в объекте @static @reqursive
    * @param {object} object исходный объект
    * @param {string} path стартовый путь
    * @return {array} список путей {...string}
    */
    static paths(object, path = '') {
      if (typeof object !== 'object') return []; // !
      let result = [];
      // let count = 0;
      for (const i in object) {
        const field = object[i];
        const current = path + '/' + i;
        result.push(current);
        result = result.concat(Obj.paths(field, current));
      }
      return result;
    }

  /** Список всех путей до листьев в объекте @static @reqursive
    * @param {object} object исходный объект
    * @param {string} path стартовый путь
    * @return {array} список путей {...string}
    */
    static leafsPaths(object, path) {
      return Obj
        .paths(object, path)
        .filter((e, i, l) => !l.slice(i + 1).find(x => x.indexOf(e) === 0));
    }

  /** Все конечные узлы / leafs @static
    * @param {object} object исходный объект
    * @param {string} path стартовый путь
    * @return {any} список элементов
    */
    static leafs(object, path) {
      return Obj
        .leafsPaths(object, path)
        .map(e => Obj.get(object, e));
    }

  /** Изменение листьев объекта @static @reqursive
    * @param {object} object исходный объект
    * @param {function} migration функция обновления листа
    * @param {string} path стартовый путь
    * @return {array} список путей {...string}
    */
    static leafsUpdate(object, migration, path) {
      const paths = Obj.leafsPaths(object, path);
      paths.forEach(path => {
        const origin = Obj.get(object, path);
        const value  = migration(origin, path);
        Obj.set(object, path, value);
      });
      return object;
    }

  /** Список всех методов в прототипе объекта, исключая конструктор @static
    * @param {object} object исходный объект
    * @return {array} список названий методов {...string}
    */
    static methods(object) {
      const methods = new Set();
      while (object = Reflect.getPrototypeOf(object)) {
        const keys = Reflect.ownKeys(object)
        keys.forEach((k) => methods.add(k));
      }
      return Array.from(methods);
    }

  /** Создаёт в объекте ключ-массив (object[key] = [..., value]) / arrays @static
    * @param {object} object исходный объект
    * @param {string} key ключ
    * @param {any} value значение
    * @return {object} object
    */
    static arrays(object, key, value) {
      if (!Obj.into(key, object)) object[key] = [];
      if (!Array.isArray(object[key])) object[key] = [object[key]];
      object[key].push(value);
      return object;
    }

  /** Глубокое копирование объекта @static
    * @param {object} source источник
    * @param {WeakMap} hash хранилище копий
    * @return {object} копия объекта
    */
    static deep(source, hash = new WeakMap()) {
      if (Object(source) !== source) return source;
      const type = [Number, String, Boolean].filter(type => source instanceof type);
      if (type.length === 1) return new type[0](source);
      if (hash.has(source)) return hash.get(source);
      const result = Fn.matches(source)(
        [obj => obj instanceof Date,     obj => new Date(obj)],
        [obj => obj instanceof RegExp,   obj => new RegExp(obj.source, obj.flags)],
        [obj => obj instanceof Function, obj => Object.assign(obj)],
        [obj => obj.constructor,         obj => new obj.constructor()]
      )(_ => Object.create(null))(source);
      hash.set(source, result);
      if (source instanceof Map) Array.from(source, ([key, val]) => result.set(key, Obj.deep(val, hash)));
      return Object.assign(result, ...Object.keys(source).map(key => ({ [key]: Obj.deep(source[key], hash) })));
    }

  /** Глубокое слияние объектов в один @static @immutable
    * @param {...object} objects - Objects to merge
    * @return {object} New object with merged key/values
    */
    static merge(...objects) {
      return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
          const pVal = prev[key];
          const oVal = obj[key];

          if (Array.isArray(pVal) && Array.isArray(oVal)) {
            prev[key] = pVal.concat(...oVal);
          } else if (Obj.is(pVal) && Obj.is(oVal)) {
            prev[key] = Obj.merge(pVal, oVal);
          } else {
            prev[key] = oVal;
          }
        });

        return prev;
      }, {});
    }

  /** Оператор наличия @static
    * @param {string} item проверяемый элемент
    * @param {object} object проверяемый объект
    * @return {boolean} флаг
    */
    static into(item, object) {
      return item in object;
    }

  /** Вернет true, если переданное значение (value) является объектом @static
    * @param {any} value проверяемое значение
    * @return {boolean} true, если параметр является объектом
    */
    static is(value) {
      return value instanceof Object && Object.getPrototypeOf(value) === Object.prototype;
    }

  /** Проверка на пустоту объекта @todo @static
    * @param {object} object проверяемый объект
    * @return {boolean} true, если нет ключей
    */
    static empty(object) {
      return Object.keys(object).length === 0;
    }

  /** Глубокое сравнение объектов */
    static equal(a, b) {
      if (a === b) return true;
      // var envHasBigInt64Array = typeof BigInt64Array !== 'undefined';

      if (a && b && typeof a === 'object' && typeof b === 'object') {
        if (a.constructor !== b.constructor) return false;

        let length, i;
        if (Array.isArray(a)) {
          length = a.length;
          if (length !== b.length) return false;
          for (i = length; i-- !== 0;) { if (!Obj.equal(a[i], b[i])) return false; }
          return true;
        }

        if ((a instanceof Map) && (b instanceof Map)) {
          if (a.size !== b.size) return false;
          for (i of a.entries()) { if (!b.has(i[0])) return false; }
          for (i of a.entries()) { if (!Obj.equal(i[1], b.get(i[0]))) return false; }
          return true;
        }

        if ((a instanceof Set) && (b instanceof Set)) {
          if (a.size !== b.size) return false;
          for (i of a.entries()) { if (!b.has(i[0])) return false; }
          return true;
        }

        if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
          length = a.length;
          if (length !== b.length) return false;
          for (i = length; i-- !== 0;) { if (a[i] !== b[i]) return false; }
          return true;
        }

        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        const keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;

        for (i = length; i-- !== 0;) { if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false; }

        for (i = length; i-- !== 0;) {
          const key = keys[i];
          if (!Obj.equal(a[key], b[key])) return false;
        }

        return true;
      }

      return Number.isNaN(a) && Number.isNaN(b);
    }
  }

// function objectDeepKeys(obj) {
//   return Object
//     .keys(obj)
//     .filter(key => obj[key] instanceof Object)
//     .map(key => objectDeepKeys(obj[key]).map(k => `${key}.${k}`))
//     .reduce((x, y) => x.concat(y), Object.keys(obj))
// }
