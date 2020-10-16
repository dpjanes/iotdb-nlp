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

import edu.stanford.nlp.ling.SentenceUtils;
import edu.stanford.nlp.ling.TaggedWord;
import edu.stanford.nlp.ling.HasWord;
import edu.stanford.nlp.tagger.maxent.MaxentTagger;

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

/*

public class TaggerDemo  {

  private static Redwood.RedwoodChannels log = Redwood.channels(TaggerDemo.class);

  private TaggerDemo() {}

  public static void main(String[] args) throws Exception {
    if (args.length != 2) {
      log.info("usage: java TaggerDemo modelFile fileToTag");
      return;
    }
    MaxentTagger tagger = new MaxentTagger(args[0]);
    List<List<HasWord>> sentences = MaxentTagger.tokenizeText(new BufferedReader(new FileReader(args[1])));
    for (List<HasWord> sentence : sentences) {
      List<TaggedWord> tSentence = tagger.tagSentence(sentence);
      System.out.println(SentenceUtils.listToString(tSentence, false));
    }
  }

}
*/
