CREATE DATABASE SmartCanteenSystem;
USE SmartCanteenSystem;
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(11) NOT NULL,
    username VARCHAR(50) NOT NULL,
    card_balance DECIMAL(10, 2) DEFAULT 0.00,
    other_balance DECIMAL(10, 2) DEFAULT 0.00,
    reserved_locker_id INT DEFAULT 0
);
INSERT INTO User (id, user_id, username, card_balance, other_balance, reserved_locker_id)  VALUES (1, '12343253611', 'zhangsan', 100.00, 100.00, 0);
INSERT INTO User (id, user_id, username, card_balance, other_balance, reserved_locker_id)  VALUES (2, '12343253411', 'lisi', 100.00, 100.00, 3);
INSERT INTO User (id, user_id, username, card_balance, other_balance, reserved_locker_id)  VALUES (3, '12333253411', 'wangwu', 100.00, 100.00, 2);
INSERT INTO User (id, user_id, username, card_balance, other_balance, reserved_locker_id)  VALUES (4, '12333266411', 'zhaoliu', 100.00, 100.00, 0);


CREATE DATABASE SmartCanteenSystem;
USE SmartCanteenSystem;
CREATE TABLE Hot (
    photo VARCHAR(255),
    storename VARCHAR(100),
    brief TEXT,
    canteen VARCHAR(50),
    btn1 VARCHAR(50),
    btn2 VARCHAR(50),
    btn3 VARCHAR(50)
);
INSERT INTO Hot (photo, storename, brief, canteen, btn1, btn2, btn3)
VALUES ('http://47.100.50.78:8081/images/zdj.jpg', '猪肚鸡', '一个商家', '第四餐厅', '价格低', '', '分量足');
INSERT INTO Hot (photo, storename, brief, canteen, btn1, btn2, btn3)
VALUES ('http://47.100.50.78:8081/images/xdtc.jpg', '兄弟套餐', '一个商家', '第一餐厅', '', '', '分量足');
INSERT INTO Hot (photo, storename, brief, canteen, btn1, btn2, btn3)
VALUES ('http://47.100.50.78:8081/images/teq.jpg', '土耳其', '一个商家', '第三餐厅', '', '好评多', '');



CREATE TABLE wxUser (
    user_id CHAR(11),
    openid VARCHAR(255) UNIQUE PRIMARY KEY,
    avatar VARCHAR(255),
    nickname VARCHAR(255),
    balance DECIMAL(10,2),
    reserved_locker_id INT(11)
);
ALTER TABLE wxUser
ADD COLUMN name VARCHAR(255),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN school VARCHAR(100),
ADD COLUMN address VARCHAR(255),
ADD COLUMN age VARCHAR(10),
ADD COLUMN vip VARCHAR(20);
INSERT INTO wxUser (user_id,  openid, avatar, nickname, balance, reserved_locker_id) 
VALUES ('916ZXLq3acG', 'oP6u662jmD7wjkfj2NGGFfMW-bPo', 'http://47.100.50.78:8081/images/avatar.jpg', 'test', '1001', 0);


CREATE TABLE Store (
    photo VARCHAR(255),
    storename VARCHAR(100),
    canteen VARCHAR(50),
    trade BOOLEAN,
    brief TEXT,
    btn1 VARCHAR(50),
    btn2 VARCHAR(50),
    btn3 VARCHAR(50)
);
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/mlt.jpg', '麻辣烫', '第二餐厅', TRUE, '一家麻辣烫', '', '', '分量足');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/zdj.jpg', '猪肚鸡', '第四餐厅', TRUE, '一个商家', '价格低', '', '分量足');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/xdtc.jpg', '兄弟套餐', '第一餐厅', TRUE, '一个商家', '', '', '分量足');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/teq.jpg', '土耳其', '第三餐厅', TRUE, '一个商家', '', '好评多', '');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/ymx.jpg', '悠米香', '第四餐厅', TRUE, '一个商家', '', '好评多', '');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/sxxc.jpg', '沙县小吃', '第一餐厅', TRUE, '一个商家', '价格低', '好评多', '');
INSERT INTO Store (photo, storename, canteen, trade, brief, btn1, btn2, btn3) 
VALUES ('http://47.100.50.78:8081/images/zz.jpg', '猪杂', '第二餐厅', TRUE, '一个商家', '价格低', '好评多', '分量足');

CREATE TABLE Food (
    foodname VARCHAR(255),
    price DECIMAL(10, 2),
    salesv INT,
    ingredients TEXT,
    photo VARCHAR(255),
    storename VARCHAR(255)
);
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('炒土豆', 12.00, 40, '土豆，辣椒', 'http://47.100.50.78:8081/images/ctd.jpg', '土耳其');
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('炒茄子', 10.00, 31, '茄子，豆瓣', 'http://47.100.50.78:8081/images/cqz.jpg', '土耳其');
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('烤肉', 18.00, 100, '鸡肉', 'http://47.100.50.78:8081/images/kr.jpg', '土耳其');
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('炒青菜', 5.00, 17, '青菜', 'http://47.100.50.78:8081/images/cqc.jpg', '土耳其');
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('清蒸鱼', 25.00, 17, '黑鱼', 'http://47.100.50.78:8081/images/qzy.jpg', '土耳其');
INSERT INTO Food (foodname, price, salesv, ingredients, photo, storename) 
VALUES ('麻辣香锅', 35.00, 200, '牛肉，虾饺，面...', 'http://47.100.50.78:8081/images/mlxg.jpg', '土耳其');


CREATE TABLE OrderRecord (
	id INT PRIMARY KEY AUTO_INCREMENT,
    foodname VARCHAR(255),
    number INT,
    price DECIMAL(10, 2),
    orderid CHAR(20),
    timestamp1 BIGINT,
    timestamp2 BIGINT,
    openid VARCHAR(255),
    storename VARCHAR(255),
    photo VARCHAR(255),
    reserved_locker_id INT,
    fetched BOOLEAN DEFAULT false,
    allprice DECIMAL(10, 2)
);

SELECT orderid,timestamp1,allprice,reserved_locker_id
FROM OrderRecord
WHERE (orderid, id) IN (
    SELECT orderid, MIN(id)
    FROM OrderRecord
    GROUP BY orderid
) AND openid = 'oP6u662jmD7wjkfj2NGGFfMW-bPo';

