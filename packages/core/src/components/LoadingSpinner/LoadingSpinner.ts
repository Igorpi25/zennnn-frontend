import { h, FunctionalComponent } from 'vue'

const DEFAULT_SIZE = 18
const RAYS_COUNT = 12
const SPEED = 1.2

const LoadingSpinner: FunctionalComponent<{
  size: number | string,
}> = (props) => {
  const size = Number(props.size || DEFAULT_SIZE)
  const radius = size * 0.35
  const width = size * 0.08
  const height = size * 0.22
  const halfSize = Math.round(size / 2)

  const childStyle = {
    transformOrigin: `${halfSize}px ${halfSize}px`,
    animation: `loading-spinner ${SPEED}s linear infinite`,
  }

  const children = Array(RAYS_COUNT).fill(null).map((_, i) => {
    return h('div', {
      style: {
        ...childStyle,
        transform: `rotate(${i * 30}deg)`,
        animationDelay: `${SPEED * -1 * (RAYS_COUNT - 1 - i) / RAYS_COUNT}s`,
      },
    }, [h('div', {
      class: 'loading-spinner__ray',
      style: {
        borderRadius: '20%',
        top: `${Math.round(halfSize - radius - height / 2)}px`,
        left: `${Math.round(halfSize - width / 2)}px`,
        width: `${Math.round(width)}px`,
        height: `${Math.round(height)}px`,
      },
    })])
  })

  return h(
    'div',
    { class: 'loading-spinner' },
    [
      h('div', {
        class: 'loading-spinner__wrapper',
        style: { width: `${size}px`, height: `${size}px` },
      }, children),
    ],
  )
}

export default LoadingSpinner
