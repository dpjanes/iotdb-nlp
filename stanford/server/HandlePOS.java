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
    Map<String,MaxentTagger> td = new HashMap<String,MaxentTagger>();

    protected JSONObject process(HttpExchange httpExchange)
        throws IOException, ClassNotFoundException
    {
        String tagger_name = "../../contrib/stanford-tagger-4.1.0/models/english-bidirectional-distsim.tagger";
        // String tagger_name = "../../contrib/stanford-tagger-4.1.0/models/english-left3words-distsim.tagger";
        MaxentTagger tagger = td.get(tagger_name);
        if (tagger == null) {
            tagger = new MaxentTagger(tagger_name);
            td.put(tagger_name, tagger);
        }

        List<List<HasWord>> sentences = MaxentTagger.tokenizeText(
            new StringReader(
                "Good afternoon Rajat Raina, how are you today?\nI go to school at Stanford University, which is located in California."
            ));

        JSONObject jo = new JSONObject();
        JSONArray jresults = new JSONArray();
        jo.put("results", jresults);

        JSONObject jresult = new JSONObject();
        jresults.add(jresult);
        JSONArray jitems = new JSONArray();
        jresult.put("items", jitems);

        for (List<HasWord> sentence : sentences) {
            List<TaggedWord> twords = tagger.tagSentence(sentence);
            // System.out.println("SENTENCE: " + sentence);
            // System.out.println("TWORDS: " + twords);
            for (TaggedWord tword : twords) {
                // System.out.println("" + tword.beginPosition() + ":" + tword); // SentenceUtils.listToString(tSentence, false));

                JSONObject jitem = new JSONObject();
                jitems.add(jitem);
                jitem.put("document", tword.word());
                jitem.put("begin", tword.beginPosition());
                jitem.put("end", tword.endPosition());
                jitem.put("tag", tword.tag());
                jitem.put("score", .99);
            }
        }

        return jo;
    }
}