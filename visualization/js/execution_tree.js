class ExecutionTree {
  constructor() {
    this.root = new ExecutionTreeNode({})
  }

  leafs() {
    return this.leafsHelper(this.root)
  }

  leafsHelper(node) {
    if (node.childs.length == 0)
      return node

    return node.childs.flatMap(child => this.leafsHelper(child))
  }

  findNode(id) {
    return this.findHelper(this.root.childs, id)
  }

  findHelper(nodes, id) {
    for(let i = 0; i < nodes.length; i++) {
      if (nodes[i].id == id)
        return nodes[i]
      else if (nodes[i].isInChildRange(id)) {
        return this.findHelper(nodes[i].childs, id)
      }
    }

    return undefined
  }

  buildFromJson(base_json) {
    let stack = []
    let last_depth = 1

    stack.push(this.root)

    for(let i = 0; i < base_json.length; i++) {
      if (base_json[i].depth == last_depth) {
        if (base_json[i].event == 'return') {
          stack[stack.length - 1].lastChild().mergeReturn(base_json[i])
        } else {
          stack[stack.length - 1].addChildFromJson(base_json[i])
        }
      } else if (base_json[i].depth > last_depth) {
        let lastChild = stack[stack.length - 1].lastChild()

        stack.push(lastChild)

        lastChild.firstChildId = document.nextId

        stack[stack.length - 1].addChildFromJson(base_json[i])

        last_depth = base_json[i].depth
      } else if (base_json[i].depth < last_depth) {
        stack[stack.length - 1].lastChildId = document.nextId - 1

        stack.pop()

        if (base_json[i].event == 'return') {
          stack[stack.length - 1].lastChild().mergeReturn(base_json[i])
        } else {
          stack[stack.length - 1].addChildFromJson(base_json[i])
        }

        last_depth = base_json[i].depth
      }
    }
  }
}

document.nextId = 0

class ExecutionTreeNode {
  constructor(trace) {
    this.childs = []

    this.id = document.nextId++
    this.event = trace.event
    this.class = trace.class
    this.depth = trace.depth
    this.method = trace.method
    this.path = trace.path
    this.pathLineno = trace.path_lineno

    switch (trace.event) {
      case 'call':
        this.caller = trace.caller
        this.caller_lineno = trace.caller_lineno
        this.params = trace.params
        break
      case 'return':
        this.return = trace.return
        break
    }
  }

  addChildFromJson(trace) {
    let node = new ExecutionTreeNode(trace)
    this.childs.push(node)
    return node
  }

  mergeReturn(trace) {
    this.returnLineno = trace.path_lineno
    this.returnValue = trace.return
  }

  lastChild() {
    return this.childs[this.childs.length - 1]
  }

  isInChildRange(id) {
    if (typeof this.firstChildId !== typeof undefined
        && typeof this.lastChildId !== typeof undefined)
      return this.firstChildId <= id && id <= this.lastChildId
    else
      return false
  }
}
