import * as React from 'react'

const MOBILE_BREAKPOINT = 768

//Used for ui a boolean showing if its a mobile or desktop device for conditional rendering.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // set the real value once mounted (client-only)
    setIsMobile(mql.matches)

    mql.addEventListener('change', onChange)

    return () => {
      mql.removeEventListener('change', onChange)
    }
  }, [])

  return isMobile
}

//===================== OLD/FIRST ONE IN PROJECT ========================
// // Used for ui a boolean showing if its a mobile or desktop device for conditional rendering.
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
