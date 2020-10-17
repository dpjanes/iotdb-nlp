# Stanford NLP

Project is here:
https://nlp.stanford.edu/software/

Our REST server (plus documentation) is 
in folder /stanford/server

To use in `iotdb-nlp` to get Entities and POS,
just call the initializer

    _.promise({
        nlp$cfg: {
            stanford: {
                url: "http://media.local:18081/",
                token: "sample-token"
            }
        },
    })
        .then(nlp.initialize)
        .then(nlp.stanford.initialize)
        
