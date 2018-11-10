
// 网关地址
const baseUrl = 'http://127.0.0.1:9999';

// 转发配置
module.exports = {
    proxyList: {
        '/auth': {
            target: baseUrl,
            changeOrigin: true,
            pathRewrite: {
                '^/auth': '/auth'
            }
        },
        '/admin': {
            target: baseUrl,
            changeOrigin: true,
            pathRewrite: {
                '^/admin': '/admin'
            }
        },
      '/exam': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/exam': '/exam'
        }
      }
    }
}
