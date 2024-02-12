import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'


export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: './',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:9090/api',
                changeOrigin: true,
            },
            '/web_api': {
                target: "https://www.xiaohongshu.com",
                changeOrigin: true,
                secure: false,
                headers: {
                    'authority': 'www.xiaohongshu.com',
                    'Cookie': 'web_session=0400698d8bd50330c3457972d2374bc83a0431;  ',
                    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                    'content-type': 'application/json;charset=UTF-8',
                    'Accept': '*/*',
                    'Host': 'www.xiaohongshu.com',
                    'Connection': 'keep-alive'
                }
            }
        }
    }
})
