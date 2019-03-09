import fetch from '@/config/fetch'

export const cityGuess = () => fetch('/v1/cities', {
  type: 'guess'
})

export const hotcity = () => fetch('/v1/cities', {
  type: 'hot'
})

export const groupcity = () => fetch('/v1/cities', {
  type: 'group'
})
