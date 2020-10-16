/*
 *  stanford/server/HandleEntity.java
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-15
 *
 *  Copyright (2013-2020) David P. Janes
 */

package org.iotdb.nlp.stanford;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.net.InetSocketAddress;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.Executors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;

import java.io.IOException;
import java.io.OutputStream;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import edu.stanford.nlp.io.IOUtils;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.sequences.DocumentReaderAndWriter;
import edu.stanford.nlp.util.Triple;
import edu.stanford.nlp.ie.crf.CRFClassifier;
import edu.stanford.nlp.ie.AbstractSequenceClassifier;
import edu.stanford.nlp.ling.CoreLabel.OutputFormat;

@SuppressWarnings("unchecked")
public class HandleEntity extends Handle
{
    Map<String,AbstractSequenceClassifier<CoreLabel>> cd = new HashMap<String,AbstractSequenceClassifier<CoreLabel>>();

    protected JSONObject process(HttpExchange hex, JSONObject ji)
        throws IOException, ClassNotFoundException
    {
        String classifier_gz = "../../contrib/stanford-ner-4.0.0/classifiers/english.all.3class.distsim.crf.ser.gz";

        AbstractSequenceClassifier<CoreLabel> classifier = cd.get(classifier_gz);
        if (classifier == null) {
            classifier = CRFClassifier.getClassifier(classifier_gz);
            cd.put(classifier_gz, classifier);
        }

        JSONArray documents = (JSONArray) ji.get("documents");

        JSONObject jo = new JSONObject();
        JSONArray jresults = new JSONArray();
        jo.put("results", jresults);

        for (int di = 0; di < documents.size(); di++) {
            String document = (String) documents.get(di);

            JSONObject jresult = new JSONObject();
            jresults.add(jresult);
            JSONArray jitems = new JSONArray();
            jresult.put("items", jitems);

            for (List < CoreLabel > lcl: classifier.classify(document)) {
                for (CoreLabel cl: lcl) {
                    String answer = cl.get(CoreAnnotations.AnswerAnnotation.class);
                    if (answer.equals("O")) {
                        continue;
                    }

                    JSONObject jitem = new JSONObject();
                    jitems.add(jitem);

                    // jitem.put("value", cl.toShorterString());
                    // jitem.put("map", cl.toString(OutputFormat.MAP));
                    // jitem.put("value", cl.toShorterString());
                    jitem.put("document", cl.originalText());
                    jitem.put("begin", cl.beginPosition());
                    jitem.put("end", cl.endPosition());
                    jitem.put("tag", answer);
                    jitem.put("score", cl.get(CoreAnnotations.AnswerProbAnnotation.class));
                }
            }
        }

        return jo;
    }
}
