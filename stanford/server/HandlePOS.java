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
import java.io.StringReader;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import edu.stanford.nlp.ling.SentenceUtils;
import edu.stanford.nlp.ling.TaggedWord;
import edu.stanford.nlp.ling.HasWord;
import edu.stanford.nlp.tagger.maxent.MaxentTagger;
import edu.stanford.nlp.ling.CoreAnnotations;

@SuppressWarnings("unchecked")
public class HandlePOS extends Handle
{
    Map<String,String> classifiers = new HashMap<String,String>();
    Map<String,MaxentTagger> td = new HashMap<String,MaxentTagger>();

    public HandlePOS(Server _server)
    {
        super(_server);

        JSONObject c = (JSONObject) _server.cfg.get("stanford-tagger");
        if (c != null) {
            super._takeAll(classifiers, c);
        } else {
            classifiers.put("en", "../contrib/stanford-tagger-4.1.0/models/english-bidirectional-distsim.tagger");
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

        MaxentTagger tagger = td.get(filename);
        if (tagger == null) {
            tagger = new MaxentTagger(filename);
            td.put(filename, tagger);
        }

        if (tagger == null) {
            jo.put("error", "no tagger found for language: " + language);
            return jo;
        }

        JSONArray jitems = new JSONArray();
        jo.put("items", jitems);

        List<List<HasWord>> sentences = MaxentTagger.tokenizeText(new StringReader(document));

        for (List<HasWord> sentence : sentences) {
            List<TaggedWord> twords = tagger.tagSentence(sentence);

            for (TaggedWord tword : twords) {
                JSONObject jitem = new JSONObject();
                jitems.add(jitem);
                jitem.put("document", tword.word());
                jitem.put("begin", tword.beginPosition());
                jitem.put("end", tword.endPosition());
                jitem.put("token", "pos");
                jitem.put("tag", tword.tag());
                jitem.put("score", .99);
            }
        }

        return jo;
    }
}
