function help() {
    writeLine('Available commands')
    Object.keys(commands).forEach((commandName) => {
        let details = commands[commandName]
        writeLine('<b>'+commandName+'</b>: ' + details.message)
    })
}

function echo(...arguments) {
    if (!arguments.length) {
        writeLine('Usage: echo &lt;text&gt; &lt;more text&gt;')
    }
    writeLine(arguments.join(' '))
} 

function clear() {
    clearShell()
}

function pwd() {
    writeLine(getCurrentWorkingDirectory())    
}

function ls() {
    const files = getFilesAt(currentWorkingDirectory)
    files.forEach((file) => {
        if (file.directory) {
            writeLine('<b>'+file.name+'</b>')
        }
        else {
            writeLine(file.name)    
        }
    })
}

function cd(folderName) {
    if (!folderName) {
        writeLine('Usage: cd &lt;folderName&gt;')
        writeLine('(use folder name .. to go up)')
        return
    }

    if (folderName === '..') {
        currentWorkingDirectory.pop()
        return
    }
    let file = getFile(folderName)
    if (!file) {
        writeLine('Folder not found: ' + folderName)
        return
    }
    if (!file.directory) {
        writeLine('File is not a folder: ' + folderName)
        return
    }
    currentWorkingDirectory.push(folderName)
}

function cat(fileName) {
    if (!fileName) {
        writeLine('Usage: cat &lt;fileName&gt;')
        return
    }

    let file = getFile(fileName)
    if (!file) {
        writeLine('file not found: ' + fileName)
        return
    }
    if (file.directory) {
        writeLine('cannot use cat on a folder: ' + fileName)
        return
    }
    let lines = file.content.split('\n')
    lines.forEach(writeLine)
}

function exitShell() {
    window.history.back()
}

const commands = {
  help: {
    message: "lists registered commands",
    func: help
  },  
  echo: {
    message: "prints out the arguments you pass in",
    func: echo
  },  
  clear: {
    message: "clears all output from this window",
    func: clear
  },  
  pwd: {
    message: "prints out the current working directory you are in",
    func: pwd
  },
  ls: {
    message: "lists files and folders in your current directory, folders are <b>bold</b>",
    func: ls
  },
  cd: {
    message: "changes your current directory to the folder you name (use .. to go up)",
    func: cd
  },
  cat: {
    message: "prints the contents of a file",
    func: cat
  },
  exit: {
    message: "exit the shell and return to where you came from",
    func: exitShell
  }
} 

