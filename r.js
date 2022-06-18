const bcrypt = require("bcrypt");

const getHashedPassword = async (password) => {
  const pass = await bcrypt.hash(password, 10);
  return pass;
};
let index = "";
getHashedPassword("deneme").then((data) => {
  index = data;
});

console.log(index);
