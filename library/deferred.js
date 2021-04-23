/** {Defer} Promise-like объект, способный резолвиться извне @class
  * @example
  * const promise = new Deferred();
  * ...
  * promise.resolve(), promise.reject();
  */
  export default class Deferred {
  /** Создание отложенного обещания {Deferred} @constructor
    */
    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject  = reject;
      });
      this.then  = this.promise.then.bind(this.promise);
      this.catch = this.promise.catch.bind(this.promise);
      this[Symbol.toStringTag] = 'Promise';
    }

  /** Проверка на Deferred / is @static
    * @param {any} value проверяемый объект
    * @return {boolean} true, если переданный объект {Deferred}
    */
    static is(value) {
      return value instanceof Deferred;
    }

  /** Проверка на промис / isPromise @static
    * @param {any} value проверяемый объект
    * @return {boolean} true, если переданный объект {Promise}
    */
    static isPromise(value) {
      return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
  }
