(function () {
    if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
        return;
    }

    self.Prism.fileHighlight = function(pre) {
        var Extensions = {
            'js': 'javascript',
            'py': 'python',
            'rb': 'ruby',
            'ps1': 'powershell',
            'psm1': 'powershell',
            'sh': 'bash',
            'bat': 'batch',
            'h': 'c',
            'tex': 'latex'
        };

        var src = pre.getAttribute('data-src');

        var language, parent = pre;
        var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
        while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode;
        }

        if (parent) {
            language = (pre.className.match(lang) || [, ''])[1];
        }

        if (!language) {
            var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
            language = Extensions[extension] || extension;
        }

        var code = document.createElement('code');
        code.className = 'language-' + language;

        pre.textContent = '';

        code.textContent = 'Loading…';

        pre.appendChild(code);

        // var xhr = new XMLHttpRequest();

        // xhr.open('GET', src, true);

        return fetch(src)
            .then((blob) => blob.text())
            .then((text) => code.textContent = text)
            .then(() => Prism.highlightElement(code))
            .catch(error => '✖ Error: Problem while fetching file')
    };
})();
