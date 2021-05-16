const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

const connection = mysql.createConnection({
  host: "codezilla-database.cesootw4enox.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "project2_db",
  port: "3306"
});

connection.connect((err) => {
  if(err) {
    throw err
  } else {
    console.log("connected.");
  }
});

//connection.query('CREATE TABLE User(userID INT AUTO_INCREMENT PRIMARY KEY, userName VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW())',(err, rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});

//connection.query("INSERT INTO User(userID,userName,email, password,firstName,lastName) VALUES (115,'pecanpie','pecan1232@yahoo.com','5678901','Ruth','Bush')", (err, rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added.");
//    console.log(rows);
//  }
//});

//connection.query("INSERT INTO Photos(userID,imagePath,imageKey) VALUES (115,'https://images.unsplash.com/photo-1566208541068-ffdb5471e9bf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', NULL)",(err,rows) =>{
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});

//connection.query("INSERT INTO Likes(photoID, userID) VALUES (1,115)",(err, rows) => {
//  if(err) {
//      throw err
//    } else {
//      console.log("data added");
//      console.log(rows);
//    }
//});

//connection.query("DROP TABLE Photos_comments",(err) => {
//  if(err){
//    throw err
//  } else {
//    console.log("table drop");
//  }
//});

//connection.query("INSERT INTO Hashtag(hashtag) VALUES('flower')" ,(err,rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});

//connection.query("INSERT INTO Comments(comment,userID,photoID) VALUES('love it',115,6)" ,(err,rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});
//connection.query("INSERT INTO User_feeds(userID,photoID) VALUES(111,1 )" ,(err,rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});

//connection.query("INSERT INTO Photos_hashtage(photoID,hashtagID) VALUES(10,4)" ,(err,rows) => {
//  if(err) {
//    throw err
//  } else {
//    console.log("data added");
//    console.log(rows);
//  }
//});


