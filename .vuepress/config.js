import {defineUserConfig} from 'vuepress';
import {defaultTheme} from '@vuepress/theme-default';
import book from '../book.json';
import {googleAnalyticsPlugin} from "@vuepress/plugin-google-analytics";
import {resolve} from "path";
import {registerComponentsPlugin} from "@vuepress/plugin-register-components";

export default defineUserConfig({
  lang: 'zh-CN',
  title: book.title,
  description: book.description,
  base: '/gitbook-design-patterns-in-jquery/',
  head: [],
  theme: defaultTheme({
    docsBranch: 'master',
    navbar: [
      {
        text: '山维空间',
        link: 'https://blog.meathill.com',
      },
      {
        text: '我的作品',
        link: 'https://github.com/meathill',
      },
      {
        text: 'Bilibili',
        link: 'https://space.bilibili.com/7409098',
      }
    ],
    repo: 'meathill/gitbook-design-patterns-in-jquery',
    sidebar: [
      {
        'text': '前言',
        'link': '/',
      },
      'oop-design-pattern.md',
      'factory-pattern.md',
      'adapter-pattern.md',
      'facade-pattern.md',
      'composite-pattern.md',
      'flyweight-pattern.md',
      'end.md',
      'APPENDIX.md',
    ],
  }),
  plugins: [
    googleAnalyticsPlugin({
      id: 'G-6X03SBJR88',
    }),
    registerComponentsPlugin({
      components: {
        Adsense: resolve(__dirname, './components/adsense.vue'),
      },
    }),
  ],
});
