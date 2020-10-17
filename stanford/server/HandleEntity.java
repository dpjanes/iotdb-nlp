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
    Map<String,String> classifiers = new HashMap<String,String>();
    Map<String,AbstractSequenceClassifier<CoreLabel>> cd = new HashMap<String,AbstractSequenceClassifier<CoreLabel>>();

    public HandleEntity(Server _server)
    {
        super(_server);

        JSONObject c = (JSONObject) _server.cfg.get("stanford-ner");
        if (c != null) {
            super._takeAll(classifiers, c);
        } else {
            classifiers.put("en", "../contrib/stanford-ner-4.0.0/classifiers/english.all.3class.distsim.crf.ser.gz");
        }
    }

    protected JSONObject process(HttpExchange hex, String document, String language, JSONObject options)
        throws IOException, ClassNotFoundException
    {
        JSONObject jo = new JSONObject();

        String filename = classifiers.get(language);
        if (filename == null) {
            jo.put("error", "language not supported: " + language);
            return jo;
        }

        AbstractSequenceClassifier<CoreLabel> classifier = cd.get(filename);
        if (classifier == null) {
            classifier = CRFClassifier.getClassifier(filename);
            cd.put(filename, classifier);
        }

        if (classifier == null) {
            jo.put("error", "no classifier found for language: " + language);
            return jo;
        }

        JSONArray jitems = new JSONArray();
        jo.put("items", jitems);

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
                jitem.put("token", "entity");
                jitem.put("tag", answer);
                jitem.put("score", cl.get(CoreAnnotations.AnswerProbAnnotation.class));
            }
        }

        return jo;
    }
}
