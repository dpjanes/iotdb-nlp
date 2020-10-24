# iotdb-nlp
NLP functions

## Components

### Stanford Server

If you're looking for the Stanford Server 
(POS and Entities via REST interface),
it's in folder `/stanford/server`. 
You can safely ignore everything else here
if that's what you're looking for.

### WordNet

    npm install node-wordnet

### Sentence Splitter

    npm install sentence-splitter

## Pipeline

### Preprocess

Preprocess extracts data from documents

    node pipeline/pipeline.js preprocess \
        --verbose \
        --cfg corpus/Pipeline.yaml \
        corpus/study-in-scarlet.txt 

It will figure out where the Pipeline.yaml
is on it's own if it is in a parent folder

    node pipeline/pipeline.js preprocess \
        corpus/study-in-scarlet.txt 

