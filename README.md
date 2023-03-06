# a new local expired storage based on localStorage

This package supports expired time storage, when time expired, we can get then null data, and clear it.

[中文介绍](./README-zh.md)

blog: [how to implement a local expired storage](https://www.xiabingbao.com/post/fe/local-expired-storage-rqstpj.html)

## Install

```shell
$ npm i @xiaowenzi/local-expired-storage
```

or

```shell
$ yarn add @xiaowenzi/local-expired-storage
```

## Introduce

We support two methods of expiration time:

- expired: it's a fixed expiration point，for example, it wont show in today when be clicked, the expired time is 23:59:59 in today, we use this `expired` more convenient; `expired` support timestamp(ms), formated string and then designated object type;
- maxAge: there has how long time to be expired from now; `maxAge` support a timestamp(ms) and then designated object type;

then designated object type means:

```typescript
interface TimeObj {
  /**
   * year
   */
  y?: number;
  /**
   * month
   */
  M?: number;
  /**
   * date
   */
  d?: number;
  /**
   * hour
   */
  h?: number;
  /**
   * minute
   */
  m?: number;
  /**
   * second
   */
  s?: number;
}
```

Notice: it means the difference in expired and maxAge, although it looks the same. in `maxAge`, the `d` means storage will be expired after the dth days. but in `expired`, it means the future date or time, like { y: 2024, M: 6, d: 12, h: 23 } means `2024/6/12 23:00`.

How to set：

```javascript
import localExpiredStorage from '@xiaowenzi/local-expired-storage';

// set valid time by maxAge
localExpiredStorage.setItem('key', 'value', { maxAge: 5000 }); // valid time is 5000ms
localExpiredStorage.setItem('key', 'value', { maxAge: { h: 3, m: 20 } }); // valid time is 3hour and 20minute

// set valid time by expired
localExpiredStorage.setItem('key', 'value', { expired: '2024/12/12 13:59:59' }); // valid time to 2024/12/12 13:59:59
localExpiredStorage.setItem('key', 'value', { expired: Date.now() + 1000 * 60 * 60 * 12 }); // valid time has 12hour from how
localExpiredStorage.setItem('key', 'value', { expired: { y: 2024, M: 12, d: 12, h: 14, m: 59 } }); // valid time to 2024/12/12 14:59
```

## get data

Get data from `getItem`.

1. get correct data when localStorage has key, and not expired;
2. get null when no key or key has been expired;

```javascript
localExpiredStorage.getItem('key');
```

## delete data

Delete then key.

```javascript
localExpiredStorage.removeItem('key');
```

## clear all expired keys

Clear all expired keys.

`localStorage` cant clear expired keys automatically, then we support a function to clear.

```javascript
localExpiredStorage.clearAllExpired();
```
