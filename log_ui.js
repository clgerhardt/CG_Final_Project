function initUI() {
    // var el = document.createElement('div')
    // el.className = 'instruct'
    // el.textContent = 'S - shoot puck | R - reset puck | L/R arrows - rotate camera'
    // document.body.appendChild(el)

    el = document.createElement('div')
    el.id = 'log'
    el.className = 'log'
    document.body.appendChild(el)
}

function log(s) {
    console.log(s)
    var el = document.getElementById('log')
    s = el.innerHTML + s + '<br/>'
    el.innerHTML = s

}
