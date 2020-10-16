/*
 *  stanford/server/Server.java
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

public class Server {
    public static void main (String[] args) throws Exception {
        System.out.println("media.local:8001");

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 8001), 0);
        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)Executors.newFixedThreadPool(10);

        server.createContext("/entities", new HandleEntity());
        server.createContext("/pos", new HandlePOS());
        server.setExecutor(threadPoolExecutor);
        server.start();
    }
}
