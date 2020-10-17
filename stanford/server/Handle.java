/*
 *  stanford/server/Handle.java
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
import com.sun.net.httpserver.Headers;

import java.net.InetSocketAddress;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.Executors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.util.Collections;
import java.util.Iterator;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;

import edu.stanford.nlp.io.IOUtils;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.sequences.DocumentReaderAndWriter;
import edu.stanford.nlp.util.Triple;
import edu.stanford.nlp.ie.crf.CRFClassifier;
import edu.stanford.nlp.ie.AbstractSequenceClassifier;
import edu.stanford.nlp.ling.CoreLabel.OutputFormat;


@SuppressWarnings("unchecked")
public class Handle implements HttpHandler {
    Map<String,AbstractSequenceClassifier<CoreLabel>> cd = new HashMap<String,AbstractSequenceClassifier<CoreLabel>>();

    @Override
    public void handle(HttpExchange hex) throws IOException {
        try {
            Date start = new Date();

            JSONObject json_response = new JSONObject();
            json_response.put("error", "didn't understand request");

            String method = hex.getRequestMethod();
            if (method.equals("POST")) {
                InputStreamReader isr = new InputStreamReader(hex.getRequestBody(), "utf-8");
                BufferedReader br = new BufferedReader(isr);

                int b;
                StringBuilder buf = new StringBuilder();
                while ((b = br.read()) != -1) {
                    buf.append((char) b);
                }

                br.close();
                isr.close();

                JSONObject ji = (JSONObject) JSONValue.parse(buf.toString());

                String document = (String) ji.get("document");
                if (document == null) {
                    document = "";
                }

                String language = (String) ji.get("language");
                if (language == null) {
                    language = "en";
                }

                json_response = process(hex, document, language, ji);
            } else if ("GET".equals(hex.getRequestMethod())) {
                Headers headers = hex.getRequestHeaders();

                String document = headers.getFirst("document");
                if (document == null) {
                    document = "";
                }

                String language = headers.getFirst("language");
                if (language == null) {
                    language = "en";
                }

                json_response = process(hex, document, language, new JSONObject(headers));
            } else {
            }

            Date end = new Date();
            json_response.put("delta", (end.getTime() - start.getTime()) / 1000.0);

            handleResponse(hex, json_response);
        } catch (ClassNotFoundException x) {
            System.err.println("ERROR: " + x);
        } catch (Error x) {
            System.err.println("ERROR: " + x);
            throw x;
        } catch (Exception x) {
            System.err.println("ERROR: " + x);
            throw x;
        }
    }

    protected JSONObject process(HttpExchange hex, String document, String language, JSONObject options)
        throws IOException, ClassNotFoundException
    {
        JSONObject json_response = new JSONObject();
        json_response.put("error", "didn't understand request");

        return json_response;
    }

    private void handleResponse(HttpExchange hex, JSONObject json_response) throws IOException {
        OutputStream outputStream = hex.getResponseBody();

        // encode HTML content
        String body = json_response.toString();

        // this line is a must
        hex.sendResponseHeaders(200, body.length());
        outputStream.write(body.getBytes());
        outputStream.flush();
        outputStream.close();
    }

    // --- helper functions ---
    protected void _takeAll(Map<String,String> classifiers, JSONObject c) {
        for (Iterator iterator = c.keySet().iterator(); iterator.hasNext();) {
            String key = (String) iterator.next();
            String value = (String) c.get(key); 

            classifiers.put(key, value);
        }
    }
}
