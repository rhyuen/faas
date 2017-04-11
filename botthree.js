"use strict";

const defaultMessages = [
  "I have nothing to say.",
  "Pizza is the best",
  "Today is Friday.",
  "It's like a marker."
];


module.exports = (context, done) => {
  context.storage.get((err, data) => {
    if(!data){
      context.storage.set({count: 1}, (err) => {
        if(err)
          return done(err);
        let introMessage = "So you're new here, huh?";
        done(null, introMessage);
      });
    }else{

      let dataObject = {};
      let randomMessageIndex = Math.floor(Math.random()*10) % defaultMessages.length;
      dataObject[new Date().toLocaleString()] =  context.data.message || defaultMessages[randomMessageIndex];

      context.storage.set(Object.assign(data, dataObject), (err) => {
        if(err){
          return done(err);
        }
        context.storage.get((err, updatedData) => {
          if(err)
            done(err);
          done(null, updatedData);
        });
      });
    }
  });
};
