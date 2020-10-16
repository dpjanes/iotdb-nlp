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
public class HandleNED implements HttpHandler {
    Map<String,AbstractSequenceClassifier<CoreLabel>> cd = new HashMap<String,AbstractSequenceClassifier<CoreLabel>>();

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        try {
            JSONObject json_response = null;
            if ("GET".equals(httpExchange.getRequestMethod())) {
                json_response = handleGetRequest(httpExchange);
            }

            handleResponse(httpExchange, json_response);
            System.err.print("D");
        } catch (ClassNotFoundException x) {
            System.err.println("ERROR: " + x);
        } catch (Error x) {
            System.err.println("ERROR: " + x);
            throw x;
        }
    }

    private JSONObject handleGetRequest(HttpExchange httpExchange)
        throws IOException, ClassNotFoundException
    {
        String serializedClassifier = "../../contrib/stanford-ner-4.0.0/classifiers/english.all.3class.distsim.crf.ser.gz";

        AbstractSequenceClassifier<CoreLabel> classifier = cd.get(serializedClassifier);
        if (classifier == null) {
            classifier = CRFClassifier.getClassifier(serializedClassifier);
            cd.put(serializedClassifier, classifier);
        }


        String[] example = {
            "Good afternoon Rajat Raina, how are you today?",
            "I go to school at Stanford University, which is located in California."
        };


        JSONArray jresults = new JSONArray();

        JSONObject jo = new JSONObject();
        jo.put("results", jresults);
        for (String str: example) {
            JSONArray jitems = new JSONArray();

            JSONObject jresult = new JSONObject();
            jresult.put("items", jitems);

            jresults.add(jresult);

            for (List < CoreLabel > lcl: classifier.classify(str)) {
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

    private void handleResponse(HttpExchange httpExchange, JSONObject json_response) throws IOException {
        OutputStream outputStream = httpExchange.getResponseBody();

        // encode HTML content
        String body = json_response.toString();

        // this line is a must
        httpExchange.sendResponseHeaders(200, body.length());
        outputStream.write(body.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}
