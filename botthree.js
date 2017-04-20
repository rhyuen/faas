"use strict";

const defaultMessages = [
  "I have nothing to say.",
  "Pizza is the best",
  "Today is Friday.",
  "It's like a marker.",
  "It's time to go.  Meow.",
  "Sometimes it rains and that's a little depressing.",
  "I deeply enjoy pizza.  It's the best.",
  "Thick cut potato chips are the best."
];

module.exports = (context, done) => {
  context.storage.get((err, data) => {

    //IF NO DATA
    if(!data){
      context.storage.set({count: 1}, (err) => {
        if(err)
          return done(err);
        let introMessage = [
          "So you're new here, huh?",
          "The commands are as follows: ",
          "?command=cleardata  ## to clear the data store",
          "?command=docs ## for the docs again",
          "?name=YourName&message=YourMessageHere  ## to append to message",
          "Type nothing for your chat history thus far."
        ];
        done(null, introMessage.join("\r\n"));
      });
    }else{
      //HAS DATA HISTORY + USER INPUT

      //HELP MENU
      if(context.query.command === "docs" || context.query.command === "help"){
        let docMessages = [
          "COMMANDS ARE AS FOLLOWS",
          "?command=cleardata  ## to clear the data store",
          "?command=docs ## for the docs again",
          "?name=YourName&message=YourMessageHere  ## to append to message",
          "Type nothing for your chat history thus far."
        ];
        return done(null, docMessages.join("\r\n"));
      }

      //CLEAR DATA STORE
      if(context.query.command === "cleardata"){
        context.storage.set({}, {force: 1}, (err) => {
          if(err)
            return done(err);
          return done(null, "Data store cleared.");
        });
      }

      //ADD NEW MESSAGE
      if(context.query.name && context.query.message){
        let newestMessage = {};
        newestMessage[new Date().toLocaleString()] = {
          date: new Date().toLocaleString(),
          name: context.query.name,
          message: context.query.message
        };

        context.storage.set(Object.assign(data, newestMessage), (err) => {
          if(err){
            return done(err);
          }
          context.storage.get((err, updatedData) => {
            if(err)
              done(err);
            done(null, updatedData);
          });
        });

      //DISPLAYS PREVIOUS USER INPUT and ADD A PRECOMPOSED MESSAGE
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
              return done(err);
            return done(null, updatedData);
          });
        });
      }
    }
  });
};
