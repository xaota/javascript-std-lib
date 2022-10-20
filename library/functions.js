/** @section @exports */
/** */
  export default class Fn {
  /** */
    static debounce(f, ms) {
      let isCooldown = false;

      return function() {
        if (isCooldown) return;
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
      };
    }

  /** */
    static throttle(func, ms) {
      let isThrottled = false,
        savedArgs,
        savedThis;

    /** */
      function wrapper() {
        if (isThrottled) { // (2)
          savedArgs = arguments;
          savedThis = this;
          return;
        }

        func.apply(this, arguments); // (1)
        isThrottled = true;
        setTimeout(function() {
          isThrottled = false; // (3)
          if (savedArgs) {
            wrapper.apply(savedThis, savedArgs);
            savedArgs = savedThis = null;
          }
        }, ms);
      }
      return wrapper;
    }

  /** Оператор функционального матчинга @static
    * @param {any} args матчевые переменные
    * @return {function} @closure
    * @usage matches(args)(...cases)(), cases = array of [function:boolean, function:handler]
    */
    static matches(...args) {
      return (...cases) => {
        cases = cases
          .filter(c => c[0](...args))
          .map(c => c[1]);
        return (nothing = _ => undefined) =>
          cases.length > 0
            ? cases[0]
            : nothing;
      }
    }

  /** Повтор функции через равные промежутки времени (после окончания) @static
    * @param {Function} fn "зацикливаемая" функция
    * @param {number} delay время между запусками (в мс)
    * @param {object} context контекст запуска
    * @return {object} {start(), stop()} управление функцией
    */
    static repeatAwait(fn, delay, context = null) {
      let flag = false;
      let timer;
      return {
      /** */
        start() {
          flag = false;
          f();
        },
      /** */
        stop() {
          flag = true;
          clearTimeout(timer);
        }
      };

    /** */
      async function f() {
        if (timer) clearTimeout(timer);
        await fn.apply(context);
        if (flag === true) return;
        timer = setTimeout(f, delay);
      }
    }

  /** Таймаут-промис @static
    * @param {number} delay время ожидания начала выполнения функции в милисекундах
    * @param {function} handler функция
    * @param {array} args список передаваемых параметров
    * @return {Promise} результат выполнения
    */
    static timeout(delay = 0, handler = () => {}, ...args) {
      return new Promise((resolve, reject) => {
        setTimeout(async (...args) => {
          try {
            const result = await handler(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay, ...args);
      });
    }

  /** Задержка выполнения / sleep @async @sattic
    * @param {number} duration продолжительность задержки (в милисекундах)
    * @return {Promise} await до возврата управления
    */
    static sleep(duration) {
      return new Promise(resolve => setTimeout(resolve, duration));
    }
  }
