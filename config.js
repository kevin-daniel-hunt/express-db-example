/* 
  this is all for quick prototyping purposes.  In an ideal scenario
  some of these configurations would be env variables or there would
  be multiple config files for dev vs prod
*/

exports.dbConnection = {
  host: 'localhost',
  port: 5432,
  database: 'express_db_example',
  username: 'kevinhunt',
};

exports.secret = 'This is a secret';