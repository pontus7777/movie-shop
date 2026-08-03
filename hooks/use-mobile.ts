import * as React from 'react'

const MOBILE_BREAKPOINT = 768

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false // default assumption during SSR — no window available
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// import * as React from 'react'

// const MOBILE_BREAKPOINT = 768

// //Used for ui a boolean showing if its a mobile or desktop device for conditional rendering.
// export function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState(false)

//   React.useEffect(() => {
//     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

//     const onChange = () => {
//       setIsMobile(mql.matches)
//     }

//     // set the real value once mounted (client-only)
//     setIsMobile(mql.matches)

//     mql.addEventListener('change', onChange)

//     return () => {
//       mql.removeEventListener('change', onChange)
//     }
//   }, [])

//   return isMobile
// }

//===================== OLD/FIRST ONE IN PROJECT ========================
// Used for ui a boolean showing if its a mobile or desktop device for conditional rendering.
// export function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState(() => {
//     if (typeof window === 'undefined') return false

//     return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
//   })

//   React.useEffect(() => {
//     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

//     const onChange = () => {
//       setIsMobile(mql.matches)
//     }

//     mql.addEventListener('change', onChange)

//     return () => {
//       mql.removeEventListener('change', onChange)
//     }
//   }, [])

//   return isMobile
// }
