
-- Optimized SQL schema based on the Library Visual Index PDM

CREATE TABLE Category (
    category_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color_hex CHAR(7),
    parent_id INT NULL,
    FOREIGN KEY (parent_id) REFERENCES Category(category_id)
);

CREATE TABLE Area (
    area_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    description TEXT
);

CREATE TABLE Shelf (
    shelf_id INT PRIMARY KEY,
    area_id INT NOT NULL,
    code VARCHAR(50),
    pos_x INT,
    pos_y INT,
    description VARCHAR(255),
    FOREIGN KEY (area_id) REFERENCES Area(area_id)
);

CREATE TABLE Book (
    book_id INT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    publisher VARCHAR(255),
    isbn VARCHAR(20),
    category_id INT NOT NULL,
    summary TEXT,
    publish_year DATE,
    cover_image_url VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE BookCopy (
    copy_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    shelf_id INT NOT NULL,
    barcode VARCHAR(50),
    status VARCHAR(20),
    due_date DATE,
    FOREIGN KEY (book_id) REFERENCES Book(book_id),
    FOREIGN KEY (shelf_id) REFERENCES Shelf(shelf_id)
);

CREATE TABLE UserAccount (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    role VARCHAR(20),
    status VARCHAR(20),
    created_at DATETIME
);

CREATE TABLE BorrowRecord (
    record_id INT PRIMARY KEY,
    copy_id INT NOT NULL,
    user_id INT NOT NULL,
    borrow_date DATETIME,
    return_date DATETIME,
    status VARCHAR(20),
    FOREIGN KEY (copy_id) REFERENCES BookCopy(copy_id),
    FOREIGN KEY (user_id) REFERENCES UserAccount(user_id)
);

CREATE TABLE Comment (
    comment_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    content NVARCHAR(MAX),
    is_anonymous BIT,
    created_at DATETIME,
    FOREIGN KEY (book_id) REFERENCES Book(book_id),
    FOREIGN KEY (user_id) REFERENCES UserAccount(user_id)
);

CREATE TABLE Broadcast (
    broadcast_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    area_id INT NOT NULL,
    type VARCHAR(20),
    content NVARCHAR(MAX),
    is_anonymous BIT,
    created_at DATETIME,
    expire_at DATETIME,
    is_active BIT,
    FOREIGN KEY (user_id) REFERENCES UserAccount(user_id),
    FOREIGN KEY (area_id) REFERENCES Area(area_id)
);
