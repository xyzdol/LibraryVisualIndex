-- Library Visual Index System
-- Using original entity name: User

CREATE DATABASE IF NOT EXISTS LibraryVisualIndex
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE LibraryVisualIndex;

-- 1. Category table
CREATE TABLE IF NOT EXISTS Category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color_hex CHAR(7),
    parent_id INT NULL,
    CONSTRAINT FK_Category_Parent
      FOREIGN KEY (parent_id) REFERENCES Category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Area table
CREATE TABLE IF NOT EXISTS Area (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Shelf table
CREATE TABLE IF NOT EXISTS Shelf (
    shelf_id INT PRIMARY KEY AUTO_INCREMENT,
    area_id INT NOT NULL,
    code VARCHAR(50),
    pos_x INT,
    pos_y INT,
    description VARCHAR(255),
    CONSTRAINT FK_Shelf_Area
      FOREIGN KEY (area_id) REFERENCES Area(area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Book table
CREATE TABLE IF NOT EXISTS Book (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    author VARCHAR(255),
    publisher VARCHAR(255),
    isbn VARCHAR(20),
    category_id INT NOT NULL,
    summary TEXT,
    publish_year DATE,
    cover_image_url VARCHAR(500),
    CONSTRAINT FK_Book_Category
      FOREIGN KEY (category_id) REFERENCES Category(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. BookCopy table
CREATE TABLE IF NOT EXISTS BookCopy (
    copy_id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    shelf_id INT NOT NULL,
    barcode VARCHAR(50),
    status VARCHAR(20),
    due_date DATE,
    CONSTRAINT FK_BookCopy_Book
      FOREIGN KEY (book_id) REFERENCES Book(book_id),
    CONSTRAINT FK_BookCopy_Shelf
      FOREIGN KEY (shelf_id) REFERENCES Shelf(shelf_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. User table  ←  已改回原始设计
CREATE TABLE IF NOT EXISTS `User` (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    role VARCHAR(20),
    status VARCHAR(20),
    created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. BorrowRecord table
CREATE TABLE IF NOT EXISTS BorrowRecord (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    copy_id INT NOT NULL,
    user_id INT NOT NULL,
    borrow_date DATETIME,
    return_date DATETIME,
    status VARCHAR(20),
    CONSTRAINT FK_BorrowRecord_Copy
      FOREIGN KEY (copy_id) REFERENCES BookCopy(copy_id),
    CONSTRAINT FK_BorrowRecord_User
      FOREIGN KEY (user_id) REFERENCES `User`(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Comment table
CREATE TABLE IF NOT EXISTS Comment (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT,
    is_anonymous BOOLEAN,
    created_at DATETIME,
    CONSTRAINT FK_Comment_Book
      FOREIGN KEY (book_id) REFERENCES Book(book_id),
    CONSTRAINT FK_Comment_User
      FOREIGN KEY (user_id) REFERENCES `User`(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Broadcast table
CREATE TABLE IF NOT EXISTS Broadcast (
    broadcast_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    area_id INT NOT NULL,
    type VARCHAR(20),
    content TEXT,
    is_anonymous BOOLEAN,
    created_at DATETIME,
    expire_at DATETIME,
    is_active BOOLEAN,
    CONSTRAINT FK_Broadcast_User
      FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    CONSTRAINT FK_Broadcast_Area
      FOREIGN KEY (area_id) REFERENCES Area(area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
