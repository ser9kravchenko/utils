// IMPORTANT!!!
// WORKS ONLY IF YOU HAVE IDENTICAL FILES STRUCTURE
// IMPORTANT!!!


const fs = require('fs');
const path = require('path');

const ignoredFolders = ['.git', '.idea', 'node_modules', 'dist', '.vscode', '.angular'];


function compareFolders(folder1, folder2) {
    const files1 = getFiles(folder1);
    const files2 = getFiles(folder2);

    files1.forEach((file, index) => {
        const file2 = files2[index];
        try {
            const content1 = fs.readFileSync(file, 'utf-8');
            const content2 = fs.readFileSync(file2, 'utf-8');
            
            if (content1 !== content2) {
                fs.writeFileSync(files2[index], content1, 'utf-8'); // REWRITE FILES IF NEEDED

                console.log('Content differs for file:', file, file2);
            }
        } catch(error) {
            console.log('ERROR', file, file2, error)
        }
    })
}

function getFiles(folder) {
    let files = [];

    const items = fs.readdirSync(folder);

    items.forEach(item => {
        const itemPath = path.join(folder, item);
        const stats = fs.statSync(itemPath);

        if(ignoredFolders.some((ignoredFolder) => itemPath.includes(ignoredFolder))) {
            return;
        }


        if (stats.isDirectory()) {
            files = files.concat(getFiles(itemPath));
        } else {
            files.push(itemPath);
        }
    });

    return files;
}

// Usage example
const folder1 = '/project_copy';
const folder2 = '/project_copy_2';

compareFolders(folder1, folder2);
