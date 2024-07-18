const fs = require('fs');
const express = require('express')
const app = express()
var path = require('path');

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get('/', function (req, res) {
  var arr = []
  fs.readdir(`./files`, function (err, files) {
    files.forEach(function(file){
      var data = fs.readFileSync(`./files/${file}`,"utf-8");
      arr.push({name:file,content:data});
    })
    if (err) return res.status(404).send(err);
    else res.render("app", { files:arr });
  })
})
app.post('/createUser', function (req, res) {
  const name = req.body.Name.split(" ").join("");
  const text = req.body.TextName;
  fs.writeFile(`./files/${name}.txt`, `${text}`, function (err) {
    if (err) console.log(err)
  })
  res.redirect("/");
})
app.get('/read/:filename', function (req, res) {
  var fsname = req.params.filename;
  fs.readFile(`./files/${fsname}`,"utf-8",function(err,data){
    if(err) res.status(404).send(err);
    else res.render("read",{data,fsname});
  })
})
app.get('/delete/:filename', function (req, res) {
  var fsname = req.params.filename;
  fs.unlink(`./files/${fsname}`,function(err){
    if(err) res.status(404).send(err);
    else res.redirect("/");
  })
})
app.get('/edit/:filename', function (req, res) {
  res.render('edit',{filename:req.params.filename})
})
app.post('/edit', function (req, res) {
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
    res.redirect("/")
  })
})


app.listen(3000)