//when a get request is sent from homepage
app.get('/',(req,res) => {
              //photoID + iamgeurl+ username
  const que1 = "SELECT COUNT(*) AS count FROM User;"+
               "SELECT Photos.photoID, Photos.imagePath,User.userName, Photos.created_at,totalLike, totalComment FROM Photos"+
               "LEFT JOIN (SELECT photoID, COUNT(*) AS totalLike FROM Likes GROUP BY photoID) AS liketable ON Photos.photoID = liketable.photoID"+
               "LEFT JOIN (SELECT photoID, COUNT(*) AS totalComment FROM Comments GROUP BY photoID) AS commenttable ON Photos.photoID = commenttable.photoID"+
               "JOIN User ON Photos.userID = User.userID"+
               "GROUP BY Photos.photoID"+
               "ORDER BY Photos.created_at ASC;"+
              //Inactive users
              "SELECT hashtagID, hashtag FROM Hashtag; " +
              "SELECT Photos.photoID, Hashtag.hashtag FROM Photos LEFT JOIN Photos_hashtage ON Photos.photoID = Photos_hashtage.photoID LEFT JOIN Hashtag ON Photos_hashtage.hashtagID = Hashtag.hashtagID ORDER BY Photos.photoID;" +
              "SELECT userName FROM User LEFT JOIN Photos ON Photos.userID = User.userID WHERE Photos.photoID IS NULL;" +

              //no_of_photos that user post
              "SELECT username, COUNT(Photos.photoID) as post FROM User"+
              "LEFT JOIN Photos ON User.userID = Photos.userID"+
              "GROUP BY User.username;"+

              //Number of Likes
              "SELECT userName, Likes.photoID, Photos.imagePath, COUNT(Likes.userID) AS 'num_likes' FROM User"+
              "JOIN Photos ON Photos.userID = User.userID"+
              "JOIN Likes ON Photos.photoID = Likes.photoID"+
              "GROUP BY Likes.photoID ORDER BY num_likes DESC, Photos.created_at DESC ;"+

              //Number of comments and comments
              "SELECT userName, COUNT(Comments.userID) AS 'num_comm', Comments.photoID, Photos.imagePath, Comments.comment FROM User"+
              "JOIN Photos ON Photos.userID = User.userID"+
              "JOIN Comments ON Photos.photoID = Comments.photoID"+
              "GROUP BY Comments.photoID ORDER BY num_comm DESC, Photos.created_at DESC;"


              //number of searched tags
              //"SELECT hashtagID, hashtag, COUNT(*) AS 'times' FROM Photos_hashtage "+
              //"JOIN Hashtag ON Photos_hashtage.hashtagID = Hashtag.hashtagID" +
              //"GROUP BY hashtagID ORDER BY times DESC LIMIT 3;" +
              //"SELECT userName FROM User ORDER BY userID ASC;"


              //user pics and Comments
            //  "SELECT userName,Photos.photoID, Photos.imagePath , Comments.comment From User"+
            //  "LEFT JOIN Photos ON User.userID= Photos.userID"+
            //  "LEFT JOIN Comments ON Photos.photoID = Comments.photoID;"
              ;

connection.query(que1, (err, results) => {
  if(err) {
    throw err
  }
  const count = results[0][0].count;
  const originalImg = results[1];
  const imgList = originalImg.slice(0,30);
  const tags = results[2];
  const inactive = results[4];
  const mostLike = resutls[5][0];
  const times = results[6][0];
  const users = results[8];
  const commonTags = results[7];
  const photoTags =[];

  for(var i=0; i<results[3].legth; i++){
    if(photoTags[results[3][i].id-1]){
      photoTags[results[3][i].id-1].push("#" + results[3][i].hashtag);
    } else {
      photoTags[results[3][i].id-1] = [" "];
      photoTags[results[3][i].id -1].push("#" + results[3][i].hashtag);
    }
  };
  console.log(users[0]);

  res.render('home',{
    data: count,
    imgList: imgList,
    tags: tags,
    photoTags: photoTags,
    currentId: originalImg.length,
    inactive: inactive,
    mostLike: mostLike,
    times: times,
    commonTags: commonTags,
    users: users,
    });
  });

});

app.post('/register',(req,res) => {
  const pics = {
    imagePath: req.body.input_imgurl,
    userID: req.body.user_idinput,
  };

  //comment text
  const photo_id = parseInt(req.body.current_photoID, 10) + 1;
  const user_comment = req.body.input_comments;
  const user_likes = req.body.input_likes;
  const tag_id = req.body.input_tags;

  const que = "INSERT INTO Photos SET ?";
  connection.query(que, pics,(err, results, fields) => {
    if(err) {
      console.log(err);
      console.log(photos);
    }
  });

  const que2 = "INSERT INTO Comments SET ?";
  for (var i = 0; i < user_comment.length; i++) {
    const comments = {
      comment_text: "so beautiful",
      photo_id: photo_id,
      user_id: user_comment[i],
    };

  connection.query(que2, comments,(err,results, fields) => {
    if(err) {
      console.log(err);
      console.log("comments");
      }
    });

  };

const que3 = "INSERT INTO Likes SET ?";
for(var i=0; i < user_likes.length; i++){
  const likes = {
    user_id: user_likes[i],
    photo_id: photo_id,
  };
  connection.query(que3, likes, (err, results, fields) => {
    if(err) {
      console.log(err);
      console.log("likes");
    }
  });
};

const que4 = "INSERT INTO Photos_hashtage SET ?";
for (var i = 0; i < user_likes.length; i++) {
  const tags = {
    photo_id: photo_id,
    tag_id: tag_id[i],
  };
  connected.query(que4,tags,(err,results,fields) => {
    if(err) {
      console.log(err);
      console.log("hashtags");
    }
  });
};
res.redirect('/');

});



const port = process.env.PORT || 3000;
app.listen(port);

console.log("App is listening on port " + port);
