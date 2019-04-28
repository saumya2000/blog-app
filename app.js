var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Test Blog",
// 	image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
// 	body: "Hello ,This is a test blog"
// });

//restful routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});

});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);       //user cannot use the script tag using this

	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			console.log("ERROR");   //res.render("/new");
		}
		else{
			res.redirect("/blogs");
		}
	});

});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});     //passing foundBlog to blog in the show page
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});     //passing foundBlog to blog in the edit page
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body); 
	 Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
	 	if (err) {
	 		res.redirect("/blogs");
	 	}else{
	 		res.redirect("/blogs/"+req.params.id);
	 	}
	 });                            //id,newdata,callback
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog 
	Blog.findByIdAndRemove(req.params.id,function(err){
	 	if (err) {
	 		res.redirect("/blogs");
	 	}else{
	 		res.redirect("/blogs");
	 	}
	 });
	//redirect somewhere
})


app.listen(4000,process.env.IP,function(){
	console.log("SERVER IS RUNNING!");
});





