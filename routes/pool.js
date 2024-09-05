var mysql=require('mysql')
var pool=mysql.createPool({
    user:'root',
    password:'root123',
    host:'localhost',
    port:'3306',
    database:'moviedetail',
    multiplestatements:true,
    connectionLimit:100,
    insecureAuth: true
})
module.exports=pool