import { atom } from 'recoil'

export const modalState = atom({
  key: 'modalState',
  default: false,
})

export const postIdState = atom({
  key: 'postId',
  default: '',
})

export const showMenuState = atom({
  key: 'showMenu',
  default: false,
})

export const emojiState = atom({
  key: 'showEmoji',
  default: false,
})
