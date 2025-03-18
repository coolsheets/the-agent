let currentWorkingDirectory = []

let files = [
    { name: "summary", content: "Some cool summary"},
    { name: "skills", directory: true, files: [
        { name: "programming-languages", content: "language content" },
        { name: "front-end-frameworks", content: "front end content" },
        { name: "hardware-operating-systems", content: "hardware and os content" },
    ]}
]

function getCurrentWorkingDirectory() {
    return '/' + currentWorkingDirectory.join('/')
}

function getFilesAt(filePath) {
    let directory = files;
    filePath.forEach(subdirName => {
        subDir = directory.find((file) => file.name===subdirName)
        if (subDir) directory = subDir.files
    })
    return directory;
}

function getFile(fileName) {
    let files = getFilesAt(currentWorkingDirectory)
    return files.find(file => file.name === fileName)
}