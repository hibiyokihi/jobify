import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100/api',
        // フロントからのリクエストのうち、/apiが含まれるものは全てtargetのpathにダイレクトされる。
        changeOrigin: true,
        // originをviteのlocalhost:5173から5100に変更する
        rewrite: (path) => path.replace(/^\/api/, ''),
        // pathに'api/'が重複するから取り除いている。（regex）→ targetからapiを除く方法ではダメなのか？
      },
    },
    // フロントサーバーがlocalhost:5173, バックサーバーがlocalhost:5100で異なると、cookieの送受信をする際にエラーが起きる。
    // proxy(代理の意味)は、フロント側がバックエンドと同じサーバーを使ってリクエストしてるように偽装するもの。
    // 本番環境では、deployすればフロントもバックも同じサーバーに入るため、proxyを使う必要は無い。devフェーズでのみ必要。
  },
})
