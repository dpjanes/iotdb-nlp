/*
 *  stanford/server/HandlePOS.java
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-16
 *
 *  Copyright (2013-2020) David P. Janes
 */

package org.iotdb.nlp.stanford;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;

import java.io.IOException;
import java.io.OutputStream;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

@SuppressWarnings("unchecked")
public class HandlePOS extends Handle
{
    protected JSONObject process(HttpExchange httpExchange)
        throws IOException, ClassNotFoundException
    {
        JSONObject jo = new JSONObject();
        jo.put("error", "coming soon");

        return jo;
    }
}
