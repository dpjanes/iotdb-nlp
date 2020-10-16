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
public class Handle implements HttpHandler {
    Map<String,AbstractSequenceClassifier<CoreLabel>> cd = new HashMap<String,AbstractSequenceClassifier<CoreLabel>>();

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        try {
            Date start = new Date();

            JSONObject json_response = new JSONObject();
            json_response.put("error", "didn't understand request");

            if ("GET".equals(httpExchange.getRequestMethod())) {
                json_response = process(httpExchange);
            }

            Date end = new Date();
            json_response.put("delta", (end.getTime() - start.getTime()) / 1000.0);

            handleResponse(httpExchange, json_response);
        } catch (ClassNotFoundException x) {
            System.err.println("ERROR: " + x);
        } catch (Error x) {
            System.err.println("ERROR: " + x);
            throw x;
        }
    }

    protected JSONObject process(HttpExchange httpExchange)
        throws IOException, ClassNotFoundException
    {
        JSONObject json_response = new JSONObject();
        json_response.put("error", "didn't understand request");

        return json_response;
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
