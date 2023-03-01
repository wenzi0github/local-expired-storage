# 基于 localStorage 的有过期时间的存储

## 获取

```shell
$ npm i @xiaowenzi/local-expired-storage
```

或

```shell
$ yarn add @xiaowenzi/local-expired-storage
```

## 存储数据

过期时间我们支持两种方式：

- expired: 固定的过期时间点，比如点击关闭按钮，当天不再展示，那过期时间就是今天晚上的 23:59:59，可以使用该属性；可以设置时间戳（单位毫秒）、格式化的时间字符串或者特定的 object 类型；
- maxAge: 从当前时间起，设置多长时间后过期；比如点击某个提示，3 天内不再展示，使用该属性就比较方便；可以设置时间戳（单位毫秒）或特定的 object 类型；

object 类型指的是：

```typescript
interface TimeObj {
  /**
   * 年份
   */
  y?: number;
  /**
   * 月份
   */
  M?: number;
  /**
   * 天
   */
  d?: number;
  /**
   * 小时
   */
  h?: number;
  /**
   * 分钟
   */
  m?: number;
  /**
   * 秒
   */
  s?: number;
}
```

注意，虽然两者都可以传入上面的数据，但含义是不一样的。在 maxAge 中配置，表示有 d 个天、h 个小时后过期。在 expired 中配置，表示的是到当时的日期时间，如{ y: 2024, M: 6, d: 12, h: 23 }，表示的是`2024年6月12日 23时`。

存储方式：

```javascript
import localExpiredStorage from '@xiaowenzi/local-expired-storage';

// 使用 maxAge 设置过期时间
localExpiredStorage.setItem('key', 'value', { maxAge: 5000 }); // 有效期为5000毫秒
localExpiredStorage.setItem('key', 'value', { maxAge: { h: 3, m: 20 } }); // 有效期为3小时20分钟

// 使用 expired 设置过期时间
localExpiredStorage.setItem('key', 'value', { expired: '2024/12/12 13:59:59' }); // 有效期截止到 2024/12/12 13:59:59
localExpiredStorage.setItem('key', 'value', { expired: Date.now() + 1000 * 60 * 60 * 12 }); // 有效期为 12 个小时，自己计算到期的时间戳
localExpiredStorage.setItem('key', 'value', { expired: { y: 2024, M: 12, d: 12, h: 14, m: 59 } }); // 有效期截止到 2024/12/12 14:59
```

## 获取数据

获取数据时就简单很多，若有数据且在有效内，则正常返回；否则返回 null。

```javascript
localExpiredStorage.getItem('key');
```

## 删除数据

删除该 key 的数据。

```javascript
localExpiredStorage.removeItem('key');
```

## 清理所有过期的 key

localStorage 中过期的数据，若不主动访问，是不会自动清除的。这里我们提供一个方法，可以清除所有过期的 key。

```javascript
localExpiredStorage.clearAllExpired();
```
