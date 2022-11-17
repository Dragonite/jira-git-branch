import $ from "jquery";

const slugify = (text: string | null) => {
    if (!text) return '';
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
    const notificationContainer: HTMLDivElement = document.createElement('div');
    notificationContainer.innerHTML = `
    <div class="toast toast--green" style="display:none">
        <div class="toast__icon">
            <svg version="1.1" class="toast__svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <g>
                <g>
                <path d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0    c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7    C514.5,101.703,514.499,85.494,504.502,75.496z"></path>
                </g>
            </g>
            </svg>
        </div>
        <div class="toast__content">
            <p class="toast__type" id="notificationName">Success!</p>
            <p class="toast__message" id="notificationDescription">Anyone with access can view your invited visitors.</p>
        </div>
        <div class="toast__close">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642">
            <path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"></path>
            </svg>
        </div>
    </div>
    `;
    document.body.appendChild(notificationContainer);
    const jiraIssues = document.querySelectorAll<HTMLDivElement>('[data-issue-key][role]');

    jiraIssues.forEach(issue => {
        const issueDescription = issue.ariaLabel;
        const buttonContainer = issue.querySelector('.ghx-days') as HTMLElement;
        const notificationDescription = document.getElementById('notificationDescription') as HTMLParagraphElement;
        const ticketType = issue.querySelector('.ghx-type') as HTMLElement;
        const button = document.createElement('a') as HTMLAnchorElement;
        button.classList.add('aui-button', 'aui-button-link');
        button.innerText = 'Copy Git Branch Name';
        if (buttonContainer) {
            buttonContainer.parentNode?.insertBefore(button, buttonContainer);
            function handleButtonClick(event: Event) {
                event.stopPropagation();
                event.preventDefault();
                let copyText: string = slugify(issueDescription);
                let prefix = 'feature/';
                if (ticketType) {
                    if (ticketType.title === 'Bug') prefix = 'bugfix/';
                }
                copyText = prefix + copyText;
                const textArea: HTMLTextAreaElement = document.createElement('textarea');
                textArea.value = copyText;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                notificationDescription.innerHTML = `Git branch name for <strong>${issue.dataset.issueKey}</strong> copied to clipboard!`;
                $(".toast").animate({ width: 'toggle' }, 350).delay(3500).fadeOut(500);
            }
            button.addEventListener('click', handleButtonClick, false);
            $(".toast__close").click(function(e){
                e.preventDefault();
                let parent = $(this).parent('.toast');
                parent.hide();
            });
        }
    });
}, 2000);

