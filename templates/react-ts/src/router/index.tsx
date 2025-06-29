import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    async lazy() {
      const { default: Component } = await import('@/views/home')
      return { Component }
    },
  },
])
