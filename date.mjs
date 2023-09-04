function getDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "2-digit",
    year: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

export {getDate};

function getDay(){
  const today = new Date();
  const options = {
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

export {getDay};
