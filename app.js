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

// 渲染书籍列表
function renderBooksList(books) {
    const booksListElement = document.getElementById('booksList');
    booksListElement.innerHTML = '';
    
    const groupedBooks = groupBooksByAuthor(books);
    
    // 按作者名称排序
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
            
            const titleElement = document.createElement('h3');
            titleElement.className = 'book-title';
            titleElement.textContent = book.title;
            bookCard.appendChild(titleElement);
            
            const doubanElement = document.createElement('p');
            doubanElement.className = 'book-info';
            doubanElement.innerHTML = `<span>豆瓣:</span> <a href="${book.doubanLink}" class="douban-link" target="_blank">查看详情</a>`;
            bookCard.appendChild(doubanElement);
            
            const updateElement = document.createElement('p');
            updateElement.className = 'book-info';
            updateElement.innerHTML = `<span>整理日期:</span> ${book.updateDate}`;
            bookCard.appendChild(updateElement);
            
            const recommenderElement = document.createElement('p');
            recommenderElement.className = 'book-info';
            recommenderElement.innerHTML = `<span>推荐人:</span> ${book.recommender}`;
            bookCard.appendChild(recommenderElement);
            
            const statusElement = document.createElement('p');
            statusElement.className = 'book-info';
            statusElement.innerHTML = `<span>状态:</span> <span class="${book.isRead ? 'status-read' : 'status-unread'}">${book.isRead ? '已读' : '未读'}</span>`;
            bookCard.appendChild(statusElement);
            
            if (book.isRead && book.comment) {
                const ratingElement = document.createElement('div');
                ratingElement.className = 'book-rating';
                
                if (book.rating > 0) {
                    const starsElement = document.createElement('div');
                    starsElement.className = 'rating-stars';
                    starsElement.textContent = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
                    ratingElement.appendChild(starsElement);
                }
                
                if (book.comment) {
                    const commentElement = document.createElement('p');
                    commentElement.textContent = book.comment;
                    ratingElement.appendChild(commentElement);
                }
                
                bookCard.appendChild(ratingElement);
            }
            
            booksContainer.appendChild(bookCard);
        });
        
        authorSection.appendChild(booksContainer);
        booksListElement.appendChild(authorSection);
    });
}

// 搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
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
        button.addEventListener('click', function() {
            // 移除所有按钮的活跃状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前按钮添加活跃状态
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
    // 显示当前日期作为最后更新日期
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('lastUpdate').textContent = formattedDate;
    
    // 渲染书籍列表
    renderBooksList(books);
    
    // 设置搜索功能
    setupSearch();
    
    // 设置过滤功能
    setupFilters();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);