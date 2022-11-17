const slugify = (text) => {
    const substrings = text.toString().split('-');
    const prefix = substrings.shift();
    const remainder = substrings.join('-');
    const slug = remainder.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    return `${prefix}-${slug}`;
}

setTimeout(() => {
    const jiraIssues = document.querySelectorAll('[data-issue-key]');

    jiraIssues.forEach(issue => {
        const issueDescription = issue.ariaLabel;
        const buttonContainer = issue.querySelector('.ghx-days');
        const button = document.createElement("a");
        button.class = 'aui-button aui-button-link';
        button.innerText = 'Copy Git Branch Name';
        if (buttonContainer) {
            buttonContainer.parentNode.insertBefore(button, buttonContainer);
            function handleButtonClick(event) {
                event.stopPropagation();
                event.preventDefault();
                const copyText = slugify(issueDescription);
                let textArea = document.createElement("textarea");
                textArea.value = copyText;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                // navigator.clipboard.writeText(copyText);
                alert(`${copyText}\n\nCopied to Clipboard!`)
            }
            button.addEventListener('click', handleButtonClick, false);
        }
    });
}, 2000);

