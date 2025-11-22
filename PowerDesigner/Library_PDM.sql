/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2012                    */
/* Created on:     11/20/2025 23:27:52                          */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Book') and o.name = 'FK_BOOK_CATEGORY__CATEGORY')
alter table Book
   drop constraint FK_BOOK_CATEGORY__CATEGORY
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BookCopy') and o.name = 'FK_BOOKCOPY_BOOK_BOOK_BOOK')
alter table BookCopy
   drop constraint FK_BOOKCOPY_BOOK_BOOK_BOOK
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BookCopy') and o.name = 'FK_BOOKCOPY_SHELF_BOO_SHELF')
alter table BookCopy
   drop constraint FK_BOOKCOPY_SHELF_BOO_SHELF
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BorrowRecord') and o.name = 'FK_BORROWRE_BOOKCOPY__BOOKCOPY')
alter table BorrowRecord
   drop constraint FK_BORROWRE_BOOKCOPY__BOOKCOPY
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BorrowRecord') and o.name = 'FK_BORROWRE_USER_BORR_USER')
alter table BorrowRecord
   drop constraint FK_BORROWRE_USER_BORR_USER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Broadcast') and o.name = 'FK_BROADCAS_AREA_BROA_AREA')
alter table Broadcast
   drop constraint FK_BROADCAS_AREA_BROA_AREA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Broadcast') and o.name = 'FK_BROADCAS_USER_BROA_USER')
alter table Broadcast
   drop constraint FK_BROADCAS_USER_BROA_USER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Comment') and o.name = 'FK_COMMENT_BOOK_COMM_BOOK')
alter table Comment
   drop constraint FK_COMMENT_BOOK_COMM_BOOK
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Comment') and o.name = 'FK_COMMENT_USER_COMM_USER')
alter table Comment
   drop constraint FK_COMMENT_USER_COMM_USER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('Shelf') and o.name = 'FK_SHELF_AREA_SHEL_AREA')
alter table Shelf
   drop constraint FK_SHELF_AREA_SHEL_AREA
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Area')
            and   type = 'U')
   drop table Area
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Book')
            and   name  = 'Category_Book_FK'
            and   indid > 0
            and   indid < 255)
   drop index Book.Category_Book_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Book')
            and   type = 'U')
   drop table Book
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BookCopy')
            and   name  = 'Book_BookCopy_FK'
            and   indid > 0
            and   indid < 255)
   drop index BookCopy.Book_BookCopy_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BookCopy')
            and   name  = 'Shelf_BookCopy_FK'
            and   indid > 0
            and   indid < 255)
   drop index BookCopy.Shelf_BookCopy_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('BookCopy')
            and   type = 'U')
   drop table BookCopy
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BorrowRecord')
            and   name  = 'BookCopy_BorrowRecord_FK'
            and   indid > 0
            and   indid < 255)
   drop index BorrowRecord.BookCopy_BorrowRecord_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BorrowRecord')
            and   name  = 'User_BorrowRecord_FK'
            and   indid > 0
            and   indid < 255)
   drop index BorrowRecord.User_BorrowRecord_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('BorrowRecord')
            and   type = 'U')
   drop table BorrowRecord
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Broadcast')
            and   name  = 'Area_Broadcast_FK'
            and   indid > 0
            and   indid < 255)
   drop index Broadcast.Area_Broadcast_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Broadcast')
            and   name  = 'User_Broadcast_FK'
            and   indid > 0
            and   indid < 255)
   drop index Broadcast.User_Broadcast_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Broadcast')
            and   type = 'U')
   drop table Broadcast
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Category')
            and   type = 'U')
   drop table Category
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Comment')
            and   name  = 'User_Comment_FK'
            and   indid > 0
            and   indid < 255)
   drop index Comment.User_Comment_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Comment')
            and   name  = 'Book_Comment_FK'
            and   indid > 0
            and   indid < 255)
   drop index Comment.Book_Comment_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Comment')
            and   type = 'U')
   drop table Comment
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('Shelf')
            and   name  = 'Area_Shelf_FK'
            and   indid > 0
            and   indid < 255)
   drop index Shelf.Area_Shelf_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('Shelf')
            and   type = 'U')
   drop table Shelf
go

if exists (select 1
            from  sysobjects
           where  id = object_id('"User"')
            and   type = 'U')
   drop table "User"
go

/*==============================================================*/
/* Table: Area                                                  */
/*==============================================================*/
create table Area (
   area_id              int                  not null,
   name                 varchar(100)         null,
   floor                int                  null,
   description          text                 null,
   constraint PK_AREA primary key nonclustered (area_id)
)
go

/*==============================================================*/
/* Table: Book                                                  */
/*==============================================================*/
create table Book (
   book_id              int                  not null,
   title                varchar(255)         null,
   author               varchar(255)         null,
   publisher            varchar(255)         null,
   isbn                 varchar(20)          null,
   category_id          int                  not null,
   summary              text                 null,
   publish_year         datetime             null,
   cover_image_url      varchar(500)         null,
   constraint PK_BOOK primary key nonclustered (book_id)
)
go

/*==============================================================*/
/* Index: Category_Book_FK                                      */
/*==============================================================*/
create index Category_Book_FK on Book (
category_id ASC
)
go

/*==============================================================*/
/* Table: BookCopy                                              */
/*==============================================================*/
create table BookCopy (
   copy_id              int                  not null,
   book_id              int                  not null,
   shelf_id             int                  not null,
   barcode              varchar(50)          null,
   status               varchar(20)          null,
   due_date             datetime             null,
   constraint PK_BOOKCOPY primary key nonclustered (copy_id)
)
go

