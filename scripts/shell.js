let cursor = '<span id="cursor">&nbsp;</span>'
let inputLine = ''

function createPrompt() {
    return getCurrentWorkingDirectory() + '<b>&gt;</b>&nbsp;'
}

function writeLine(htmlText) {
    let body = document.getElementsByTagName('body')[0]
    let newLine = document.createElement('div')
    newLine.innerHTML = htmlText
    let promptLine = document.getElementById('inputLine')
    body.insertBefore(newLine, promptLine)
}

function updateInputLine() {
    const promptHTML = createPrompt() + inputLine + cursor
    const inputLineDiv = document.getElementById('inputLine')
    inputLineDiv.innerHTML = promptHTML 
    inputLineDiv.scrollIntoView()
}

function clearInputLine() {
    inputLine = ''
    updateInputLine()
}

function backspace() {
    if (inputLine.length > 0) {
        inputLine = inputLine.slice(0, inputLine.length-1)
    }
}

function appendKey(key) {
    if (key.length === 1) {
        inputLine += key
    }
    if ((key === 'Backspace') || (key === 'Delete')) {
        backspace()
    }
    updateInputLine()
}

function executeCommand(commandLine) {
    if (!commandLine) return
    
    const commandLineParts = commandLine.split(' ')
    const commandName = commandLineParts[0]
    const arguments = commandLineParts.slice(1, commandLineParts.length)
    let commandDetail = commands[commandName]
    if (!commandDetail) {
        writeLine('Command not found: <b>' + commandName +'</b>')
        writeLine('Use the command <b>help</b> to get a list of commands')
        return
    }
    commandDetail.func(...arguments)
}

function keydown(event) {
    event.preventDefault()
    if (event.key === 'Enter') {
        let commandLine = inputLine
        writeLine( createPrompt() + commandLine)
        executeCommand(inputLine)
        clearInputLine()        
    }
    else appendKey(event.key)
}

function clearShell() {
    const body = document.getElementsByTagName('body')[0]
    const inputLineDiv = document.getElementById('inputLine')
    body.replaceChildren(inputLineDiv)
}
// install event handler for keypress
document.getElementsByTagName('body')[0].addEventListener('keydown', keydown)

// blink the cursor
setInterval(() => {
    const cursor = document.getElementById('cursor')
    cursor?.classList.toggle("blink-on")
}, 500)

writeLine("Welcome to tsh.")
writeLine("Use the command <b>help</b> to get a list of commands")
updateInputLine()