# Wallet Visual Customization

[![](https://avatars3.githubusercontent.com/u/46114007?s=200&v=4)](https://psfoundation.cash/)

# Setup

 > We can establish global CSS variables that would allow us to use
 > those variables in the different components, to make them
 > customizable and dynamic

### Example:
```
    const myColor = 'black'
    const footerH = '500px'
    const styles = document.documentElement.style
    styles.setProperty('--main-color', myColor)
    styles.setProperty('--footer-height', footerH)
```
This way we can create dynamic variables to change different CSS
properties, to see the use of the global variables we can check
the the [/components/app-colors.css](https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet/blob/master/src/components/app-colors.css)

### Example:
```
    const body = document.getElementsByTagName('body')
    body[0].style.fontFamily = 'Courier New'
    body[0].style.fontSize = '25px'
```
This way we could change some styles of everything covered by the `<body>`
tag, it is basically the whole app.

### Example:
The following example is to customize the color of the warning message:
```
       # app-color.css
       :root {
         --warning-alert-bg-color:'red';
         --warning-alert-txt-color:'white';

        }

        # layout.css

        .version-status div{
           color: var(--warning-alert-txt-color);
           background-color: var(--warning-alert-bg-color);
        }

        # JS
         // We change the values of the CSS variables
         const styles = document.documentElement.style
         styles.setProperty('--warning-alert-bg-color', 'white')
         styles.setProperty('--warning-alert-txt-color', 'black')
```
