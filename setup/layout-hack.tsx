// ref: https://docs.fontawesome.com/web/use-with/react/use-with
/*

Since Next.js manages CSS differently than most web projects if you just follow the plain vanilla documentation to integrate react-fontawesome into your project you’ll see huge icons because they are missing the accompanying CSS that makes them behave.

To fix this, we update our (top-level) layout.tsx 
*/

// HACK: Make FontAwesome to Behave
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false