# 3D Graphic With Three.js and JavaScript

*Get started with Three.js to render 3d Web Experience*


[Youtube Setup Video] ==> https://youtu.be/fNnzLiZmFCg

[Demo] ==> https://tuilatung.github.io/CS105-Deployment/


## Installation

Step 1: Install NodeJS (required)

    Download and install NodeJS ==> https://nodejs.org/en/download/

Step 2: Install Yarn (required)
    
    npm install --global yarn

Step 3: Open (git bash) terminal, clone project and move on to the project folder

    git clone https://github.com/tuilatung/CS105-3D-Graphic.git

    cd CS105-3D-Graphic

Step 4: Install dependencies (only for first time) :

    yarn


Step 5: Compile the code for development and start a local server:

    yarn dev

    If you face to ERR_OSSL_EVP_UNSUPPORTED, run this script and re-run `yarn dev`. If not, please SKIP this step!

        export NODE_OPTIONS=--openssl-legacy-provider

Step 6: Local Server will open on:

    http://localhost:8080/


Step 7: Create the build (optional):

    yarn build


## MIT License

Copyright (c) 2021 Tung Huynh Thien

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
