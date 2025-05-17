// 按作者分组书籍
function groupBooksByAuthor(books) {
    const groupedBooks = {};
    books.forEach(book => {
        if (!groupedBooks[book.author]) {
            groupedBooks[book.author] = [];
        }
        groupedBooks[book.author].push(book);
    });
    return groupedBooks;
}

// 创建右侧 panel
// 修改 JavaScript 部分 - 替换 createSidePanel 和 showSidePanel 函数

// 创建右侧 panel
function createSidePanel() {
    const panel = document.createElement('div');
    panel.id = 'sidePanel';
    panel.className = 'hidden'; // 使用 hidden 类初始化隐藏状态
    panel.innerHTML = `
        <div class="panel-content">
            <span class="close-button">&times;</span>
            <h3 id="panelTitle"></h3>
            <div id="panelRating" class="rating-stars"></div>
            <p id="panelComment"></p>
        </div>
    `;
    document.body.appendChild(panel);

    // 关闭逻辑
    panel.querySelector('.close-button').addEventListener('click', () => {
        panel.classList.add('hidden');
        document.querySelector('.container').classList.remove('panel-open');
    });
}

// 展示 panel
function showSidePanel(book) {
    const panel = document.getElementById('sidePanel');
    document.getElementById('panelTitle').textContent = book.title;
    
    // 设置评分星星
    const ratingElement = document.getElementById('panelRating');
    if (book.rating > 0) {
        ratingElement.textContent = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
    } else {
        ratingElement.textContent = '';
    }
    
    // 设置评论内容
    const commentElement = document.getElementById('panelComment');
    if (book.comment) {
        commentElement.innerHTML = book.comment; // 使用innerHTML来支持HTML格式
    } else {
        commentElement.textContent = '暂无评论';
    }
    
    // 显示面板
    panel.classList.remove('hidden');
    document.querySelector('.container').classList.add('panel-open');
}

// 渲染书籍列表
function renderBooksList(books) {
    const booksListElement = document.getElementById('booksList');
    booksListElement.innerHTML = '';

    const groupedBooks = groupBooksByAuthor(books);
    const sortedAuthors = Object.keys(groupedBooks).sort();

    sortedAuthors.forEach(author => {
        const authorSection = document.createElement('div');
        authorSection.className = 'author-section';

        const authorNameElement = document.createElement('h2');
        authorNameElement.className = 'author-name';
        authorNameElement.textContent = author;
        authorSection.appendChild(authorNameElement);

        const booksContainer = document.createElement('div');
        booksContainer.className = 'books-container';

        groupedBooks[author].forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.dataset.read = book.isRead ? 'read' : 'unread';

            bookCard.innerHTML = `
                <h3 class="book-title">${book.title}</h3>
                <p class="book-info"><span>豆瓣:</span> <a href="${book.doubanLink}" class="douban-link" target="_blank">查看详情</a></p>
                <p class="book-info"><span>整理日期:</span> ${book.updateDate}</p>
                <p class="book-info"><span>推荐人:</span> ${book.recommender}</p>
                <p class="book-info"><span>状态:</span> <span class="${book.isRead ? 'status-read' : 'status-unread'}">${book.isRead ? '已读' : '未读'}</span></p>
            `;

            // 点击展开评论面板
            bookCard.addEventListener('click', () => {
                if (book.isRead && (book.comment)) {
                    showSidePanel(book);
                }
            });

            booksContainer.appendChild(bookCard);
        });

        authorSection.appendChild(booksContainer);
        booksListElement.appendChild(authorSection);
    });
}

// 搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        renderBooksList(filteredBooks);
    });
}

// 过滤功能
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            let filteredBooks;
            if (filterValue === 'all') {
                filteredBooks = books;
            } else if (filterValue === 'read') {
                filteredBooks = books.filter(book => book.isRead);
            } else if (filterValue === 'unread') {
                filteredBooks = books.filter(book => !book.isRead);
            }
            renderBooksList(filteredBooks);
        });
    });
}

// 初始化页面
function initPage() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('lastUpdate').textContent = formattedDate;

    createSidePanel();
    renderBooksList(books);
    setupSearch();
    setupFilters();
}

document.addEventListener('DOMContentLoaded', initPage);
