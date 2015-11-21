package com.appstoremarketresearch.d3jsscatterplot.view;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
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

    int yMin = 100;
    int yMax = 200;
    
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
        WebView webview = (WebView)topLevelView.findViewById(
            R.id.webview);
        
        webview.getSettings().setJavaScriptEnabled(true);
        
        webview.setWebChromeClient(
            new WebChromeClient());
        
        final WebView wv = webview;
            
        webview.setWebViewClient(new WebViewClient() 
        {
            @Override  
            public void onPageFinished(
                WebView view, 
                String url)  
            {
                String xDomain = "{ min : " + xMin + ", max : " + xMax + " }";
                String yDomain = "{ min : " + yMin + ", max : " + yMax + " }";
                
                // call methods in my_scatter_plot.js 
                // through scatterplot_android.html
                wv.loadUrl("javascript:initChart('scatterplot', " + xDomain + "," + yDomain + ")");
                
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
                int x = (int)(Math.round(Math.random() * (xMax - xMin) + xMin));
                int y = (int)(Math.round(Math.random() * (yMax - yMin) + yMin));
                
                webview.loadUrl("javascript:addDataPoint('scatterplot'," + x + "," + y + ")");              
            }            
        }
    }
}
