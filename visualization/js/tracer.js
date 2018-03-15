class Tracer {
  constructor(base_json) {
    this.element = document.querySelector('.output')

    this.tree = new ExecutionTree

    fetch(base_json)
      .then(blob => blob.json())
      .then(data => this.tree.buildFromJson(data))
      .then(() => this.init(this.tree.root.childs))
  }

  init(nodes) {
    document.querySelectorAll('.output .row').forEach(node => node.remove())

    let div = document.querySelector(`.zero`)

    for(let i = nodes.length - 1 ; i >= 0; i--)
      this.draw(nodes[i], html => div.insertAdjacentHTML('afterend', html))
  }

  draw(node, appendFunction) {
    let html = `
      <div id='row-${node.id}' class='row'>
        <div class='call'>
            <div style='margin-left: ${(node.depth - 1) * 30}px;'>
              <h3></h3>
              <pre id='id-${node.id}' class='line-numbers call'
                data-line='${node.pathLineno}'
                data-src='http://localhost:5000${node.path}'>
              </pre>
            </div>
        </div>

        <div class='debug'>
          <div class='tab-buttons'>
            <button class='tablinks tablink-params'>Parameters</button>
            <button class='tablinks tablink-return'>Return</button>
            <button class='expand-node'>+</button>
            <button class='delete-node'>✖</button>
          </div>

          <div class='tabcontent tabcontent-params'>
            <pre class='language-ruby'><code></code></pre>
          </div>

          <div class='tabcontent tabcontent-return'>
            <pre class='language-ruby'><code></code></pre>
          </div>
        </div>
      </div>
    `

    appendFunction(html)

    let output = document.querySelector(`#row-${node.id}`)

    output.querySelector('h3').textContent = node.class
    output.querySelector('div.tabcontent-params code').textContent = node.params
    output.querySelector('div.tabcontent-return code').textContent = node.returnValue

    let paramsButton = output.querySelector('.tablink-params')
    let returnButton = output.querySelector('.tablink-return')
    let expandButton = output.querySelector('.expand-node')
    let deleteButton = output.querySelector('.delete-node')

    paramsButton.onclick = () => { this.openDebug(paramsButton, '.tabcontent-params', node.id) }
    returnButton.onclick = () => { this.openDebug(returnButton, '.tabcontent-return', node.id) }
    expandButton.onclick = () => { this.expandNode(node.id) }
    deleteButton.onclick = () => { this.deleteNode(node.id) }

    let preCall = output.querySelector(`#id-${node.id}`)
    let preDebugs = output.querySelectorAll('div.tabcontent > pre')

    Prism.fileHighlight(preCall)
      .then(() => preCall.querySelector('.line-highlight').scrollIntoView())

    preDebugs.forEach(pre => Prism.highlightElement(pre))
  }

  openDebug(button, className, nodeId) {
    let div = document.querySelector(`#row-${nodeId}`)

    let tabcontent = div.getElementsByClassName("tabcontent")
    for (let i = 0; i < tabcontent.length; i++)
      tabcontent[i].style.display = "none"

    let tablinks = div.getElementsByClassName("tablinks")
    for (let i = 0; i < tablinks.length; i++)
      tablinks[i].className = tablinks[i].className.replace(" active", "")

    div.querySelector(className).style.display = "block"

    button.className += " active"
  }

  expandNode(nodeId) {
    let node = this.tree.findNode(nodeId)
    let nodeDiv = document.querySelector(`#row-${nodeId}`)

    for(let i = node.childs.length - 1 ; i >= 0; i--)
      this.draw(node.childs[i], html => nodeDiv.insertAdjacentHTML('afterend', html))
  }

  deleteNode(nodeId) {
    document.querySelector(`#row-${nodeId}`).remove()
  }
}

let base_url = 'http://localhost:5000/Users/gabriel/Workspace/project/tracer/trace.json'
let tracer = new Tracer(base_url)
