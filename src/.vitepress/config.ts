import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Walshy',
  description: 'Your gateway to Development, Gaming, AI, and Tech',
  base: '/walshyydev.github.io/',
  appearance: 'dark',
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Development',
        items: [
          { text: 'Coding Guides', link: '/dev/guides/' },
          { text: 'Projects', link: '/dev/projects/' },
          { text: 'Resources', link: '/dev/resources/' }
        ]
      },
      {
        text: 'Gaming',
        items: [
          { text: 'Game Reviews', link: '/gaming/reviews/' },
          { text: 'Tutorials', link: '/gaming/tutorials/' },
          { text: 'Mod Guides', link: '/gaming/mods/' }
        ]
      },
      {
        text: 'AI & Tech',
        items: [
          { text: 'AI Guides', link: '/tech/ai/' },
          { text: 'Tech News', link: '/tech/news/' },
          { text: 'Tools', link: '/tech/tools/' }
        ]
      },
      { text: 'Blog', link: '/blog/' }
    ],

    sidebar: {
      '/dev/': [
        {
          text: 'Development',
          items: [
            { text: 'Getting Started', link: '/dev/guides/' },
            { text: 'Web Development', link: '/dev/guides/web' },
            { text: 'Mobile Development', link: '/dev/guides/mobile' },
            { text: 'Game Development', link: '/dev/guides/gamedev' }
          ]
        }
      ],
      '/gaming/': [
        {
          text: 'Gaming',
          items: [
            { text: 'Latest Reviews', link: '/gaming/reviews/' },
            { text: 'Gaming Guides', link: '/gaming/tutorials/' },
            { text: 'Modding', link: '/gaming/mods/' }
          ]
        }
      ],
      '/tech/': [
        {
          text: 'AI & Tech',
          items: [
            { text: 'AI Basics', link: '/tech/ai/' },
            { text: 'Latest in Tech', link: '/tech/news/' },
            { text: 'Recommended Tools', link: '/tech/tools/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/walshy' },
      { icon: 'discord', link: 'https://discord.gg/walshy' },
      { icon: 'twitter', link: 'https://twitter.com/walshy' }
    ],

    footer: {
      message: 'Built with ❤️ by Walshy',
      copyright: 'Copyright © 2024 Walshy'
    }
  }
})
