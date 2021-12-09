# 3D Graphic With Three.js and JavaScript

*Get started with Three.js to render 3d Web Experience*

![Image Title](https://github.com/tuilatung/CS105-3D-Graphic/blob/master/Screenshot%202021-12-09%20093839.png)

[Youtube Setup Video](https://youtu.be/fNnzLiZmFCg)

[Demo](https://tuilatung.github.io/CS105-Deployment/)


## Installation

Install NodeJS (required)
[Download and install NodeJS](https://nodejs.org/en/download/)

Install Yarn (required)
```
npm install --global yarn
```

Clone project and move on to the project folder
```
git clone https://github.com/tuilatung/CS105-3D-Graphic.git
```

```
cd CS105-3D-Graphic
```

*Note:* Make sure you are in CS105-3D-Graphic folder!

Install dependencies (only for first time) :

```
yarn
```

Compile the code for development and start a local server:

```
yarn dev
```
If you face to ERR_OSSL_EVP_UNSUPPORTED, run this script and re-run `yarn dev`. If not, please SKIP this step!
```
export NODE_OPTIONS=--openssl-legacy-provider
```
Local Server will open on:

```
http://localhost:8080/
```

Create the build (optional):

```
yarn build
```

## Credits

- [Webpack THREE.js Template](https://github.com/brunosimon/webpack-three-js-template)

## License
[MIT](LICENSE)

Made with :blue_heart: by [Mohnish Landge](http://mohnishlandge.me)