/*==============================================================*/
/* Index: Shelf_BookCopy_FK                                     */
/*==============================================================*/
create index Shelf_BookCopy_FK on BookCopy (
shelf_id ASC
)
go

/*==============================================================*/
/* Index: Book_BookCopy_FK                                      */
/*==============================================================*/
create index Book_BookCopy_FK on BookCopy (
book_id ASC
)
go

/*==============================================================*/
/* Table: BorrowRecord                                          */
/*==============================================================*/
create table BorrowRecord (
   record_id            int                  not null,
   copy_id              int                  not null,
   user_id              int                  not null,
   borrow_date          datetime             null,
   return_date          datetime             null,
   status               varchar(20)          null,
   constraint PK_BORROWRECORD primary key nonclustered (record_id)
)
go

/*==============================================================*/
/* Index: User_BorrowRecord_FK                                  */
/*==============================================================*/
create index User_BorrowRecord_FK on BorrowRecord (
user_id ASC
)
go

/*==============================================================*/
/* Index: BookCopy_BorrowRecord_FK                              */
/*==============================================================*/
create index BookCopy_BorrowRecord_FK on BorrowRecord (
copy_id ASC
)
go

/*==============================================================*/
/* Table: Broadcast                                             */
/*==============================================================*/
create table Broadcast (
   broadcast_id         int                  not null,
   user_id              int                  not null,
   area_id              int                  not null,
   type                 varchar(20)          null,
   content              text                 null,
   is_anonymous         bit                  null,
   created_at           datetime             null,
   expire_at            datetime             null,
   is_active            bit                  null,
   constraint PK_BROADCAST primary key nonclustered (broadcast_id)
)
go

/*==============================================================*/
/* Index: User_Broadcast_FK                                     */
/*==============================================================*/
create index User_Broadcast_FK on Broadcast (
user_id ASC
)
go

/*==============================================================*/
/* Index: Area_Broadcast_FK                                     */
/*==============================================================*/
create index Area_Broadcast_FK on Broadcast (
area_id ASC
)
go

/*==============================================================*/
/* Table: Category                                              */
/*==============================================================*/
create table Category (
   category_id          int                  not null,
   name                 varchar(100)         null,
   color_hex            char(7)              null,
   parent_id            int                  null,
   constraint PK_CATEGORY primary key nonclustered (category_id)
)
go

/*==============================================================*/
/* Table: Comment                                               */
/*==============================================================*/
create table Comment (
   comment_id           int                  not null,
   book_id              int                  not null,
   user_id              int                  not null,
   content              text                 null,
   is_anonymous         bit                  null,
   created_at           datetime             null,
   constraint PK_COMMENT primary key nonclustered (comment_id)
)
go

/*==============================================================*/
/* Index: Book_Comment_FK                                       */
/*==============================================================*/
create index Book_Comment_FK on Comment (
book_id ASC
)
go

/*==============================================================*/
/* Index: User_Comment_FK                                       */
/*==============================================================*/
create index User_Comment_FK on Comment (
user_id ASC
)
go

/*==============================================================*/
/* Table: Shelf                                                 */
/*==============================================================*/
create table Shelf (
   shelf_id             int                  not null,
   area_id              int                  not null,
   code                 varchar(50)          null,
   pos_x                int                  null,
   pos_y                int                  null,
   description          varchar(255)         null,
   constraint PK_SHELF primary key nonclustered (shelf_id)
)
go

/*==============================================================*/
/* Index: Area_Shelf_FK                                         */
/*==============================================================*/
create index Area_Shelf_FK on Shelf (
area_id ASC
)
go

/*==============================================================*/
/* Table: "User"                                                */
/*==============================================================*/
create table "User" (
   user_id              int                  not null,
   username             varchar(50)          null,
   password_hash        varchar(255)         null,
   real_name            varchar(50)          null,
   role                 varchar(20)          null,
   status               varchar(20)          null,
   created_at           datetime             null,
   constraint PK_USER primary key nonclustered (user_id)
)
go

alter table Book
   add constraint FK_BOOK_CATEGORY__CATEGORY foreign key (category_id)
      references Category (category_id)
go

alter table BookCopy
   add constraint FK_BOOKCOPY_BOOK_BOOK_BOOK foreign key (book_id)
      references Book (book_id)
go

alter table BookCopy
   add constraint FK_BOOKCOPY_SHELF_BOO_SHELF foreign key (shelf_id)
      references Shelf (shelf_id)
go

alter table BorrowRecord
   add constraint FK_BORROWRE_BOOKCOPY__BOOKCOPY foreign key (copy_id)
      references BookCopy (copy_id)
go

alter table BorrowRecord
   add constraint FK_BORROWRE_USER_BORR_USER foreign key (user_id)
      references "User" (user_id)
go

alter table Broadcast
   add constraint FK_BROADCAS_AREA_BROA_AREA foreign key (area_id)
      references Area (area_id)
go

alter table Broadcast
   add constraint FK_BROADCAS_USER_BROA_USER foreign key (user_id)
      references "User" (user_id)
go

alter table Comment
   add constraint FK_COMMENT_BOOK_COMM_BOOK foreign key (book_id)
      references Book (book_id)
go

alter table Comment
   add constraint FK_COMMENT_USER_COMM_USER foreign key (user_id)
      references "User" (user_id)
go

alter table Shelf
   add constraint FK_SHELF_AREA_SHEL_AREA foreign key (area_id)
      references Area (area_id)
go

