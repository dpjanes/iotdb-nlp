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

import java.io.IOException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.json.simple.JSONValue;
import org.json.simple.JSONObject;

public class Server {
    static public Server server;

    public JSONObject cfg = new JSONObject();
    public String configuration_file = null;
    public String host = "0.0.0.0";
    public int port = 18081;
    public int threads = 10;

    public static void main (String[] av) throws Exception {
        Server.server = new Server();
        Server.server.arguments(av);
        Server.server.configuration();
        Server.server.arguments(av);
        Server.server.run();
    }

    public void Server() {
    }

    public void run() {
        try {

            HttpServer server = HttpServer.create(new InetSocketAddress(host, port), 0);
            ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)Executors.newFixedThreadPool(threads);

            server.createContext("/entities", new HandleEntity(this));
            server.createContext("/pos", new HandlePOS(this));
            server.setExecutor(threadPoolExecutor);
            server.start();

            System.out.println("listing on " + host + ":" + port + " with " + threads + " thread(s)");
        } catch (IOException x) {
            System.err.println(x);
        }
    }

    enum Next {
        Option,
        Done,
        Configuration,
        Host,
        Port,
        Threads,
    }

    private void arguments(String[] av) {
        Next next = Next.Option;
        for (String a : av) {
            switch (next) {
            case Done:
                break;

            case Configuration:
                this.configuration_file = a;
                next = Next.Option;
                break;

            case Host:
                this.host = a;
                next = Next.Option;
                break;

            case Port:
                this.port = Integer.parseInt(a);
                next = Next.Option;
                break;

            case Option:
                if (a.equals("--cfg")) {
                    next = Next.Configuration;
                } else if (a.equals("--configuration")) {
                    next = Next.Configuration;
                } else if (a.equals("--port")) {
                    next = Next.Port;
                } else if (a.equals("--host")) {
                    next = Next.Host;
                } else if (a.equals("--threads")) {
                    next = Next.Threads;
                } else if (a.equals("--")) {
                    next = Next.Done;
                } else {
                    System.err.println("unknown argument: " + a);
                    System.exit(1);
                }
                break;
            }
        }
    }

    private void configuration() {
        JSONObject cfg;
        try {
            String filename = this.configuration_file != null ? this.configuration_file : "cfg.json";
            String data = new String(Files.readAllBytes(Paths.get(filename)));

            cfg = (JSONObject) JSONValue.parse(data);
        } catch (IOException x) {
            if (this.configuration_file != null) {
                System.err.println("configuration file not found: " + this.configuration_file);
                System.exit(1);
            }
            return;
        }

        JSONObject scfg = (JSONObject) cfg.get("stanford-server");
        if (scfg == null) {
            return;
        }

        this.cfg = scfg;

        // handle standard options
        if (this.cfg.get("port") != null) {
            this.port = ((Number) this.cfg.get("port")).intValue();
        }

        if (this.cfg.get("host") != null) {
            this.host = (String) this.cfg.get("host");
        }

        if (this.cfg.get("threads") != null) {
            this.threads = ((Number) this.cfg.get("threads")).intValue();
        }
    }
}
