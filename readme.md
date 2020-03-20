Расширения для стандартной библиотеки JavaScript @esm

## Установка
```shell
$ npm install javascript-std-lib
```

## Использование
```html
<script type="importmap">
{
  "imports": {
    "javascript-std-lib": "/javascript-std-lib/index.js",
    "javascript-std-lib/": "/javascript-std-lib/library/"
  }
}
</script>
```

```javascript
import {Num, Arr, Str, Obj, Fn, Moment} 'javascript-std-lib'; // all static classes
...
```
---

## Классы
### `Num` - методы для работы с числами
```javascript
import Num from 'javascript-std-lib/number.js';

//

Num.rand(min, max)                             // rand integer from [min, max)
Num.percent(count, from = 100, precision = 2)  // Num.percent(3, 10) -> 0.3
Num.trunc(num, precision = 2)
Num.pad(5, length = 2, char = '0')             // "05"
Num.sum([1, 2, 3])                             // 6
Num.mean([1, 2, 3, 4])                         // 2.5
Num.percentile(array, percent)
Num.quartile(array, index = 1)
Num.median(array = [])
Num.mode(array = [])
Num.clamp(value, min = 0, max = 1)
```
---

### `Arr` - методы для работы с массивами
```javascript
import Arr from 'javascript-std-lib/array.js';

//

Arr.rand([1, 2, 3, 4, 5, 6, 7]);           // допустим, 5 - случайный элемент массива
Arr.randIndex([1, 2, 3, 4, 5, 6, 7])       // допустим, 3 - случайный индекс из массива
Arr.shuffle([1, 2, 3, 4, 5, 6, 7])         // допустим, [7, 3, 6, 1, 2, 5, 4] - перемешанный массив

Arr.swap([1, 2, 3, 4, 5, 6, 7], 5, 3)      // [1, 2, 3, 6, 5, 4, 7] !!!NOTE @mutable

Arr.uniq([1, 1, 1, 2, 3, 3, 4])            // -> [1, 2, 3, 4]
Arr.uniqObjects(array, path, split = '/')  // Уникальные элементы массива объектов (по полю)

Arr.concat(item => item)                   // (list, item) => list.concat(handler(item)) // для .reduce

Arr.similar([1, 2, 3, 4], [4, 3, 1, 2])    // true, если массивы "похожи"
Arr.included([1, 2, 3, 4, 5], [3, 1, 2])   // true, если элементы второго массива находятся в первом
Arr.intersect([1, 2, 3, 4, 5], [3, 1, 2])  // [1, 2, 3] - пересечение двух массивов
Arr.difference([1, 2, 3, 4, 5], [3, 1, 2]) // [4, 5] - разница двух массивов
Arr.symmetricDifference([1, 2, 3, 4, 5], [3, 1, 2, 6]) // [4, 5, 6]

// Arr.fill(length, any | function)           заполняет массив по паттерну
  Arr.fill(5, 'a')                         // ['a', 'a', 'a', 'a', 'a']
  Arr.fill(5, (_, i) => i + 1)             // [1, 2, 3, 4, 5]

Arr.without([1, 2, 3, 4, 5], 3)            // [1, 2, 4, 5]
Arr.withoutIndex([1, 2, 3, 4, 5], 2)       // [1, 2, 4, 5]

// Arr.groups(array, groups, (item, group) => item === group)
// Группировка элементов массива по другому массиву

// Arr.cartesianProduct(array)                Декартово произведение элементов массива массивов
  Arr.cartesianProduct([[1, 2], 3, [5, 6]])   // [[1, 3, 5], [1, 3, 6], [2, 3, 5], [2, 3, 6]]

Arr.concatMap(array, fn)

Arr.condition([1, 2, 3], e => e % 2 === 0, e => e * 10) // [1, 20, 3]
Arr.filterIndex([1, 2, 3, 4], e => e % 2) // [2, 4]
```
---

### `Str` - методы для работы со строками
```javascript
import Str from 'javascript-std-lib/string.js';

//

Str.is(value) // true, если переданый параметр - строка (без наследования от String @todo)
Str.fill(length, pattern)
Str.random(length, space = 'abc...zyz1...90ABC...XYZ')
Str.matchAll(input, regexp)
Str.format(string, ...args)

Str.cleanRU(string) // !
```
---

### `Obj` - методы для работы с объектами
```javascript
import Obj from 'javascript-std-lib/object.js';

//

Obj.is(value)          // true, если переданый параметр - простой объект
Obj.empty(object)      // true, если переданый параметр - пустой объект (без наследования)
Obj.into(item, object) // boolean, -> item in object
Obj.merge(...objects)
Obj.deep(source)       // deep clone
Obj.arrays(object, key, value) // object[key] = [..., value], return object
Obj.methods(object)    // Список всех методов в прототипе объекта, исключая конструктор

Obj.get(object, path, split = '/')
Obj.set(object, path, value, split = '/')
Obj.paths(object, path = '')
Obj.leafs(object, path = '')
Obj.leafsPaths(object, path = '')
Obj.leafsUpdate(object, migration, path = '')
```
