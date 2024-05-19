const generateID = (): string => {
  const characters =
    "QWERTYUIOPASDFGHJKLZXCVBNM123456789mnbvcxzlkjhgfdsapoiuytrewq";
  let id = "";
  for (let i = 1; i <= 26; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
};

export default generateID;
