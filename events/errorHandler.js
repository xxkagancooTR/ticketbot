

process.on('uncaughtException', (error) => {
    console.error('Beklenmeyen bir hata meydana geldi: ', error);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Yakalanmamış bir vaat reddedildi:', reason);
  });
