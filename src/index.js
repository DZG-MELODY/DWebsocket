const propOnConnect = Symbol('_onConnect');
const propOnDisConnect = Symbol('_onDisConnect');
const propOnReceive = Symbol('_onReceive');
const propOnError = Symbol('_onError');


/**
 * WebSocket类
 */
export default class WS {
  constructor(options) {
    // url路径
    this.url = options.url || '';
    // 用户token
    this.token = options.token || '';
    // socket 链接 url
    this.socketUrl = '';
    // socket 初始化状态 0 未初始化 1 初始化正常 -1 初始化异常
    this.initStatus = 0;
    // 重连时钟间隔
    this.reconnectInterval = options.reconnectInterval || 5000;
    // socket对象
    this.webSocket = null;
    // 重连时钟
    this.reconnectTimer = null;
    // 连接成功事件响应
    this.onConnect = typeof options.onConnect === 'function' ? options.onConnect : null;
    // 断开事件响应
    this.onDisConnect = typeof options.onConnect === 'function' ? options.onConnect : null;
    // 关闭事件响应
    this.onClose = typeof options.onClose === 'function' ? options.onClose : null;
    // 接收消息事件响应
    this.onReceive = typeof options.onReceive === 'function' ? options.onReceive : null;
    // 错误事件响应
    this.onError = typeof options.onError === 'function' ? options.onError : null;
    // 私有响应事件
    this[propOnConnect] = this.privateOnConnect.bind(this);
    this[propOnDisConnect] = this.privateOnDisconnect.bind(this);
    this[propOnReceive] = this.privateOnReceive.bind(this);
    this[propOnError] = this.privateOnError.bind(this);
  }

  /**
   * socket 进行连接
   * @param {Boolean} isBindEvent 是否绑定事件
   */
  connect(isBindEvent = true) {
    if (!this.url) {
      this.privateOnError({ code: -1, msg: 'url can not be empty' });
      return false;
    }
    if (!this.token) {
      this.privateOnError({ code: -1, msg: 'token can not be empty' });
      return false;
    }

    this.socketUrl = `${this.url}?token=${this.token}`;

    try {
      // 初始化socket对象
      this.webSocket = new WebSocket(this.socketUrl);
      if (isBindEvent) {
      // 监听连接事件
        this.webSocket.addEventListener('open', this[propOnConnect]);
        // 监听断开事件
        this.webSocket.addEventListener('close', this[propOnDisConnect]);
        // 监听消息接收事件
        this.webSocket.addEventListener('message', this[propOnReceive]);
        // 监听错误事件
        this.webSocket.addEventListener('error', this[propOnError]);
      }
    } catch (err) {
      this.initStatus = -1;
      this.privateOnError({ code: -1, msg: err.message });
      return false;
    }

    return true;
  }

  /**
   * socket 当前状态
   */
  status() {
    return this.webSocket && this.webSocket.readyState || -1;
  }

  /**
   * 发送消息
   * @param {Object} params
   */
  send(params) {
    if (this.status() === 1) this.webSocket.send(JSON.stringify(params));
  }

  /**
   * 关闭连接
   */
  close() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.webSocket.removeEventListener('open', this[propOnConnect]);
    this.webSocket.removeEventListener('close', this[propOnDisConnect]);
    this.webSocket.removeEventListener('message', this[propOnReceive]);
    this.webSocket.removeEventListener('error', this[propOnError]);
    this.webSocket.close();
    this.webSocket = null;
  }

  /**
   * 重连
   */
  reconnect() {
    const vm = this;
    this.reconnectTimer = setInterval(() => {
      if (vm.initStatus === 1) {
        clearInterval(vm.reconnectTimer);
        vm.reconnectTimer = null;
        return;
      }
      vm.connect(false);
    }, this.reconnectInterval);
  }

  privateOnConnect(evt) {
    this.initStatus = 1;
    console.log(`websocket init success [${this.url}]`);
    if (this.onConnect) this.onConnect(evt);
  }

  privateOnDisconnect() {
    if (this.initStatus === -1 || this.initStatus === 0) {
      this.reconnect();
      console.warn('websocket init fail reconnect...');
    } else {
      this.reconnect();
      console.warn('websocket exception reconnect...');
    }
  }

  privateOnReceive(evt) {
    try {
      const data = JSON.parse(evt.data);
      if (this.onReceive) this.onReceive(data);
    } catch (err) {
      console.warn(err.message);
      if (this.onReceive) this.onReceive(evt.data);
    }
  }

  privateOnError(error, evt) {
    console.error(error.msg, error);
    if (this.onError) this.onError(error, evt);
  }
}
