var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'routes', 'gmail.env') });


router.get('/', function(req, res, next) {
  res.render("admin/index");
});
router.get('/dashboard', function(req, res, next) {
  res.render("admin/dashboard");
});
router.get('/signup', function(req, res, next) {
  res.render("admin/signup");
});
router.get('/index', function(req, res, next) {
  res.render("admin/index");
});
router.get('/login', function(req, res, next) {
  res.render("admin/login");
});
router.get('/shop', function(req, res, next) {
  res.render("admin/shop");
});
router.get('/blog', function(req, res, next) {
  res.render("admin/blog");
});
//cart show 
router.get('/cart', function(req, res, next) {
  const usersessiondata = req.session.sessname; // Get the user session data
  const selectquery = "SELECT * FROM tbl_user_cart WHERE userid = '"+usersessiondata+"'"; // Use parameterized query to prevent SQL injection

  connection.query(selectquery, function(err, result) {
      if (err) {
          console.error(err); // Log the error for debugging
          return res.status(500).send('Internal Server Error'); // Send a 500 error response
      }  

      const obj = { data: result }; // Prepare the data object
      console.log('Result from DB:', result);

      res.render('admin/cart', { obj: obj }); // Render the cart view
  });
});


router.get('/about', function(req, res, next) {
  res.render("admin/about");
});
router.get('/sproducts', function(req, res, next) {
  res.render("admin/sproducts");
});
router.get('/contact', function(req, res, next) {
  res.render("admin/contact");
});
router.get('/forgotpassword', function(req, res, next) {
  res.render("admin/forgotpassword");
});
router.get('/chatbox', function(req, res, next) {
  res.render("admin/chatbox");
});

//logout
router.get('/logout', (req, res) => {
  // Destroy session
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.sendStatus(500);
      }
      // Redirect to logged-out page or login page
      res.redirect('/index');
  });
});

//userreviewdetail
// router.use(express.urlencoded({ extended: true }));
router.post("/insertreviewdetails",function(req,res){
  username=req.body.username;
  email=req.body.email;
  subject=req.body.subject;
  review=req.body.review;

  const usersessiondata=req.session.sessname;
  selectquery="select * from tbl_user_signup where userid='"+usersessiondata+"'";
  connection.query(selectquery,function(err,result){
    if(err){
      throw err;
    }
    else{
      insertquery="insert into tbl_user_review(userid,username,email,subject,review) values('"+usersessiondata+"',?,?,?,?)";
      connection.query(insertquery,[username,email,subject,review],function(err,data,next){
        if(err){
          console.log(err) 
          console.log("Insert Query:", insertquery);
          throw err;
        }
        else{
          console.log("inserted successfully in review table");
          res.render("admin/contact");
        } 
       })
    
    }
    

    })
  })
 
//sqlconnection
var mysql=require("mysql");
var connection=mysql.createConnection({ 
  host:"127.0.0.1",
  user:"root",
  password:"root",
  database:"ecommerce"
});
connection.connect(function(err){
  if(err)
  {
    console.log(err);
    throw err;
   
  }
  else{
    console.log("database is connected successfully");
  }
});


const emailUser = process.env.EMAILUSER;
const emailPass = process.env.EMAILPASS;

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: emailUser, // Your email address
      pass: emailPass // Your password
  },
 
  debug: true 
});


//insertcustomerdetails

router.post('/insertcustomerdetails',function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var email=req.body.email;
  var iquery=`insert into tbl_user_signup(username,password,email)values(?,?,?)`;
  connection.query(iquery,[username,password,email],function(err,data,result){ 
    if(err)
    {
      req.flash('error', 'Error occurred while creating account.');
      throw err;
     
    }
    else{
      console.log(iquery)
      console.log("inserted successfully");

        // Email content
            let mailOptions = {
                from: emailUser, // Sender email address
                to: email, // Receiver email address provided by the user
                subject: 'Account Creation Successful',
                text: 'Congratulations! Your account has been successfully created.'
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred while sending email:',error.message);
                    req.flash('error', 'Error occurred while sending confirmation email.');  
                } else {
                    console.log('Email sent:', info.response);
                    // res.status(200).send('Account created successfully and Confirmation email sent.');
                   // req.flash('success', 'Account created successfully  Confirmation email sent.');
                    res.redirect("/login");
                }
               
            });

         
        }
        // res.render("/admin/login");
    });
      
    })



//checklogindetails
router.post("/checklogindetails",function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var inquery="select * from tbl_user_signup where username='"+username+"' and password='"+password+"'" ;
   connection.query(inquery,function(err,result){
   if(err)
   {
    throw err;
   }
   else{
    if(result.length>0){
      req.session.sessname=result[0].userid //user session
      res.render("admin/index")
    }
    else{

      res.render("admin/login",{ error: "Invalid username or password" })
    }
   }
   })
})
//forgot password
router.post("/updatepassword",function(req,res){
  var user_email=req.body.email;
  var newpassword=req.body.newpassword;
  var confirmpassword=req.body.confirmpassword;
  if(newpassword!==confirmpassword){
    return res.status(400).send("Passwords do not match");
  }
  var selectquery="select * from tbl_user_signup where email='"+user_email+"'";
  connection.query(selectquery,function(err,result){
    if(err){
      throw err;
    }
    else{
      var updatequery="update tbl_user_signup set password='"+newpassword+"'where email='"+user_email+"'";
     connection.query(updatequery,function(err,result){
      if(err){
        console.log(err);
        throw err;
       
      }
      else{
        console.log(updatequery)
        console.log("successfully password is updated");
        res.render("admin/forgotpassword");
      }
     })
      
      }
  })
})
//viewcustomer details
router.get('/mainpage',function(req,res){
  const usersessiondata=req.session.sessname;
  
  var selectquery="select * from tbl_user_signup where userid='"+usersessiondata+"' "; 
  connection.query(selectquery,function(err,result){
    if(err){
      // console.log(userId);
      console.log(err);
      throw err;
    }
    else{
      // console.log(userId);
      obj={data:result}
      res.render('admin/mainpage',{obj:obj})
    }
  })
})
//insertproducts
 router.post('/insertproducts',function(req,res){
  imagepath = req.body.image_path;
  product_name=req.body.product_name;
  price=req.body.price;
  product_size=req.body.size;
  number=req.body.number;
  bill_amt=price*number;

  const usersessiondata=req.session.sessname;
  selectquery="select * from tbl_user_signup where userid='"+usersessiondata+"'";
  connection.query(selectquery,function(err,result){
    if(err){
      throw err;
    }
    else{
      insertquery="insert into tbl_user_cart(userid,image_path,product_name,price,quantity,total,bill_amt) values('"+usersessiondata+"',?,?,?,?,?,?)";
      connection.query(insertquery,[imagepath,product_name,price,product_size,number,bill_amt],function(err,data,next){
        if(err){
          console.log(err) 
          console.log("Insert Query:", insertquery);
          throw err;
        }
        else{
          console.log("inserted successfully in cart table");
          res.render("admin/sproducts");
        } 
       })
    
    }
    

    })
 


 })




module.exports = router;
