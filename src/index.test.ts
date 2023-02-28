import clientStorage from './index';

describe('test utils clientStorage', () => {
  const localDateNow = Date.now;

  beforeEach(() => {
    class LocalStorageMock {
      public length = 0;
      private store: any = {};

      public clear() {
        this.store = {};
      }
      public getItem(key: string) {
        return this.store[key] || null;
      }
      public setItem(key: string, value: string | number) {
        this.store[key] = String(value);
        this.length = Object.keys(this.store).length;
      }
      public removeItem(key: string) {
        delete this.store[key];
        this.length = Object.keys(this.store).length;
      }
      public key(num: number) {
        return Object.keys(this.store)[num];
      }
    }
    // global.localStorage = new LocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock(), writable: true });
  });
  afterEach(() => {
    Object.defineProperty(window, 'localStorage', { value: null, writable: true });
    Date.now = localDateNow;
  });
  test('should get value when save item', () => {
    clientStorage.setItem('key', 'value');
    expect(clientStorage.getItem('key')).toBe('value');
  });
  test('should get null when key is expired', () => {
    // 过期了
    const now = Date.now();
    clientStorage.setItem('key', 'value', { maxAge: 5000 }); // 存储5s
    Date.now = jest.fn(() => now + 1000 * 10); // 将时间定位到10s后
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should get null when key not existed', () => {
    expect(clientStorage.getItem('key')).toBeNull();
  });

  test('should get null when value cant JSON.parse', () => {
    window.localStorage.setItem('ghh5.gh_h5_page.key', 'value');
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should get null when exec cleanExceed()', () => {
    const now = Date.now();
    clientStorage.setItem('key', 'value', { maxAge: 5000 }); // 存储5s
    Date.now = jest.fn(() => now + 1000 * 10); // 将时间定位到10s后
    clientStorage.clearAllExpired();
    expect(localStorage.getItem('ghh5.gh_h5_page.key')).toBeNull();
  });
  test('should get null when has been removed', () => {
    clientStorage.setItem('key', 'value');
    clientStorage.removeItem('key');
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should not clear when key not exceed', () => {
    const now = Date.now();
    clientStorage.setItem('key', 'value', { maxAge: 15000 }); // 存储5s
    Date.now = jest.fn(() => now + 1000 * 2); // 将时间定位到2s后

    clientStorage.clearAllExpired();
    expect(clientStorage.getItem('key')).toBe('value');
  });
  test('should only clear key startsWith prefix when exec cleanExceed()', () => {
    const now = Date.now();
    window.localStorage.setItem('ss', 'ss');
    clientStorage.setItem('key', 'value', { maxAge: 5000 }); // 存储5s
    Date.now = jest.fn(() => now + 1000 * 10); // 将时间定位到10s后
    clientStorage.clearAllExpired();
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should clear key when key not value', () => {
    const now = Date.now();
    window.localStorage.setItem('ghh5.gh_h5_page.key', '');
    Date.now = jest.fn(() => now + 1000 * 60 * 60 * 24);
    clientStorage.clearAllExpired();
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should clear key error when key cant JSON.parse', () => {
    const now = Date.now();
    window.localStorage.setItem('ghh5.gh_h5_page.key', 'value');
    Date.now = jest.fn(() => now + 1000 * 60 * 60 * 24);
    clientStorage.clearAllExpired();
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should get value when set options.expired but not expired', () => {
    clientStorage.setItem('key', 'value', { expired: Date.now() + 5000 });
    expect(clientStorage.getItem('key')).toBe('value');
  });
  test('should get value when set options.expired but not expired', () => {
    clientStorage.setItem('key', 'value', { expired: Date.now() - 5000 });
    expect(clientStorage.getItem('key')).toBeNull();
  });
  test('should get value when set maxAge as object type', () => {
    clientStorage.setItem('key', 'value', { maxAge: { h: 20 } }); // 设置20小时后过期
    expect(clientStorage.getItem('key')).toBe('value');
  });
  test('should get value when set options.expired as string type', () => {
    clientStorage.setItem('key', 'value', { expired: '2099/12:12' });
    expect(clientStorage.getItem('key')).toBe('value');
  });
  test('should get value when set options.expired as object type', () => {
    clientStorage.setItem('key', 'value', { expired: { y: 2099 } });
    expect(clientStorage.getItem('key')).toBe('value');
  });
});
