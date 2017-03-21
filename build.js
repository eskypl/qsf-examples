const glob = require('glob');
const pug = require('pug');
const path = require('path');
const fs = require('fs-extra');
const sass = require('node-sass');

const OUTPUT_DIR = path.resolve(__dirname, 'docs');
const PAGES_DIR_NAME = 'pages';
const EXAMPLES_DIR_NAME = 'examples';
const BASE = 'http://localhost:3000';
// const BASE = 'https://eskypl.github.io/qsf-examples/';
const PATH_FILTER = new RegExp(`^(${PAGES_DIR_NAME}|${EXAMPLES_DIR_NAME})/?`);

const cleanPath = file => file.replace(PATH_FILTER, '');
const dirname = file => path.dirname(cleanPath(file));
const title = value => {
    const clean = value.replace(/\W+/g, ' ').toLowerCase().trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const collect = options => new Promise((resolve, reject) => {
    glob(`${options.match}${options.ext || ''}`, (error, files) => {
        if (error) {
            return reject(error);
        }

        resolve(files.map(file => {

            const filePath = dirname(file);
            const filePathAbs = path.resolve(OUTPUT_DIR, filePath);
            const fileName = path.basename(file);
            const fileNameWithoutExt = path.basename(file, options.ext);
            const ext = options.outExt || options.ext || '';

            return {
                file,
                src: path.resolve(__dirname, file),
                path: filePath,
                pathAbs: filePathAbs,
                name: fileName,
                nameWithoutExt: fileNameWithoutExt,
                dest: path.resolve(filePathAbs, fileNameWithoutExt) + ext,
                url: [BASE, filePath, fileNameWithoutExt].filter(item => item !== '.').join('/') + ext,
                title: title(fileNameWithoutExt),
                categoryTitle: title(filePath)
            }
        }));
    });
});

const images = () => collect({
    match: 'assets/images/**/*'
}).then(files => {
    files.forEach(file => {
        fs.copy(file.src, file.dest);
        console.log(`${file.src} to ${file.dest} done.`);
    });
});

const styles = () => collect({
    match: 'assets/**/*',
    ext: '.scss',
    outExt: '.css'
}).then(files => {
    return Promise.all(files.map(file => new Promise((resolve, reject) => {
        sass.render({
            file: file.src
        }, (error, result) => {
            if (error) {
                return reject(error);
            }

            fs.outputFileSync(file.dest, result.css);
            console.log(`${file.src} to ${file.dest} done.`);
            resolve();
        })
    })));
});

const scripts = () => collect({
    match: EXAMPLES_DIR_NAME + '/**/*.js'
}).then(files => {
    files.forEach(file => {
        fs.copy(file.src, file.dest);
        console.log(`${file.src} to ${file.dest} done.`);
    });
});

const templates = () => collect({
    match: PAGES_DIR_NAME + '/**/*',
    ext: '.pug',
    outExt: '.html'
}).then(files => {
    const pages = files.reduce((pages, file) => {
        if (file.path !== '.') {
            pages[file.path] = pages[file.path] || [];
            pages[file.path].push(file);
        }

        return pages;
    }, {});

    const menu = Object.keys(pages)
        .map(page => pages[page].filter(item => item.nameWithoutExt === 'index'))
        .reduce((menu, page) => menu.concat(page), []);

    files.map(file => {
        return {
            file,
            html: pug.renderFile(file.src, {
                filename: file.src,
                basedir: __dirname,
                page: {
                    base: BASE,
                    name: file.nameWithoutExt,
                    dir: file.path,
                    menu,
                    pages: pages[file.path] || []
                }
            })
        }
    }).forEach(template => {
        fs.outputFileSync(template.file.dest, template.html);
        console.log(`${template.file.src} to ${template.file.dest} done.`);
    })
});

Promise.all([
    images(),
    styles(),
    scripts(),
    templates()
]).then(() => {
    console.log('All done.');
}).catch(error => {
    console.error(error);
    process.exit(1);
});