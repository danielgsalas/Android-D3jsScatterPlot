package com.appstoremarketresearch.d3jsscatterplot.view;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.appstoremarketresearch.d3jsscatterplot.R;

/**
 * HomeFragment
 */
public class MainFragment extends Fragment
{
    int xMin = 0;
    int xMax = 10000;

    int yMin = 0;
    int yMax = 1000;
    
    @Override
    public View onCreateView(
        LayoutInflater inflater,
        ViewGroup container,
        Bundle savedInstanceState)
    {
        super.onCreateView(inflater, container, savedInstanceState);
        
        View topLevelView = inflater.inflate(R.layout.fragment_main, container, false);
        
        initWebView(topLevelView);
        
        return topLevelView;
    }
    
    /**
     * initWebView
     */
    private void initWebView(View topLevelView)
    {
        WebView webview = (WebView)topLevelView.findViewById(R.id.webview);        
        webview.getSettings().setJavaScriptEnabled(true);

        // WebView reference in the inner class must be final
        final WebView wv = webview;
            
        webview.setWebViewClient(new WebViewClient() 
        {
            @Override  
            public void onPageFinished(
                WebView view, 
                String url)  
            {
                // build JavaScript-format objects
                String xDomain = "{ min : " + xMin + ", max : " + xMax + " }";
                String yDomain = "{ min : " + yMin + ", max : " + yMax + " }";
                
                // call methods in my_scatter_plot.js through scatterplot_android.html
                wv.loadUrl("javascript:buildChart('scatterplot', " + xDomain + "," + yDomain + ")");
                
                // after the HTML page loads, 
                // submit data points
                DataPointSubmitter submitter = new DataPointSubmitter(wv);
                Thread thread = new Thread(submitter);
                thread.start();
            }  
        });            
            
        // note the mapping from  file:///android_asset 
        // to Android-D3jsScatterPlot/assets
        webview.loadUrl("file:///android_asset/html/scatterplot_android.html");
    }
    
    /**
     * DataPointSubmitter
     */
    class DataPointSubmitter implements Runnable
    {
        private WebView webview;
        
        /**
         * DataPointSubmitter
         */
        public DataPointSubmitter(WebView webview)
        {
            this.webview = webview;
        }
        
        /**
         * run
         */
        public void run()
        {
            int pointCount = 20;
            
            for (int i = 0; i < pointCount; i++)
            {
                final int x = (int)(Math.round(Math.random() * (xMax - xMin) + xMin));
                
                // generate y correlating to x
                int y = x / 15 + 150;
                
                // randomize y a little bit
                if (i % 2 == 0) {
                    y *= 1 + Math.random() * 0.2;
                }
                else {
                    y *= 1 - Math.random() * 0.2;
                }
                
                // WARNING - java.lang.Throwable: A WebView method was called on thread 
                // 'Thread-123'. All WebView methods must be called on the same thread.
                //webview.loadUrl("javascript:addDataPoint('scatterplot'," + x + "," + y + ")");

                final int yFinal = y;
                
                webview.post(new Runnable() 
                {
                    public void run() 
                    {
                        webview.loadUrl("javascript:addDataPoint('scatterplot'," + x + "," + yFinal + ")"); 
                    }
                });                
            }            
        }
    }
}
