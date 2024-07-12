const mysql = require('mysql');
const wait = require('node:timers/promises').setTimeout;
const settings = require("../config.json")
const connection = mysql.createConnection({
  host: settings.mysql.host,
  user: settings.mysql.user,
  database: settings.mysql.database
});
  
setTimeout(async () => {

  console.log("Mysql ile bağlantı sağlanıyor...")
connection.connect(function(err) {
  setTimeout(async () => {

    if (err) {
      console.error('Mysql ile bağlantı sağlanamadı! ' + err.stack);
      return;
    }
   
    console.log('Mysql ile bağlantı sağlandı!');
  }, 3000)

})
}, 3000)

setInterval(async () => {
    console.log("Mysql ile bağlantısı yenileniyor...")
    connection.destroy()
    connection.connect(function(err) {
      setTimeout(async () => {
    
        if (err) {
          console.error('Mysql ile bağlantısı yenilenemedi! ' + err.stack);
          return;
        }
       
        console.log('Mysql ile bağlantı yenilendi!');
      }, 3000)
    
    })
}, 1 * 60 * 60 * 1000)

 