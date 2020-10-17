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
import java.util.stream.Stream;
import java.util.stream.Collectors;

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
    Server server;

    public Handle(Server _server) {
        this.server = _server;
    }

    @Override
    public void handle(HttpExchange hex) throws IOException {
        Date start = new Date();

        JSONObject jo = new JSONObject();
        jo.put("error", "didn't understand request");

        Headers headers = hex.getRequestHeaders();
        Map<String,String> query = _parseQuery(hex.getRequestURI().getQuery());

        String token = query.get("token");
        String bearer = headers.getFirst("Authorization");
        if ((bearer != null) && (bearer.startsWith("Bearer "))) {
            token = bearer.substring("Bearer ".length());
        }
        
        try {
            String method = hex.getRequestMethod();
            if (!this.server.validateToken(token)) {
                jo.put("error", "not allowed");
            } else if (method.equals("POST")) {
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

                jo = process(hex, document, language, ji);
            } else if ("GET".equals(hex.getRequestMethod())) {
                String document = query.get("document");
                if (document == null) {
                    document = "";
                }

                String language = query.get("language");
                if (language == null) {
                    language = "en";
                }

                jo = process(hex, document, language, new JSONObject(headers));
            } else {
                jo.put("error", "unknown request method");
            }

            Date end = new Date();
            jo.put("delta", (end.getTime() - start.getTime()) / 1000.0);

            if (jo.get("error") != null) {
                System.err.println("- " + hex.getRequestURI() + " error: " + jo.get("error"));
            } else {
                System.err.println("- " + hex.getRequestURI() + " in " + ((end.getTime() - start.getTime()) / 1000.0) + "s");
            }
        } catch (ClassNotFoundException x) {
            System.err.println("ERROR: " + x);
            jo.put("error", x.toString());
        } catch (Error x) {
            System.err.println("ERROR: " + x);
            jo.put("error", x.toString());
        } catch (Exception x) {
            System.err.println("ERROR: " + x);
            jo.put("error", x.toString());
        }

        handleResponse(hex, jo);
    }

    protected JSONObject process(HttpExchange hex, String document, String language, JSONObject options)
        throws IOException, ClassNotFoundException
    {
        JSONObject jo = new JSONObject();
        jo.put("error", "didn't understand request");

        return jo;
    }

    private void handleResponse(HttpExchange hex, JSONObject jo) throws IOException {
        OutputStream outputStream = hex.getResponseBody();

        String body = jo.toString();

        if (jo.get("error") != null) {
            hex.sendResponseHeaders(400, body.length());
        } else {
            hex.sendResponseHeaders(200, body.length());
        }

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

    // https://stackoverflow.com/a/63976481/96338
    public static Map<String, String> _parseQuery(String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyMap();
        }

        return Stream.of(query.split("&"))
                .filter(s -> !s.isEmpty())
                .map(kv -> kv.split("=", 2)) 
                .collect(Collectors.toMap(x -> x[0], x-> x[1]));
    }

}
