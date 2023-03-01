import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import getTimeStamp from './utils/get-time-stamp';
dayjs.extend(objectSupport);

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

interface SetItemOptions {
  maxAge?: number | Omit<TimeObj, 'y' | 'M'>; // 从当前时间往后多长时间过期
  expired?: number | string | TimeObj; // 过期的准确时间点，优先级比maxAge高
}

const format = 'YYYY/MM/DD HH:mm:ss';

class LocalExpiredStorage {
  private prefix = 'local-expired-'; // 用于跟没有过期时间的key进行区分

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
    if (typeof window?.localStorage !== 'object') {
      throw new Error('[local-expired-storage]: no localStorage in window');
    }
  }

  /**
   * 存储key，并设置过期时间
   * @param key
   * @param value
   * @param options 过期时间设置
   */
  setItem(key: string, value: any, options?: SetItemOptions) {
    const now = Date.now();
    let expired = now + 1000 * 60 * 60 * 3; // 默认过期时间为3个小时

    if (options?.expired) {
      expired = dayjs(options.expired).valueOf();
    } else if (options?.maxAge) {
      expired = now + getTimeStamp(options.maxAge);
    }

    localStorage.setItem(
      `${this.prefix}${key}`,
      JSON.stringify({
        value,
        start: dayjs().format(format),
        expired: dayjs(expired).format(format),
      }),
    );
  }

  /**
   * 获取key的数据，若数据存在且未过期，则正常返回，否则返回null
   */
  getItem(key: string): any {
    const result = localStorage.getItem(`${this.prefix}${key}`);
    if (!result) {
      // 若key本就不存在，直接返回null
      return result;
    }
    const { value, expired } = JSON.parse(result);
    if (Date.now() <= dayjs(expired).valueOf()) {
      // 还没过期，返回存储的值
      return value;
    }
    // 已过期，删除该key，然后返回null
    this.removeItem(key);
    return null;
  }

  /**
   * 删除数据
   */
  removeItem(key: string) {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  /**
   * 删除所有已过期的key
   * @returns {number} 返回删除的个数
   */
  clearAllExpired() {
    let num = 0;

    // 判断 key 是否过期，然后删除
    const delExpiredKey = (key: string, value: string | null) => {
      if (value) {
        // 若value有值，则判断是否过期
        const { expired } = JSON.parse(value);
        if (now > dayjs(expired).valueOf()) {
          // 已过期
          localStorage.removeItem(key);
          return 1;
        }
      } else {
        // 若 value 无值，则直接删除
        localStorage.removeItem(key);
        return 1;
      }
      return 0;
    };

    const { length } = window.localStorage;
    const now = Date.now();

    for (let i = 0; i < length; i++) {
      const key = window.localStorage.key(i);

      if (key?.startsWith(this.prefix)) {
        // 只处理我们自己的类创建的key
        const value = window.localStorage.getItem(key);
        num += delExpiredKey(key, value);
      }
    }
    return num;
  }
}
const localExpiredStorage = new LocalExpiredStorage();
export default localExpiredStorage;
