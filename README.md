# iotdb-nlp
NLP functions

## Components

### Stanford Server

If you're looking for the Stanford Server 
(POS and Entities via REST interface),
it's in folder `/stanford/server`. 
You can safely ignore everything else here
if that's what you're looking for.

## Pipeline

### Preprocess

    node pipeline/pipeline.js preprocess \
        --verbose \
        --cfg corpus/Pipeline.yaml \
        corpus/study-in-scarlet.txt 

