// 从JSON文件中加载书籍数据
let books = [];

// 异步加载书籍数据
async function loadBooks() {
    try {
        const response = await fetch('books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        books = await response.json();
        
        // 数据加载完成后初始化页面
        initPage();
    } catch (error) {
        console.error('加载书籍数据失败:', error);
        
        // 显示错误信息
        const booksListElement = document.getElementById('booksList');
        booksListElement.innerHTML = `
            <div class="error-message">
                <h3>加载数据失败</h3>
                <p>无法加载书籍数据，请稍后再试。</p>
                <p>错误详情: ${error.message}</p>
            </div>
        `;
    }
}

// 初始化页面，显示书籍列表
function initPage() {
    displayBooksList();
}

// 显示书籍列表
function displayBooksList() {
    const booksListElement = document.getElementById('booksList');
    
    // 清空现有内容
    booksListElement.innerHTML = '';
    
    if (books.length === 0) {
        booksListElement.innerHTML = '<p>没有找到书籍</p>';
        return;
    }
    
    // 为每本书创建一个列表项
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>作者: ${book.author}</p>
        `;
        
        booksListElement.appendChild(bookItem);
    });
}

// 页面加载完成后执行数据加载
document.addEventListener('DOMContentLoaded', loadBooks);